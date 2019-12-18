const config = require('../config')
const YouTube = require("youtube-node");
const yt = new YouTube();

module.exports = function search(req, res) {
  const query = req.query.q;
  const rpp = req.query.rpp || 5;
  const nextPageToken = req.query.nextPageToken;
  const type = req.query.type || 'video';

  if(!query){
    return res.status(400).json({error: "Query param (q) is missing"});
  }

  yt.setKey(config.apiKey)
  yt.search(query, rpp, {pageToken: nextPageToken}, function(err, results){
    if(err){
      console.error("youtube search error: ", err);
      res.status(500).send(err);
      return;
    }

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
  });
}
