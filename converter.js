module.exports = function(req, res, next){
  var ytdl   = require('ytdl-core');
  var ffmpeg = require('fluent-ffmpeg');

  var id     = req.params.ytid;
  var title  = req.params.title;

  if(!id || !title){
    return res.status(400).send("Missing param ytid or title");
  }

  var url    = "https://youtube.com/watch?v="+id;
  var stream = ytdl(url);

  res.setHeader('Content-disposition', 'attachment; filename='+title+'.mp3');
  res.setHeader('Content-type', 'audio/mpeg');

  var proc = new ffmpeg({source: stream});
  proc.withAudioCodec('libmp3lame')
    .toFormat('mp3')
    .output(res)
    .run();

  proc.on('end', function(){
    console.log('finished streaming file '+title+'.mp3 from url '+url);
  });
  
}
