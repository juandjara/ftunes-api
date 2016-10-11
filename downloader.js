module.exports = function(req, res, next){
  var ytdl    = require('ytdl-core');
  var ffmpeg  = require('fluent-ffmpeg');
  var through = require('through2');

  var id     = req.params.ytid;
  var title  = req.query.title || id;

  if(!id){
    return res.status(400).json({error: "Missing param ytid"});
  }

  var url    = "https://youtube.com/watch?v="+id;
  var video = ytdl(url, {
    filter: "audioonly"
  });
  var stream = through();

  res.setHeader('Content-disposition', 'attachment; filename='+title+'.mp3');  
  res.setHeader('Content-type', 'audio/mpeg');

  try{
    convert(stream, video).pipe(res);      
  }catch(err){
    return res.status(500).send(err);
  }

  function convert(stream, video){
    var proc = new ffmpeg({source: video});
    proc.withAudioCodec('libmp3lame')
      .toFormat('mp3')
      .pipe(stream);

    var initTime = Date.now(); 
    var endTime  = initTime;
    proc.on('start', function(){
      console.log('Starting FFmpeg proccess for file '+title+'.mp3 from url '+url);
    });
    proc.on('end', function(){
      endTime = Date.now();
      var time = (endTime - initTime) / 1000;
      console.log('finished FFmpeg proccess for file '+title+'.mp3 from url '+url);
      console.log('FFmpeg proccess took '+time.toFixed(3)+' seconds');
    });
    proc.on('error', function(err){
      video.end();
      stream.emit("error", err);
    });

    return stream;
  }

}
