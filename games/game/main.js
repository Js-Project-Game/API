import {Player} from "./Class/Players.js";
import {Xp} from "./Class/Xp.js";
import {Team} from "./Class/Team.js";
import {Flag} from "./Class/Flag.js";
import {EndScreen} from "./Class/EndScreen.js";
import {GetTime, time} from "./Utils/Utils.js";

//canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


ctx.font = '50px Georgia';

//mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

let score = {
    red: 0,
    blue: 0
}


canvas.width = 1920;
canvas.height = 1080;


let gameFrame = 0;
const xpArray = [];

const spawnPoint = {
    red: {
        x: 100,
        y: canvas.height / 2
    },
    blue: {
        x: canvas.width - 100,
        y: canvas.height / 2
    },
    default: {
        x: canvas.width / 2,
        y: canvas.height / 2
    }
}


canvas.addEventListener('mousedown', function (event) {
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function () {
    mouse.click = false;
});

//player

const TeamRed = new Team("red", "#cc6565", spawnPoint.red);
const TeamBlue = new Team("blue", "#6565cc", spawnPoint.blue);

const players = [];
const IA_mouses = [];

for (let i = 0; i < 9; i++) {
    const AI_mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        click: false
    }
    IA_mouses.push(AI_mouse);
}

// for (let i = 0; i < 9; i++) {
//     if (i < 5) {
//         players.push(new Player(IA_mouses[i], TeamRed));
//     } else {
//         players.push(new Player(IA_mouses[i], TeamBlue));
//     }
// }

const player1 = new Player(mouse, TeamRed);
players.push(player1);
const player2 = new Player(IA_mouses[0], TeamBlue);
players.push(player2);

const flag = new Flag(players);

//Fonction des déplacements de l'IA:
function IA_movement(IA_mouse, player) {

    //Event de déplacement de la souris virtuelle de l'IA
    function IA_mouse_move(x, y) {
        IA_mouse.x = x;
        IA_mouse.y = y;
    }

    //Fonction qui retourne l'XP' le plus proche:
    function IA_closestXp() {
        let closestXp = xpArray[0];
        for (let i = 0; i < xpArray.length; i++) {
            if (Math.sqrt(Math.pow(xpArray[i].x - player.x, 2) + Math.pow(xpArray[i].y - player.y, 2)) < Math.sqrt(Math.pow(closestXp.x - player.x, 2) + Math.pow(closestXp.y - player.y, 2))) {
                closestXp = xpArray[i];
            }
        }
        return closestXp;
    }

    //Fonction qui retourne les joueurs de lequipe adverse avec un score plus petit que l'IA:
    function IA_playersWithLowerScore() {
        let playersWithLowerScore = [];
        for (let i = 0; i < players.length; i++) {
            if (players[i].team !== player.team && players[i].score < player.score) {
                playersWithLowerScore.push(players[i]);
            }
        }
        return playersWithLowerScore;
    }

    //Fonction qui retourne le joueur le plus proche:
    function IA_closestPlayer() {
        let playersWithLowerScore = IA_playersWithLowerScore();
        let closestPlayer = playersWithLowerScore[0];
        for (let i = 0; i < playersWithLowerScore.length; i++) {
            if (Math.sqrt(Math.pow(playersWithLowerScore[i].x - player.x, 2) + Math.pow(playersWithLowerScore[i].y - player.y, 2)) < Math.sqrt(Math.pow(closestPlayer.x - player.x, 2) + Math.pow(closestPlayer.y - player.y, 2))) {
                closestPlayer = playersWithLowerScore[i];
            }
        }
        return closestPlayer;
    }

    //Fonction qui retourne le joueur qui a le flag:
    function IA_PlayerWithFlag() {
        let playerWithFlag = players[0];
        for (let i = 0; i < players.length; i++) {
            if (players[i].asFlag === true) {
                playerWithFlag = players[i];
            }
        }
        return playerWithFlag;
    }

    //Si le flag n'a pas d'équipe, il va vers le flag:
    if (flag.noTeam === true) {
        IA_mouse_move(flag.x, flag.y);
    } else if (player.asFlag === true) {
        //si l'IA a le flag, il va vers l'XP le plus proche
        if (xpArray.length === 0) {
            IA_mouse_move(player.team.spawnPoint.x, player.team.spawnPoint.y);
        } else {
            let closestXp = IA_closestXp();
            IA_mouse_move(closestXp.x, closestXp.y);
        }
    } else {
        //si l'IA n'a pas le flag, et que le joueur qui a le flag a un score plus petit ou égal a l'IA, il va vers le joueur qui a le flag
        let playerWithFlag = IA_PlayerWithFlag();
        if (player.team === playerWithFlag.team) {
            let closestPlayer = IA_closestPlayer();
            if (closestPlayer === undefined) {
                if (xpArray.length === 0) {
                    IA_mouse_move(player.team.spawnPoint.x, player.team.spawnPoint.y);
                } else {
                    let closestXp = IA_closestXp();
                    IA_mouse_move(closestXp.x, closestXp.y);
                }
            } else {
                IA_mouse_move(closestPlayer.x, closestPlayer.y);
            }
        } else {
            if (player.score > playerWithFlag.score) {
                IA_mouse_move(playerWithFlag.x, playerWithFlag.y);
            } else {
                if (xpArray.length === 0) {
                    IA_mouse_move(player.team.spawnPoint.x, player.team.spawnPoint.y);
                } else {
                    let closestXp = IA_closestXp();
                    IA_mouse_move(closestXp.x, closestXp.y);
                }
            }
        }

    }
}

