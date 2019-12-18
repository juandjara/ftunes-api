const YouTube = require("youtube-node");
const yt = new YouTube();

module.exports = function songById(req, res) {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({error: "id is missing"});
  }

  yt.setKey(process.env.GOOGLE_API_KEY);
  yt.getById(id, function(err, result){
    if (err) {
      console.error("youtube getById error: ", err);
      res.status(500).send(err);
      return;
    }

    try {
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
