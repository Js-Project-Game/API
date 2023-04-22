export class Player {
    constructor(mouse, team){
        this.canvas = document.getElementById('gameCanvas');
        this.team = team;
        this.x = team.spawnPoint.x;
        this.y = team.spawnPoint.y;
        this.radius = 50;
        // this.angle = 0;
        // this.frameX = 0;
        // this.frameY = 0;
        // this.frame = 0;
        this.score = 0;
        this.mouse = mouse;
        this.ctx = this.canvas.getContext('2d');
    };

    setPos(x, y){
        this.x = x;
        this.y = y;
    };
    update(){
        const dx = this.x - this.mouse.x;
        const dy = this.y - this.mouse.y;
        if(this.mouse.x !== this.x){
            this.x -= dx/50;
        }
        if(this.mouse.y !== this.y){
            this.y -= dy/50;
        }
    };
    draw(){
        if(this.mouse.click){
            this.ctx.lineWidth = 0.2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
        }
        let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.team.color);
        gradient.addColorStop(0.75, this.team.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);

        this.ctx.fill();
        this.ctx.closePath();

        //text on the player for print the score
        this.ctx.fillStyle = 'black';
        this.ctx.font = '30px scratchy_regular';
        this.ctx.fillText(this.score, this.x-10, this.y+10);

    };
}
