var express = require('express');
var app     = express();
var cors    = require('cors');
var downloader = require('./downloader');
var streamer   = require('./streamer');
var search     = require('./search');
var sendSeekable = require('send-seekable');
var byid = require('./byid');
var axios = require('axios')
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
app.get('/song/:id', byid);

app.get('/domain', (req, res) => {
  const proto = req.protocol
  const host = req.get('host')
  res.json({host, proto})
})

app.get('/autocomplete', (req, res) => {
  const url = 'https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q='+req.query.q;
  axios({
    url,
    method: 'get',
    responseType: 'stream'
  }).then(completionRes => {
    completionRes.data.pipe(res)
  }).catch(err => {
    res.status(500).json(err)
  })
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
