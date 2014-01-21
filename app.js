var express = require('express');
var crypto = require('crypto');
var exec = require('child_process').exec;
var mysqlurl = "mysql://avahi:avahipassword@localhost:3306/avahiservices";

var endProgram = function(){
	console.log('End program');
	var child = exec("avahi-ps unpublish mysqlsaveservices", function(error, stdout, stderr){ console.log(stdout); });
	process.exit(0);
};
var service = require('./models/services');
service.setConnection(mysqlurl, function(error, data){ console.log(error); });

var http = require('http');
var path = require('path');

var child = exec("avahi-ps publish MySQL-Save-Services mysqlsaveservices 3000", function (error, stdout, stderr) { console.log (stdout); });

var app = express();
 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine','jade');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname,'public')));
 
require('./routes')(app);
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

process.on('SIGINT', endProgram);
