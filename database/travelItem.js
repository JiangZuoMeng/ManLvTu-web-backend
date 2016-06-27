var DBPool = require('./dbpool.js');
var Define = require('./define.js');

var KeyDefine = new Define;
KeyDefine.TABLE_NAME = 'travelItem';

KeyDefine.query = function(query, callback) {
    DBPool.getConnection(function(err, connection) {
        var result = {request: KeyDefine.ACTION_QUERY, target: KeyDefine.TABLE_NAME, result: KeyDefine.RESULT_FAILED}
        if (err) {
            console.error('Error in getting connection: ' + err.code);
            callback(result);
            return;
        }

        var queryOption;
        if (query.travelId) {
            queryOption = {
                sql: 'select * from ?? where travelId = ?',
                values: [KeyDefine.TABLE_NAME, query.travelId],
                timeout: 10000
            }
        } else if (query.id) {
            queryOption = {
                sql: 'select * from ?? where id = ?',
                values: [KeyDefine.TABLE_NAME, query.id],
                timeout: 10000
            }
        } else if (query.locationLatLowerBound && query.locationLatUpperBound &&
                query.locationLngLowerBound && query.locationLngUpperBound) {
            queryOption = {
                sql: 'select * from ?? where locationLat >= ? and locationLat <= ? and locationLng >= ? and locationLng <= ?',
                values: [KeyDefine.TABLE_NAME, query.locationLatLowerBound, query.locationLatUpperBound,
                    query.locationLngLowerBound, query.locationLngUpperBound],
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
        if (query.id) {
            queryOption = {
                sql: 'update ?? set\
                    label = ?, time = ?, locationLat = ?, locationLng = ?, m_like = ?, description = ?, media = ?\
                    where id = ?',
                values: [KeyDefine.TABLE_NAME, query.label, query.time, query.locationLat, query.locationLng,
                    query.m_like, query.description, query.media, query.id],
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
            result.data = {id: query.id}
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
        if (query.travelId) {
            queryOption = {
                sql: 'insert into ?? (travelId, label, time, locationLat, locationLng, m_like, description, media)\
                    values (?, ?, ?, ?, ?, ?, ?, ?)',
                values: [KeyDefine.TABLE_NAME, query.travelId, query.label, query.time, query.locationLat, query.locationLng,
                    query.m_like, query.description, query.media],
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
            result.data = {id: rows.insertId}
            callback(result);
        });
    });
}

module.exports = KeyDefine;
