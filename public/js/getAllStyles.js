function css(el) {
  var sheets = document.styleSheets,
    ret = [];
  el.matches =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector ||
    el.oMatchesSelector;
  for (var i in sheets) {
    var rules = sheets[i].rules || sheets[i].cssRules;
    for (var r in rules) {
      if (el.matches(rules[r].selectorText)) {
        ret.push(rules[r].cssText);
      }
    }
  }
  return ret;
}
var k = css(document.getElementById('btn'));
k.forEach((i) => {
  console.log(i);
});
