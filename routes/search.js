const config = require('../config')
const axios = require('axios')

const axiosInstance = axios.create({
  headers: {
    get: {
      referer: 'https://freetunes.fuken.xyz'
    }
  }
})

module.exports = async function search(req, res) {
  const q = req.query.q;
  const maxResults = req.query.rpp || 5;
  const pageToken = req.query.nextPageToken;
  const type = req.query.type || 'video';
  const part = 'snippet'
  const key = process.env.GOOGLE_API_KEY

  if (!q) {
    return res.status(400).json({error: "Query param (q) is missing"});
  }

  const params = { key, q, maxResults, pageToken, type, part }
  const urlParams = Object.keys(params)
    .map(key => params[key] && `${key}=${params[key]}`)
    .filter(Boolean)
    .join('&')

  const url = `${config.searchUrl}?${urlParams}`
  try {
    const _res = await axiosInstance.get(url)
    const results = _res.data
    try {
      var parsedResults = results.items
      .filter(elem => elem.id.kind.indexOf(type) !== -1)
      .map(elem => ({
        id: elem.id.videoId,
        ...elem.snippet,
      }));
      res.json({
        results: parsedResults,
        nextPageToken: results.nextPageToken
      });
    } catch(err) {
      res.status(500).json({error: "error parsing youtube api"});
    }
  } catch (err) {
    console.error(err)
    let apiError = err
    if (err instanceof Error) {
      apiError = {
        message: err.message,
        stack: err.stack
      }
    }
    if (err.response) {
      apiError = {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data
      }
    }
    res.status(500).json({ error: "error calling youtube search api", apiError });
  }
}
