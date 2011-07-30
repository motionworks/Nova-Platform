Backbone.View::renderTemplate = (data)->
  if not @templateItem?
    t = $.tmpl(@template, @model.toJSON())
    $(t).appendTo(@el)
    @templateItem = $.tmplItem(t)
  else 
    t = @
    $.extend(@templateItem.data, data)
    $(@el).empty()
    $.tmpl(@template, @templateItem.data).appendTo(@el)

Backbone.View::showMessage = (msg) ->
  if $('#msg').length < 1
    $('#content').prepend('<p id="msg"><span>'+msg+'</span><a href="#" id="msg_close">(X)</a></p>')
    $('#msg_close, #msg').live 'click', ->
      $('#msg').remove()
  else 
    $('#msg span').text(msg)
  timer = setTimeout (->$('#msg').slideUp(300, ->$('#msg').remove())), 7000
     

# Ideas page function
ideas =
  options:  
    ideasNum: 10
          
class ideas.Model extends Backbone.Model
  defaults: 
    'commentsNum' : 0
  initialize: ->
    @view = new ideas.SingleView({model: @})
    @view.render()
    
  addLike: ->
    id = @get('id')
    console.log(id)
    t = @
    $.ajax {
      url: '/idea/like/' + id
      type: 'PUT'
      success: (data) ->
        console.log(data)
        l = t.get('like') + 1
        t.set({'like': l})
        $(t.view.el).find('.likes-count').addClass('active') 
    }
        
        
  change: ->
    if @.hasChanged()
      @view.update(@changedAttributes())
    
class ideas.List extends Backbone.Collection
  model: ideas.Model
  initialize: ->
    @update()
  update: (opt)->
    t = @
    attr = {}
    if opt is undefined
      attr = 
        num: ideas.options.ideasNum
    else attr = opt
    
    $('#get-more-ideas').addClass('loading')
    $.getJSON '/idea/list', (data) ->
      data
    .then (data)->
      c = 0
      idea = data.idea
      num = idea.length
      for i in idea
        m = new ideas.Model(i)
        t.add(m)
        c++
        if c is num 
          ideas.list.render(t)
        $('#get-more-ideas').removeClass('loading')
    return @
                  
class ideas.SingleView extends Backbone.View
  tagName: 'article'
  events: 
    'click .likes-count': 'addLike'
    'click .comments-count': 'goDetails'
    'click .more': 'goDetails'
    'click' : 'toggleDetails'
    
  initialize: ->
    @template = $('#ideaTmpl').template()
    
  render: ->
    id = 'idea_' + @model.get('id')
    t = @
    $(@el).attr('id', id)
    $(@el).addClass(@model.get('contentType') + ' tagMatch')
    tags = @model.get('tags')
    if $.isArray(tags)
      tagsStr = tags.join(',')
    else tagsStr = tags
     
    $(@el).attr('data-tag', tagsStr)
    
    @renderTemplate()
    $('#ideas-container').isotope 'insert', $(@el)
    
    if @model.get('isNew')
      $(@el).effect('highlight', 2000)
      @showMessage('Congratulations! Your idea is successfully shared!')
      
    @checkImgLoaded()
    return @
    
  update: (attr)->
    @renderTemplate(attr)
    $(@el).effect('highlight', 1000)
    return @
    
  checkImgLoaded: ->
    el = @el
    if ($(el).find('img').length > 0)
      $(el).addClass('loading')
      $(el).find('img').load ->
        $(el).closest('article').removeClass('loading')  
 
  addLike: (e)->
    if @.$('.likes-count').hasClass('active') is false
      @model.addLike()
      @showMessage('Awesome, you liked this idea!')
      # ideas.tagsList.view.updateRecommendedTags($(@el).find('.tags'))
    e.preventDefault()
          
  goDetails: (e)->
    window.location.href = @.$('.more').attr('href')
    
  toggleDetails: (e) ->
    $(@el).toggleClass('detail')
    $('#ideas-container').isotope 'reLayout'
    

