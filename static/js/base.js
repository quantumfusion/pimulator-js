var running = false;
var savedCode = null
var worker = new Worker("static/js/robot.js");
worker.postMessage({start:false})
worker.onmessage = function(e) {
    running = e.data.robot.isRunning
    update(e.data.robot)
}
function down(e){
    worker.postMessage({keypress: true, keyCode: e.keyCode, up: false});
}
function up(e){
    worker.postMessage({keypress: true, keyCode: e.keyCode, up: true});
}
document.addEventListener('keydown', down);
document.addEventListener('keyup', up);
var simulator = new Simulator();

function uploadCode() {
    if (typeof pyodide != "undefined" && typeof pyodide.version != "undefined") {
        code = cm.getValue();
        savedCode = code;
        worker.postMessage({code:code, start:false})
        // alert("Code uploaded");
    }
    else {
        alert("Simulator has not finished loading. Try again in a moment.")
    }
};

function update(state) {
    /*
    Update the state (position and direction) of the robot.
    Example of state: {x:72, y:72, dir:0}
    */
    // console.log("StateX")
    // console.log(state.x)
    document.getElementById("demo").innerHTML = state.X.toFixed(2) + ", " + state.Y.toFixed(2)
    var robotRect = document.querySelector("rect")
    // console.log("SVG")
    // console.log(robotRect)
    robotRect.setAttributeNS(null, "x", state.X)
    robotRect.setAttributeNS(null, "y", state.Y)
    var rotateStr = "rotate(" + state.dir + " " + (state.X + 15*scaleFactor) + " " + (state.Y + 20*scaleFactor) + ")"
    // console.log(rotateStr)
    robotRect.setAttribute("transform", rotateStr)
    // console.log("Adjusted")
};

function start(auto=0) {
    /*
    Start the robot thread
    Return if started robot thread
    */
    if (running) {
        return;
    }
    else {
        if (auto === 0) {
            worker.postMessage({start:true, mode:"teleop"})
        }
        else if (auto === 1) {
            worker.postMessage({start:true, mode:"auto"})
        }
        // We utilize a daemon thread to such that the thread exits even if we
        // do not exit gracefully from __main__
        // robotWorker = new Worker("{{ url_for('static', filename='js/pimulator.js') }}");
        // robotWorker = threading.Thread(group=None, target=pimulator.main, args=(stateQueue,auto,stop),
        //                                name="robot thread", daemon=True)
        console.log("robot started");
    }
};

function stop() {
    /*
    Stop the robot thread
    */
    update({X:144,Y:144,dir:0})
    worker.terminate()
    worker = new Worker("/static/js/robot.js")
    worker.postMessage({start:false})
    worker.postMessage({code:savedCode, start:false})
    worker.onmessage = function(e) {
        running = e.data.robot.isRunning
        update(e.data.robot)
    }
    running = false
};
