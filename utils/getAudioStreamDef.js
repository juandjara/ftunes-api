const { default: axios } = require('axios')

const BASE_URL = 'https://invidious.weblibre.org/api/v1/videos'
module.exports = async function getAudioStreamDef(videoId, type) {
  const url = `${BASE_URL}/${videoId}`
  const resp = await axios.get(url)
  const title = resp.data.title
  const streams = resp.data.adaptiveFormats
  const audioStreams = streams
    .filter(s => s.type.startsWith(type))
    .map(s => ({ ...s, title }))
    .sort((a, b) => Number(b.bitrate) - Number(a.bitrate))

  return audioStreams[0]
}
