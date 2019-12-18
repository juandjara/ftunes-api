const express = require('express');
const app     = express();
const cors    = require('cors');
const downloader = require('./downloader');
const streamer   = require('./streamer');
const search     = require('./search');
const sendSeekable = require('send-seekable');
const byid  = require('./byid');
const axios = require('axios')
const config = require('./config')
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
  const url = config.autocompleteUrl + req.query.q;
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

app.listen(config.port, function () {
  console.log('🚀 app listening at port ', config.port);
});
