const ytdl = require('ytdl-core');

module.exports = function streamer(req, res) {
  const id = req.params.ytid;
  if (!id) {
    return res.status(400).json({error: "Missing param ytid"});
  }

  const url = "https://youtube.com/watch?v="+id;
  const video = ytdl(url, { filter: "audioonly" });

  video.on('error', err => {
    console.error(err);
    res.status(500).send("Video Stream Error")
  })
  video.on('response', function(data){
    const length = parseInt(data.headers["content-length"]);
    res.sendSeekable(video, {
      type: "audio/webm",
      length: length
    });
  });
}
