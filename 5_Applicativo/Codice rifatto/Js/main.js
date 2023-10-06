import { selectDotsLayer } from './layers.js';

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

function saveCanvas() {
    let link = document.createElement('a');
    link.download = 'image.png';
    link.href = document.getElementById('dots-canvas').toDataURL()
    link.click();
}

const chooseFile = document.getElementById("file-selector");
chooseFile.addEventListener("change", function () {
    getImgData();
});

const canvas = document.getElementById("workspace-canvas");
const context = canvas.getContext('2d');


selectDotsLayer();