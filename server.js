var express = require('express');
var app     = express();
var cors    = require('cors');
var yt_mp3  = require('./converter.js');

app.set('json spaces', 2);
app.use(cors());

app.get('/', function(req, res){
    res.json({status: 'ok',
              description: 'descripcion del servicio',
              sample:'/url-ejemplo-servicio'});
});

app.get('/dl/:ytid/:title', yt_mp3);

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
