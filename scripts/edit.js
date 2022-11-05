var pixels = new Array();
var instrument = "hand";
var editInstrument = "reformer";
var state = 1;
var deleteState = 0;
function updateSizes() {
  pixels = [];
  for(let x = 0; x < fieldSizes[0]; x++) {
    pixels[x] = new Array();
    for(let y = 0; y < fieldSizes[1]; y++){
      pixels[x][y] = 0;
    }
  }
}
function setInstrument(name) {
  instrument = name;
  editRender();
}
function setEditInstrument(name) {
  editInstrument = name;
  editRender();
}
function cellToState(x,y,state) {
  pixels[x][y] = state;
  editRender();
} 
