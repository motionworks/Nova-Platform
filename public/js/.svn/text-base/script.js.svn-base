(function() {
  var threads;
  threads = function() {
    var parent;
    parent = $('body').attr('id');
    $('.spot_wrap').each(function() {
      var item, url;
      item = $(this).find('a').attr('rel');
      url = "/feedback/" + parent + "/" + item + ".html";
      return $(this).find('a').attr({
        'href': url,
        'target': '_blank'
      });
    });
    return $('.spot').find('a').nyroModal();
  };
  $(function() {
    threads();
    return $('.contributors a').attr('target', '_blank');
  });
}).call(this);
