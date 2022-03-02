const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: String,
    description: String,
    username: String,
    date: Date
}, { collection: 'post' });

module.exports = mongoose.model('posts', PostSchema);