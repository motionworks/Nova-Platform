
/**
 * Module dependencies.
 */

var express = require('express'), 
sys = require('sys'),
cluster = require('cluster');
mongoose = require('mongoose');
models = require('./models');


var app = module.exports = express.createServer();

// Configuration
// db added by akmal

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.set('db-uri', 'mongodb://localhost/nova-dev');	
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	app.set('db-uri', 'mongodb://localhost/nova-prod');
  app.use(express.errorHandler()); 
});


// Database Model (akmal)
// Install crypto for the models to work
models.defineModels(mongoose, function() {
  app.Idea = Idea = mongoose.model('Idea');
  db = mongoose.connect(app.set('db-uri'));
})

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Nova: Malaysia\'s Open Innovation Platform',
    pageName: 'Home',
    bodyId: 'home'
  });
});

app.get('/:page', function(req, res){
  page = req.params.page
  pageName = page.charAt(0).toUpperCase() + page.substr(1);
  var title = page + ' | Nova: Malaysia\'s Open Innovation Platform';
   
  res.render(page, {
    title: title,
    pageName: pageName,
    bodyId: page
  });
});

//Idea Routes
//TODO : add users here once users have been added.

// Idea List
app.get('/idea/list', function(req, res) {
  Idea.find({},
                [], { sort: ['title', 'descending'] },
                function(err, idea) {
    idea = idea.map(function(i) {
      return { 
        title: i.title, 
        id: i._id, 
        url: i.url, 
        username: i.username, 
        desc: i.desc, 
        tags: i.tags, 
        like: i.like,
        contentType: i.contentType 
      };
    });
    res.send({ idea: idea });
  });
});

//the pages
app.get('/idea/:id', function(req, res, next) {
  if (req.params.id != 'new'){
    Idea.findOne({ _id: req.params.id }, function(err, i) {
      res.render('idea/detail.jade', {
        locals: {
          title: i.title,
          pageName: 'Idea',
          bodyId: 'idea',
          i: i 
        }
      });
    });
  }
});


// Edit page
app.get('/idea/:id.:format?/edit', function(req, res, next) {
  Idea.findOne({ _id: req.params.id }, function(err, i) {
    if (!i) return next(new NotFound('Idea not found'));
    res.render('idea/edit.jade', {
      locals: { i: i }
    });
  });
});


// Update the idea
app.put('/idea/:id.:format?', function(req, res, next) {
  Idea.findOne({ _id: req.params.id }, function(err, i) {
    if (!i) return next(new NotFound('Idea not found'));
    i.title = req.body.title;
    i.data = req.body.data;

    i.save(function(err) {
      switch (req.params.format) {
        case 'json':
          res.send(i.toObject());
        break;
		
		default:
          req.flash('info', 'Idea updated');
          res.redirect('/idea');
      }
    });
  });
});

//Add Like
app.put('/idea/like/:id', function(req, res, next) {
  Idea.findOne({ _id: req.params.id }, function(err, i) {
    if (!i) return next(new NotFound('Idea not found'));
    var currLike = parseFloat(i.like);
    var newLike = currLike + 1;
		i.like = newLike.toString();
		
    i.save(function(err) {
      res.send(i.toObject());
    });
  });
});

// Delete the idea
app.del('/idea/:id.:format?', function(req, res, next) {
  Idea.findOne({ _id: req.params.id }, function(err, i) {
    if (!i) return next(new NotFound('Idea not found'));

    i.remove(function() {
      switch (req.params.format) {
        case 'json':
          res.send('true');
        break;

        default:
          req.flash('info', 'Idea deleted');
          res.redirect('/idea');
      } 
    });
  });
});

// Create the Idea
app.post('/idea/new', function(req, res) {
  var i = new Idea(req.body);
  //i.user_id = req.currentUser.id;
  i.save(function() {
    var data = i.toObject();
    data.id = data._id;
    res.send(data);
  });
});



// Only listen on $ node app.js

if (!module.parent) {
  app.listen(4000);
  console.log("Express server listening on port %d", app.address().port);
}
