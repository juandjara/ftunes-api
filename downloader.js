const ytdl    = require('ytdl-core');
const ffmpeg  = require('fluent-ffmpeg');
const through = require('through2');

module.exports = function download (req, res) {
  const id    = req.params.ytid;
  const title = req.query.title || id;
  const url = `https://youtube.com/watch?v=${id}`
  const log = `${title}.mp3 from url ${url}`

  if (!id) {
    return res.status(400).json({error: "Missing param ytid"});
  }

  const stream = through();
  const video = ytdl(url, { filter: "audioonly" });

  res.setHeader('Content-disposition', `attachment; filename="${title}.mp3"`);
  res.setHeader('Content-type', 'audio/mpeg');

  try {
    convert(stream, video, log).pipe(res);
  } catch(err) {
    return res.status(500).send(err);
  }
}

function convert(stream, video, log){
  const proc = new ffmpeg({source: video});
  proc
    .withAudioCodec('libmp3lame')
    .toFormat('mp3')
    .pipe(stream);

  let initTime = Date.now(); 

  proc.on('start', function () {
    console.log(`Starting FFmpeg proccess for file ${log}`);
  });
  proc.on('end', function () {
    const endTime = Date.now();
    const time = (endTime - initTime) / 1000;
    console.log(`FFmpeg proccess finished for file ${log}`);
    console.log('FFmpeg proccess took '+time.toFixed(3)+' seconds');
  });
  proc.on('error', function (err) {
    console.error('FFmpeg error', err);
    video.end();
    stream.emit("error", err.message);
  });

  return stream;
}
