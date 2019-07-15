export default `
function mistakes() {
    const test = require();
    const value = Math.hypot(dx, dx);
    const API_URL = 2;
    const opts = {'noCache': 0};
    function x() {
      const x = 1;
    }
  
    class t {
      CONSTRUCTOR(user) { console.log(user) }
    }
  }

function infiniteLoop() {
    for(;;){}
}
function badCompare() {
    /abc/ != /efg/ ||
    /a/ !== /e/ ||
    /abc/i != /efg/
}
function slow() {
    const duplicate = function() {}
    [2, 3, 4].map(duplicate).flat()

    Array(10000000000)

    JSON.stringify({});
}
function codeDuplicate() {
    return [a, a, a];
}

function canUseConstante() {
    return 3.141592653589793 + Math.exp(1) + 2.220446049250313e-16
}

function noAutofix() {
    function myFunction (aaaaaa, aaaaaab) {}
    return document.evaluate("//book/title | //book/title", document)
}

function avoidConflict() {
    var closed
    class MSTest {}
}
`.trim()
