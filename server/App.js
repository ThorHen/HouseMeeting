//Setup of Middleware and configs for server
const express = require('express');
const app = express();
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const sessionConfig = require('../SessionSecret.json');
const modelController = require('../controllers/ModelController');
const session = require('express-session');
app.use(session(sessionConfig));

app.set('view engine', 'pug');
app.set('views', __dirname + '\\views');
app.use(express.static('Server'));
app.use(morgan('short'));

//Encoding of 'post' request data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Middleware that serves the favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')));

//Middleware that checks if user is logged in
app.use(function (req, res, next) {
    if(req.session.isLoggedIn || req.url === '/user/login' || req.url === '/user/auth') {
        next();
    }
    else {
        res.redirect('/user/login');
    }
});

//Routers
const frontPageRouter = require('./routers/FrontPageRouter');
app.use('/', frontPageRouter);

const houseMeetingRouter = require('./routers/HouseMeetingRouter');
app.use('/housemeetings', houseMeetingRouter);

const statisticsRouter = require('./routers/StatisticsRouter');
app.use('/statistics', statisticsRouter);

const settingsRouter = require('./routers/SettingsRouter');
app.use('/settings', settingsRouter);

const userRouter = require('./routers/UserRouter');
app.use('/user', userRouter);

//Setup of port and start of server
const portNumber = 8080;
app.listen(portNumber, () => console.log(`Server started on ${portNumber}`));