//Fontion qui gère les Xp:
function handleXP() {
    if (gameFrame % 20 === 0 && xpArray.length < 20) { //ajoute un Xp toutes les 20 frames
        xpArray.push(new Xp(canvas)); //ajoute un Xp toutes les 100 frames
        console.log("new xp");
    }

    //boucle pour chaque Xp:
    if (xpArray.length > 0) {
        for (let i = 0; i < xpArray.length; i++) {
            if (xpArray[i].life < 0) {
                xpArray.splice(i, 1); //supprime l'Xp si sa vie est inférieur à 0
                console.log("xp deleted, cause: life < 0");
            } else if (xpArray[i].x > canvas.width + 10 || xpArray[i].x < -10 || xpArray[i].y > canvas.height + 10 || xpArray[i].y < -10) { //supprime l'Xp si il est hors de l'écran
                xpArray.splice(i, 1);
                console.log("xp deleted, cause: out of screen");
            } else {
                if (xpArray.length > 0) {
                    let temp = false; //variable temporaire pour savoir si l'Xp est pris
                    //boucle pour chaque joueur:
                    for (let j = 0; j < players.length; j++) {
                        //si le joueur est dans la zone de l'Xp:
                        if (temp === false) {
                            if (xpArray[i].x < players[j].x + players[j].radius + 10 && xpArray[i].x > players[j].x - players[j].radius && xpArray[i].y < players[j].y + players[j].radius + 10 && xpArray[i].y > players[j].y - players[j].radius) {
                                xpArray.splice(i, 1); //supprime l'Xp si il est pris
                                console.log("xp deleted, cause: taken");
                                players[j].score += 1; //ajoute 1 au score du joueur
                                temp = true;
                                if (xpArray.length === 0) {
                                    return;
                                }
                            }
                        }

                    }
                    if (temp === false) { //si l'Xp n'est pas pris
                        xpArray[i].update(); //met à jour l'Xp
                        xpArray[i].draw(); //dessine l'Xp
                    }
                }
            }
        }
    }

}

