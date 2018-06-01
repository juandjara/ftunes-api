module.exports = function(req, res){
  var YouTube = require("youtube-node");
  var yt = new YouTube();
  var id = req.params.id;

  if(!id){
    return res.status(400).json({error: "id is missing"});
  }

  yt.setKey(process.env.GOOGLE_API_KEY);
  yt.getById(id, function(err, result){
    if(err){
      console.error("youtube getById error: ", err);
      return res.status(500).send(err);
    }

    try{
      const item = result.items[0];
      res.json({
        id: item.id,
        ...item.snippet
      });
    } catch(err) {
      res.status(500).json({error: "error parsing youtube api result"});
    }
  });
}
