const user_doc = require('../models/User');

exports.profile_followers = (req, res) => {
    user_doc.findOne({ username: req.params.username })
        .then(result => {
            if (result.username == req.session.user.username) {
                res.render('profile-followers', { other: result, myself: req.session.user.username, who: '0' });  // not showing any button
            }
            else {
                user_doc.findOne({ username: req.params.username, "followers.follower_name": req.session.user.username })
                    .then(result2 => {
                        if (result2 == null) {
                            res.render('profile-followers', { other: result, myself: req.session.username, who: '1' });  //showing follow button
                        }
                        else {
                            res.render('profile-followers', { other: result, myself: req.session.username, who: '2' });  //showing unfollow button
                        }
                    })
                    .catch(error => {
                        res.json(error);
                    });
            }
        })
        .catch(err => {
            res.redirect('back');
        });
};
exports.profile_following = (req, res) => {
    user_doc.findOne({ username: req.params.username })   // <= this is to check if the user exists or not
        .then(result => {
            // below code is to decide which button(follow/unfollow/nothing) to be shown
            if (result.username == req.session.user.username) {
                res.render('profile-following', { other: result, myself: req.session.user.username, who: '0' });  // not showing any button
            }
            else {
                user_doc.findOne({ username: req.params.username, "followers.follower_name": req.session.user.username })
                    .then(result2 => {
                        if (result2 == null) {
                            res.render('profile-following', { other: result, myself: req.session.user.username, who: '1' });  //showing follow button
                        }
                        else {
                            res.render('profile-following', { other: result, myself: req.session.user.username, who: '2' });  //showing unfollow button
                        }
                    })
                    .catch(error => {
                        res.json(error);
                    });
            }
        })
        .catch(err => {
            res.redirect('back');
        });
};
exports.add_follow = (req, res) => {
    user_doc.updateOne({ username: req.params.username },
        { $push: { followers: { follower_name: req.session.user.username } } })
        .then(result => {
            user_doc.updateOne({ username: req.session.user.username },
                { $push: { following: { following_name: req.params.username } } })
                .then(result2 => {
                    res.redirect('back');  // to be changed
                })
                .catch(error => {
                    res.json(error);
                });
        })
        .catch(error => {
            res.json(error);
        });
};
exports.remove_follow = (req, res) => {
    user_doc.updateOne({ username: req.params.username },
        { $pull: { followers: { follower_name: req.session.user.username } } })
        .then(result => {
            user_doc.updateOne({ username: req.session.user.username },
                { $pull: { following: { following_name: req.params.username } } }) // used to delete from an array in document !! remember we have used update not delete
                .then(result2 => {
                    res.redirect('back');  // to be changed
                })
                .catch(error => {
                    res.json(error);
                });
        })
        .catch(error => {
            res.json(error);
        });
};

