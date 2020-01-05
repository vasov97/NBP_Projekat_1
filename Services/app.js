var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recepiesRouter = require('./routes/recepies');
<<<<<<< HEAD
var usersN4router = require('./routes/usersN4');
var postsN4router = require('./routes/postsN4');
var commentsN4router = require('./routes/commentsN4');

=======
var usersN4Router = require('./routes/usersN4');
var postsN4Router=require('./routes/postN4')
>>>>>>> a25faa7b4b5e337dcc243998f5070fdf6c763bdf
var app = express();

const port = 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recepies',recepiesRouter);
<<<<<<< HEAD
app.use('/usersN4',usersN4router);
app.use('/postsN4',postsN4router);
app.use('/commentsN4',commentsN4router);

=======
app.use('/usersN4',usersN4Router);
app.use('/postsN4',postsN4Router);
>>>>>>> a25faa7b4b5e337dcc243998f5070fdf6c763bdf
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port,()=>{
  console.log('New app listening on port:%s',port);
});

module.exports = app;
