
let dotsNum = 1;  
let dotSize = 5;
let dots = [];
let lastDotSize = -1;

let selectedDot = null;
let areAllDotsSelected = false;



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

function clearDotCanvas() {
    dotsContext.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);
}


function drawDotCanvas() {
    for (let dot of dots) {
        dot.draw(dotsContext);
    }

    if (areDotsConnected) {
        drawDotsConnections();
    }
}

function refreshDotCanvas() {
    clearDotCanvas();
    drawDotCanvas();
}

function drawDotsConnections() {
    let dotBefore = dots[dots.length - 1];
    for (let i = 0; i < dots.length; i++) {
        let line = new Line(dotBefore.x, dotBefore.y, dots[i].x, dots[i].y); // TODO: aggiungere come attributi beforeDot e afterDot così non devo sempre cambiare coordinate
        line.draw(dotsContext);
        dotBefore = dots[i];
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
    dot.label = dots.length > 0 ? parseInt(dots[dots.length - 1].label) + 1 : 1;

    dots.push(dot);
    refreshDotCanvas();
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

function selectDot(event) {
    
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

            getDotSizeElement.value = dot.size;
            dotSize = dot.size;

            refreshDotCanvas();

            break;
        }
    }

    if (!selected) {
        clearSelectedDot();
        selectDeleteOptionElement.style.display = "none";
    } else {
        selectDeleteOptionElement.style.display = "block";
    }

}
