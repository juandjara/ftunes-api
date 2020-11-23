const express = require('express');
const app     = express();
const cors    = require('cors');
const downloader = require('./routes/downloader');
const streamer   = require('./routes/streamer');
const search     = require('./routes/search');
const sendSeekable = require('send-seekable');
const axios = require('axios')
const config = require('./config')
const pkg = require('./package.json')
require('dotenv').config()

app.set('json spaces', 2);
app.use(cors());
app.use(sendSeekable);

app.get('/', function(req, res){
  res.json({
    name: pkg.name,
    description: pkg.description,
    version: pkg.version
  });
});
app.get('/dl/:ytid', downloader);
app.get('/stream/:ytid', streamer);
app.get('/search', search);

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
