import {Team} from "./Team.js";
import {rgbToRgba} from "../Utils/Utils.js";

export class EndScreen {

    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.Winner = null;
    }

    //rgb to rgba

    setWinner(winner) {
        this.Winner = winner;
    }
    draw() {
        this.ctx.fillStyle = rgbToRgba(this.Winner.color, 0.5);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = document.getElementById('gameCanvas').style.fontFamily = '40px take_looksregular';
        this.ctx.fillText("The winner is: " + this.Winner.name, this.canvas.width/3,  this.canvas.height/2);
    }

}