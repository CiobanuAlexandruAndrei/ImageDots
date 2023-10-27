

let drawingSize = 5;
let drawingColor = "#000";
let areShapesFilled = false;

let lines = [];
let rects = [];
let ellipses = [];

let selectedDrawing = null;

class Line {
    constructor(fromX, fromY, toX, toY) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.size = 3;
        this.color = '#000';
    }

    draw(context) {
        context.lineCap = 'round';
        context.beginPath();
        context.lineWidth = this.size;
        context.moveTo(this.fromX, this.fromY);
        context.lineTo(this.toX, this.toY);
        context.strokeStyle = this.color;
        context.stroke();
    }
}

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.size = 3;

        this.color = '#000';
        this.filled = false;
    }

    draw(context) {
        context.beginPath();
        if (!this.filled) {
            context.lineWidth = this.size;
            context.strokeStyle = this.color;
            context.rect(this.x, this.y, this.width, this.height);
        } else {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }

        context.stroke();
    }
}

class Ellipse {
    constructor(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise) {
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

function clearDrawingCanvas() {
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

function drawDrawingCanvas(context) {

    for (let line of lines) {
        line.draw(context);
    }

    for (let rect of rects) {
        rect.draw(context);
    }

    for (ellipse of ellipses) {
        ellipse.draw(context);
    }

    if(dotsLayerVisibility){
        drawDotCanvas(drawingContext);
    }
}

function refreshDrawingCanvas() {
    clearDrawingCanvas();
    drawDrawingCanvas(drawingContext);
}


const stopDrawingEllipse = () => {
    isMouseDown = false;
    if(lastEllipse){
        ellipses.push(lastEllipse);
    }
    
    lastEllipse = null;
    refreshDrawingCanvas();
}
const startDrawingEllipse = event => {
    isMouseDown = true;
    first = true;
    let lastEllipse = null;
    [startX, startY] = [scaleCanvasX(event.x), scaleCanvasY(event.y)]
    [x, y] = [scaleCanvasX(event.x), scaleCanvasY(event.y)];
}

const drawEllipse = event => {
    if (isMouseDown) {
        refreshDrawingCanvas();
       
        const newX = scaleCanvasX(event.x);
        const newY = scaleCanvasY(event.y);

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

const stopDrawingRect = () => {  // Quando esci dal canvas se ne creano altri quindi setto a null lastRect
    isMouseDown = false;
    
    if(lastRect){
        rects.push(lastRect);
    }
    
    lastRect = null; 
    console.log(rects);
    refreshDrawingCanvas();
}
const startDrawingRect = event => {
    isMouseDown = true;
    first = true;
    let lastRect = null;
    [startX, startY] = [scaleCanvasX(event.x), scaleCanvasY(event.y)]
    [x, y] = [scaleCanvasX(event.x), scaleCanvasY(event.y)];
}

const drawRect = event => {
    if (isMouseDown) {
        refreshDrawingCanvas();
        const newX = scaleCanvasX(event.x);
        const newY = scaleCanvasY(event.y);

        if (!first) {  // se no quando inizi a disegnare vedi una cosa strana
            rect = new Rect(startX, startY, x - startX, y - startY);
            rect.size = drawingSize;
            rect.color = drawingColor;
            rect.filled = areShapesFilled;
            rect.draw(drawingContext);


            lastRect = rect;
        }

        //[x, y] = [newX, newY];
        x = newX;
        y = newY;

    }
    first = false;
}

const stopDrawingLine = () => { isMouseDown = false; }
const startDrawingLine = event => {
    isMouseDown = true;
    [x, y] = [scaleCanvasX(event.x), scaleCanvasY(event.y)];
}
const drawLine = event => {
    if (isMouseDown) {
        const newX = scaleCanvasX(event.x);
        const newY = scaleCanvasY(event.y);

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
    [x, y] = [scaleCanvasX(event.x), scaleCanvasY(event.y)];
}
const eraseDrawing = event => {
    if (isMouseDown) {
        const newX = scaleCanvasX(event.x);
        const newY = scaleCanvasY(event.y);

        for (let i = 0; i < lines.length; i++) {
            if (Math.abs(lines[i].fromX - newX) < drawingSize + 1 &&
                Math.abs(lines[i].fromY - newY) < drawingSize + 1) {
                lines.splice(i, 1);
            }
        }

        for (let i = 0; i < rects.length; i++) {
            if (Math.abs(rects[i].x + rects[i].width) < newX &&  // TODO: sistemare
                Math.abs(rects[i].y + rects[i].height) < newY) {
                rects.splice(i, 1);
            }
        }

        //[x, y] = [newX, newY];
        x = newX;
        y = newY;
    }
    refreshDrawingCanvas();
}

function selectDrawings(event) {
    let x = scaleCanvasX(event.x);
    let y = scaleCanvasY(event.y);

    let selected = false;

    for(let rect of rects){
        if(x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height){
            console.log('NICE RECT');
            
            selected = true;
            //selectedDrawing = rect;
            break;
        }
    }
}