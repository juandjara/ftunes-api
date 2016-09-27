module.exports = function(req, res){
  var YouTube = require("youtube-node");
  var yt      = new YouTube();
  var env     = require("./env");
  var query   = req.query.q;
  var rpp     = req.query.rpp || 5;

  if(!query){
    return res.status(400).send("Query param (q) is missing");
  }

  yt.setKey(env.youtube);
  yt.search(query, rpp, function(err, results){
    if(err){
      console.error(err);
      return res.status(500).send(err);
    }

    res.json(results);
  });
}
