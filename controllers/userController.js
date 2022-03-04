var bcrypt = require('bcryptjs');
var validator = require('validator');
var user_doc = require('../models/User');
var post_doc = require('../models/Post');

module.exports.search_profile = (req, res) => {
    user_doc.findOne({ username: req.body.username })
        .then(result => {
            res.redirect(`/profile/${req.body.username}`);

        })
        .catch(err => {
            res.redirect('back');
            // res.json(err);
        });
};

module.exports.home_dashboard = (req, res) => {
    user_doc.findOne({ username: req.session.user.username })
        .then(result => {
            var arr = result.following.map(a => a.following_name);
            arr.push(req.session.user.username);
            post_doc.find({ username: { $in: arr } }).sort({ date: -1 })
                .then(result2 => {
                    res.render('home-dashboard', { myself : req.session.user.username, recent_posts: result2 });
                })
                .catch(error2 => {
                    res.json(error2);
                });
        })
        .catch(error => {
            res.json(error);
        });
};

module.exports.home_guest = (req, res) => {
    res.render('home-guest');
};

module.exports.profile = (req, res) => {
    user_doc.findOne({ username: req.params.username })
        .then(result => {
            // console.log(result);
            if (result==null) {
              res.redirect('back');
            }
            else if (result.username == req.session.user.username) {
                res.render('profile', { other: result, myself: req.session.user.username, who: '0' });  // not showing any button
            }
            else {
                user_doc.findOne({ username: req.params.username, "followers.follower_name": req.session.user.username })
                    .then(result2 => {
                        if (!result2) {
                            res.render('profile', { other: result, myself: req.session.user.username, who: '1' });  //showing follow button
                        }
                        else {
                            res.render('profile', { other: result, myself: req.session.user.username, who: '2' });  //showing unfollow button
                        }
                    })
                    .catch(error => {
                        res.json(error);
                    });
            }
        })
        .catch(err=> {
            res.redirect('back');
        });
};

module.exports.user_register = async (req, res) => {
    const { username, email, password } = req.body;
    const errors = [];
    if (!validator.isEmail(email)) {
        errors.push({
            param: 'email',
            msg: 'Invalid e-mail address.'
        });
    }
    try {
        const usernameExists = await user_doc.countDocuments({ username: username });
        const emailExists = await user_doc.countDocuments({ email: email });
        if (usernameExists === 1) {
            errors.push({
                param: 'username',
                msg: 'Invalid username.'
            });
        }
        else if (emailExists === 1) {
            errors.push({
                param: 'email',
                msg: 'Invalid e-mail address.'
            });
        }
    } catch (err) {
        console.log(err);
    }
    if (errors.length == 0) {
        const hash = bcrypt.hashSync(password, 8);
        const newUser = new user_doc({
            username,
            email,
            password: hash
        });

        try {
            newUser.save();
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        // flash message to be implemented
        // res.json({ errors });
    }
    res.redirect('/');

};


module.exports.user_login = (req, res) => {
    const { username, password } = req.body;
    user_doc.findOne({ username: username })
        .then(result => {
            if (result == null) {
                res.redirect('/');
            }
            if (bcrypt.compareSync(password, result.password)) {
                req.session.isAuth = true;
                req.session.user = result;
                res.redirect('/home-dashboard');
            }
            else {
                res.redirect('/');
            }
        })
        .catch(err => console.log(err));
};



module.exports.user_logout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
    });
    res.redirect('/');
};
