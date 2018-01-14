const axios = require('axios')

const makeUrl = (url, params) => {
  const query = Object.keys(params)
  .map(key => `${key}=${encodeURIComponent(params[key])}`)
  .join('&');
  return `${url}?${query}`
}
exports.makeUrl = makeUrl;

const getAuthRedirect = () => {
  const auth_base_url = 'https://accounts.spotify.com/authorize'
  const auth_params = {
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    redirect_uri: 'http://localhost:3000/spotify_callback',
    scope: 'playlist-read-private'
  }
  return makeUrl(auth_base_url, auth_params);
}
exports.getAuthRedirect = getAuthRedirect;

const getTokens = code => {
  const token_url = 'https://accounts.spotify.com/api/token'
  const params = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:3000/spotify_callback',
  }
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const auth_text = client_id+':'+client_secret
  const auth_token = new Buffer(auth_text).toString('base64')

  return axios({
    method: 'POST',
    url: token_url,
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic '+auth_token
    }
  })
}
exports.getTokens = getTokens;
