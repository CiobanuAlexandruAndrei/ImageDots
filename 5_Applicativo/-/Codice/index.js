
let dotsNum = 1; 
// let dotsNums = [];  
let dotSize = 5;
let dots = [];

let movedImage = null;
let isMouseDown = false;
let isSelectionMode = false;
let selectedDot = null;
let x = 0;
let y = 0;
let areAllDotsSelected = false;
let areDotsConnected = false;

let lastDotSize = -1;

let dotsLayerSelected = false;  // solo uno alla volta può essere utilizzato
let drawingLayerSelected = false;

let dotsLayerVisibility = false;  // se tutti e due sono on si usa il context del terzo canvas
let drawingLayerVisibility = false;

let drawingSize = 5;
let drawingColor = "#000";
let lines = [];
let rects = [];
let ellipses = [];


let areShapesFilled = false;


class Dot {
    
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 5;
        this.label = null;
        this.color = '#000';
    }

    draw(context) {
        if (this.color == null) {
            this.color = '#000';
        }
        if (this.size == null) {
            this.size = 5;
        }

        let pointX = Math.round(this.x);
        let pointY = Math.round(this.y);

        context.beginPath();
        context.fillStyle = this.color;
        context.arc(pointX, pointY, this.size, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        if (this.label) {
            let textX = pointX - 15;
            let textY = Math.round(pointY - this.size - 3);

            let calulatedFont = Math.round((16.0 / 5.0) * this.size);

            context.font = calulatedFont + 'px Nunito';
            context.fillStyle = this.color;
            context.textAlign = 'center';
            context.fillText(this.label, textX, textY);
        }
    }
}

class Line{
    constructor(fromX, fromY, toX, toY){
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.size = 3;
        this.color = '#000';
    }
    
    draw(context){
        context.lineCap = 'round';
        context.beginPath();
        context.lineWidth = this.size;
        context.moveTo(this.fromX, this.fromY);
        context.lineTo(this.toX, this.toY);
        context.strokeStyle = this.color;
        context.stroke();
    }
}

class Rect{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.size = 3;

        this.color = '#000';
        this.filled = false;
    }

    draw(context){
        context.beginPath();
        if(!this.filled){
            context.lineWidth = this.size;
            context.strokeStyle = this.color;
            context.rect(this.x, this.y, this.width, this.height);
        }else{
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
        
        context.stroke();
    }
}

class Ellipse{
    constructor(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise){
        this.x = x;
        this.y = y;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.rotation = rotation;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterclockwise = counterclockwise;

        this.color = '#000';
        this.size = 3;
        this.filled = false;
    }

    draw(context) {
        context.beginPath();
        if (!this.filled) {
            context.lineWidth = this.size;
            context.strokeStyle = this.color;
            context.ellipse(this.x, this.y, this.radiusX, this.radiusY, this.rotation, this.startAngle, this.endAngle, this.counterclockwise)
        } else {
            context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.ellipse(this.x, this.y, this.radiusX, this.radiusY, this.rotation, this.startAngle, this.endAngle, this.counterclockwise)
            context.fill();
        }
        
        context.stroke();
    }
}

