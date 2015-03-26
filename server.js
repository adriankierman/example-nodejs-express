var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  var message = process.env.POWERED_BY;
  if (typeof(message) == "undefined") {
  	message = "GP - GovPaas from Nava"
  }
  res.send('<img src="logo.png"/><p>EmPowered by ' + message + '</p>');
});

/* Use PORT environment variable if it exists */
var port = process.env.PORT || 5000;
server = app.listen(port);

console.log('Server listening on port %d in %s mode', server.address().port, app.settings.env);
