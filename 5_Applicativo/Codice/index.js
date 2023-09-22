
var dotsNum = 1; // fare un array per vedere quelli riutilizzabili
var dotsNums = [];
var dotSize = 5;
var dots = [];

var movedImage = null;
var isMouseDown = false;
var isSelectionMode = false;
var selectedDot = null;
var x = 0;
var y = 0;


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

        var pointX = Math.round(this.x);
        var pointY = Math.round(this.y);

        context.beginPath();
        context.fillStyle = this.color;
        context.arc(pointX, pointY, this.size, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        if (this.label) {
            var textX = pointX - 15;
            var textY = Math.round(pointY - this.size - 3);

            context.font = '16px Nunito';
            context.fillStyle = this.color;
            context.textAlign = 'center';
            context.fillText(this.label, textX, textY);
        }
    }
}

function getDotSize(){
    var range = document.getElementById("dotSizeRange");
    dotSize = range.value;
}

function saveCanvas() {
    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = document.getElementById('dots-canvas').toDataURL()
    link.click();
}

function clearCanvas() {
    dotsContext.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);
}

function drawCanvas() {
    for (var dot of dots) {
        dot.draw(dotsContext);
    }
}

function clearSelectedDot() {
    if (selectedDot != null) {
        selectedDot.color = "#000";
        clearCanvas();
        drawCanvas();
        selectedDot = null;
    }
}

function addDot(event) {
    var rect = dotsCanvas.getBoundingClientRect();
    var scaleX = dotsCanvas.width / rect.width;
    var scaleY = dotsCanvas.height / rect.height;

    var x = Math.round((event.x - rect.left) * scaleX);
    var y = Math.round((event.y - rect.top) * scaleY);

    var dot = new Dot();
    dot.x = x;
    dot.y = y;
    dot.size = dotSize;

    var foundNum = -1;
    for (var i = 0; i < dotsNums.length; i++) {
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
    }

    console.log(dotsNums);

    dot.draw(dotsContext);

    dots.push(dot);
    dotsNum++;

    oneDot = dot;
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

        clearCanvas();
        selectedDot.x = x;
        selectedDot.y = y;
        drawCanvas();

        console.log(x, y);
    }
}

function selectDot(event) {
    var deleteOption = document.getElementById("delete-option");
    var rect = dotsCanvas.getBoundingClientRect();
    var scaleX = dotsCanvas.width / rect.width;
    var scaleY = dotsCanvas.height / rect.height;

    var x = Math.round((event.x - rect.left) * scaleX);
    var y = Math.round((event.y - rect.top) * scaleY);

    var selected = false;

    for (var dot of dots) {
        if (Math.abs(dot.x - x) < 10 && Math.abs(dot.y - y) < 10) {
            console.log(dot.label + " schiacciato");
            dot.color = "#266DD3";

            if (dot != selectedDot && selectedDot != null) {
                clearSelectedDot();
                console.log("gaga");
            }

            selectedDot = dot;
            selected = true;

            clearCanvas();
            drawCanvas();

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

    var e = document.getElementById("free-mode-option");
    e.style.background = "#393E46";
    e.getElementsByTagName('img')[0].src = "Img/CursorLight.png";

    var e2 = document.getElementById("add-mode-option");
    e2.style.background = "#F7F7F7";
    e2.getElementsByTagName('img')[0].src = "Img/DotDark.png";

    var e3 = document.getElementById("select-mode-option");
    e3.style.background = "#F7F7F7";
    e3.getElementsByTagName('img')[0].src = "Img/SelectDark.png";
}

function selectAddMode() {
    isSelectionMode = false;

    dotsCanvas.removeEventListener('mousedown', selectDot);
    dotsCanvas.addEventListener('mousedown', addDot);
    var e = document.getElementById("free-mode-option");
    e.style.background = "#F7F7F7";
    e.getElementsByTagName('img')[0].src = "Img/CursorDark.png";

    var e2 = document.getElementById("add-mode-option");
    e2.style.background = "#393E46";
    e2.getElementsByTagName('img')[0].src = "Img/DotLight.png";

    var e3 = document.getElementById("select-mode-option");
    e3.style.background = "#F7F7F7";
    e3.getElementsByTagName('img')[0].src = "Img/SelectDark.png";

    clearSelectedDot();
}

function selectDeleteMode() {
    var deleteOption = document.getElementById("delete-option");
    for (var i = 0; i < dots.length; i++) {
        var indx = parseInt(selectedDot.label) - 1;
        dotsNums[indx] = false;
        if (selectedDot == dots[i]) {
            dots.splice(i, 1);
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

            var image = new Image();
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
    // da fare dopo spostamento puntini
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
