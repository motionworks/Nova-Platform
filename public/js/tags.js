(function() {
  var tags;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  tags = {};
  tags.Model = (function() {
    __extends(Model, Backbone.Model);
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    return Model;
  })();
  tags.List = (function() {
    __extends(List, Backbone.Collection);
    function List() {
      List.__super__.constructor.apply(this, arguments);
    }
    List.prototype.url = '/tags/get';
    List.prototype.model = tags.Model;
    List.prototype.dictionary = [];
    List.prototype.initialize = function() {
      var c;
      c = this;
      return $.get('/tags/get', function(data) {
        c.add(data);
        return c.makeDictionary();
      });
    };
    List.prototype.makeDictionary = function() {
      var tag, tagName, _i, _len, _ref;
      _ref = this.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        tagName = tag.get('name');
        this.dictionary.push(tagName);
      }
      return this.view = new tags.ListView();
    };
    return List;
  })();
  tags.ListView = (function() {
    __extends(ListView, Backbone.View);
    function ListView() {
      ListView.__super__.constructor.apply(this, arguments);
    }
    ListView.prototype.initialize = function() {
      this.ideaListView = ideas.ideaListingView;
      this.addRecommendedTags();
      return this.bindRefresh();
    };
    ListView.prototype.addRecommendedTags = function() {
      var article, articles, recommendedTags, tag, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
      articles = this.ideaListView.collection.models;
      recommendedTags = [];
      _ref = articles.slice(3, 7);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        article = _ref[_i];
        _ref2 = article.get('tags');
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          tag = _ref2[_j];
          recommendedTags.push(tag);
        }
      }
      _ref3 = recommendedTags.slice(3, 7);
      _results = [];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        tag = _ref3[_k];
        $('#tag-recommended').append('<li><a href="#">' + tag + '</a></li>');
        _results.push($('#tag-selected').prepend('<li class="active"><a href="#">' + tag + ' <span href="#" class="delete">(x)</span></a></li>'));
      }
      return _results;
    };
    ListView.prototype.updateRecommendedTags = function(tagsEl) {
      var elemsLength, i, tagsArr;
      tagsArr = [];
      $(tagsEl).find('li').each(function() {
        return tagsArr.push($.trim($(this).text()));
      });
      elemsLength = $('#tag-recommended li').length - 1;
      i = 0;
      while (i < elemsLength) {
        $('#tag-recommended li').eq(i).find('a').text(tagsArr[i]);
        i++;
      }
      return $('#tag-recommended').effect('highlight', 1000);
    };
    ListView.prototype.updateSelected = function(tagVal) {
      return $('#tag-selected').prepend('<li class="active"><a href="#">' + tagVal + ' <span href="#" class="delete">(x)</span></a></li>');
    };
    ListView.prototype.bindRefresh = function() {
      $('#tag-selected li').live('click', function() {
        return $(this).toggleClass('active');
      });
      $('#tag-selected .delete').live('click', function() {
        return $(this).parent().remove();
      });
      return $('#tag-refresh').live('click', function(e) {
        var articleShowNum, diff;
        tags = [];
        $('#tag-selected li.active a').each(function() {
          var t;
          t = $.trim($(this).text());
          t = t.replace(/\*?(\s\(x\))/g, "");
          return tags.push(t);
        });
        if (tags.length > 0) {
          $('#ideas-container article').each(function() {
            var tag, _i, _len, _results;
            $(this).removeClass('tagMatch');
            _results = [];
            for (_i = 0, _len = tags.length; _i < _len; _i++) {
              tag = tags[_i];
              _results.push($(this).attr('data-tag').indexOf(tag) > 0 ? $(this).addClass('tagMatch') : void 0);
            }
            return _results;
          });
          $('#ideas-container').isotope({
            filter: '.tagMatch'
          });
        } else {
          $('#ideas-container').isotope({
            filter: '*'
          });
        }
        articleShowNum = $('#ideas-container .tagMatch').length;
        if (articleShowNum < ideas.options.ideasNum) {
          diff = ideas.options.ideasNum - articleShowNum;
          ideas.ideaListingView.collection.update({
            num: diff,
            tags: tags.slice(0, 3)
          });
        }
        return e.preventDefault();
      });
    };
    return ListView;
  })();
  $('.tags:not(#tag-selected)').find('a').live('click', function(e) {
    ideas.tagsList.view.updateSelected($.trim($(this).text()));
    return e.preventDefault();
  });
}).call(this);
