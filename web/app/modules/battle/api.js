const async = require('async');

const Video = require('../../models/video.js');
const Like = require('../../models/like.js');


const isTokenValid = require('../../middlewares.js').isTokenValid;


app.post('/api/battles/battle', isTokenValid, (req, res) => {

  if (battle.videos[0] && battle.videos[1]) {
        let newBattle = new Battle();
        newBattle.category = "Dance";
        newBattle.videos = [battle.videos[0], battle.videos[1]];
        newBattle.likesCount = [0, 0];
        newBattle.createdAt = new Date();
        return newBattle.save();
    }
      throw 'One of the videos is not valid';
  }).then((model) => {
      res.json({success: true, message: 'Battle created successfully'});
  }).catch((err) => {
    res.json({success: false, message: err});
  });
});


module.exports = battleApiRoutes;
