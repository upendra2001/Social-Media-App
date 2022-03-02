'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    post: [{
        post_id: String,
        post_title: String,
        posted_on: Date
    }],
    followers: [{
        follower_name: String
    }],
    following: [{
        following_name: String
    }]
}, { collection: 'user' });

module.exports = mongoose.model('users', UserSchema);
