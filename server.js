var express = require('express');
var app     = express();
var cors    = require('cors');
var downloader = require('./downloader');
var streamer   = require('./streamer');
var search     = require('./search');
var sendSeekable = require('send-seekable');
var spotify = require('./spotify');
require('dotenv').config()

app.set('json spaces', 2);
app.use(cors());
app.use(sendSeekable);

app.get('/', function(req, res){
  res.json({
    status: 'ok',
    description: 'convertir musica de yt a mp3',
    sample:'/dl/:yt_video_id/:titulo_de_la_descarga'
  });
});
app.get('/dl/:ytid', downloader);
app.get('/stream/:ytid', streamer);
app.get('/search', search);
app.get('/spotify_redirect', (req, res) => {
  const url = spotify.getAuthRedirect();
  res.redirect(url);
})
app.get('/spotify_callback', (req, res) => {
  const code = req.query.code;
  spotify.getTokens(code)
  .then(({data}) => {
    const web_url = spotify.makeUrl(process.env.FRONTEND, data)
    res.redirect(web_url);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send();
  })
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
