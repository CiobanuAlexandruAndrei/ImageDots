/**
 * main.js contiene il codice utilizzato per le funzioni del menu o le funzioni principali.
 * 
 * @author Alexandru Ciobanu
 * @version 10.11.2023
 */


/**
 * Serve a usare i dati dell'immagine presi dall'input, dopodichè modifica le proprietà
 * dei vari canvas e l'immagine viene disegnata.
 */
function getImgData() {
    const files = chooseFile.files[0];
    if (files) {

        const reader = new FileReader();

        reader.addEventListener("load", function (theFile) {  

            let image = new Image();
            image.src = theFile.target.result;

            image.addEventListener("load", function () {  // Quando il caricamento è completato l'immmagine viene utilizzata.
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

/**
 * Fa il refresh del sito per chiudere l'immagine.
 */
function closeImage() {
    location.reload()
}

/**
 * Apre il menu di salvataggio.
 */
function openSaveCanvasMenu(){
    saveMenu.style.display = "block";
}

/**
 * Chiude il menu di salvataggio.
 */
function closeSaveCanvasMenu(){
    saveMenu.style.display = "none";
}

/**
 * Dopo aver aperto il menu di salvataggio, si usa questo metodo per comunicare con Print.js 
 * e far aprire il menu di stampa del browser.
 */
function printCanvas() {  
    context.clearRect(0, 0, canvas.width, canvas.height);  // context e canvas sono utilizzati soltanto per il salvataggio quindi ogni volta sono da pulire.

    let wereDotsConnected = areDotsConnected;
    areDotsConnected = saveMenuIsSolutionIncludedInput.checked;

    drawDotCanvas(context);
    areDotsConnected = wereDotsConnected;

    if(saveMenuAreDrawingsIncludedInput.checked){
        drawDrawingCanvas(context);
    }

    printJS({printable: document.querySelector("#workspace-canvas").toDataURL(), type: 'image', imageStyle: 'width:100%', header: saveMenuTitleInput.value});

    closeSaveCanvasMenu()
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Serve a salvare l'immagine all'utente.
 */
function saveCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // context e canvas sono utilizzati soltanto per il salvataggio quindi ogni volta sono da pulire.

    let wereDotsConnected = areDotsConnected;  // controlla se prima i puntini erano collegati, così le impostazioni di salvataggio non infliggono la visualizzazione precedente.
    areDotsConnected = saveMenuIsSolutionIncludedInput.checked;
    
    let imageTitle = saveMenuTitleInput.value;
    
    
    let link = document.createElement('a');
    if(imageTitle){
        link.download = imageTitle + '.png';
    }else{
        link.download = 'image.png';
    }

    if(saveMenuAreDrawingsIncludedInput.checked){
        drawDrawingCanvas(context);
    }
    drawDotCanvas(context);
    areDotsConnected = wereDotsConnected;
   
    link.href = document.getElementById('workspace-canvas').toDataURL()
    link.click();
    closeSaveCanvasMenu()
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const chooseFile = document.getElementById("file-selector");
chooseFile.addEventListener("change", function () {
    getImgData();
});


// Dichiarazione degli elementi HTML usati nel codice.
const canvas = document.getElementById("workspace-canvas");
const context = canvas.getContext('2d');
const saveMenu = document.getElementById("save-menu");
const saveMenuTitleInput = document.getElementById("saveCanvasName");
const saveMenuAreDrawingsIncludedInput = document.getElementById("saveCanvasIncludeDrawings");
const saveMenuIsSolutionIncludedInput = document.getElementById("saveCanvasIncludeSolution");

selectDotsLayer(); 


