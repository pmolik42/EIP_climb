const async = require('async');

const User = require('../../models/user.js');
const Video = require('../../models/video.js');
const Follower = require('../../models/follower.js');
const Like = require('../../models/like.js');
const Battle = require ('../../models/battle.js');
const Vote = require('../../models/votes.js');

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
                         }).limit(20).sort('-createdAt').exec((err, battles) => {
          if (err) {
            console.log(typeof usersId[0]);
            console.log(err);

            return cb(err);
          }
          cb(null, battles);
        });
      },
      (battles, cb) => {
        async.map(battles, (battle, callback) => {
          Vote.find({battleId: battle._id}).exec((err, votes) => {
            if (err) return callback(err);
            console.log(votes.filter(function (el) {return el.video == false}));
            var userBattle = battle.toObject();
            userBattle.video_1.votes = votes.filter(function (el) {return el.video == 1}).length;
            userBattle.video_2.votes = votes.filter(function (el) {return el.video == 2}).length;

            Vote.findOne({userId: req.user.id, battleId: battle._id}).exec((err, vote) => {
              if (err) return callback(err);
              if (vote){
                userBattle.video_1.isVoted = vote.video == 1 ? true : false;  
                userBattle.video_2.isVoted = vote.video == 2 ? true : false;  
              }
              else{
                userBattle.video_1.isVoted = false;
                userBattle.video_2.isVoted = false;
              }
              callback(null, userBattle);
            });

          });
        }, (err, results) => {
          if (err) return cb(err);
          cb(null, results);
        });
      }


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
        
    }
  });

  app.post('/api/battles/:battleId/vote', isTokenValid, (req, res) => {
    const battleId = req.params.battleId || '';
    const video = req.body.vote || null;

    console.log(video);
    Battle.findOne({_id: battleId}).then((battle) => {
      if (!battle) {
        throw 'Battle does not exist';
      } else return battle;
    }).then((battle) => {
      Vote.findOneAndUpdate({battleId: battle._id, userId: req.user.id}, {video: video, createdAt: new Date()}, {new: true, upsert:true}).exec((err, vote) => {
        if (err) return res.json({success: false, message: err});
        return res.json({success:true, vote: vote})
      });
    }).then((model) => {
        res.json({success: true, message: 'Successfully liked'});
    }).catch((err) => {
      res.json({success: false, message: err});
    });
  });

  app.delete('/api/battles/:battleId/vote', isTokenValid, (req, res) => {
    const battleId = req.params.battleId || '';

    Battle.findOne({_id: battleId}).then((battle) => {
      if (!battle) {
        console.log("not exist");
        throw 'Battle does not exist';
      } else return battle;
    }).then((battle) => {
      console.log("phase 2");
      Vote.findOne({battleId: battle._id, userId: req.user.id}).exec((err, vote) => {
        if (vote) {
          return vote.remove();
        }
        console.log("didnt vote");
        throw 'You didnt vote for this battle';
      });
    }).then((model) => {
        res.json({success: true, message: 'Successfully disliked'});
    }).catch((err) => {
      res.json({success: false, message: err});
    });
  });
};

module.exports = battleApiRoutes;
