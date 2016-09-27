module.exports = function(req, res){
  var search = require("youtube-search");
  var env    = require("./env");

  var query = req.query.q;
  var options  = {
    key: env.youtube,
    maxResults: 10
  };
  search(query, options, function(err, results){
    if(err){
      console.error(err);
      return res.status(500).send(err);
    }

    res.json(results);
  });
}
