var oneStep;
var viewModeTurn;
var nearAlive;
var doCalc;
var frame = new Array();
var near = new Array();
var start;
var fps;
var generation;
var cells;

function calculate2Near(calc) {
  near = [];
  for (let x = 0; x < fieldSizes[0]; x++) {
    near[x] = new Uint8Array(fieldSizes[1]);
  }
  for (let x = 0; x < fieldSizes[0]; x++) {
    for (let y = 0; y < fieldSizes[1]; y++ ) {
      nearAlive = 0;
      if (calc[0] == 0) {isAlive(x-1,y-1);}
      if (calc[1] == 0) {isAlive(x,y-1);} 
      if (calc[2] == 0) {isAlive(x+1,y-1);}
      if (calc[3] == 0) {isAlive(x-1,y);}
      if (calc[5] == 0) {isAlive(x+1,y);}
      if (calc[6] == 0) {isAlive(x-1,y+1);}
      if (calc[7] == 0) {isAlive(x,y+1);}
      if (calc[8] == 0) {isAlive(x+1,y+1);}
      near[x][y] = nearAlive;
    }
  } 
}
function isAlive(x,y) {
  if (x >= 0 && x < fieldSizes[0] && y >= 0 && y < fieldSizes[1]) {
    if (frame[x][y][0] == 1) {
      nearAlive++;
    }
  } 
}
function oneStep() {
  doCalc();
  editRender();
}
function manySteps(steps) {
  for (let i = 0; i < steps; i++) {
    doCalc();
  } 
  editRender();
}
function previosFrame() {
  if (generation > 0) {
    let needing = generation-1;
    viewModeTurn();
    manySteps(needing);
  } 
}
function run() {
  running = true;
  doRun();
  editRender();
}
function stopRun() {
  running = false;
  editRender();
}
function doRun() {
  if (running) {
    oneStep();
    setTimeout(() => { doRun(); }, 0);
  } 
}
eval(`
  viewModeTurn = function() {
    stopRun();
    cells = 0;
    generation = 0;
    for (let x = 0; x < fieldSizes[0]; x++) {
      frame[x] = new Array();
    }
    for (let x = 0; x < fieldSizes[0]; x++) {
      for (let y = 0; y < fieldSizes[1]; y++ ) {
        frame[x][y] = new Uint8Array([pixels[x][y], 0]);
        if (pixels[x][y] == 1) {
          cells++;
        }
      } 
    }
  }
  doCalc = function() {
    start = performance.now();
    calculate2Near("0000#0000");
    for (let x = 0; x < fieldSizes[0]; x++) {
      for (let y = 0; y < fieldSizes[1]; y++ ) {
        if (frame[x][y][0] == 1) {
          if (near[x][y] == 2 || near[x][y] == 3) {
            if (frame[x][y][1] < 255) {
              frame[x][y][1]++;
            }
          }
          else {
           frame[x][y][0] = 0;
           frame[x][y][1] = 0;
           cells--;
         }
       }
       else {
         if (near[x][y] == 3) {
           frame[x][y][0] = 1;
           frame[x][y][1] = 0;
           cells++;
         }
       }
     }
   }
   generation++;
   start = performance.now() - start; 
}`);
viewModeTurn();
//oneStep();
