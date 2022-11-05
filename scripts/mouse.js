var clicked = false;
var clickType;
var startXcamera;
var startYcamera;
var startXmouse;
var startYmouse;
var mouseX;
var mouseY;
const devices = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini', "i");
const mobile = devices.test(navigator.userAgent);
if (mobile) {
  document.addEventListener('touchstart',touchstart);
  document.addEventListener('touchend',touchend);
  document.addEventListener('touchmove',touchmove);
} 
else {
  document.addEventListener('mousedown',touchstart);
  document.addEventListener('mouseup',touchend);
  document.addEventListener('mousemove',touchmove);
}

function touchstart(e) {
  let x = getMouseX(0,e);
  let y = getMouseY(0,e); 
  if(touchzone(x,y)) {
    if (instrument == "hand" && action == "edit") {
     clicked = true;
     startXmouse = x;
     startYmouse = y;
     startXcamera = x_camera;
     startYcamera = y_camera;
     clickType = "hand";
    }
    if (action == "view") {
     clicked = true;
     startXmouse = x;
     startYmouse = y;
     startXcamera = x_camera;
     startYcamera = y_camera;
     clickType = "hand";
    }
    if (instrument == "edit" && action == "edit") {
      let x = Math.floor((getMouseX(0,e)/zoom+x_camera)/20);
      let y = Math.floor((getMouseY(0,e)/zoom+y_camera)/20);
      if (x >= 0 && y >= 0 && x < fieldSizes[0] && y < fieldSizes[1]) {
        if (editInstrument == "reformer") {
          if (pixels[x][y] == 0) {
            clickType = 1; 
          }
          if (pixels[x][y] == 1) {
            clickType = 0; 
          }
        }
        if (editInstrument == "eraser") {
          clickType = 0;
        }
        if (editInstrument == "pencil") {
          clickType = 1;
        }
        cellToState(x,y,clickType);
      }
    }
  } 
  else {
    if (action == "edit") {
      if (buttonClicked(10,10,36,36,x,y)) {
        setInstrument("hand");
      }
      if (buttonClicked(60,10,36,36,x,y)) {
        setInstrument("edit");
      }
      if (buttonClicked(110,10,36,36,x,y)) {
        //setInstrument("select");
      }
      if (buttonClicked(10,55,36,36,x,y)) {
        setEditInstrument("reformer");
      }
      if (buttonClicked(60,55,36,36,x,y)) {
        setEditInstrument("eraser");
      }
      if (buttonClicked(110,55,36,36,x,y)) {
        setEditInstrument("pencil");
      }
      if (buttonClicked(525,10,36,36,x,y)) {
        viewModeTurn();
        action = "view";
      } 
    }
    else {
      if (buttonClicked(10,10,36,36,x,y)) {
        action = "edit";
        running = false;
      }
      if (buttonClicked(60,10,36,36,x,y)) {
        viewModeTurn();
      }
      if (buttonClicked(110,10,36,36,x,y)) {
        previosFrame();
      }
      if (buttonClicked(160,10,36,36,x,y)) {
        oneStep();
        stopRun();
      } 
      if (buttonClicked(210,10,36,36,x,y)) {
        if (running) {
          stopRun();
        }
        else {
          run();
        } 
        editRender();
      }
    } 
    if (buttonClicked(860,50,20,340,x,y)) {
      clickType = "Yswich";
      y_camera = (y-50)/340*fieldSizes[1]*20;
      editRender();
      clicked = true; 
    }
    if (buttonClicked(50,420,820,20,x,y)) {
      clickType = "Xswich";
      x_camera = (x-50)/820*fieldSizes[0]*20;
      editRender();
      clicked = true; 
    }
    if (buttonClicked(400,10,120,36,x,y)) {
      clickType = "zoom";
      zoom = (x-399)/20;
      editRender();
      clicked = true;
    }
  }
  editRender();
}
function touchend() {
  clicked = false;
  clickType = null;
  editRender();
} 
function touchmove(e) {
  if (clicked && clickType == "hand") {
     let x = getMouseX(0,e);
     let y = getMouseY(0,e);
     x_camera = startXcamera-((x-startXmouse)/zoom);
     y_camera = startYcamera-((y-startYmouse)/zoom);
     editRender();
  } 
  if (clicked && clickType == "zoom") {
    let x = getMouseX(0,e);
    let y = getMouseY(0,e);
    zoom = (x-399)/20;
    if (zoom < 0.05) {
      zoom = 0.05;
    }
    if (zoom > 6) {
      zoom = 6;
    }
    editRender();
  } 
  if (instrument == "edit") {
    let x = Math.floor((getMouseX(0,e)/zoom+x_camera)/20);
    let y = Math.floor((getMouseY(0,e)/zoom+y_camera)/20); 
    if (x >= 0 && y >= 0 && x < fieldSizes[0] && y < fieldSizes[1]) {
      cellToState(x,y,clickType);
    } 
  }
  let x = getMouseX(0,e);
  let y = getMouseY(0,e);
  if (clickType == "Yswich" && clicked) {
      y_camera = (y-50)/340*fieldSizes[1]*20;
      editRender();
  } 
  if (clickType == "Xswich" && clicked) {
      x_camera = (x-50)/820*fieldSizes[0]*20;
      editRender();
  } 
} 
function touchzone(x,y) {
  if (instrument == "hand") {
    if (y > 50 && y < 420 && x < 850) {
      return true;
    }
    else {
      return false;
    }
  }
  if (instrument == "edit") {
    if (y > 90 && y < 420 && x < 850) {
      return true;
    }
    else {
      return false;
    }
  } 
}
function buttonClicked(x,y,w,h,Xmouse,Ymouse) {
  return Xmouse > x && Ymouse  > y && Xmouse < x+w && Ymouse < y+h;
}
function getMouseX(number,e) {
  if (mobile) {
    mouseX = (e.touches[number].pageX/canvasWidth*900)-canvasLeft;
  }
  else {
    mouseX = (e.pageX/canvasWidth*900)-canvasLeft;
  }
  return mouseX;
}
function getMouseY(number,e) {
  if (mobile) {
    mouseY = (e.touches[number].pageY/canvasHeight*450)-canvasTop;
  }
  else {
    mouseY = (e.pageY/canvasHeight*450)-canvasTop;
  }
  return mouseY;
}
