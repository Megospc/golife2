var action = "edit";
var images = new Array();
var images = [new Array(), new Array(), new Array()];
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
function setCanvasSize(w,h,x,y) {
  canvas.style.width=`${w}px`;
  canvas.style.height=`${h}px`;
  canvasWidth=w;
  canvasHeight=h;
  canvas.style.left=`${x}px`;
  canvas.style.top=`${y}px`;
  canvasTop = y;
  canvasLeft = x;
}