class ideas.ListView extends Backbone.View          
  initialize: -> 
    @collection = new ideas.List()
    
    @bindElems()
          
  bindElems: ->
    t = @
    $('#ideas-container').isotope({
      layoutMode: 'masonry'
      containerClass: 'isotope'
      masonry:
        columnWidth: 40
      getSortData: 
        id : ($elem)->
          return parseInt($elem.attr('id').substr(5))
      sortBy: 'id'
      sortAscending: false
      animationEngine: 'jquery'
    })
    
    $('#get-more-ideas').click (e)-> 
      t.collection.update()
      e.preventDefault()
     
    $('#submit-idea').click ->
      new ideas.FormView()
              
class ideas.FormView extends Backbone.View
  id : 'idea-form'
    
  initialize: ->
    @template = $('#ideaFormTmpl').template()
    $.tmpl(@template).appendTo(@el)
    @render()
    
  render: ->
    t = @
    $.nmData(@el, {
      # callbacks: 
        # beforeShowCont: -> t.bindTags()
        # afterReposition: -> t.setSuggestPos()
    })
    @.$('#submit').bind 'click', (e)->
      t.submitForm()
      e.preventDefault()
  
  setSuggestPos : ->
    pos = @.$('#form_tags').offset()
    @.$('#form_tags-suggest').css(
      position: 'fixed'
      top: pos.top + 30
      left: pos.left + 150
    )

  bindTags : ->
    dict = ideas.tagsList.dictionary
    f = @
    
    f.$('#form_tags').bind 'keypress change', ->
      val = $(@).val()
      list = ''
      if val.length >= 3
        found = $.grep dict, (n, i) ->
          word = n.toLowerCase()
          if (word.indexOf(val) != -1)
            return n
        suggest = found[0...5]
        for word in suggest
          list += '<li>'+word+'</li>'
        
        f.$('#form_tags-suggest ul').html(list).show()
        
      else
        f.$('#form_tags-suggest ul').empty().hide()
        
    @.$('#form_tags-suggest ul li').live 'click', ->
      val = $(@).text()
      f.$('#form_tags').val('')
      f.$('#form_tags-suggest ul').empty().hide()
      f.$('#form_tags-added').append('<li><a href="#">'+val+'</a></li>')
      
      $.nmTop().resize(true)
      f.setSuggestPos()
    
    
  submitForm : ->
    el = @el
    submitUrl = $(el).find('form').attr('action')
    title = $(el).find('#form_title')
    desc = $(el).find('#form_desc')
    url = $(el).find('#form_url')
    username = $(el).find('#form_name')
    email = $(el).find('#form_email')
    tags = $(el).find('#form_tags')
    
    arr = [title, desc, tags, username, email]
    json = {}
    
    validate = ->
      for field in arr
        $(el).find('.msg').remove()
        field.removeClass('error')
        if field.val() is ''
          field.addClass('error')
      if $('.error').length > 0
        if ($(el).find('.msg').length < 1)
          $(el).find('ul:first').before('<p class="msg">Oops, seems like you missed out some fields!</p>')
        $.nmTop().resize(true)
        return false
      else
        return true
        
    urlVal = url.val()
        
    if /(png|jpg|bmp|gif)/.test(urlVal) is true then contentType = 'image'
    else if /(youtube.com)/.test(urlVal) is true 
      contentType = 'video'
      urlVal = urlVal.match(/http\:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})/)[1]
    else if urlVal isnt '' then contentType = 'url'
    else contentType = 'text'
    
    json =
      'title' : title.val()
      'desc' : desc.val()
      'url' : urlVal
      'username' : username.val()
      'email' : email.val()
      'tags' : tags.val()
      'like' : 0
      'contentType' : contentType
    
    if validate() is true
      $.post submitUrl, json, (data)->
        $.nmTop().close();
        new ideas.Model(data)
        
        
class ideas.Controller extends Backbone.Controller
  initialize: ->
    ideas.list = new ideas.ListView()
    window.location.href = "#"
  
$ -> 
  ideas.session = new ideas.Controller()
  
  