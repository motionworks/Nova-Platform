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
    __extends(Model, Backbone.Model);
    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }
    Model.prototype.defaults = {
      'commentsNum': 0
    };
    Model.prototype.initialize = function() {
      this.view = new ideas.SingleView({
        model: this
      });
      return this.view.render();
    };
    Model.prototype.addLike = function() {
      var id, t;
      id = this.get('id');
      console.log(id);
      t = this;
      return $.ajax({
        url: '/idea/like/' + id,
        type: 'PUT',
        success: function(data) {
          var l;
          console.log(data);
          l = t.get('like') + 1;
          t.set({
            'like': l
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
    __extends(List, Backbone.Collection);
    function List() {
      List.__super__.constructor.apply(this, arguments);
    }
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
      $.getJSON('/idea/list', function(data) {
        return data;
      }).then(function(data) {
        var c, i, idea, m, num, _i, _len, _results;
        c = 0;
        idea = data.idea;
        num = idea.length;
        _results = [];
        for (_i = 0, _len = idea.length; _i < _len; _i++) {
          i = idea[_i];
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
    __extends(SingleView, Backbone.View);
    function SingleView() {
      SingleView.__super__.constructor.apply(this, arguments);
    }
    SingleView.prototype.tagName = 'article';
    SingleView.prototype.events = {
      'click .likes-count': 'addLike',
      'click .comments-count': 'goDetails',
      'click .more': 'goDetails',
      'click': 'toggleDetails'
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
    SingleView.prototype.goDetails = function(e) {
      return window.location.href = this.$('.more').attr('href');
    };
    SingleView.prototype.toggleDetails = function(e) {
      $(this.el).toggleClass('detail');
      return $('#ideas-container').isotope('reLayout');
    };
    return SingleView;
  })();
  ideas.ListView = (function() {
    __extends(ListView, Backbone.View);
    function ListView() {
      ListView.__super__.constructor.apply(this, arguments);
    }
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
    __extends(FormView, Backbone.View);
    function FormView() {
      FormView.__super__.constructor.apply(this, arguments);
    }
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
      var arr, contentType, desc, el, email, json, submitUrl, tags, title, url, urlVal, username, validate;
      el = this.el;
      submitUrl = $(el).find('form').attr('action');
      title = $(el).find('#form_title');
      desc = $(el).find('#form_desc');
      url = $(el).find('#form_url');
      username = $(el).find('#form_name');
      email = $(el).find('#form_email');
      tags = $(el).find('#form_tags');
      arr = [title, desc, tags, username, email];
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
      urlVal = url.val();
      if (/(png|jpg|bmp|gif)/.test(urlVal) === true) {
        contentType = 'image';
      } else if (/(youtube.com)/.test(urlVal) === true) {
        contentType = 'video';
        urlVal = urlVal.match(/http\:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})/)[1];
      } else if (urlVal !== '') {
        contentType = 'url';
      } else {
        contentType = 'text';
      }
      json = {
        'title': title.val(),
        'desc': desc.val(),
        'url': urlVal,
        'username': username.val(),
        'email': email.val(),
        'tags': tags.val(),
        'like': 0,
        'contentType': contentType
      };
      if (validate() === true) {
        return $.post(submitUrl, json, function(data) {
          $.nmTop().close();
          return new ideas.Model(data);
        });
      }
    };
    return FormView;
  })();
  ideas.Controller = (function() {
    __extends(Controller, Backbone.Controller);
    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }
    Controller.prototype.initialize = function() {
      ideas.list = new ideas.ListView();
      return window.location.href = "#";
    };
    return Controller;
  })();
  $(function() {
    return ideas.session = new ideas.Controller();
  });
}).call(this);
