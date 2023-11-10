/**
 * layers.js gestisce i metodi che servono al funzionamento del 
 * cambiamento della visualiizzazione dei layer.
 * 
 * @author Alexandru Ciobanu
 * @version 10.11.2023
 */

let dotsLayerSelected = false;  // solo uno alla volta può essere utilizzato
let drawingLayerSelected = false;

let dotsLayerVisibility = false;  // se tutti e due sono on si usa il context del terzo canvas
let drawingLayerVisibility = false;

let isMouseDown = false;


/**
 * Seleziona il layer dei puntini.
 */
function selectDotsLayer(){
    dotsLayerSelected = true; 
    drawingLayerSelected = false;

    dotsLayerVisibility = false;  
    drawingLayerVisibility = false;

    refreshDotCanvas();
    clearSelectedDot();

    // Modifiche stilistiche del menu.
    drawingCanvas.style.display = "none";
    dotsCanvas.style.display = "block";

    dotElement.style.backgroundColor = "#393E46";
    dotTextElement.style.color = "#EEEEEE";
    dotImageElement.src = "Img/EyeLight.png";

    drawingElement.style.backgroundColor = "#EEEEEE";
    drawingTextElement.style.color = "#393E46";
    drawingImageElement.src = "Img/EyeDark.png";

    // Gli elementi del menu dei puntini vengono visualizzate.
    for(item of dotMenuItemsElement){
        if (item.id != "delete-option" && item.id != "change-dot-num-mode-option") {  // delete-option e change-dot-num-mode-option vengono visualizzati con un certo evento.
            item.style.display = "block";                                              
        }
    }

    // Gli elementi del menu di disegno vengono nascosti.
    for (item of drawingMenuItemsElement) {
        item.style.display = "none";
    }

    connectDotsElement.style.display = "flex";  // Altrimenti l'immagine e il testo non stanno sulla stessa riga.
}

function selectDrawingLayer() {
    dotsLayerSelected = false;
    drawingLayerSelected = true;
    
    dotsLayerVisibility = false;  
    drawingLayerVisibility = false;
    
    refreshDrawingCanvas();

    // Modifiche stilistiche del menu.
    dotsCanvas.style.display = "none";
    drawingCanvas.style.display = "block";

    drawingElement.style.backgroundColor = "#393E46";
    drawingTextElement.style.color = "#EEEEEE";
    drawingImageElement.src = "Img/EyeLight.png";

    dotElement.style.backgroundColor = "#EEEEEE";
    dotTextElement.style.color = "#393E46";
    dotImageElement.src = "Img/EyeDark.png";

    // Gli elementi del menu dei puntini vengono nascosti.
    for (item of dotMenuItemsElement) {
        item.style.display = "none";
        
    }

    // Gli elementi del menu di disegno vengono visualizzate.
    for (item of drawingMenuItemsElement) {
        if (item.id != "delete-drawing-option") {
            item.style.display = "block";
        }
    }

    connectDotsElement.style.display = "none";  // Non serve questa opzione con i disegni.
}

/**
 * Rende visibili gli elementi del layer dei puntini, nel layer dei disegni.
 */
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

/**
 * Rende visibili gli elementi del layer dei disegni, nel layer dei puntini.
 */
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


// Dichiarazione degli elementi HTML usati nel codice.
const dotMenuItemsElement = document.getElementsByClassName("dot-menu-element");
const drawingMenuItemsElement = document.getElementsByClassName("drawing-menu-element");

const dotElement = document.getElementById("dots-layer-selection");
const dotTextElement = document.getElementById("dots-layer-selection-text");
const dotImageElement = document.getElementById("dots-layer-selection-image");
const drawingElement = document.getElementById("drawing-layer-selection");
const drawingTextElement = document.getElementById("drawing-layer-selection-text");
const drawingImageElement = document.getElementById("drawing-layer-selection-image");

