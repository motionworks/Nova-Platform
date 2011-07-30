tags = {}
  
class tags.Model extends Backbone.Model

class tags.List extends Backbone.Collection
  url : '/tags/get'
  model : tags.Model
  dictionary: []
  initialize: ->
    c = @
    
    $.get '/tags/get', (data) ->
      c.add(data)
      c.makeDictionary()
  
  makeDictionary: ->
    for tag in @models
      tagName = tag.get('name')
      @dictionary.push(tagName)
    @view = new tags.ListView()
      
class tags.ListView extends Backbone.View
  initialize: ->
    @ideaListView = ideas.ideaListingView
    @addRecommendedTags()
    @bindRefresh()
  addRecommendedTags: ->
    articles = @ideaListView.collection.models
    recommendedTags = []
    
    for article in articles[3...7]
      for tag in article.get('tags')
        recommendedTags.push(tag)
        
    for tag in recommendedTags[3...7]
      $('#tag-recommended').append('<li><a href="#">'+tag+'</a></li>')
      $('#tag-selected').prepend('<li class="active"><a href="#">'+tag+' <span href="#" class="delete">(x)</span></a></li>')
      
  updateRecommendedTags: (tagsEl)->
    tagsArr = []
    $(tagsEl).find('li').each ->
      tagsArr.push($.trim($(@).text()))
    
    elemsLength = $('#tag-recommended li').length-1
    i = 0
    
    while i < elemsLength
      $('#tag-recommended li').eq(i).find('a').text(tagsArr[i])
      i++
      
    $('#tag-recommended').effect 'highlight', 1000
    
  updateSelected: (tagVal)->
    $('#tag-selected').prepend('<li class="active"><a href="#">'+tagVal+' <span href="#" class="delete">(x)</span></a></li>')
    
  bindRefresh: ->
    $('#tag-selected li').live 'click', -> $(@).toggleClass('active')
    $('#tag-selected .delete').live 'click', -> $(@).parent().remove()
    
    $('#tag-refresh').live 'click', (e)->
      tags = []
      $('#tag-selected li.active a').each ->
        t = $.trim($(@).text())
        t = t.replace /\*?(\s\(x\))/g, ""
        tags.push(t)
      
      if tags.length > 0
        $('#ideas-container article').each ->
          $(@).removeClass('tagMatch')
          for tag in tags
            if $(@).attr('data-tag').indexOf(tag) > 0
              $(@).addClass('tagMatch')
      
        $('#ideas-container').isotope(
          filter: '.tagMatch'
        )
        
      else
        $('#ideas-container').isotope(
          filter: '*'
        )
      
      articleShowNum = $('#ideas-container .tagMatch').length
      
      if articleShowNum < ideas.options.ideasNum
        diff = ideas.options.ideasNum - articleShowNum
        ideas.ideaListingView.collection.update({num: diff, tags: tags[0...3]})
      
      e.preventDefault()
      
      
$('.tags:not(#tag-selected)').find('a').live 'click', (e)->
  ideas.tagsList.view.updateSelected($.trim($(@).text()))
  e.preventDefault()
