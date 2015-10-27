require('mocha')
require('should')
//var OrientDB = require('orientjs');
var winston = require('winston')
require('../lib/orientdbTransport.js').OrientDB;
var logger;
var meta = {name : {firstName : "ABC" , lastName : "XYZ"}, age:19 , dateOfBirth : new Date(), isValid : true, percentage : 89.17,subjects:['Mathematics','Physics','Chemistry','Computer Science']};
describe("Verify logging", function () {
	before(function (done) {
		var options = {};
		options.level = 'debug';
		options.storeHost = true;
		options.connection = {
			"host": 'localhost',
			"port": 2424,
			"username": 'root',
			"password": 'root'
		};
		options.db = {
			"name" : "logs",
			"username": 'root',
			"password": 'root',
		}
		options.handleExceptions= true;
		var transports = [new winston.transports.OrientDB(options)];
	logger = new (winston.Logger)({
	transports: transports
	});
	done();
	});
	
	it("info log message" , function(done){
		logger.info("info log message",function(err){done(err);});
	});
	
	it("info log message with metadata" , function(done){
		logger.info("info log message with metadata",meta,function(err){done(err);});
	});
	
	it("warn log message" , function(done){
		logger.warn("warn log message",function(err){done(err);});
	});
	
	it("warn log message with metadata" , function(done){
		logger.warn("warn log message with metadata",meta,function(err){done(err);});
	});
	
	it("debug log message" , function(done){
		logger.debug("debug log message",function(err){done(err);});
	});
	
	it("debug log message with metadata" , function(done){
		logger.debug("debug log message with metadata",meta,function(err){done(err);});
	});
	
	it("error log message" , function(done){
		logger.error("debug log message",function(err){done(err);});
	});
	
	it("error log message with metadata" , function(done){
		try {
			JSON.parse({a:10, b: 20});
		}catch(ex) {
			logger.error(ex.message,meta,function(err){done(err);});
		}
	});
});