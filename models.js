var crypto = require('crypto'),
    Idea;

function extractKeywords(text) {
  if (!text) return [];

  return text.
    split(/\s+/).
    filter(function(v) { return v.length > 2; }).
    filter(function(v, i, a) { return a.lastIndexOf(v) === i; });
}

function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema;

  /**
    * Model: Idea
    */
  Idea = new Schema({
    'title': { type: String, index: true },
    'desc': String,
    'tags': [String],
    'username': [String],
  	'email': [String],
  	'url': [String],
	  'like': String,
	  'contentType' : String
  });

  Idea.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  mongoose.model('Idea', Idea);

  fn();
}

exports.defineModels = defineModels; 

