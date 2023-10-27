
function removeAllDrawingEvents() {
    drawingCanvas.removeEventListener('mousedown', startDrawingLine);
    drawingCanvas.removeEventListener('mousemove', drawLine);
    drawingCanvas.removeEventListener('mouseup', stopDrawingLine);
    drawingCanvas.removeEventListener('mouseout', stopDrawingLine);

    drawingCanvas.removeEventListener('mousedown', startErasingDrawing);
    drawingCanvas.removeEventListener('mousemove', eraseDrawing);
    drawingCanvas.removeEventListener('mouseup', stopErasingDrawing);
    drawingCanvas.removeEventListener('mouseout', stopErasingDrawing);

    drawingCanvas.removeEventListener('mousedown', startDrawingRect);
    drawingCanvas.removeEventListener('mousemove', drawRect);
    drawingCanvas.removeEventListener('mouseup', stopDrawingRect);
    drawingCanvas.removeEventListener('mouseout', stopDrawingRect);

    drawingCanvas.removeEventListener('mousedown', startDrawingEllipse);
    drawingCanvas.removeEventListener('mousemove', drawEllipse);
    drawingCanvas.removeEventListener('mouseup', stopDrawingEllipse);
    drawingCanvas.removeEventListener('mouseout', stopDrawingEllipse);

    drawingCanvas.removeEventListener('mousedown', selectDrawings);
}

function resetOptionElements() {
    selectDrawingFreeModeElement.style.backgroundColor = "#F7F7F7";
    selectDrawingFreeModeElement.getElementsByTagName("img")[0].src = "Img/CursorDark.png";

    selectEraseDrawingElement.style.backgroundColor = "#F7F7F7";
    selectEraseDrawingElement.getElementsByTagName("img")[0].src = "Img/EraserDark.png";

    selectPenModeElement.style.backgroundColor = "#F7F7F7";
    selectPenModeElement.getElementsByTagName("img")[0].src = "Img/EditDark.png";

    selectDrawingRectElement.style.backgroundColor = "#F7F7F7";
    selectDrawingRectElement.getElementsByTagName("img")[0].src = "Img/SquareDark.png";

    selectDrawingElypseElement.style.backgroundColor = "#F7F7F7";
    selectDrawingElypseElement.getElementsByTagName("img")[0].src = "Img/CircleDark.png";
}

function selectDrawingFreeMode() {
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', selectDrawings);

    selectDrawingFreeModeElement.style.backgroundColor = "#393E46";
    selectDrawingFreeModeElement.getElementsByTagName("img")[0].src = "Img/CursorLight.png";

}

function selectPenMode() {
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startDrawingLine);
    drawingCanvas.addEventListener('mousemove', drawLine);
    drawingCanvas.addEventListener('mouseup', stopDrawingLine);
    drawingCanvas.addEventListener('mouseout', stopDrawingLine);

    selectPenModeElement.style.backgroundColor = "#393E46";
    selectPenModeElement.getElementsByTagName("img")[0].src = "Img/EditLight.png";

}

function selectEraseDrawingMode() {
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startErasingDrawing);
    drawingCanvas.addEventListener('mousemove', eraseDrawing);
    drawingCanvas.addEventListener('mouseup', stopErasingDrawing);
    drawingCanvas.addEventListener('mouseout', stopErasingDrawing);

    selectEraseDrawingElement.style.backgroundColor = "#393E46";
    selectEraseDrawingElement.getElementsByTagName("img")[0].src = "Img/EraserLight.png";
}

function selectDrawingRectMode() {
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startDrawingRect);
    drawingCanvas.addEventListener('mousemove', drawRect);
    drawingCanvas.addEventListener('mouseup', stopDrawingRect);
    drawingCanvas.addEventListener('mouseout', stopDrawingRect);

    selectDrawingRectElement.style.backgroundColor = "#393E46";
    selectDrawingRectElement.getElementsByTagName("img")[0].src = "Img/SquareLight.png";
}

function selectDrawingElypseMode() {
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startDrawingEllipse);
    drawingCanvas.addEventListener('mousemove', drawEllipse);
    drawingCanvas.addEventListener('mouseup', stopDrawingEllipse);
    drawingCanvas.addEventListener('mouseout', stopDrawingEllipse);

    selectDrawingElypseElement.style.backgroundColor = "#393E46";
    selectDrawingElypseElement.getElementsByTagName("img")[0].src = "Img/CircleLight.png";
}

function selectFill() {
    if (areShapesFilled) {
        areShapesFilled = false;
        selectDrawingShapeFilledElement.style.backgroundColor = "#F7F7F7";
        selectDrawingShapeFilledElement.getElementsByTagName("img")[0].src = "Img/FillDark.png";
    } else {
        areShapesFilled = true;
        selectDrawingShapeFilledElement.style.backgroundColor = "#393E46";
        selectDrawingShapeFilledElement.getElementsByTagName("img")[0].src = "Img/FillLight.png";
    }
}

function getDrawingSize(){
    let range = document.getElementById("drawingSizeRange");
    drawingSize = range.value;
}

function getDrawingColor(){
    let input = document.getElementById("drawing-color-input");
    drawingColor = input.value;
}

const drawingCanvas = document.getElementById("drawing-canvas");
const drawingContext = drawingCanvas.getContext('2d');

let selectDrawingFreeModeElement = document.getElementById("select-free-drawing-mode-option");
let selectPenModeElement = document.getElementById("select-pen-mode-option");
let selectEraseDrawingElement = document.getElementById("select-erase-drawing-mode-option");
let selectDrawingRectElement = document.getElementById("select-drawing-rect-mode-option");
let selectDrawingElypseElement = document.getElementById("select-drawing-elypse-mode-option");
let selectDrawingShapeFilledElement = document.getElementById("select-drawing-shape-filled-mode-option");

