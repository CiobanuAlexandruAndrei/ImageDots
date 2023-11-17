/**
 * drawing.js contiene la logica del funzionamento dei disegni, contiene classi ed eventi 
 * che vengono usati in drawing_manager.js e gli altri file.
 * 
 * @author Alexandru Ciobanu
 * @version 10.11.2023 
 */

let drawingSize = 5;  // Spessore linee rettangoli, elissi e linee.
let drawingColor = "#000";  
let areShapesFilled = false;  // Se i rettangoli ed ellissi sono riempite con il colore selezionato.

let lines = [];  // Tutte le linee disegnate nel drawingContext, create con la classe Line.
let rects = [];  // Tutti i rettangoli disegnati nel drawingContext, creati con la classe Rect.
let ellipses = [];  // Tutte le elissi disegnate nel drawingContext, create con la classe Ellipse.

let selectedDrawing = null;  // La forma selezionata che verrà eliminata, spostata, modificata.

/**
 * Rappresenta le linee disegnate a mano libera.
 */
class Line {
    /**
     * Inizializza i parametri necessari al disegnamento.
     * 
     * @param fromX  X da dove parte la linea.
     * @param fromY  Y da dove parte la linea
     * @param toX   X dove arriva la linea.
     * @param toY   Y dove arriva la linea.
     */
    constructor(fromX, fromY, toX, toY) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.size = 3;
        this.color = '#000';
    }

    /**
     * Disegna la linea.
     * 
     * @param context  il contesto dove verrà disegnata la linea, nella maggior parte dei casi sarà drawingContext.
     */
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

/**
 * Rappresenta i rettangoli disegnati.
 */
class Rect {
    /**
     * Inizializza i parametri necessari al disegnamento.
     * 
     * @param x  X dove inizia la forma. 
     * @param y  Y dove inizia la forma.
     * @param width  Larghezza della forma.
     * @param height  Altezza della forma.
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.size = 3;

        this.color = '#000';
        this.filled = false;
    }

    /**
     * Disegna il rettangolo.
     * 
     * @param context  il contesto dove verrà disegnata la linea, nella maggior parte dei casi sarà drawingContext.
     */
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

/**
 * Rappresenta le elissi disegnate.
 */
class Ellipse {
    /**
     * Inizializza i parametri necessari al disegnamento.
     * @param x  X del centro della forma.
     * @param y  Y del centro della forma.
     * @param radiusX  Lunghezza del raggio X della forma.
     * @param radiusY  Lunghezza del raggio Y della forma.
     * @param rotation  
     * @param startAngle 
     * @param endAngle 
     * @param counterclockwise 
     */
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

/**
 * Pulisce il drawing canvas.
 */
function clearDrawingCanvas() {
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

/**
 * Disegna il drawing canvas.
 * 
 * @param context  serve in caso che dobbiamo disegnare il drawing canvas in altri context.
 */
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

/**
 * Aggiorna il canvas,  e ridisegna
 */
function refreshDrawingCanvas() {
    clearDrawingCanvas();
    drawDrawingCanvas(drawingContext);
}

function clearSelectedDrawing(){
    selectedDrawing = null;
    selectDeleteDrawingOptionElement.style.display = 'none';
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
    let lastEllipse = new Ellipse(0, 0, 0, 0, 0, 0, 0, 0, 0);
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
    
    console.log("Schiacciato --> " + x + "; " + y);

    for(let rect of rects){
        if(x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height){
            selected = true;
            selectedDrawing = rect;
            break;
        }
    }

    if(!selected){
        for(let ellipse of ellipses){
            let theoricalX = Math.abs(x - ellipse.x);  // si considera ellipse.x come 0, punto di partenza
            let theoricalY = Math.abs(x - ellipse.y);  // si considera ellipse.y come 0, punto di partenza
            let distanceFromCenter = Math.sqrt(theoricalX * theoricalX, theoricalY * theoricalY);
            console.log("Distance -> " + distanceFromCenter + "\n" + "Radius X -> " + ellipse.radiusX + "\n" + "Radius Y -> " + ellipse.radiusY);
            if(distanceFromCenter < ellipse.radiusX && distanceFromCenter < ellipse.radiusY){
                selected = true;
                selectedDrawing = ellipse;
                console.log("yay");
                break;   
            }
        }
    }

    if(!selected){
        clearSelectedDrawing();
    } else{
        selectDeleteDrawingOptionElement.style.display = 'block';
    }
}

const stopMovingDrawing = () => { isMouseDown = false; }
const startMovingDrawing = event => {
    isMouseDown = true;
    [x, y] = [scaleCanvasX(event.x), scaleCanvasY(event.y)];
}
const moveDrawing = event => {
    
    if (isMouseDown && isSelectionMode && selectedDrawing != null) {
        const newX = scaleCanvasX(event.x);
        const newY = scaleCanvasY(event.y);
        x = newX;
        y = newY;

        selectedDrawing.x = x;
        selectedDrawing.y = y;

        refreshDrawingCanvas();

        console.log(x, y);
    } 
}