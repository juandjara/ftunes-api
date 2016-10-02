var express = require('express');
var app     = express();
var cors    = require('cors');
var downloader = require('./downloader');
var streamer   = require('./streamer');
var search  = require('./search');
var sendSeekable = require('send-seekable');

app.set('json spaces', 2);
app.use(cors());
app.use(sendSeekable);

app.use(express.static('public'));

app.get('/api', function(req, res){
    res.json({status: 'ok',
              description: 'convertir musica de yt a mp3',
              sample:'/dl/:yt_video_id/:titulo_de_la_descarga'});
});
app.get('/api/dl/:ytid', downloader);
app.get('/api/stream/:ytid', streamer);
app.get('/api/search', search);

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
