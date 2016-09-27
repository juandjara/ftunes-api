var express = require('express');
var app     = express();
var cors    = require('cors');
var path    = require('path');
var yt_mp3  = require('./converter.js');

app.set('json spaces', 2);
app.use(cors());

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/api', function(req, res){
    res.json({status: 'ok',
              description: 'convertir musica de yt a mp3',
              sample:'/dl/:yt_video_id/:titulo_de_la_descarga'});
});
app.get('/api/:ytid/:title', yt_mp3);

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
