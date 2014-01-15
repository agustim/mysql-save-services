var crypto = require('crypto');
var mysql = require('mysql');

var connection ;

var serviceModel = {};

serviceModel.setConnection = function(mysqlurl, callback)
{
	connection = mysql.createConnection('mysql://avahi:avahipassword@localhost:3306/avahiservices');
}
//obtenir tots els serveis.
serviceModel.getServices = function(callback)
{
	if (connection) 
	{
		connection.query('SELECT * FROM services ORDER BY id', function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				console.log("Get all services.")
				callback(null, rows);
			}
		});
	}
}

//Servei per id
serviceModel.getService = function(id,callback)
{
	if (connection) 
	{
		var sql = 'SELECT * FROM services WHERE id = ' + connection.escape(id);
		connection.query(sql, function(error, row) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				console.log("Get iformation from "+id+" service.")
				callback(null, row);
			}
		});
	}
}

//afegir servei
serviceModel.insertService = function(serviceData,callback)
{
	if (serviceData.type == "") {
		console.log("Empty service type.");
		callback(null,{"msg":"emptyType"});
	} else {
		if (connection) 
		{
			var sqlExists = 'SELECT count(*) as num FROM services WHERE md5num = ' + connection.escape(serviceData.md5num);
			connection.query(sqlExists, function(err, row) 
			{
				if(err)
				{
					throw error;
				}
				else
				{
					if(row[0].num == 0)
					{
						console.log("Service don't exist, insert in the table.");
						connection.query('INSERT INTO services SET ?', serviceData, function(error, result) 
						{
							if(error)
							{
								throw error;
							}
							else
							{
								console.log("")
								callback(null,{"insertId" : result.insertId});
							}
						});
					} else {
						console.log("This service exist in table, update modified field.");
						/* update last modification */
						connection.query('UPDATE services SET modified = sysdate() WHERE md5num=' + connection.escape(serviceData.md5num));
						callback(null,{"msg":"existHash"});
					}
				}
			});
		}
	}
}

//actualizar
serviceModel.updateService = function(serviceData, callback)
{
	if(connection)
	{
		var sql = 'UPDATE services SET ' + 
		'type = ' + connection.escape(serviceData.type) + ',' +
		'description = ' + connection.escape(serviceData.description) + ',' +  
		'hostname = ' + connection.escape(serviceData.hostname) + ',' +
		'ip = ' + connection.escape(serviceData.ip) + ',' +
		'port = ' + connection.escape(serviceData.port) + ',' +
		'txt = ' + connection.escape(serviceData.txt) + ',' +
		'md5num = ' + connection.escape(serviceData.hash) + ',' +
		'modified = sysdate() ' +
		'WHERE id = ' + serviceData.id;

		connection.query(sql, function(error, result) 
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null,{"msg":"success"});
			}
		});
	}
}

//eliminar un servei
serviceModel.deleteService = function(id, callback)
{
	if(connection)
	{
		var sqlExists = 'SELECT * FROM services WHERE id = ' + connection.escape(id);
		connection.query(sqlExists, function(err, row) 
		{
			if(row)
			{
				var sql = 'DELETE FROM services WHERE id = ' + connection.escape(id);
				connection.query(sql, function(error, result) 
				{
					if(error)
					{
						throw error;
					}
					else
					{
						callback(null,{"msg":"deleted"});
					}
				});
			}
			else
			{
				callback(null,{"msg":"notExist"});
			}
		});
	}
}

module.exports = serviceModel;