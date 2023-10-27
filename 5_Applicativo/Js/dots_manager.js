
let isSelectionMode = false;
let areDotsConnected = false;

function removeAllDotsEvents(){
    dotsCanvas.removeEventListener('mousedown', addDot);
    dotsCanvas.removeEventListener('mousedown', selectDot);
}

function resetDotsOptionsElements(){
    selectFreeModeOptionElement.style.background = "#F7F7F7";
    selectFreeModeOptionElement.getElementsByTagName('img')[0].src = "Img/CursorDark.png";

    selectAddModeOptionElement.style.background = "#F7F7F7";
    selectAddModeOptionElement.getElementsByTagName('img')[0].src = "Img/DotDark.png";

    //selectAllDotsOptionElement.style.background = "#F7F7F7";
    //selectAllDotsOptionElement.getElementsByTagName('img')[0].src = "Img/SelectDark.png";
}

function selectFreeMode() {
    isSelectionMode = true;

    removeAllDotsEvents();
    resetDotsOptionsElements();

    dotsCanvas.addEventListener('mousedown', selectDot);

    selectFreeModeOptionElement.style.background = "#393E46";
    selectFreeModeOptionElement.getElementsByTagName('img')[0].src = "Img/CursorLight.png";
}

function selectAddMode() {
    isSelectionMode = false;

    removeAllDotsEvents();
    resetDotsOptionsElements();
    
    if(areAllDotsSelected){
        selectAllDots();
    }

    dotsCanvas.addEventListener('mousedown', addDot);

    selectAddModeOptionElement.style.background = "#393E46";
    selectAddModeOptionElement.getElementsByTagName('img')[0].src = "Img/DotLight.png";

    clearSelectedDot();
}

function selectDeleteMode() {
    if(areAllDotsSelected){
        dots.splice(0, dots.length);
    } else{
        for (let i = 0; i < dots.length; i++) {
            let dotNumber = parseInt(selectedDot.label) - 1;
            if (selectedDot == dots[i]) {
                dots.splice(i, 1);
            }
        }

        let numberGapFound = false;
        let lastDotNumber = 0; 
        for (let i = 0; i < dots.length; i++) {
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
    }
        
    selectDeleteOptionElement.style.display = "none";
    clearSelectedDot();
    refreshDotCanvas();
}

function selectAllDots() {
    if (areAllDotsSelected) {
        areAllDotsSelected = false;

        selectAllDotsOptionElement.style.backgroundColor = "#F7F7F7";
        selectAllDotsOptionElement.getElementsByTagName("img")[0].src = "Img/SelectDark.png";

        for(let i = 0; i < dots.length; i++){
            dots[i].color = "#000";
        }
        selectDeleteOptionElement.style.display = "none";
    } else {
        areAllDotsSelected = true;
        selectAllDotsOptionElement.style.backgroundColor = "#393E46";
        selectAllDotsOptionElement.getElementsByTagName("img")[0].src = "Img/SelectLight.png";

        for(let i = 0; i < dots.length; i++){
            dots[i].color = "#266DD3";
        }
        selectDeleteOptionElement.style.display = "block";
    }
    refreshDotCanvas();
}

function selectChangeDotsNums(){
    let j = 0;
    for(let i = dots.length - 1; i >= 0; i--){
        dots[i].label = j + 1;
        j++;
    }
    dots.reverse();
    refreshDotCanvas();
}

function selectChangeDotNum(){
    var num = prompt("Insert the new number of the dot")

    if (!isNaN(num)){
        num = parseInt(num);
        let clone = new Dot();
        clone.x = selectedDot.x;
        clone.y = selectedDot.y;
        clone.size = selectedDot.size;
        clone.label = num;
        clone.color = selectedDot.color;

        for (let i = 0; i < dots.length; i++) {
            let dotNumber = parseInt(selectedDot.label) - 1;
            if (selectedDot == dots[i]) {
                dots.splice(i, 1);
            }
        }

        let lastDotNumber = 0; 
        dots.splice(num - 1, 0, clone);
        
        for (let i = 0; i < dots.length; i++) {
            dots[i].label = i + 1;
        }

        selectedDot = clone;
    } else{
        alert('ERRORE: Inserisci un numero valido')
    }
    
    refreshDotCanvas();
    console.log(dots);
}

function connectDots() {
    if (!areDotsConnected) {
        areDotsConnected = true;
        connectDotsTextElement.innerText = "Deconnect dots";
        selectConnectDotsElement.style.backgroundColor = "#393E46";

        drawDotsConnections(dotsContext);
    } else {
        connectDotsTextElement.innerText = "Connect dots";
        selectConnectDotsElement.style.backgroundColor = "#87CBB9";
        areDotsConnected = false;
        refreshDotCanvas();
    }
}

function getDotSize() {
    dotSize = getDotSizeElement.value;

    if (areAllDotsSelected){
        for(let i = 0; i < dots.length; i++){
            dots[i].size = dotSize;
        }
        refreshDotCanvas();
    }else if (lastDotSize != dotSize && selectedDot.size != dotSize) {
        selectedDot.size = dotSize;
        refreshDotCanvas();
    }
}

const dotsCanvas = document.getElementById("dots-canvas"); 
const dotsContext = dotsCanvas.getContext('2d');

const connectDotsElement = document.getElementById("connect-dots-menu");

const selectFreeModeOptionElement = document.getElementById("free-mode-option");
const selectAddModeOptionElement = document.getElementById("add-mode-option");
const selectModeOptionElement = document.getElementById("select-mode-option");
const selectDeleteOptionElement = document.getElementById("delete-option");

const selectConnectDotsElement = document.getElementById("connect-dots-menu");
const connectDotsTextElement = document.getElementById("connect-dots-menu-text");

const getDotSizeElement = document.getElementById("dotSizeRange");

const selectAllDotsOptionElement = document.getElementById("select-all-dots-mode-option");
const selectChangeDotsNumsElement = document.getElementById("change-dots-nums-mode-option");
const selectChangeDotNumElement = document.getElementById("change-dot-num-mode-option");

dotsCanvas.addEventListener('mousedown', startMovingDot);
dotsCanvas.addEventListener('mousemove', moveDot);
dotsCanvas.addEventListener('mouseup', stopMovingDot);
dotsCanvas.addEventListener('mouseout', stopMovingDot);
