module.exports = function(req, res){
  var YouTube = require("youtube-node");
  var yt      = new YouTube();
  var env     = require("./env");
  var query   = req.query.q;
  var rpp     = req.query.rpp || 5;
  var nextPageToken = req.query.nextPageToken;

  if(!query){
    return res.status(400).json({error: "Query param (q) is missing"});
  }

  yt.setKey(env.youtube);
  if(nextPageToken) {
    yt.addParam('pageToken', nextPageToken);
  }
  yt.search(query, rpp, function(err, results){
    if(err){
      console.error(err.error);
      return res.status(500).send(err);
    }

    try{
      var mappedResults = results.items.map(function(elem){
        return {
          id: elem.id.videoId,
          etag: elem.etag,
          data: elem.snippet,
        };
      });
      return res.json({
        results: mappedResults,
        nextPageToken: results.nextPageToken
      });
    }catch(err){
      res.status(500).json({error: "error parsing youtube api"});
    }
  });
}
