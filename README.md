# winston-orientdb
A OrientDB transport for [winston][0].

## Index
* [Install](#install)
* [Usage](#usage)
* [License](#license)

## Install

```bash
npm install winston-orientdb --save
```
## Usage

```js
var winston = require('winston');
 
require('winston-orientdb').OrientDB;

winston.add(winston.transports.OrientDB, options);
```

The OrientDB transport takes the following options. 'connection' is required:

* __level:__ Level of messages that this transport should log, defaults to
'info'.
* __silent:__ Boolean flag indicating whether to suppress output, defaults to
false.
* __connection:__ Server host name , port , username and password `eg. {"host": 'localhost',"port": 2424, "username": "root","password": "root" }`   
* __db:__  database name, username and password `eg { "name" : "logs",	"username": "root",	"password": "root", }` default `{"name" : "logs"}`.  **Database must be exist**  
* __class__: The name of the class you want to store log messages in,
defaults to 'logs'. class is be created if it does not exist. 
* __storeHost:__ Boolean indicating if you want to store machine hostname in
logs entry, if set to true it populates entry with 'hostname' field,
which stores os.hostname() value.
* __label:__ Label stored with entry object if defined.
* __name:__ Transport instance identifier. Useful if you need to create multiple
OrientDB transports.

*Metadata:* Logged as a native JSON object in 'meta' property.

*Logging unhandled exceptions:* For logging unhandled exceptions specify
winston-orientdb as `handleExceptions` logger according to winston documentation.

## Tests

```js
npm test
```
## License
[MIT][license-url]

[0]: https://github.com/flatiron/winston
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
