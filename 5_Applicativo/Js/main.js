
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

function openSaveCanvasMenu(){
    saveMenu.style.display = "block";
}

function closeSaveCanvasMenu(){
    saveMenu.style.display = "none";
}

function printCanvas() {  
    context.clearRect(0, 0, canvas.width, canvas.height);

    let wereDotsConnected = areDotsConnected;
    areDotsConnected = true;
    drawDotCanvas(context);
    areDotsConnected = wereDotsConnected;

    if(saveMenuAreDrawingsIncludedInput.checked){
        drawDrawingCanvas(context);
    }

    printJS({printable: document.querySelector("#workspace-canvas").toDataURL(), type: 'image', imageStyle: 'width:100%'});

    closeSaveCanvasMenu()
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    let wereDotsConnected = areDotsConnected;
    areDotsConnected = true;
    drawDotCanvas(context);
    areDotsConnected = wereDotsConnected;

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
    
   
    link.href = document.getElementById('workspace-canvas').toDataURL()
    link.click();
    closeSaveCanvasMenu()
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const chooseFile = document.getElementById("file-selector");
chooseFile.addEventListener("change", function () {
    getImgData();
});

const canvas = document.getElementById("workspace-canvas");
const context = canvas.getContext('2d');
const saveMenu = document.getElementById("save-menu");
const saveMenuTitleInput = document.getElementById("saveCanvasName");
const saveMenuAreDrawingsIncludedInput = document.getElementById("saveCanvasIncludeDrawings");

selectDotsLayer();


