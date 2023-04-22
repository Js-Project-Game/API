import {Player} from "./Players.js";

export class Flag {

    constructor(players) {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.CollideRadius = 50;
        this.players = players;
        this.color = "#FFFFFF";
        this.noTeam = true;
    }

    setNoTeam(value) {
        this.noTeam = value;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        this.ctx.fillStyle = "#696969";
        this.ctx.fillRect(this.x, this.y + 100, 40, 20);
        this.ctx.fillStyle = "#D3D3D3";
        this.ctx.fillRect(this.x + 15, this.y - 100, 10, 200);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x + 25, this.y - 100, 100, 100);
    }

    update() {
        if (this.noTeam === true) {
            this.color = "#FFFFFF";
            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
        } else {
            for (let i = 0; i < this.players.length; i++) {

                if (this.players[i].team.hasFlag === true) {
                    this.x = this.players[i].x;
                    this.y = this.players[i].y;
                    this.color = this.players[i].team.color;
                }
            }
        }

    }
}