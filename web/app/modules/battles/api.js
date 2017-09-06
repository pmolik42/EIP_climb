const async = require('async');

const User = require('../../models/user.js');
const Video = require('../../models/video.js');
const Follower = require('../../models/follower.js');
const Like = require('../../models/like.js');
const Battle = require ('../../models/battle.js');


const isTokenValid = require('../../middlewares.js').isTokenValid;
const upload = require('../../middlewares.js').upload.single('video');
var mongoose = require('mongoose');

const findUserData = (battle, users) => {
  for (let i = 0; i < users.length; i++) {
    if (battle.ownerId == users[i]._id) {
      return {username : users[i].profile.username, profilePicture : users[i].profile.pictureUrl};
    }
  }
  return {};
}

const battleApiRoutes = (app) => {

  app.get('/api/battle/:battleId', isTokenValid, (req, res) => {
    const battleId = req.params.battleId || '';

    Battle.find({'video_1.author' : req.params.battleId})
    //Battle.findOne({_id: battleId}).populate('video_1').populate('video_2') //cf models/battles.js for populate
    .then((battle) => {
      if (!battle) {
        throw 'Battle does not exist';
      } else return battle;
    }).then((battle) => {
        res.json({success: true, message: battle});
    }).catch((err) => {
      res.json({success: false, message: err});
    });
  })

app.get('/api/battles/feed', isTokenValid, (req, res) => {

    async.waterfall([
      (cb) => {
        Follower.find({followerId : req.user.id}).select('userId').exec((err, followers) => {
          if (err) return cb(err);
          cb(null, followers);
        });
      },
      (followers, cb) => {
        User.find({_id : { $in : followers}}).select('profile.pictureUrl profile.username _id').exec((err, users) => {
          if (err) return cb(err);
          cb(null, users, followers);
        });
      },
      (users, followers, cb) => {
        let feedBattlesUsers = users;
        let usersId = followers;
        usersId.push(mongoose.Types.ObjectId(req.user.id));
        feedBattlesUsers.push({profile: {username : req.user.username, pictureUrl : req.user.pictureUrl}, _id: req.user.id});
        Battle.find({ $or : [ 
                        {'video_1.author' : { $in : usersId}}, 
                        {'video_2.author' : { $in : usersId}}]
                         }).limit(20).sort('-createdAt').exec((err, results) => {
          if (err) {
            console.log(typeof usersId[0]);
            console.log(err);

            return cb(err);
          }
          cb(null, results);
        });
      },


    ], (err, results) => {
      if (err) return res.json({success : false, message : 'No battles found'});

      res.json({success : true, battles : results});
    });


  });

  app.post('/api/battle', isTokenValid, (req, res) => {
    if (req.body.video_1 && req.body.video_2)
    {
        Video.findOne({_id : req.body.video_1}, 'ownerId').exec((err, video1) => {
          if (err) throw err;
          let author_1 = video1.ownerId
          Video.findOne({_id : req.body.video_2}, 'ownerId').exec((err, video2) => {
            if (err) throw err;
            let author_2 = video2.ownerId

            let newBattle = new Battle();
            newBattle.category = null;//not implemented
            newBattle.video_1.video= req.body.video_1;
            newBattle.video_1.votes = 0;
            newBattle.video_1.author = author_1;
            newBattle.video_2.video = req.body.video_2;
            newBattle.video_2.votes = 0;
            newBattle.video_2.author = author_2;
            newBattle.createdAt = new Date();
            newBattle.save((err, data) => {
            if (err) throw err;
            res.json({success: true, battle: newBattle});
            });
          });
        });
        
        //console.log(newBattle)
        
    }
  });
};

module.exports = battleApiRoutes;
