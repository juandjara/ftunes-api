module.exports = function(req, res, next){
  var ytdl   = require('ytdl-core');
  var ffmpeg = require('fluent-ffmpeg');

  var id     = req.params.ytid;
  var title  = req.query.title || id;
  var isDownload = req.query.dl;
  var isConvert = req.query.mp3convert;

  if(!id){
    return res.status(400).json({error: "Missing param ytid"});
  }

  var url    = "https://youtube.com/watch?v="+id;
  var stream = ytdl(url, {
    filter: "audioonly"
  });

  if(isDownload){
    res.setHeader('Content-disposition', 'attachment; filename='+title+'.mp3');
  }
  //res.setHeader('Content-type', 'audio/mpeg');

  stream.on('info', function(info){
    //res.setHeader('Content-Length', info.size);
    try{
      if(isConvert){
	      convert(res, stream);      
      }else{
	      stream.pipe(res);
      }
    }catch(err){
      return res.status(500).send(err);
    }
  })

  function convert(res, stream){
    var proc = new ffmpeg({source: stream});
    proc.withAudioCodec('libmp3lame')
      .toFormat('mp3')
      .pipe(res);

    var initTime = Date.now(); 
    var endTime  = initTime;
    proc.on('start', function(){
      console.log('Start streaming file '+title+'.mp3 from url '+url);
    });
    proc.on('end', function(){
      if(isDownload){
        endTime = Date.now();
        var time = (endTime - initTime) / 1000;
        console.log('Streaming took '+time.toFixed(3)+'s');
      }
      console.log('finished streaming file '+title+'.mp3 from url '+url);
    });
    proc.on('error', function(){
      res.end();
    });
  }

}
