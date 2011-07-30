module 'Randomizers'
test "Random number generator", ->
  ok randVal(1,5), "random number generated"
  ok randVal(1,5,3), "random number with fixed decimal generated"

test "Random idea generator defaults works", ->
  result = new RandomIdea()
  result.init()
  console.log('result = ' + result)
  ok result.title, 'Title okay'
  ok result.tags, 'Tags okay'
  ok result.comments, 'Comments okay'
  ok result.likes, 'Likes okay'
  ok result.user, 'User okay'
  ok result.content, 'content okay'

  
module 'Mockjax'
asyncTest "ideas/get", ->
  $.get '/ideas/get', (data) ->
    console.log('data = ' + data)
    ok data, "We have data!" 
    start()
    
module 'Backbone: Model'
