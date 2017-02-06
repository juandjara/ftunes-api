module.exports = function(req, res, next){
  var ytdl = require('ytdl-core');
  var id   = req.params.ytid;

  if(!id){
    return res.status(400).json({error: "Missing param ytid"});
  }

  var url   = "https://youtube.com/watch?v="+id;
  var video = ytdl(url, {
    filter: "audioonly"
  });

  video.on('error', err => res.status(500).send(err))
  video.on('response', function(data){
    var length = parseInt(data.headers["content-length"]);
    res.sendSeekable(video, {
      type: "audio/webm",
      length: length
    });
  });
}
