// "watch": "webpack --watch"
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const route = require('./routes');
const path = require('path');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

dotenv.config({ path: './config.env' });
const url = process.env.URL;
const port = process.env.PORT||8000;
const oneDay = 1000 * 60 * 60 * 24;
const store = new mongodbSession({
    uri: url,
    collection: "mySessions"
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }))  // decode the url and sends the data in body of req
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: "key that will sign cookie",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: oneDay },
        store: store,
    }));
app.use('/', route);


mongoose.connect(url, function (err, client) {
    if (err) console.log(err);

    server.listen(port, function (error) {
        if (error) {

            console.log('error in running the server', error);
            return;
        }
        io.on('connection', (socket) => {
            socket.on('chat_message', (msg) => {
                io.emit('chat_message', msg);
            });
        });
        console.log('server is running succefully');
    })
});


