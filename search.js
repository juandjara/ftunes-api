var YouTube = require("youtube-node");
var yt = new YouTube();


module.exports = function(req, res){
  var query   = req.query.q;
  var rpp     = req.query.rpp || 5;
  var nextPageToken = req.query.nextPageToken;

  if(!query){
    return res.status(400).json({error: "Query param (q) is missing"});
  }

  yt.setKey(process.env.GOOGLE_API_KEY);  
  yt.search(query, rpp, {pageToken: nextPageToken}, function(err, results){
    if(err){
      console.error("youtube search error: ", err);
      res.status(500).send(err);
      return;
    }

    try{
      var mappedResults = results.items.map(function(elem){
        return {
          id: elem.id.videoId,
          ...elem.snippet,
        };
      });
      res.json({
        results: mappedResults,
        nextPageToken: results.nextPageToken
      });
    } catch(err) {
      res.status(500).json({error: "error parsing youtube api"});
    }
  });
}
