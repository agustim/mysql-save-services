var ServiceModel = require('../models/services');
var crypto = require('crypto');

split_txt = function(str){

}

module.exports = function(app)
{

	app.get("/", function (req, res){
		ServiceModel.getServices(function(error,data){
			data.forEach(function(e){
				//Convert TXT in varibles from object.
				e.txt.split("&").map(function(element){
					e2 = element.split("=");
					if (e2.length == 2) {
						eval("e."+e2[0]+"='"+e2[1]+"'");
					}
				});
				if (e.type == '_ftp._tcp' || e.type == '_nfs._tcp'){
					if (typeof e.path === 'undefined') e.path="/";
					//Treure _*._tcp
					t=(e.type == '_ftp._tcp')?"ftp":"nfs";
					e.url=t+"://"+e.user+":"+e.password+"@"+e.ip+":"+e.port+e.path;
				}
				if (e.type == '_mysqlsaveservices._tcp'){
					e.url="http://"+e.ip+":"+e.port;				
				}
			});
			res.render('services', {
                title: 'Services in Avahi Discobered.',
                services : data
            });
		});
	});

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
				res.json(200, {"id":data.insertId});
			}
			else
			{
				res.json(500,{"msg":error});
			}
		});
	});

	app.put("/services", function(req,res)
	{
		var ServiceData = {
			id:req.param('id'),
			type:req.param('type'),
			description:req.param('description'),
			hostname:req.param('hostname'),
			ip:req.param('ip'),
			port:req.param('port'),
			txt:req.param('txt')
		};
		ServiceData['md5num'] = crypto.createHash('md5').update(
			ServiceData.tipo+";"+ServiceData.hostname+";"+ServiceData.port
		).digest("hex");
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
