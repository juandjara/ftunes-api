const { default: axios } = require('axios')
const getAudioStreamDef = require('../utils/getAudioStreamDef')

module.exports = async function streamer(req, res) {
  const id = req.params.ytid;
  const streamDef = await getAudioStreamDef(id, 'audio/webm')
  const response = await axios.get(streamDef.url, { responseType: 'stream' })
  const axiosStream = response.data
  axiosStream.on('error', (err) => {
    console.error('error streaming youtube response data', err)
    res.status(500).json({ error: err })
  })

  res.sendSeekable(axiosStream, {
    type: 'audio/webm',
    length: Number(streamDef.clen)
  })
}
