(function() {
  var RandomIdea, compileTags, idCounter, randomWords, tagsArr, users;
  tagsArr = [];
  compileTags = function() {
    return $.ajax({
      url: 'js/tagslist.txt',
      dataType: 'text',
      success: function(data) {
        tagsArr = data.split("\n");
        return tagsArr.sort();
      }
    });
  };
  compileTags();
  randomWords = ["Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit", "Duis", "massa", "eros,", "adipiscing", "at", "sagittis", "vitae,", "commodo", "non", "orci", "Aliquam", "mauris", "turpis,", "ornare", "eget", "sagittis", "vitae,", "condimentum", "et", "lacus", "Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit", "Maecenas", "ipsum", "dui,", "luctus", "in", "sollicitudin", "ultrices,", "commodo", "a", "erat", "Maecenas", "eleifend", "mi", "at", "dui", "semper", "rhoncus", "Curabitur", "quis", "odio", "felis,", "scelerisque", "lacinia", "diam", "Nam", "felis", "nulla,", "porttitor", "a", "adipiscing", "at,", "mattis", "ut", "lorem", "Pellentesque", "vehicula,", "nisi", "a", "pulvinar", "accumsan,", "mauris", "orci", "accumsan", "velit,", "non", "auctor", "eros", "urna", "vitae", "quam", "Nullam", "non", "mi", "non", "nisl", "semper", "venenatis", "a", "vel", "nisi", "Vivamus", "ac", "consectetur", "diam"];
  users = ['Farid Hanif', 'Mohd Afiq', 'Lyana Omar Hakim', 'Grey Ang', 'Winnie Gan', 'Akmal Fikri', 'Aaron Gill'];
  idCounter = 0;
  RandomIdea = (function() {
    function RandomIdea() {}
    RandomIdea.prototype.init = function() {
      var o;
      o = this.defaults;
      idCounter++;
      this.id = idCounter;
      this.getTags();
      this.getUser();
      this.getMedia();
      this.getDesc();
      this.getTitle();
      this.getCommentsNum();
      this.getLikes();
      this.getContentType();
      return this.build();
    };
    RandomIdea.prototype.build = function() {
      var json, t;
      t = this;
      json = {
        'id': t.id,
        'title': t.title,
        'tags': t.tags,
        'user': t.user,
        'commentsNum': t.commentsNum,
        'likes': t.likes,
        'media': t.media,
        'desc': t.desc,
        'contentType': t.contentType
      };
      return json;
    };
    RandomIdea.prototype.getTitle = function() {
      var chosen, i, maxNum, maxRange, title;
      maxRange = randomWords.length - 1;
      i = 0;
      title = '';
      if (this.media === '') {
        maxNum = 10;
      } else {
        maxNum = 5;
      }
      while (i < maxNum) {
        chosen = randomWords[randVal(0, maxRange)];
        title += chosen + ' ';
        i++;
      }
      title = title.charAt(0).toUpperCase() + title.slice(1);
      return this.title = title;
    };
    RandomIdea.prototype.getTags = function() {
      var chosen, i, maxRange, tags;
      maxRange = randomWords.length - 1;
      i = 0;
      tags = [];
      while (i < randVal(1, 5)) {
        chosen = tagsArr[randVal(0, maxRange)];
        tags.push(chosen);
        i++;
      }
      return this.tags = tags;
    };
    RandomIdea.prototype.getUser = function() {
      return this.user = users[randVal(0, users.length)];
    };
    RandomIdea.prototype.getMedia = function() {
      var roulette, t;
      roulette = randVal(1, 2);
      switch (roulette) {
        case 1:
          t = this.tags.join(',');
          t = t.replace(/\*?(\/|\+|\&|\#|\.|\s\&\s)/g, " ");
          return this.media = 'http://flickholdr.com/280/210/' + t;
        case 2:
          return this.media = '';
      }
    };
    RandomIdea.prototype.getDesc = function() {
      return this.desc = 'Lorem ipsum dolor sit amet consecteteur adipiscing elit';
    };
    RandomIdea.prototype.getCommentsNum = function() {
      return this.commentsNum = randVal(0, 99);
    };
    RandomIdea.prototype.getLikes = function() {
      return this.likes = randVal(0, 99);
    };
    RandomIdea.prototype.getContentType = function() {
      if (this.media !== '') {
        return this.contentType = 'image';
      } else {
        return this.contentType = 'text';
      }
    };
    return RandomIdea;
  })();
  $(function() {
    $.mockjax({
      url: '/ideas/get',
      response: function(settings) {
        var arr, e, i, j, k, obj, params, r, v, _ref;
        params = {};
        obj = function(e) {
          return {
            'id': e.id,
            'title': e.title,
            'tags': e.tags,
            'user': e.user,
            'commentsNum': e.commentsNum,
            'likes': e.likes,
            'media': e.media,
            'desc': e.desc,
            'contentType': e.contentType
          };
        };
        if (settings.data !== void 0) {
          _ref = settings.data;
          for (i in _ref) {
            e = _ref[i];
            params[i] = e;
          }
        }
        if (params.num !== void 0) {
          i = 0;
          arr = [];
          while (i < params.num) {
            r = new RandomIdea;
            e = r.init();
            j = obj(e);
            for (k in params) {
              v = params[k];
              if (j[k] !== void 0) {
                j[k] = v;
              }
            }
            arr.push(j);
            i++;
          }
          return this.responseText = arr;
        } else {
          r = new RandomIdea;
          e = r.init();
          return this.responseText = obj(e);
        }
      }
    });
    $.mockjax({
      url: '/ideas/add-like',
      response: function(settings) {
        return this.responseText = 'success';
      }
    });
    $.mockjax({
      url: '/ideas/get-comments',
      response: function(settings) {
        return this.responseText = 'woohoo!';
      }
    });
    $.mockjax({
      url: '/ideas/create',
      response: function(settings) {
        var appendVal, d, tagsStr;
        idCounter++;
        d = settings.data;
        tagsStr = settings.data.tags;
        appendVal = function() {
          d.id = idCounter++;
          d.isNew = true;
          d.tags = function() {
            var t, tag, _i, _len;
            tagsArr = [];
            if (tagsStr.indexOf(" ") > 0) {
              t = tagsStr.split(" ");
              for (_i = 0, _len = t.length; _i < _len; _i++) {
                tag = t[_i];
                if (tag !== "") {
                  tagsArr.push(tag);
                }
              }
            } else {
              tagsArr.push(tagsStr);
            }
            return tagsArr;
          };
          if (d.media !== '') {
            return d.contentType = 'image';
          } else {
            return d.contentType = 'text';
          }
        };
        $.extend(d, appendVal());
        return this.responseText = d;
      }
    });
    return $.mockjax({
      url: '/tags/get',
      response: function() {
        var tag, tagsID, tagsObj, _i, _len;
        tagsID = 1;
        tagsObj = [];
        for (_i = 0, _len = tagsArr.length; _i < _len; _i++) {
          tag = tagsArr[_i];
          tagsObj.push({
            id: tagsID,
            name: tag
          });
          tagsID++;
        }
        return this.responseText = tagsObj;
      }
    });
  });
}).call(this);
