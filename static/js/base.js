var screenUpdate;

// function req(arg, act) {
//     var xhttp = new XMLHttpRequest();
//     if (act) {
//         xhttp.onreadystatechange = function() {
//               if (this.readyState == 4 && this.status == 200) {
//                   var state = JSON.parse(this.responseText);
//                   console.log("StateX")
//                   console.log(state.x)
//                   document.getElementById("demo").innerHTML = String([state.x, state.y])
//                   var robotRect = document.getElementById("robot") //kd this doesn't work i'm p sure
//                   var obj = document.getElementById("obj") //kd
//                   console.log("SVG")
//                   console.log(robotRect)
//                   console.log("SVG2")
//                   console.log(obj)
//                   robotRect.setAttributeNS(null, "x", state.x) //robot coordinates get updated, robot moves?
//                   robotRect.setAttributeNS(null, "y", state.y)
//                   obj.setAttributeNS(null, "x", state.x) //kd
//                   obj.setAttributeNS(null, "y", state.y+40) //kd
//                   var rotateStr = "rotate(" + state.theta + " " + (state.x + 15) + " " + (state.y + 20) + ")"
//                   console.log(rotateStr)
//                   robotRect.setAttribute("transform", rotateStr)
//                   obj.setAttribute("transform", rotateStr) //kd
//                 console.log("Adjusted")
//               }
//         };
//     }
//     xhttp.open("GET", arg, true);
//     xhttp.send();
// }

function req(arg, act) {
    var xhttp = new XMLHttpRequest();
    if (act) {
        xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  var state = JSON.parse(this.responseText);
                  var picked_up = false;
                  console.log("StateX")
                  console.log(state.x)
                  document.getElementById("demo").innerHTML = String([state.x, state.y])
                  var robotRect = document.getElementById("robot") //kd this doesn't work i'm p sure
                  var obj = document.getElementById("obj") //kd
                  console.log("SVG")
                  console.log(robotRect)
                  console.log("SVG2")
                  console.log(obj)
                  robotRect.setAttributeNS(null, "x", state.x) //robot coordinates get updated, robot moves?
                  robotRect.setAttributeNS(null, "y", state.y)

                  var obj_x = document.getElementById("obj").getAttribute("x"); //make sure it's grabbing the right svg
                  var obj_y = document.getElementById("obj").getAttribute("y");
                  //console.log("object's x");
                  //console.log(obj_x);


                  var detectOverlap = (function () {
                    function getPositions(elem) {
                        var pos = elem.getBoundingClientRect();
                        return [[pos.left, pos.right], [pos.top, pos.bottom]];
                    }

                    function comparePositions(p1, p2) {
                        var r1, r2;
                        if (p1[0] < p2[0]) {
                          r1 = p1;
                          r2 = p2;
                        } else {
                          r1 = p2;
                          r2 = p1;
                        }
                        return r1[1] > r2[0] || r1[0] === r2[0];
                    }

                    return function (a, b) {
                        var pos1 = getPositions(a),
                            pos2 = getPositions(b);
                        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
                    };
                  })();
                  picked_up = detectOverlap(robotRect, obj)



                  if (picked_up) {
                    obj.setAttributeNS(null, "x", state.x) //kd
                    obj.setAttributeNS(null, "y", state.y+40) //kd
                  }
                  var rotateStr = "rotate(" + state.theta + " " + (state.x + 15) + " " + (state.y + 20) + ")"
                  console.log(rotateStr)
                  robotRect.setAttribute("transform", rotateStr)
                  if (picked_up) {
                    obj.setAttribute("transform", rotateStr) //kd
                  }
                console.log("Adjusted")
              }
        };
    }
    xhttp.open("GET", arg, true);
    xhttp.send();
}

function update() {
    req("/state", true)
}

function stop() {
    req("/stop", false);
    clearInterval(screenUpdate);
}

function start() {
    req("/start", false)
    screenUpdate = setInterval(update, 50);
}
