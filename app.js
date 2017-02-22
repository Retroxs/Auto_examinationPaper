let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let jade = require('jade');

let mongoose = require('./config/mongoose');
let db = mongoose();
let rootContrllerPath ='./controller/web/rooter';
let teacherContrllerPath ='./controller/web/teacher';
// let routes = require('./routes/index');
// let api = require('./routes/api');
let rooterController = require(rootContrllerPath+'/WebHomeController');
let rooterAPIController = require(rootContrllerPath+'/WebApiController');
let rooterDATAController = require(rootContrllerPath+'/WebDataController');
let teacherController = require(teacherContrllerPath+'/WebHomeController');
let teacherAPIController = require(teacherContrllerPath+'/WebApiController');
let teacherDATAController = require(teacherContrllerPath+'/WebDataController');



let app = express();

// view engine setup

//use jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/api', api);
// app.use('/back', rooterController);
app.use('/back', rooterController);
app.use('/back', rooterDATAController);
app.use('/back/api', rooterAPIController);
app.use('/', teacherController);
app.use('/', teacherDATAController);
app.use('/api', teacherAPIController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
