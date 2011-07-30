threads = ->
  parent = $('body').attr('id')
  
  $('.spot_wrap').each ->
    item = $(@).find('a').attr('rel')
    url = "/feedback/#{parent}/#{item}.html"
    $(@).find('a').attr(
      'href' : url
      'target' : '_blank'
    )
  $('.spot').find('a').nyroModal()
  
$ ->
  threads()
  $('.contributors a').attr('target', '_blank')
  