function getDotSize(){
    let range = document.getElementById("dotSizeRange");
    dotSize = range.value;

    if(lastDotSize != dotSize && selectedDot.size != dotSize){ 
        selectedDot.size = dotSize;
        refreshDotCanvas();
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

function saveCanvas() {
    let link = document.createElement('a');
    link.download = 'image.png';
    link.href = document.getElementById('dots-canvas').toDataURL()
    link.click();
}

function clearDotCanvas() {
    dotsContext.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);
}

function drawDotCanvas() {
    for (let dot of dots) {
        dot.draw(dotsContext);
    }

    if(areDotsConnected){
        drawDotsConnections();
    }
}

function refreshDotCanvas(){
    clearDotCanvas();
    drawDotCanvas();
}

function clearDrawingCanvas(){
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

function drawDrawingCanvas(){
    for (let line of lines) {
        line.draw(drawingContext);
    }

    for(let rect of rects){
        rect.draw(drawingContext);
    }

    for(ellipse of ellipses){
        ellipse.draw(drawingContext);
    }
}

function refreshDrawingCanvas(){
    clearDrawingCanvas();
    drawDrawingCanvas();
}

function drawDotsConnections(){
    let dotBefore = dots[dots.length - 1];
    for (let i = 0; i < dots.length; i++) {
        let line = new Line(dotBefore.x, dotBefore.y, dots[i].x, dots[i].y); // TODO: aggiungere come attributi beforeDot e afterDot così non devo sempre cambiare coordinate
        line.draw(dotsContext);
        dotBefore = dots[i];
    }
}

function connectDots(){
    let connectDotsButton = document.getElementById("connect-dots-menu");
    let connectDotsText = document.getElementById("connect-dots-menu-text");

    if(!areDotsConnected){
        areDotsConnected = true;
        connectDotsText.innerText = "Deconnect dots";
        connectDotsButton.style.backgroundColor = "#393E46";

        drawDotsConnections();
    }else{
        connectDotsText.innerText = "Connect dots";
        connectDotsButton.style.backgroundColor = "#87CBB9";
        areDotsConnected = false;
        refreshDotCanvas();
    }
}

function clearSelectedDot() {
    if (selectedDot != null) {
        selectedDot.color = "#000";
        refreshDotCanvas();
        selectedDot = null;
    }
}

function addDot(event) {
    let rect = dotsCanvas.getBoundingClientRect();
    let scaleX = dotsCanvas.width / rect.width;
    let scaleY = dotsCanvas.height / rect.height;

    let x = Math.round((event.x - rect.left) * scaleX);
    let y = Math.round((event.y - rect.top) * scaleY);

    let dot = new Dot();
    dot.x = x;
    dot.y = y;
    dot.size = dotSize;

    /*
    let foundNum = -1;
    for (let i = 0; i < dotsNums.length; i++) {
        if (dotsNums[i] == false) {
            foundNum = i;
            dotsNums[i] = true;
            dot.label = foundNum + 1;
            break;
        }
    }

    if (foundNum == -1) {
        dot.label = dotsNums.length + 1;
        dotsNums.push(true);
    }*/

    //console.log(dotsNums);
    
    dot.label = dots.length > 0 ? parseInt(dots[dots.length - 1].label) + 1 : 1;
 
    dots.push(dot);
    refreshDotCanvas();
    //dotsNum++;
}

const stopMovingDot = () => { isMouseDown = false; }
const startMovingDot = event => {
    isMouseDown = true;
    [x, y] = [event.offsetX, event.offsetY];
}
const moveDot = event => {
    if (isMouseDown && isSelectionMode && selectedDot != null) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        x = newX;
        y = newY;

        clearDotCanvas();
        selectedDot.x = x;
        selectedDot.y = y;
        drawDotCanvas();

        console.log(x, y);
    }
}

const stopDrawingEllipse = () => {
    isMouseDown = false;
    ellipses.push(lastEllipse);
    refreshDrawingCanvas();
}
const startDrawingEllipse = event => {
    isMouseDown = true;
    first = true;
    let lastEllipse = null;
    [startX, startY] = [event.offsetX, event.offsetY]
    [x, y] = [event.offsetX, event.offsetY];
}

const drawEllipse = event => {
    if (isMouseDown) {
        refreshDrawingCanvas();
        const newX = event.offsetX;
        const newY = event.offsetY;

        if (!first) {  // se no quando inizi a disegnare vedi una cosa strana

            var w = newX - startX;
            var h = newY - startY;
            var radius = Math.sqrt(Math.pow((startX - newX), 2) + Math.pow((startY - newY), 2));
            var cw = (startX > newX) ? true : false;
            ellipse = new Ellipse(startX, startY, Math.abs(w), Math.abs(h), 0, 2 * Math.PI, false);
            ellipse.size = drawingSize;
            ellipse.color = drawingColor;
            ellipse.filled = areShapesFilled;
            ellipse.draw(drawingContext);
            lastEllipse = ellipse;

        }

        x = newX;
        y = newY;

    }
    first = false;
}



const stopDrawingRect = () => { 
    isMouseDown = false; 
    rects.push(lastRect);
    refreshDrawingCanvas();
}
const startDrawingRect = event => {
    isMouseDown = true;
    first = true;
    let lastRect = null;
    [startX, startY] = [event.offsetX, event.offsetY]
    [x, y] = [event.offsetX, event.offsetY];
}

const drawRect = event => {
    if (isMouseDown) {
        refreshDrawingCanvas();
        const newX = event.offsetX;
        const newY = event.offsetY;

        if(!first){  // se no quando inizi a disegnare vedi una cosa strana
            rect = new Rect(startX, startY, x - startX, y - startY);
            rect.size = drawingSize;
            rect.color = drawingColor;
            rect.filled = areShapesFilled;
            rect.draw(drawingContext);


            lastRect = rect;
        }
        //lines.push(line);

        //[x, y] = [newX, newY];
        x = newX;
        y = newY;
        
    }
    first = false;
}



const stopDrawingLine = () => { isMouseDown = false; }
const startDrawingLine = event => {
    isMouseDown = true;
    [x, y] = [event.offsetX, event.offsetY];
}
const drawLine = event => {
    if ( isMouseDown ) {
        const newX = event.offsetX;
        const newY = event.offsetY;

        line = new Line(x, y, newX, newY);
        line.size = drawingSize;
        line.color = drawingColor;
        line.draw(drawingContext);

        lines.push(line);

        //[x, y] = [newX, newY];
        x = newX;
        y = newY;
    }
}

const stopErasingDrawing = () => { isMouseDown = false; }
const startErasingDrawing = event => {
    isMouseDown = true;
    [x, y] = [event.offsetX, event.offsetY];
}
const eraseDrawing = event => {
    if (isMouseDown) {
        const newX = event.offsetX;
        const newY = event.offsetY;
        
        for(let i = 0; i < lines.length; i++){
            if (Math.abs(lines[i].fromX - newX) < drawingSize+1 && 
                Math.abs(lines[i].fromY - newY) < drawingSize+1){
                lines.splice(i, 1);
            }
        }

        for (let i = 0; i < rects.length; i++) {
            if (Math.abs(rects[i].x + rects[i].width) < newX &&  // TODO: sistemare
                Math.abs(rects[i].y + rects[i].height) < newY){
                rects.splice(i, 1);
            }
        }

        //[x, y] = [newX, newY];
        x = newX;
        y = newY;
    }
    refreshDrawingCanvas();
}

function selectDot(event) {
    let deleteOption = document.getElementById("delete-option");
    let rect = dotsCanvas.getBoundingClientRect();
    let scaleX = dotsCanvas.width / rect.width;
    let scaleY = dotsCanvas.height / rect.height;

    let x = Math.round((event.x - rect.left) * scaleX);
    let y = Math.round((event.y - rect.top) * scaleY);

    let selected = false;

    for (let dot of dots) {
        if (Math.abs(dot.x - x) < dot.size && Math.abs(dot.y - y) < dot.size) { 
            console.log(dot.label + " schiacciato");
            dot.color = "#266DD3";

            if (dot != selectedDot && selectedDot != null) {
                clearSelectedDot();
                console.log("gaga");
            }

            selectedDot = dot;
            selected = true;

            document.getElementById('dotSizeRange').value = dot.size;
            dotSize = dot.size;

            refreshDotCanvas();

            break;
        }
    }

    if (!selected) {
        clearSelectedDot();
        deleteOption.style.display = "none";
    } else {
        deleteOption.style.display = "block";

    }

}

function selectFreeMode() {
    isSelectionMode = true;

    dotsCanvas.removeEventListener('mousedown', addDot);
    dotsCanvas.addEventListener('mousedown', selectDot);

    let e = document.getElementById("free-mode-option");
    e.style.background = "#393E46";
    e.getElementsByTagName('img')[0].src = "Img/CursorLight.png";

    let e2 = document.getElementById("add-mode-option");
    e2.style.background = "#F7F7F7";
    e2.getElementsByTagName('img')[0].src = "Img/DotDark.png";

    let e3 = document.getElementById("select-mode-option");
    e3.style.background = "#F7F7F7";
    e3.getElementsByTagName('img')[0].src = "Img/SelectDark.png";
}

function selectAddMode() {
    isSelectionMode = false;

    dotsCanvas.removeEventListener('mousedown', selectDot);
    dotsCanvas.addEventListener('mousedown', addDot);
    let e = document.getElementById("free-mode-option");
    e.style.background = "#F7F7F7";
    e.getElementsByTagName('img')[0].src = "Img/CursorDark.png";

    let e2 = document.getElementById("add-mode-option");
    e2.style.background = "#393E46";
    e2.getElementsByTagName('img')[0].src = "Img/DotLight.png";

    let e3 = document.getElementById("select-mode-option");
    e3.style.background = "#F7F7F7";
    e3.getElementsByTagName('img')[0].src = "Img/SelectDark.png";

    clearSelectedDot();
}

function selectDeleteMode() {
    let deleteOption = document.getElementById("delete-option");

    for (let i = 0; i < dots.length; i++) {
        let dotNumber = parseInt(selectedDot.label) - 1;
        
        //dotsNums[indx] = false;

        if (selectedDot == dots[i]) {
            dots.splice(i, 1);
        }
    }

    let numberGapFound = false;
    let lastDotNumber = dots.length > 0 ? parseInt(dots[0].label) : 0;
    for (let i = 1; i < dots.length; i++) {
        let thisDotNumber = parseInt(dots[i].label)
        if (numberGapFound) {
            dots[i].label = thisDotNumber - 1;
        } else {
            if ((thisDotNumber - lastDotNumber) == 2) {
                numberGapFound = true;
                dots[i].label = thisDotNumber - 1;
            }
            console.log(thisDotNumber - lastDotNumber)
            lastDotNumber = thisDotNumber;
        }
    }

    deleteOption.style.display = "none";
    clearSelectedDot();
    //console.log(dotsNums);
}

function selectAllDots() {
    if (areAllDotsSelected) {
        areAllDotsSelected = false;
        console.log("NEIN");
        selectAllDotsElement.style.backgroundColor = "#F7F7F7";
        selectAllDotsElement.getElementsByTagName("img")[0].src = "Img/SelectDark.png";
    } else {
        areAllDotsSelected = true;
        console.log("Yaooooo");
        selectAllDotsElement.style.backgroundColor = "#393E46";
        selectAllDotsElement.getElementsByTagName("img")[0].src = "Img/SelectLight.png";
    }
}


function getImgData() {
    const files = chooseFile.files[0];
    if (files) {
        dotsNum = 1;

        const reader = new FileReader();

        reader.addEventListener("load", function (theFile) {

            let image = new Image();
            image.src = theFile.target.result;

            image.addEventListener("load", function () {
                canvas.style.backgroundImage = 'url("' + this.src + '") ';
                canvas.style.backgroundSize = 'contain';
                canvas.width = this.width;
                canvas.height = this.height;

                dotsCanvas.width = this.width;
                dotsCanvas.height = this.height;

                drawingCanvas.width = this.width;
                drawingCanvas.height = this.height;
            });

        });
        reader.readAsDataURL(files);
    }
}

function closeImage() {
    location.reload()
}

function selectDotsLayer(){
    dotsLayerSelected = true; 
    drawingLayerSelected = false;
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

    let dotMenuItems = document.getElementsByClassName("dot-menu-element");
    for(item of dotMenuItems){
        if (item.id != "delete-option") {
            item.style.display = "block";
        }
    }

    let drawingMenuItems = document.getElementsByClassName("drawing-menu-element");
    for (item of drawingMenuItems) {
        item.style.display = "none";
    }

    connectDotsElement.style.display = "flex";
}

function selectDrawingLayer() {
    dotsLayerSelected = false;
    drawingLayerSelected = true;
    
    refreshDrawingCanvas();

    dotsCanvas.style.display = "none";
    drawingCanvas.style.display = "block";

    drawingElement.style.backgroundColor = "#393E46";
    drawingTextElement.style.color = "#EEEEEE";
    drawingImageElement.src = "Img/EyeLight.png";

    dotElement.style.backgroundColor = "#EEEEEE";
    dotTextElement.style.color = "#393E46";
    dotImageElement.src = "Img/EyeDark.png";

    let dotMenuItems = document.getElementsByClassName("dot-menu-element");
    for (item of dotMenuItems) {
        // if (item.id != "delete-option"){
        //     item.style.display = "none";
        // }
        item.style.display = "none";
        
    }

    let drawingMenuItems = document.getElementsByClassName("drawing-menu-element");
    for (item of drawingMenuItems) {
        item.style.display = "block";
    }

    connectDotsElement.style.display = "none";
}

function removeAllDrawingEvents(){
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
}

function resetOptionElements(){
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

function selectDrawingFreeMode(){
    removeAllDrawingEvents();
    resetOptionElements();

    selectDrawingFreeModeElement.style.backgroundColor = "#393E46";
    selectDrawingFreeModeElement.getElementsByTagName("img")[0].src = "Img/CursorLight.png";

}

function selectPenMode(){
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startDrawingLine);
    drawingCanvas.addEventListener('mousemove', drawLine);
    drawingCanvas.addEventListener('mouseup', stopDrawingLine);
    drawingCanvas.addEventListener('mouseout', stopDrawingLine);

    selectPenModeElement.style.backgroundColor = "#393E46";
    selectPenModeElement.getElementsByTagName("img")[0].src = "Img/EditLight.png";

}

function selectEraseDrawingMode(){
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startErasingDrawing);
    drawingCanvas.addEventListener('mousemove', eraseDrawing);
    drawingCanvas.addEventListener('mouseup', stopErasingDrawing);
    drawingCanvas.addEventListener('mouseout', stopErasingDrawing);

    selectEraseDrawingElement.style.backgroundColor = "#393E46";
    selectEraseDrawingElement.getElementsByTagName("img")[0].src = "Img/EraserLight.png";
}

