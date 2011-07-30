(function() {
  $(function() {
    $('#footer_network .info').css({
      'opacity': 0
    });
    return $('#footer_network nav>ul>li').hover((function() {
      return $(this).find('.info').stop(true, true).animate({
        'top': '-253px',
        'opacity': 1
      }, 500);
    }), (function() {
      return $(this).find('.info').animate({
        'top': '100px',
        'opacity': 0
      }, 500);
    }));
  });
}).call(this);
