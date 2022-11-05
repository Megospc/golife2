const canvas = document.getElementById('canvas'); if (canvas.getContext) { const ctx = canvas.getContext('2d');
var backgroundColor = "#a0a0a0";
var gridColor = "#808080";
var gridWidth = 0.5;
var zoom = 1;
var x_camera = 0;
var y_camera = 0;
var loaded = 0;
var running = false;
var fieldSizes = new Array();
var buttonsBack = new Array();
var cellsColors = new Array();
var buttons = new Array();

loadButton(0,'assets/buttons/hand.svg');
loadButton(1,'assets/buttons/edit.svg');
loadButton(2,'assets/buttons/select.svg');
loadButton(3,'assets/buttons/reformer.svg');
loadButton(4,'assets/buttons/eraser.svg');
loadButton(5,'assets/buttons/pencil.svg');
loadButton(6,'assets/buttons/view.svg');
loadButton(7,'assets/buttons/firstFrame.svg');
loadButton(8,'assets/buttons/oneStep.svg');
loadButton(9,'assets/buttons/previosStep.svg');
loadButton(10,'assets/buttons/play.svg');
loadButton(11,'assets/buttons/pause.svg');

cellsColors = ["#ffffff","#000080"];
buttonsBack = ["#404040c0", "#0000a0", "#00a000"];
fieldSizes = [96,96];

updateSizes();
updateWindowSizes();

function updateWindowSizes() {
  let WINDW = window.innerWidth;
  let WINDH = window.innerHeight;
  let coff = WINDW/WINDH;
  if (coff == 2) {
    setCanvasSize(WINDW,WINDH,0,0);
  }
  if (coff < 2) {
    setCanvasSize(WINDW,WINDW/2,0,(WINDH-(WINDW/2))/2);
  }
  if (coff > 2) {
    setCanvasSize(WINDH*2,WINDH,(WINDW-(WINDH*2))/2,0);
  }
}
function editRender() {
  ctx.fillStyle=backgroundColor;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=cellsColors[0];
  let x_start = x_camera*zoom;
  fillRectZoom(ctx,x_camera*-1,y_camera*-1,fieldSizes[0]*20,fieldSizes[1]*20);
  for(let x = 0; x < fieldSizes[0]; x++){
    for (let y = 0; y < fieldSizes[1]; y++) {
      if (action == "view") {
        if (frame[x][y][0] > 0) {
          ctx.fillStyle=cellsColors[frame[x][y][0]];
          fillRectZoom(ctx,x*20-x_camera,y*20-y_camera,20,20);
        }
      }
      if (action == "edit") {
        if (pixels[x][y] > 0) {
          ctx.fillStyle=cellsColors[pixels[x][y]];
          fillRectZoom(ctx,x*20-x_camera,y*20-y_camera,20,20);
        }
      }
    }
  } 
  ctx.fillStyle=gridColor; 
  for(let x = 0; x < fieldSizes[0]+1; x++){
    fillRectZoom(ctx,20*x-x_camera,0-y_camera,gridWidth,20*fieldSizes[1]+gridWidth);
  } 
  for(let y = 0; y < fieldSizes[1]+1; y++){
    fillRectZoom(ctx,0-x_camera,20*y-y_camera,20*fieldSizes[0]+gridWidth,gridWidth);
  }
  if (action == "edit") {
    drawButton(buttons[0],10,10,36,36,5,instrument == "hand");
    drawButton(buttons[1],60,10,36,36,5,instrument == "edit");
    //drawButton(buttons[2],110,10,36,36,5,instrument == "select");
    drawButton(buttons[6],525,10,36,36,7,action == "view");
    if (instrument == "edit") {
      drawButton(buttons[3],10,60,36,36,5,editInstrument == "reformer");
      drawButton(buttons[4],60,60,36,36,5,editInstrument == "eraser");
      drawButton(buttons[5],110,60,36,36,5,editInstrument == "pencil");
    }
  }
  else {
    drawButton(buttons[6],10,10,36,36,7,action == "view");
    drawButton(buttons[7],60,10,36,36,7,false);
    drawButton(buttons[9],110,10,36,36,7,false);
    drawButton(buttons[8],160,10,36,36,7,false);
    if (running) {
      drawButton(buttons[11],210,10,36,36,7,true);
    }
    else {
      drawButton(buttons[10],210,10,36,36,7,false);
    }
  }
  ctx.fillStyle=buttonsBack[0];
  ctx.fillRect(395,10,120,36);
  if (clickType == "zoom") {
    ctx.fillStyle=buttonsBack[2];
    ctx.fillRect(zoom*20+392,10,5,36);
  } 
  ctx.fillStyle="#ffffff";
  ctx.fillRect(zoom*20+394,10,1,36);
  text(`zoom: ×${Math.floor(zoom*200)/10}`,'18px mono',"#ffffff",403,33); 
  ctx.fillStyle="#80808080";
  ctx.fillRect(860,50,20,340);
  ctx.fillRect(50,420,800,20);
  ctx.fillStyle="#40404080";
  if (y_camera < 0) {
    ctx.fillRect(860,50,20,30);
  }
  else {
    if (y_camera > fieldSizes[1]*20) {
      ctx.fillRect(860,360,20,30);
    }
    else {
      ctx.fillRect(860,50+((y_camera/fieldSizes[1]/20)*310),20,30);
    } 
  }
  if (x_camera < 0) {
    ctx.fillRect(50,420,30,20);
  }
  else {
    if (x_camera > fieldSizes[1]*20) {
      ctx.fillRect(820,420,30,20);
    }
    else {
      ctx.fillRect(50+((x_camera/fieldSizes[1]/20)*775),420,30,20);
    } 
  }
} 
function fillRectZoom(context,x,y,width,height){
  context.fillRect(x*zoom,y*zoom,width*zoom,height*zoom); 
} 
function drawButton(img,x,y,w,h,add,selected) {
  if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    ctx.fillStyle=buttonsBack[2];
  } 
  else {
    if (selected) {
      ctx.fillStyle=buttonsBack[1];
    } 
    else {
      ctx.fillStyle=buttonsBack[0];
    }
  } 
  ctx.fillRect(x,y,w,h);
  ctx.drawImage(img,x+add,y+add,w-(add*2),h-(add*2));
}
function text(text,font,color,x,y) {
  ctx.fillStyle=color;
  ctx.font=font;
  ctx.fillText(text,x,y);
}
function loadButton(id,src) {
  buttons[id] = new Image();
  buttons[id].src= src;
  buttons[id].onload = imageLoaded();
}
function imageLoaded() {
  loaded++;
  if (loaded == 12) {
    setTimeout(() => {editRender(); } , 500);
  }
} 
} 
else {document.getElementById('canvasNoSupport').style.display="block";}
