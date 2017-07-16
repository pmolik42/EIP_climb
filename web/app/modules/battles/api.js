const async = require('async');

const User = require('../../models/user.js');
const Video = require('../../models/video.js');
const Follower = require('../../models/follower.js');
const Like = require('../../models/like.js');
const Battle = require ('../../models/battle.js');


const isTokenValid = require('../../middlewares.js').isTokenValid;
const upload = require('../../middlewares.js').upload.single('video');

//ffmpeg for thumbnails
var ffmpeg = require('fluent-ffmpeg');

const battleApiRoutes = (app) => {

app.post('/api/battles/battle', isTokenValid, (req, res) => {

      function battleObjectCreation(battle) {
        if (battle.videos[0] && battle.videos[1]) {

            let newBattle = new Battle();
            newBattle.category = "Dance";
            newBattle.videos = [battle.videos[0], battle.videos[1]];
            newBattle.likesCount = [0, 0];
            newBattle.createdAt = new Date();
            return newBattle.save();
          }
          throw 'One of the videos is not valid';
      }
        res.json({success: true, message: 'Battle created successfully'});

 });
};

module.exports = battleApiRoutes;
