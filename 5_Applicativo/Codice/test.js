
class Ball{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.size = 5;
        this.label = null;
        this.color = '#000';
    }

    draw(context){
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

function saveCanvas(){
    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = document.getElementById('workspace-canvas').toDataURL()
    link.click();
}

const canvas = document.getElementById("workspace-canvas");
const context = canvas.getContext('2d');

var img = new Image();
img.src = "Img/pika.png";
canvas.style.backgroundImage = 'url("Img/pika.png")';
canvas.width = img.width;
canvas.height = img.height;

var ballsNum = 1;

canvas.addEventListener('mousedown', function (e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;    
    var scaleY = canvas.height / rect.height;
    
    var x = Math.round((e.x - rect.left) * scaleX);
    var y = Math.round((e.y - rect.top) * scaleY);

    var ball = new Ball();
    ball.x = x;
    ball.y = y,
    ball.label = ballsNum;
    ball.draw(context);

    ballsNum++;

});

