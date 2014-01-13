var ServiceModel = require('../models/services');
var crypto = require('crypto');

module.exports = function(app)
{
	app.get("/services", function(req,res){
		ServiceModel.getServices(function(error, data)
		{
			res.json(200,data);
		});
	});

	app.get("/services/:id", function(req,res)
	{
		var id = req.params.id;
		if(!isNaN(id))
		{
			ServiceModel.getService(id,function(error, data)
			{
				if (typeof data !== 'undefined' && data.length > 0)
				{
					res.json(200,data);
				}
				else
				{
					res.json(404,{"msg":"notExist"});
				}
			});
		}
		else
		{
			res.json(500,{"msg":"Error"});
		}
	});

	app.post("/services", function(req,res)
	{
		var ServiceData = {
			id : null,
			type : req.body.type,
			description : req.body.description,
			hostname : req.body.hostname,
			ip : req.body.ip,
			port : req.body.port,
			txt : req.body.txt
		};
		ServiceData['md5num'] = crypto.createHash('md5').update(
			ServiceData.tipo+";"+ServiceData.hostname+";"+ServiceData.port
		).digest("hex");

		ServiceModel.insertService(ServiceData,function(error, data)
		{
			if(data && data.insertId)
			{
				res.redirect("/services/" + data.insertId);
			}
			else
			{
				res.json(500,{"msg":error});
			}
		});
	});

	app.put("/services", function(req,res)
	{
		var ServiceData = {id:req.param('id'),username:req.param('username'),email:req.param('email')};
		ServiceModel.updateService(ServiceData,function(error, data)
		{
			if(data && data.msg)
			{
				res.json(200,data);
			}
			else
			{
				res.json(500,{"msg":"Error"});
			}
		});
	});

	app.delete("/services", function(req,res)
	{
		var id = req.param('id');
		ServiceModel.deleteService(id,function(error, data)
		{
			if(data && data.msg === "deleted" || data.msg === "notExist")
			{
				res.json(200,data);
			}
			else
			{
				res.json(500,{"msg":"Error"});
			}
		});
	});
}