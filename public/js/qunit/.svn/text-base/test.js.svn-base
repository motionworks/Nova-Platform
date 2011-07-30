module('Randomizers');
test("Random number generator", function() {
  ok(randVal(1, 5), "random number generated");
  return ok(randVal(1, 5, 3), "random number with fixed decimal generated");
});
test("Random idea generator defaults works", function() {
  var result;
  result = new RandomIdea();
  result.init();
  console.log('result = ' + result);
  ok(result.title, 'Title okay');
  ok(result.tags, 'Tags okay');
  ok(result.comments, 'Comments okay');
  ok(result.likes, 'Likes okay');
  ok(result.user, 'User okay');
  return ok(result.content, 'content okay');
});
module('Mockjax');
asyncTest("ideas/get", function() {
  return $.get('/ideas/get', function(data) {
    console.log('data = ' + data);
    ok(data, "We have data!");
    return start();
  });
});
module('Backbone: Model');