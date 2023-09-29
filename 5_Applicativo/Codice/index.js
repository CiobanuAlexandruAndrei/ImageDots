
let dotsNum = 1; // fare un array per vedere quelli riutilizzabili
let dotsNums = [];
let dotSize = 5;
let dots = [];

let movedImage = null;
let isMouseDown = false;
let isSelectionMode = false;
let selectedDot = null;
let x = 0;
let y = 0;

let areDotsConnected = false;


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
        context.beginPath();
        context.lineWidth = this.size;
        context.moveTo(this.fromX, this.fromY);
        context.lineTo(this.toX, this.toY);
        context.strokeStyle = this.color;
        context.stroke();
    }
}

function getDotSize(){
    let lastDotSize = dotSize; 
    let range = document.getElementById("dotSizeRange");
    dotSize = range.value;

    if(lastDotSize != dotSize && selectedDot.size != dotSize){ 
        selectedDot.size = dotSize;
        refreshCanvas();
    }
}

function saveCanvas() {
    let link = document.createElement('a');
    link.download = 'image.png';
    link.href = document.getElementById('dots-canvas').toDataURL()
    link.click();
}

function clearCanvas() {
    dotsContext.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);
}

function drawCanvas() {
    for (let dot of dots) {
        dot.draw(dotsContext);
    }

    if(areDotsConnected){
        drawDotsConnections();
    }
}

function refreshCanvas(){
    clearCanvas();
    drawCanvas();
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
        refreshCanvas();
    }
}

function clearSelectedDot() {
    if (selectedDot != null) {
        selectedDot.color = "#000";
        refreshCanvas();
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
    refreshCanvas();
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

        /*
        if(areDotsConnected){
            connectDots(); // toglie i collegamenti
        }
        */

        clearCanvas();
        selectedDot.x = x;
        selectedDot.y = y;
        drawCanvas();

        console.log(x, y);
    }
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
        if (Math.abs(dot.x - x) < dot.size && Math.abs(dot.y - y) < dot.size) { // TODO: includere il size
            console.log(dot.label + " schiacciato");
            dot.color = "#266DD3";

            if (dot != selectedDot && selectedDot != null) {
                clearSelectedDot();
                console.log("gaga");
            }

            selectedDot = dot;
            selected = true;

            refreshCanvas();

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
    console.log(dotsNums);
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

const canvas = document.getElementById("workspace-canvas");
const dotsCanvas = document.getElementById("dots-canvas");
const drawingCanvas = document.getElementById("drawing-canvas");

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
