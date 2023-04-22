export class Xp {
    constructor(){
        this.canvas = document.getElementById('gameCanvas');;
        this.x = Math.random()* this.canvas.width
        this.y = Math.random() * this.canvas.height;
        this.radius = 10;
        this.moveRadius = 50;
        this.life = 150;
        this.ctx = this.canvas.getContext('2d');
        this.destination = {
            x: Math.random()* (this.x - (this.x + this.moveRadius)) + this.x,
            y: Math.random()* (this.y - (this.y + this.moveRadius)) + this.y
        };
    };

    draw(){
        let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'rgba(255,255,255,255)');
        gradient.addColorStop(0.5, 'rgba(255,249,0,0.5)');
        gradient.addColorStop(1, 'rgba(89,221,31,0)');
        this.ctx.fillStyle = gradient; //color of the player
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();
    };

    update(){
        const dx = this.x - this.destination.x;
        const dy = this.y - this.destination.y;
        if(this.destination.x !== this.x){
            this.x -= dx/50;
        }
        if(this.destination.y !== this.y){
            this.y -= dy/50;
        }
        if (this.x < this.destination.x + 5 && this.x > this.destination.x - 5 && this.y < this.destination.y + 5 && this.y > this.destination.y - 5) {
            this.destination.x = Math.random()* (this.x - (this.x + this.moveRadius)) + this.x;
            this.destination.y = Math.random()* (this.y - (this.y + this.moveRadius)) + this.y;
        }
        this.life--;
    };
}