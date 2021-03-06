(function() {
  var ideas;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Backbone.View.prototype.renderTemplate = function(data) {
    var t;
    if (!(this.templateItem != null)) {
      t = $.tmpl(this.template, this.model.toJSON());
      $(t).appendTo(this.el);
      return this.templateItem = $.tmplItem(t);
    } else {
      t = this;
      $.extend(this.templateItem.data, data);
      $(this.el).empty();
      return $.tmpl(this.template, this.templateItem.data).appendTo(this.el);
    }
  };
  Backbone.View.prototype.showMessage = function(msg) {
    var timer;
    if ($('#msg').length < 1) {
      $('#content').prepend('<p id="msg"><span>' + msg + '</span><a href="#" id="msg_close">(X)</a></p>');
      $('#msg_close, #msg').live('click', function() {
        return $('#msg').remove();
      });
    } else {
      $('#msg span').text(msg);
    }
    return timer = setTimeout((function() {
      return $('#msg').slideUp(300, function() {
        return $('#msg').remove();
      });
    }), 7000);
  };
  ideas = {
    options: {
      ideasNum: 10
    }
  };
  ideas.Model = (function() {
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    __extends(Model, Backbone.Model);
    Model.prototype.defaults = {
      'commentsNum': 0,
      'likes': 0
    };
    Model.prototype.initialize = function() {
      this.view = new ideas.SingleView();
      this.view.model = this;
      return this.view.render();
    };
    Model.prototype.addLike = function() {
      var id, t;
      id = this.id;
      t = this;
      return $.get('/ideas/add-like', {
        id: id
      }, function(data) {
        return data;
      }).then(function(data) {
        var l;
        if (data === 'success') {
          l = t.get('likes') + 1;
          t.set({
            'likes': l
          });
          return $(t.view.el).find('.likes-count').addClass('active');
        }
      });
    };
    Model.prototype.change = function() {
      if (this.hasChanged()) {
        return this.view.update(this.changedAttributes());
      }
    };
    return Model;
  })();
  ideas.List = (function() {
    function List() {
      List.__super__.constructor.apply(this, arguments);
    }
    __extends(List, Backbone.Collection);
    List.prototype.model = ideas.Model;
    List.prototype.initialize = function() {
      return this.update();
    };
    List.prototype.update = function(opt) {
      var attr, t;
      t = this;
      attr = {};
      if (opt === void 0) {
        attr = {
          num: ideas.options.ideasNum
        };
      } else {
        attr = opt;
      }
      $('#get-more-ideas').addClass('loading');
      $.getJSON('/ideas/get', attr, function(data) {
        return data;
      }).then(function(data) {
        var c, i, m, num, _i, _len, _results;
        c = 0;
        num = attr.num;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          i = data[_i];
          m = new ideas.Model(i);
          t.add(m);
          c++;
          if (c === num) {
            ideas.list.render(t);
          }
          _results.push($('#get-more-ideas').removeClass('loading'));
        }
        return _results;
      });
      return this;
    };
    return List;
  })();
  ideas.SingleView = (function() {
    function SingleView() {
      SingleView.__super__.constructor.apply(this, arguments);
    }
    __extends(SingleView, Backbone.View);
    SingleView.prototype.tagName = 'article';
    SingleView.prototype.events = {
      'click .likes-count': 'addLike',
      'click .comments-count': 'getComments',
      'click .more': 'toggleDetails'
    };
    SingleView.prototype.initialize = function() {
      return this.template = $('#ideaTmpl').template();
    };
    SingleView.prototype.render = function() {
      var id, t, tags, tagsStr;
      id = 'idea_' + this.model.get('id');
      t = this;
      $(this.el).attr('id', id);
      $(this.el).addClass(this.model.get('contentType') + ' tagMatch');
      tags = this.model.get('tags');
      if ($.isArray(tags)) {
        tagsStr = tags.join(',');
      } else {
        tagsStr = tags;
      }
      $(this.el).attr('data-tag', tagsStr);
      this.renderTemplate();
      $('#ideas-container').isotope('insert', $(this.el));
      if (this.model.get('isNew')) {
        $(this.el).effect('highlight', 2000);
        this.showMessage('Congratulations! Your idea is successfully shared!');
      }
      this.checkImgLoaded();
      return this;
    };
    SingleView.prototype.update = function(attr) {
      this.renderTemplate(attr);
      $(this.el).effect('highlight', 1000);
      return this;
    };
    SingleView.prototype.checkImgLoaded = function() {
      var el;
      el = this.el;
      if ($(el).find('img').length > 0) {
        $(el).addClass('loading');
        return $(el).find('img').load(function() {
          return $(el).closest('article').removeClass('loading');
        });
      }
    };
    SingleView.prototype.addLike = function(e) {
      if (this.$('.likes-count').hasClass('active') === false) {
        this.model.addLike();
        this.showMessage('Awesome, you liked this idea!');
      }
      return e.preventDefault();
    };
    SingleView.prototype.getComments = function(e) {
      this.model.getComments();
      return e.preventDefault();
    };
    SingleView.prototype.toggleDetails = function(e) {
      $(this.el).toggleClass('detail');
      $('#ideas-container').isotope('reLayout');
      return e.preventDefault();
    };
    return SingleView;
  })();
  ideas.ListView = (function() {
    function ListView() {
      ListView.__super__.constructor.apply(this, arguments);
    }
    __extends(ListView, Backbone.View);
    ListView.prototype.initialize = function() {
      this.collection = new ideas.List();
      return this.bindElems();
    };
    ListView.prototype.bindElems = function() {
      var t;
      t = this;
      $('#ideas-container').isotope({
        layoutMode: 'masonry',
        containerClass: 'isotope',
        masonry: {
          columnWidth: 40
        },
        getSortData: {
          id: function($elem) {
            return parseInt($elem.attr('id').substr(5));
          }
        },
        sortBy: 'id',
        sortAscending: false,
        animationEngine: 'jquery'
      });
      $('#get-more-ideas').click(function(e) {
        t.collection.update();
        return e.preventDefault();
      });
      return $('#submit-idea').click(function() {
        return new ideas.FormView();
      });
    };
    return ListView;
  })();
  ideas.FormView = (function() {
    function FormView() {
      FormView.__super__.constructor.apply(this, arguments);
    }
    __extends(FormView, Backbone.View);
    FormView.prototype.id = 'idea-form';
    FormView.prototype.initialize = function() {
      this.template = $('#ideaFormTmpl').template();
      $.tmpl(this.template).appendTo(this.el);
      return this.render();
    };
    FormView.prototype.render = function() {
      var t;
      t = this;
      $.nmData(this.el, {});
      return this.$('#submit').bind('click', function(e) {
        t.submitForm();
        return e.preventDefault();
      });
    };
    FormView.prototype.setSuggestPos = function() {
      var pos;
      pos = this.$('#form_tags').offset();
      return this.$('#form_tags-suggest').css({
        position: 'fixed',
        top: pos.top + 30,
        left: pos.left + 150
      });
    };
    FormView.prototype.bindTags = function() {
      var dict, f;
      dict = ideas.tagsList.dictionary;
      f = this;
      f.$('#form_tags').bind('keypress change', function() {
        var found, list, suggest, val, word, _i, _len;
        val = $(this).val();
        list = '';
        if (val.length >= 3) {
          found = $.grep(dict, function(n, i) {
            var word;
            word = n.toLowerCase();
            if (word.indexOf(val) !== -1) {
              return n;
            }
          });
          suggest = found.slice(0, 5);
          for (_i = 0, _len = suggest.length; _i < _len; _i++) {
            word = suggest[_i];
            list += '<li>' + word + '</li>';
          }
          return f.$('#form_tags-suggest ul').html(list).show();
        } else {
          return f.$('#form_tags-suggest ul').empty().hide();
        }
      });
      return this.$('#form_tags-suggest ul li').live('click', function() {
        var val;
        val = $(this).text();
        f.$('#form_tags').val('');
        f.$('#form_tags-suggest ul').empty().hide();
        f.$('#form_tags-added').append('<li><a href="#">' + val + '</a></li>');
        $.nmTop().resize(true);
        return f.setSuggestPos();
      });
    };
    FormView.prototype.submitForm = function() {
      var arr, desc, el, json, media, submitUrl, tags, title, validate;
      el = this.el;
      submitUrl = $(el).find('form').attr('action');
      title = $(el).find('#form_title');
      desc = $(el).find('#form_desc');
      media = $(el).find('#form_media');
      tags = $(el).find('#form_tags');
      arr = [title, desc, tags];
      json = {};
      validate = function() {
        var field, _i, _len;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          field = arr[_i];
          $(el).find('.msg').remove();
          field.removeClass('error');
          if (field.val() === '') {
            field.addClass('error');
          }
        }
        if ($('.error').length > 0) {
          if ($(el).find('.msg').length < 1) {
            $(el).find('ul:first').before('<p class="msg">Oops, seems like you missed out some fields!</p>');
          }
          $.nmTop().resize(true);
          return false;
        } else {
          return true;
        }
      };
      json = {
        'title': title.val(),
        'desc': desc.val(),
        'media': media.val(),
        'tags': tags.val(),
        'user': 'Grey Ang'
      };
      if (validate() === true) {
        return $.post(submitUrl, json, function(data) {
          $.nmTop().close();
          return new ideas.Idea(data);
        });
      }
    };
    return FormView;
  })();
  ideas.Controller = (function() {
    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }
    __extends(Controller, Backbone.Controller);
    Controller.prototype.initialize = function() {
      ideas.list = new ideas.ListView();
      return window.location.href = "#";
    };
    Controller.prototype.listIdeas = function() {
      return console.log('show all ideas');
    };
    Controller.prototype.submitIdea = function() {
      return console.log('new idea');
    };
    Controller.prototype.idea = function() {
      return console.log('if GET then get idea from ID, if POST then update idea, if delete then delete idea');
    };
    return Controller;
  })();
  $(function() {
    return ideas.session = new ideas.Controller();
  });
}).call(this);