function selectDrawingRectMode(){
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startDrawingRect);
    drawingCanvas.addEventListener('mousemove', drawRect);
    drawingCanvas.addEventListener('mouseup', stopDrawingRect);
    drawingCanvas.addEventListener('mouseout', stopDrawingRect);

    selectDrawingRectElement.style.backgroundColor = "#393E46";
    selectDrawingRectElement.getElementsByTagName("img")[0].src = "Img/SquareLight.png";
}

function selectDrawingElypseMode(){
    removeAllDrawingEvents();
    resetOptionElements();

    drawingCanvas.addEventListener('mousedown', startDrawingEllipse);
    drawingCanvas.addEventListener('mousemove', drawEllipse);
    drawingCanvas.addEventListener('mouseup', stopDrawingEllipse);
    drawingCanvas.addEventListener('mouseout', stopDrawingEllipse);

    selectDrawingElypseElement.style.backgroundColor = "#393E46";
    selectDrawingElypseElement.getElementsByTagName("img")[0].src = "Img/CircleLight.png";
}

function selectFill(){
    if(areShapesFilled){
        areShapesFilled = false;
        selectDrawingShapeFilledElement.style.backgroundColor = "#F7F7F7";
        selectDrawingShapeFilledElement.getElementsByTagName("img")[0].src = "Img/FillDark.png";
    }else{
        areShapesFilled = true;
        selectDrawingShapeFilledElement.style.backgroundColor = "#393E46";
        selectDrawingShapeFilledElement.getElementsByTagName("img")[0].src = "Img/FillLight.png";
    }
}

