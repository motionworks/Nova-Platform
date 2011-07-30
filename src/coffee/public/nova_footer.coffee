$ ->
  $('#footer_network .info').css {'opacity': 0}
  $('#footer_network nav>ul>li').hover (->
    $(@).find('.info').stop(true,true).animate {'top': '-253px', 'opacity': 1}, 500
  ), (->
    $(@).find('.info').animate {'top': '100px', 'opacity': 0}, 500 
  )