//Fonction qui gère les combats:
function Combat() {

    //boucle qui teste chaque joueur avec chaque joueur:
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players.length; j++) {
            if (i !== j) {

                //si les joueurs ne sont pas de la même équipe:
                if (players[i].team !== players[j].team) {

                    //si les joueurs sont dans la même zone:
                    if (players[i].x < players[j].x + players[j].radius && players[i].x > players[j].x - players[j].radius && players[i].y < players[j].y + players[j].radius && players[i].y > players[j].y - players[j].radius) {

                        if (players[i].score > players[j].score) { //si le joueur 1 a un meilleur score que le joueur 2:

                            //supprime le score et le flag du joueur 2, le fait respawn, donne le flag au joueur 1, et enlève le score du joueur 2 au joueur 1.
                            players[j].team.hasFlag = false;
                            players[i].team.hasFlag = true;
                            players[i].score -= players[j].score;
                            players[j].score = 0;
                            players[j].setPos(players[j].team.spawnPoint.x, players[j].team.spawnPoint.y);
                            players[i].setPos(players[i].team.spawnPoint.x, players[i].team.spawnPoint.y);


                            // console.log("player 1 has the flag");
                        } else if (players[j].score > players[i].score) { //si le joueur 2 a un meilleur score que le joueur 1:

                            //supprime le score et le flag du joueur 1, le fait respawn, donne le flag au joueur 2, et enlève le score du joueur 1 au joueur 2.
                            players[i].team.hasFlag = false;
                            players[j].team.hasFlag = true;
                            players[j].score -= players[i].score;
                            players[i].score = 0;
                            players[i].setPos(players[i].team.spawnPoint.x, players[i].team.spawnPoint.y);
                            players[j].setPos(players[j].team.spawnPoint.x, players[j].team.spawnPoint.y);

                            // console.log("player 2 has the flag");

                        } else { //si les joueurs ont le même score:

                            //reset le flag.
                            players[i].setPos(players[i].team.spawnPoint.x, players[i].team.spawnPoint.y);
                            players[j].setPos(players[j].team.spawnPoint.x, players[j].team.spawnPoint.y);
                            players[i].team.hasFlag = false;
                            players[j].team.hasFlag = false;
                            flag.setNoTeam(true)
                            flag.setPos(canvas.width / 2, canvas.height / 2);
                            // console.log("no one has the flag");
                        }
                    }
                }
            }
        }
    }
}

//Fonction qui gère le score des teams:
function TeamScore() {
    if (TeamBlue.hasFlag === true) {
        score.blue += 1;
    } else if (TeamRed.hasFlag === true) {
        score.red += 1;
    }

    if (score.blue > score.red) {
        ctx.fillStyle = TeamBlue.color;
        ctx.fillRect(canvas.width - 50, 40, (score.blue * (canvas.width - 100) / (score.blue + score.red)) * -1, 70); //blue
        ctx.fillStyle = TeamRed.color;
        ctx.fillRect(50, 50, (score.red * (canvas.width - 100) / (score.blue + score.red)), 50); //red
    } else if (score.blue < score.red) {
        ctx.fillStyle = TeamBlue.color;
        ctx.fillRect(canvas.width - 50, 50, (score.blue * (canvas.width - 100) / (score.blue + score.red)) * -1, 50); //blue
        ctx.fillStyle = TeamRed.color;
        ctx.fillRect(50, 40, (score.red * (canvas.width - 100) / (score.blue + score.red)), 70); //red
    }


    ctx.fillStyle = "black";
    ctx.fillText(score.red, 100, 85);
    ctx.fillStyle = "black";
    ctx.fillText(score.blue, canvas.width - 150, 85);

    //print Time
    ctx.fillStyle = "black";
    ctx.fillText((time.Minutes + ":" + time.Seconds + "." + time.Milliseconds), canvas.width / 2, 85);
}

//Fonction qui gère le flag:
function handleFlag() {
    for (let i = 0; i < players.length; i++) {
        if (flag.noTeam === true) {
            if (players[i].x < flag.x + flag.CollideRadius && players[i].x > flag.x - flag.CollideRadius && players[i].y < flag.y + flag.CollideRadius && players[i].y > flag.y - flag.CollideRadius) {
                players[i].asFlag = true;
                flag.setNoTeam(false);
            }
        }

    }
    flag.update();
    flag.draw();
}

//Fonction qui gère les joueurs:
function handlePlayer() {
    for (let i = 0; i < players.length; i++) {
        players[i].update();
        players[i].draw();
    }
}

const endScreen = new EndScreen();

//Animation Loop
function animate() {
    GetTime();

    if (time.Minutes < 1) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        gameFrame++;
        // console.log(gameFrame);

        for (let i = 0; i < players.length; i++) {
            IA_movement(IA_mouses[i], players[i]);
        }

        handleXP();
        // console.log(xpArray.length);

        Combat();

        handleFlag();

        handlePlayer();

        TeamScore();

    } else if (time.Minutes >= 1) {
        //light gray
        let Winner = new Team("No one", "rgb(100, 100, 100)", spawnPoint.default);
        if (score.blue < score.red) {
            Winner = TeamRed;
        } else if (score.blue > score.red) {
            Winner = TeamBlue;
        }
        endScreen.setWinner(Winner);
        endScreen.draw();
    }


    requestAnimationFrame(animate);
}

animate();
