module.exports = function(req, res){
  var YouTube = require("youtube-node");
  var yt      = new YouTube();
  var env     = require("./env");
  var query   = req.query.q;
  var rpp     = req.query.rpp || 5;

  if(!query){
    return res.status(400).json({error: "Query param (q) is missing"});
  }

  yt.setKey(env.youtube);
  yt.search(query, rpp, function(err, results){
    if(err){
      console.error(err.error);
      return res.status(500).send(err);
    }

    try{
      res.json(results.items.map(function(elem){
        return {
          id: elem.id.videoId,
          etag: elem.etag,
          data: elem.snippet
        };
      }));
    }catch(err){
      res.status(500).json({error: "error parsing youtube api"});
    }
  });
}
