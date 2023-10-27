
let dotsNum = 1;  
let dotSize = 5;
let dots = [];
let lastDotSize = -1;

let selectedDot = null;
let possibleSelectedDot = null;
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


function drawDotCanvas(context) {
    if (areDotsConnected) {
        drawDotsConnections(context);
    }

    for (let dot of dots) {
        dot.draw(context);
    }

}

function refreshDotCanvas() {
    clearDotCanvas();
    if(drawingLayerVisibility){
        drawDrawingCanvas(dotsContext);
    }
    
    drawDotCanvas(dotsContext);
}

function drawDotsConnections(context) {
    let dotBefore = dots[dots.length - 1];
    for (let i = 0; i < dots.length; i++) {
        let line = new Line(dotBefore.x, dotBefore.y, dots[i].x, dots[i].y); // TODO: aggiungere come attributi beforeDot e afterDot così non devo sempre cambiare coordinate
        line.draw(context);
        dotBefore = dots[i];
    }
}

function clearSelectedDot() {
    if (selectedDot != null && !areAllDotsSelected) {
        selectedDot.color = "#000";
        refreshDotCanvas();
        selectedDot = null;
    }
}

function addDot(event) {
    if(!areAllDotsSelected){
        
        let x = scaleCanvasX(event.x);
        let y = scaleCanvasY(event.y);

        let dot = new Dot();
        dot.x = x;
        dot.y = y;
        dot.size = dotSize;
        dot.label = dots.length > 0 ? parseInt(dots[dots.length - 1].label) + 1 : 1;

        dots.push(dot);
        refreshDotCanvas();
    }
    
}

const stopMovingDot = () => { isMouseDown = false; }
const startMovingDot = event => {
    isMouseDown = true;
    [x, y] = [scaleCanvasX(event.x), scaleCanvasY(event.y)];
}
const moveDot = event => {
    
    if (isMouseDown && isSelectionMode && areAllDotsSelected) {
        const newX = scaleCanvasX(event.x);
        const newY = scaleCanvasY(event.y);
        
        //clearDotCanvas();
        for(let i = 0; i < dots.length; i++){
            dots[i].x = dots[i].x + (newX - x);
            dots[i].y = dots[i].y + (newY - y);
        }
        //drawDotCanvas(dotsContext);
        refreshDotCanvas();

        x = newX;
        y = newY;
        console.log(x, y);
    } else if (isMouseDown && isSelectionMode && selectedDot != null) {
        const newX = scaleCanvasX(event.x);
        const newY = scaleCanvasY(event.y);
        x = newX;
        y = newY;

        //clearDotCanvas();
        selectedDot.x = x;
        selectedDot.y = y;
        //drawDotCanvas(dotsContext);
        refreshDotCanvas();

        console.log(x, y);
    } 
}

function scaleCanvasX(usedX){
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let calculatedX = Math.round((usedX - rect.left) * scaleX);

    return calculatedX;
}

function scaleCanvasY(usedY){
    let rect = canvas.getBoundingClientRect();
    let scaleY = canvas.height / rect.height;
    let calculatedY = Math.round((usedY - rect.top) * scaleY);

    return calculatedY;
}

function selectDot(event) {
    let x = scaleCanvasX(event.x);
    let y = scaleCanvasY(event.y);

    let selected = false;

    for (let dot of dots) {
        if (Math.abs(dot.x - x) < dot.size + 25 && Math.abs(dot.y - y) < dot.size + 25) {
            console.log(dot.label + " schiacciato");
            dot.color = "#266DD3";

            if (dot != selectedDot && selectedDot != null) {
                clearSelectedDot();
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
        if(areAllDotsSelected){
            selectAllDots();
        }
        selectDeleteOptionElement.style.display = "none";
        selectChangeDotNumElement.style.display = "none";
    } else {
        selectDeleteOptionElement.style.display = "block";
        selectChangeDotNumElement.style.display = "block";
    }

}

const checkPossibleSelection = event => {
    let x = scaleCanvasX(event.x);
    let y = scaleCanvasY(event.y);

    let found = false;

    for (let dot of dots) {
        if (Math.abs(dot.x - x) < dot.size + 25 && Math.abs(dot.y - y) < dot.size + 25) {
            
            if(possibleSelectedDot != selectedDot){
                possibleSelectedDot.color = "#000";
            }

            if(dot == possibleSelectedDot && dot == selectedDot){
                possibleSelectedDot.color = "#266DD3";
            }else{
                possibleSelectedDot = dot;
                possibleSelectedDot.color = "#696969";
            }

            found = true;
            break;
        }
    }

    if(!found && possibleSelectedDot != selectedDot){
        possibleSelectedDot.color = "#000";

    }

    refreshDotCanvas();
}
