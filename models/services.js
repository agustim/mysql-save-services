var crypto = require('crypto');
var mysql = require('mysql');
/*var connection = mysql.createConnection(
	{ 
		host: 'localhost', 
		user: 'avahi',  
		password: 'avahipassword', 
		database: 'avahiservices'
	}
);*/
var connection = mysql.createConnection('mysql://avahi:avahipassword@localhost:3306/avahiservices');

var serviceModel = {};

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
				callback(null, row);
			}
		});
	}
}

//afegir servei
serviceModel.insertService = function(serviceData,callback)
{
	if (connection) 
	{
		var sqlExists = 'SELECT count(*) as num FROM services WHERE md5num = ' + connection.escape(serviceData.md5num);
		console.log(sqlExists);
		connection.query(sqlExists, function(err, row) 
		{
			if(err)
			{
				throw error;
			}
			else
			{
				console.log(row[0].num);
				console.log(serviceData);
				if(row[0].num == 0)
				{
					
					console.log("Not exist!");

					connection.query('INSERT INTO services SET ?', serviceData, function(error, result) 
					{
						if(error)
						{
							throw error;
						}
						else
						{
							callback(null,{"insertId" : result.insertId});
						}
					});
				} else {
					callback(null,{"msg":"existHash"});
				}
			}
		});
	}
}

//actualizar
serviceModel.updateService = function(serviceData, callback)
{
	//console.log(serviceData); return;
	if(connection)
	{
		var hash = crypto.createHash('md5').update(
			serviceData.tipo+";"+serviceData.ip+";"+serviceData.port
		).digest("hex");
		var sql = 'UPDATE services SET ' + 
		'type = ' + connection.escape(serviceData.tipo) + ',' +
		'description = ' + connection.escape(serviceData.description) + ',' +  
		'hostname = ' + connection.escape(serviceData.hostname) + ',' +
		'ip = ' + connection.escape(serviceData.ip) + ',' +
		'port = ' + connection.escape(serviceData.port) + ',' +
		'txt = ' + connection.escape(serviceData.txt) + ',' +
		'md5num = ' + hash +
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