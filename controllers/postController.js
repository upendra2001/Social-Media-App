var post_doc = require('../models/Post');
var user_doc = require('../models/User');

exports.create_post_get = (req, res) => {
    res.render('create-post', { myself: req.session.user.username });
};
exports.create_post_post = (req, res) => {
    const { title, body } = req.body;
    const newPost = new post_doc({
        title: title,
        description: body,
        username: req.session.user.username,
        date: new Date(),
    });
    var id;
    newPost.save()
        .then(result => {
            id = result._id;
            user_doc.findOneAndUpdate({ username: result.username },
                { $push: { post: { post_id: id, post_title: title, posted_on: result.date } } })
                .then(result2 => {
                    res.redirect(`/post/${id}`);
                })
                .catch(error => {
                    res.json(error);
                });
        })
        .catch(err => res.json(err));

};
exports.edit_post_get = (req, res) => {
    post_doc.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) {
                res.redirect('back');
            }
            else {
                res.render('edit-post', { post_to_edit: result, myself: req.session.user.username });
            }
        })
        .catch(err => {
            res.json(err);
        });
};
exports.edit_post_post = (req, res) => {
    const { title, body } = req.body;
    post_doc.findOneAndUpdate({ _id: req.params.id },
        { title: title, description: body })
        .then(result => {
            if (result == null) {
                res.redirect('back');
            }
            else {
                user_doc.updateOne({ username: result.username, "post.post_id": req.params.id },
                    { $set: { "post.$.post_title": title } })
                    .then(result2 => {
                        res.redirect(`/post/${req.params.id}`);
                    })
                    .catch(error => {
                        res.json(error);
                    });
            }
        })
        .catch(err => {
            res.json(err);
        });
};
exports.single_post_screen = (req, res) => {
    post_doc.findOne({ _id: req.params.id })
        .then(result => {
            if (result == null) {
                res.redirect('back');
            }
            else {
                res.render('single-post-screen', { post_sent: result, myself: req.session.user.username });
            }
        })
        .catch(err => {
            res.json(err);
        });
};

exports.delete_post = (req, res) => {
    post_doc.deleteOne({ _id: req.params.id })
        .then(result => {
            user_doc.updateOne({ username: req.session.user.username },
                { $pull: { post: { post_id: req.params.id } } })
                .then(result2 => {
                    res.redirect(`/profile/${req.session.user.username}`);
                })
                .catch(error => {
                    res.json(error);
                });
        })
        .catch(err => res.json(err));
}