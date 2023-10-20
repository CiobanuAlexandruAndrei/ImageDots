

let dotsLayerSelected = false;  // solo uno alla volta può essere utilizzato
let drawingLayerSelected = false;

let dotsLayerVisibility = false;  // se tutti e due sono on si usa il context del terzo canvas
let drawingLayerVisibility = false;

let isMouseDown = false;

function selectDotsLayer(){
    dotsLayerSelected = true; 
    drawingLayerSelected = false;

    dotsLayerVisibility = false;  
    drawingLayerVisibility = false;

    refreshDotCanvas();
    
    clearSelectedDot();

    drawingCanvas.style.display = "none";
    dotsCanvas.style.display = "block";

    dotElement.style.backgroundColor = "#393E46";
    dotTextElement.style.color = "#EEEEEE";
    dotImageElement.src = "Img/EyeLight.png";

    drawingElement.style.backgroundColor = "#EEEEEE";
    drawingTextElement.style.color = "#393E46";
    drawingImageElement.src = "Img/EyeDark.png";

    for(item of dotMenuItemsElement){
        if (item.id != "delete-option" && item.id != "change-dot-num-mode-option") {
            item.style.display = "block";
        }
    }

    for (item of drawingMenuItemsElement) {
        item.style.display = "none";
    }

    connectDotsElement.style.display = "flex";
}

function selectDrawingLayer() {
    dotsLayerSelected = false;
    drawingLayerSelected = true;
    
    dotsLayerVisibility = false;  
    drawingLayerVisibility = false;
    
    refreshDrawingCanvas();

    dotsCanvas.style.display = "none";
    drawingCanvas.style.display = "block";

    drawingElement.style.backgroundColor = "#393E46";
    drawingTextElement.style.color = "#EEEEEE";
    drawingImageElement.src = "Img/EyeLight.png";

    dotElement.style.backgroundColor = "#EEEEEE";
    dotTextElement.style.color = "#393E46";
    dotImageElement.src = "Img/EyeDark.png";

    for (item of dotMenuItemsElement) {
        item.style.display = "none";
        
    }

    for (item of drawingMenuItemsElement) {
        item.style.display = "block";
    }

    connectDotsElement.style.display = "none";
}

function selectDotsLayerVisibility(){
    if(!dotsLayerSelected && drawingLayerSelected){
        if(dotsLayerVisibility){
            dotsLayerVisibility = false;
            dotImageElement.src = '../Img/EyeDark.png';
        }else{
            dotsLayerVisibility = true;
            dotImageElement.src = '../Img/HideDark.png';
        }
        refreshDrawingCanvas()
    }
}

function selectDrawingLayerVisibility(){
    if(dotsLayerSelected && !drawingLayerSelected){
        if(drawingLayerVisibility){
            drawingLayerVisibility = false;
            drawingImageElement.src = '../Img/EyeDark.png';
        }else{
            drawingLayerVisibility = true;
            drawingImageElement.src = '../Img/HideDark.png';
        }
        refreshDotCanvas()
    }
}

const dotMenuItemsElement = document.getElementsByClassName("dot-menu-element");
const drawingMenuItemsElement = document.getElementsByClassName("drawing-menu-element");

let dotElement = document.getElementById("dots-layer-selection");
let dotTextElement = document.getElementById("dots-layer-selection-text");
let dotImageElement = document.getElementById("dots-layer-selection-image");
let drawingElement = document.getElementById("drawing-layer-selection");
let drawingTextElement = document.getElementById("drawing-layer-selection-text");
let drawingImageElement = document.getElementById("drawing-layer-selection-image");

