/* global process */
var util = require('util'),
    winston = require('winston'),
    Oriento = require('orientjs'),
    os = require('os');

var OrientDBLogger = exports.OrientDB = winston.transports.OrientDB = function (options) {
    options = options || {};

    this.name = options.name || 'OrientDB';
    this.level = options.level || 'info';

    if (!options.connection) {
        throw new Error('You should provide connection to orientdb database.');
    }

    this.connection = options.connection;
    this.db = options.db || { name: 'logs' };
    this.class = options.class || 'logs';
    this.storeHost = options.storeHost;
    this.silent = options.silent;
    this.label = options.label;
    // pre connect logs
    this.preConnectLogQueue = [];

    if (this.storeHost) {
        this.hostname = os.hostname();
    }

    var self = this;

    function connectDB() {
        var server = Oriento(
            self.connection
            );
        self.logDb = server.use(self.db);
        self.logDb.class.get(self.class).then(function () {
            processPreConnectLogQueue();
        }).catch(function (err) {
            self.logDb.class.create(self.class)
                .then(function (logClass) {
                    processPreConnectLogQueue();
                });
        });

    }

    function processPreConnectLogQueue() {
        self.preConnectLogQueue.forEach(function (operation) {
            self[operation.method].apply(self, operation.args);
        });
        delete self.preConnectLogQueue;
    }
    connectDB();
};

util.inherits(OrientDBLogger, winston.Transport);

OrientDBLogger.prototype.log = function (level, msg, meta, callback) {
    if (!this.logDb) {
        this.preConnectLogQueue.push({
            method: 'log',
            args: arguments
        });
        return;
    }
    var self = this;
    process.nextTick(function () {
        if (self.silent) {
            callback(null, true);
            return;
        }

        function onError(err) {
            self.emit('error', err);
            callback(err, null);
        }

        var entry = {};
        entry.message = msg;
        entry.timestamp = new Date();
        entry.level = level;
        entry.meta = meta//helpers.prepareMetaData(meta);
        if (self.storeHost) {
            entry.hostname = self.hostname;
        }
        if (self.label) {
            entry.label = self.label;
        }

        self.logDb.insert().into(self.class).set(entry).one()
            .then(function (log) {
                self.emit('logged');
                callback(null, true);
            }).catch(function (err) {
                console.log(err);
                onError(err);
            });
    });
};