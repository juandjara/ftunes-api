module.exports = {
  apiKey: process.env.GOOGLE_API_KEY,
  port: process.env.PORT || 3000,
  autocompleteUrl: 'https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=',
  searchUrl: 'https://www.googleapis.com/youtube/v3/search'
}