# Compile tags
tagsArr = []
compileTags = ->
  $.ajax(
    url: 'js/tagslist.txt'
    dataType: 'text'
    success: (data)->
      tagsArr = data.split "\n"
      tagsArr.sort()
  )
compileTags()


# Random value function
randomWords = ["Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit", "Duis", "massa", "eros,", "adipiscing", "at", "sagittis", "vitae,", "commodo", "non", "orci", "Aliquam", "mauris", "turpis,", "ornare", "eget", "sagittis", "vitae,", "condimentum", "et", "lacus", "Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit", "Maecenas", "ipsum", "dui,", "luctus", "in", "sollicitudin", "ultrices,", "commodo", "a", "erat", "Maecenas", "eleifend", "mi", "at", "dui", "semper", "rhoncus", "Curabitur", "quis", "odio", "felis,", "scelerisque", "lacinia", "diam", "Nam", "felis", "nulla,", "porttitor", "a", "adipiscing", "at,", "mattis", "ut", "lorem", "Pellentesque", "vehicula,", "nisi", "a", "pulvinar", "accumsan,", "mauris", "orci", "accumsan", "velit,", "non", "auctor", "eros", "urna", "vitae", "quam", "Nullam", "non", "mi", "non", "nisl", "semper", "venenatis", "a", "vel", "nisi", "Vivamus", "ac", "consectetur", "diam"]
users = ['Farid Hanif', 'Mohd Afiq', 'Lyana Omar Hakim', 'Grey Ang', 'Winnie Gan', 'Akmal Fikri', 'Aaron Gill']
idCounter = 0

# Idea randomizer
class RandomIdea
  init : ->
    o = @defaults
    idCounter++
    @id = idCounter
    @getTags()
    @getUser()
    @getMedia()
    @getDesc()
    @getTitle()    
    @getCommentsNum()
    @getLikes()
    @getContentType()
    
    # Build json
    @build()
    
  build : ->
    t = @
    json =
      'id' : t.id
      'title' : t.title
      'tags' : t.tags
      'user' : t.user
      'commentsNum' : t.commentsNum
      'likes' : t.likes
      'media' : t.media
      'desc' : t.desc
      'contentType' : t.contentType
    json
  
  getTitle: -> 
    maxRange = randomWords.length - 1
    i = 0
    title = ''
    if @media is '' then maxNum = 10
    else maxNum = 5
    
    while i < maxNum
      chosen = randomWords[randVal(0,maxRange)]
      title += chosen + ' '
      i++
    title = title.charAt(0).toUpperCase() + title.slice(1)
    @title = title
  getTags: -> 
    maxRange = randomWords.length - 1
    i = 0
    tags = []
    while i < randVal(1,5)
      chosen = tagsArr[randVal(0,maxRange)]
      tags.push chosen
      i++
    @tags = tags
  getUser: -> 
    @user = users[randVal(0, users.length)]
  getMedia: -> 
    roulette = randVal(1,2)
    switch roulette
      when 1
        t = @tags.join(',')
        t = t.replace /\*?(\/|\+|\&|\#|\.|\s\&\s)/g, " "        
        @media = 'http://flickholdr.com/280/210/' + t
      when 2
        @media = ''
  getDesc: ->
    @desc = 'Lorem ipsum dolor sit amet consecteteur adipiscing elit'
  getCommentsNum: ->
    @commentsNum = randVal(0,99)
  getLikes: ->
    @likes = randVal(0,99)
  getContentType: ->
    if @media isnt '' 
      @contentType = 'image'
    else 
      @contentType = 'text'

$ ->
  # Mock Ajax
  # Get ideas
  $.mockjax(
    url: '/ideas/get',
    response: (settings) ->
      params = {}
      obj = (e) ->
        return {
          'id' : e.id
          'title' : e.title
          'tags' : e.tags
          'user' : e.user
          'commentsNum' : e.commentsNum
          'likes' : e.likes
          'media' : e.media
          'desc' : e.desc
          'contentType' : e.contentType
        } 
      
      if settings.data isnt undefined
        for i,e of settings.data
          params[i] = e
      if params.num isnt undefined
        i = 0
        arr = []
        while i < params.num
          r = new RandomIdea
          e = r.init()
          j = obj(e)
          for k,v of params
            if j[k] isnt undefined
              j[k] = v
          arr.push(j)
          i++
        @responseText = arr
      else    
        r = new RandomIdea
        e = r.init()
        @responseText = obj(e)
  }
  
  # Add like
  $.mockjax(
    url: '/ideas/add-like'
    response: (settings)->
      @responseText = 'success'
  )
  
  # Get comments
  $.mockjax(
    url: '/ideas/get-comments'
    response: (settings)->
      @responseText = 'woohoo!'
  )
  
  # Create new
  $.mockjax(
    url: '/ideas/create'
    response: (settings)->
      idCounter++
      d = settings.data
      tagsStr = settings.data.tags
      appendVal = ->
        d.id = idCounter++
        d.isNew = true
        d.tags = ->
           tagsArr = []
           if (tagsStr.indexOf(" ") > 0)
             t = tagsStr.split(" ")
             for tag in t
               if tag isnt ""
                 tagsArr.push(tag)
           else 
               tagsArr.push(tagsStr)
           return tagsArr
        if d.media isnt '' 
          d.contentType = 'image'
        else 
          d.contentType = 'text'
       
      $.extend(d,appendVal())
      @responseText = d
  )
  
  $.mockjax(
    url: '/tags/get'
    response: ->
      tagsID = 1
      tagsObj = []
      
      for tag in tagsArr
        tagsObj.push(
          id: tagsID
          name: tag
        )
        tagsID++
        
      @responseText = tagsObj
  )