var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'travel';

KeyDefine.query = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_QUERY, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.userId) {
            queryOption = {
                sql: 'select * from ?? where userId = ?',
                values: [KeyDefine.TABLE_NAME, query.userId],
                timeout: 10000
            }
        } else {
            callback(result);
            return;
        }
        
        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in querying %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            } else if (rows.length <= 0) {
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = rows;
            callback(result);
        });
    });
}

KeyDefine.remove = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_REMOVE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        if (!query.id) {
            callback(result);
            return;
        }

        var queryOption = {
            sql: 'delete from ?? where id = ?',
            values: [KeyDefine.TABLE_NAME, query.id],
            timeout: 10000
        };
        
        
        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in deleting %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            if (rows.affectedRows <= 0) {
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = {id: query.id}
            callback(result);
        });
    });
}

KeyDefine.update = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_UPDATE, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.id && query.name) {
            queryOption = {
                sql: 'update ?? set name = ? where id = ?',
                values: [KeyDefine.TABLE_NAME, query.name, query.id],
                timeout: 10000
            };
        } else {
            callback(result);
            return;
        }
        
        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in updating %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }
            if (rows.affectedRows <= 0) {
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = {id: query.id, name: query.name}
            callback(result);
        });
    });
}

KeyDefine.insert = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_INSERT, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.userId && query.name) {
            queryOption = {
                sql: 'insert into ?? (userId, name) values (?, ?)',
                values: [KeyDefine.TABLE_NAME, query.userId, query.name],
                timeout: 10000
            };
        } else {
            callback(result);
            return;
        }
        
        connection.query(queryOption, function(err, rows) {
            if (err) {
                console.error('Error in inserting %s: ' + err.code, KeyDefine.TABLE_NAME);
                callback(result);
                return;
            }

            result.result = KeyDefine.RESULT_SUCCESS;
            result.data = {id: rows.insertId, userId: query.userId, name: query.name}
            callback(result);
        });
    });
}

module.exports = KeyDefine;
