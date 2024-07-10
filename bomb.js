var TIME = 30;
var CURRENT_TIME;
var DEFUSED = false;
var EXPLODED = false;

var WIRES = [];

document.addEventListener("DOMContentLoaded", function() {
  // attach a click handler to each wire so they can be cut.
  var wires = document.querySelectorAll(".wires img");
  wires.forEach(function(wire) {
    wire.addEventListener("click", cutWire);
  });

  var button = document.getElementById("reset");
  button.addEventListener("click", reset);

  reset();
});

function cutWire(e) {
  if (EXPLODED) {
    return;
  }

  var wire = e.target;

  if (wire.src.includes("uncut")) {
    play("electricity");
    wire.src = wire.src.replace("uncut", "cut");

    if (!WIRES.includes(wire)) {
      setTimeout(explode, 750);
    } else {
      CUT_WIRES++;

      if (CUT_WIRES === WIRES.length) {
        defuse();
      }
    }
  }
}

function getDisplayTime() {
  if (CURRENT_TIME < 0) {
    display = "0:00:00.000";
  } else {
    var display = "0:00:";

    if (CURRENT_TIME < 10) {
      display += "0";
    }

    display += CURRENT_TIME;

    // get three digits out of a random number.
    var milliseconds = ("" + Math.random()).substring(1, 5);
    display += milliseconds
  }

  return display;
}

function tick() {
  if (DEFUSED || EXPLODED) {
    return;
  }

  if (CURRENT_TIME < 0) {
    explode();
  }

  var timer = document.getElementById("timer");
  timer.textContent = getDisplayTime();
}

function defuse() {
  DEFUSED = true;

  var timer = document.getElementById("timer");
  timer.classList.add("defused");

  stop("siren");
  play("cheer");

  var sound = document.getElementById("cheer");
  sound.addEventListener("ended", function() {
    play("success");
  });

  var button = document.getElementById("reset");
  button.disabled = false;
}

function explode() {
  if (DEFUSED || EXPLODED) {
    return;
  }

  EXPLODED = true;

  document.body.classList.remove("unexploded"); 
  document.body.classList.add("exploded"); 

  var button = document.getElementById("reset");
  button.disabled = false;

  stop("siren");
  play("explode");
}

function reset() {
  EXPLODED = false;
  DEFUSED = false;

  document.body.classList.remove("exploded");
  document.body.classList.add("unexploded");

  var button = document.getElementById("reset");
  button.disabled = true;

  var wires = document.querySelectorAll(".wires img");
  wires.forEach(function(wire) {
    if (!wire.src.includes("uncut")) {
      wire.src = wire.src.replace("cut", "uncut");
    }
  });
 
  CURRENT_TIME = TIME;

  stop("success");
  play("siren");

  // start the bomb timer!
  var ticker = setInterval(tick, 0);
  var ticker = setInterval(function() {
    CURRENT_TIME--;
  }, 1000);

  chooseWires();
}

function chooseWires() {
  // reset list and count of cut wires.
  WIRES = [];
  CUT_WIRES = 0;

  var timer = document.getElementById("timer");
  timer.classList.remove("defused");

  var wires = document.querySelectorAll(".wires img");
  wires.forEach(function(wire) {
    if (Math.random() < .5) {
      WIRES.push(wire);
    }
  });
}

function play(id) {
  document.getElementById(id).play();
}

function stop(id) {
  var audio = document.getElementById(id);
  audio.pause();
  audio.currentTime = 0;
}
