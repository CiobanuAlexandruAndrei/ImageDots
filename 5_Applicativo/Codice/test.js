
var dotsNum = 1;
var dots = [];
var movedImage = null;

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

            context.font = 'Italic 16px Nunito';
            context.fillStyle = this.color;
            context.textAlign = 'center';
            context.fillText(this.label, textX, textY);
        }
    }
}

function saveCanvas() {
    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = document.getElementById('workspace-canvas').toDataURL()
    link.click();
}

function addDot(event){
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;

    var x = Math.round((event.x - rect.left) * scaleX);
    var y = Math.round((event.y - rect.top) * scaleY);

    var dot = new Dot();
    dot.x = x;
    dot.y = y;
    dot.label = dotsNum;
    dot.draw(context);

    dots.push(dot);
    dotsNum++;

    oneDot = dot;
}

function moveDot(){
    // let x = 0, y = 0;
    // let isMouseDown = false;

    // const stopDrawing = () => { isMouseDown = false; }
    // const startDrawing = event => {
    //     isMouseDown = true;
    //     [x, y] = [event.offsetX, event.offsetY];
    // }
    // const drawLine = event => {
    //     if (isMouseDown) {
    //         const newX = event.offsetX;
    //         const newY = event.offsetY;
    //         context.beginPath();
    //         context.moveTo(x, y);
    //         context.lineTo(newX, newY);
    //         context.stroke();
    //         //[x, y] = [newX, newY];
    //         x = newX;
    //         y = newY;
    //     }
    // }

    // paintCanvas.addEventListener('mousedown', startDrawing);
    // paintCanvas.addEventListener('mousemove', drawLine);
    // paintCanvas.addEventListener('mouseup', stopDrawing);
    // paintCanvas.addEventListener('mouseout', stopDrawing);
}

function selectDot(event){
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;

    var x = Math.round((event.x - rect.left) * scaleX);
    var y = Math.round((event.y - rect.top) * scaleY);

    for(var dot of dots){
        if (Math.abs(dot.x - x) < 10 && Math.abs(dot.y - y) < 10 ){
            console.log(dot.label + " schiacciato");
            break;
        }
    }
}

function selectFreeMode(){
    canvas.removeEventListener('mousedown', addDot);
    canvas.addEventListener('mousedown', selectDot);

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

function selectAddMode(){
    canvas.removeEventListener('mousedown', selectDot);
    canvas.addEventListener('mousedown', addDot);
    var e = document.getElementById("free-mode-option");
    e.style.background = "#F7F7F7";
    e.getElementsByTagName('img')[0].src = "Img/CursorDark.png";

    var e2 = document.getElementById("add-mode-option");
    e2.style.background = "#393E46";
    e2.getElementsByTagName('img')[0].src = "Img/DotLight.png";

    var e3 = document.getElementById("select-mode-option");
    e3.style.background = "#F7F7F7";
    e3.getElementsByTagName('img')[0].src = "Img/SelectDark.png";
}

const canvas = document.getElementById("workspace-canvas");
const context = canvas.getContext('2d');

var img = new Image();
img.src = "Img/pika.png";
canvas.style.backgroundImage = 'url("Img/pika.png") ';
canvas.style.backgroundSize = 'contain';
canvas.width = img.width;
canvas.height = img.height;