const canvas = document.getElementById("workspace-canvas");
const dotsCanvas = document.getElementById("dots-canvas");
const drawingCanvas = document.getElementById("drawing-canvas");

let selectAllDotsElement = document.getElementById("select-all-dots-mode-option");

let dotElement = document.getElementById("dots-layer-selection");
let dotTextElement = document.getElementById("dots-layer-selection-text");
let dotImageElement = document.getElementById("dots-layer-selection-image");
let drawingElement = document.getElementById("drawing-layer-selection");
let drawingTextElement = document.getElementById("drawing-layer-selection-text");
let drawingImageElement = document.getElementById("drawing-layer-selection-image");
let connectDotsElement = document.getElementById("connect-dots-menu");

let selectDrawingFreeModeElement = document.getElementById("select-free-drawing-mode-option");
let selectPenModeElement = document.getElementById("select-pen-mode-option");
let selectEraseDrawingElement = document.getElementById("select-erase-drawing-mode-option");
let selectDrawingRectElement = document.getElementById("select-drawing-rect-mode-option");
let selectDrawingElypseElement = document.getElementById("select-drawing-elypse-mode-option");
let selectDrawingShapeFilledElement = document.getElementById("select-drawing-shape-filled-mode-option");

const context = canvas.getContext('2d');
const dotsContext = dotsCanvas.getContext('2d');
const drawingContext = drawingCanvas.getContext('2d');

const chooseFile = document.getElementById("file-selector");

chooseFile.addEventListener("change", function () {
    getImgData();
});

dotsCanvas.addEventListener('mousedown', startMovingDot);
dotsCanvas.addEventListener('mousemove', moveDot);
dotsCanvas.addEventListener('mouseup', stopMovingDot);
dotsCanvas.addEventListener('mouseout', stopMovingDot);

// drawingCanvas.addEventListener('mousedown', startDrawingLine);
// drawingCanvas.addEventListener('mousemove', drawLine);
// drawingCanvas.addEventListener('mouseup', stopDrawingLine);
// drawingCanvas.addEventListener('mouseout', stopDrawingLine);

selectDotsLayer();