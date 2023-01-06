const ffmpeg  = require('fluent-ffmpeg');
const through = require('through2');
const { default: axios } = require('axios');
const getAudioStreamDef = require('../utils/getAudioStreamDef')

module.exports = async function download(req, res) {
  try {
    const id = req.params.ytid
    const streamDef = await getAudioStreamDef(id, 'audio/webm')
    await downloadAudio(streamDef, res)
  } catch (err) {
    console.error('generic error', err)
    res.status(500).json({ error: err })
  }
}

async function downloadAudio(streamDef, res) {
  const response = await axios.get(streamDef.url, { responseType: 'stream' })
  const axiosStream = response.data
  axiosStream.on('error', (err) => {
    console.error('error streaming youtube response data', err)
    res.status(500).json({ error: err })
  })

  const ffmpegStream = convertToMP3(axiosStream, streamDef.title)
  ffmpegStream.on('error', (err) => {
    console.error('error converting youtube stream to MP3 with FFmpeg', err)
    res.status(500).json({ error: err })
  })

  res.setHeader('Content-disposition', `attachment; filename="${streamDef.title}.mp3"`);
  res.setHeader('Content-type', 'audio/mpeg');
  res.setHeader('Content-Length', streamDef.clen);
  ffmpegStream.pipe(res)
}

function convertToMP3(inputStream, title) {
  const initTime = Date.now(); 
  const outputStream = through();
  const proc = new ffmpeg({source: inputStream});

  proc
    .withAudioCodec('libmp3lame')
    .toFormat('mp3')
    .pipe(outputStream);

  proc.on('start', function () {
    console.log(`FFmpeg proccess started for ${title}`);
  });

  proc.on('end', function () {
    const endTime = Date.now();
    const time = (endTime - initTime) / 1000;
    console.log(`FFmpeg proccess finished for ${title}`);
    console.log(`FFmpeg proccess took ${time.toFixed(3)} seconds`);
  });

  proc.on('error', function (err) {
    inputStream.end();
    outputStream.emit("error", err);
  });

  return outputStream;
}
