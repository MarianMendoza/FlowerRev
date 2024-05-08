// This game is slightly rigged as there is no winning. Meant to be time-based but couldn't solve the needed while loop.

let canvas;
let context;

let fpsInterval = 1000/30;
let now;
let then = Date.now()

let flowers = [];
let floor;
let score = 0;

let request_id;

// Got this from here, https://www.w3schools.com/jsref/dom_obj_audio.asp except inserting it into my html i put it in my js, just playing around.

var Shoot = new Audio("./static/shoot.mp3");


let player = {
    x : 0,
    y : 0,
    xChange: 0,
    yChange: 0,
    size: 64,
    frameX: 0,
    frameY: 0
}

let bullet = {
    x:0,
    y: 0,
    xChange: 0,
    yChange: 0,
    size: 10
}



let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;
let Space = false;

// Tile set from here https://cypor.itch.io/12x12-rpg-tileset, only used the grass.
let background = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
    [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
    [19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
    [43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,43,44,44,44],
    [29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29],
    [89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89],
    [89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89],
    [89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89,89],
]

let tilesPerRow = 7;
let tileSize = 36;

// I drew my own sprites, and the enemies hence, file size.
let IMAGES = {player: "./static/sprite1.png",player1: "./static/sprite2.png", playerdie: "./static/spritedie.png",flowers: "./static/flower.png",flowersdie:"./static/flowerdead.png", background: "./static/tiles.png"};
document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    floor = canvas.height - 50;
    player.x = canvas.width/2;
    player.y = floor - player.size;
    bullet.x = canvas.width/2 + player.size/2 + bullet.size/2;
    bullet.y = floor - bullet.size - player.size/2 + bullet.size/2;
    
    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);

    load_images(draw);
}



function draw() {
    window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval){
        return;
    }
    then = now - (elapsed % fpsInterval);
        if (flowers.length < 3) {
            let f = {
                x: randint(0, canvas.width),
                y: -10,
                frameX:0,
                frameY:0,
                size: 50,
                xChange: 0,
                yChange: randint(10,1)
            }; 
            flowers.push(f);
        }
        if (score > 50 ){
            if (flowers.length < 5){
                let f = {
                    x: randint(0, canvas.width),
                    y: -10,
                    frameX:0,
                    frameY:0,
                    size: 50,
                    xChange: 0,
                    yChange: randint(10,1)
                }; 
                flowers.push(f);
            }
        }

        if (score > 100){
            if (flowers.length < 7){
                let f = {
                    x: randint(0, canvas.width),
                    y: -10,
                    frameX:0,
                    frameY:0,
                    size: 50,
                    xChange: 0,
                    yChange: randint(10,1)
                }; 
                flowers.push(f);
            }
            // LEVELLING SYSTEM.
        }
        if (score > 150){
            if (flowers.length < 10){
                let f = {
                    x: randint(0, canvas.width),
                    y: -10,
                    frameX:0,
                    frameY:0,
                    size: 50,
                    xChange: 0,
                    yChange: randint(10,1)
                }; 
                flowers.push(f);
            }
        }
                if (score > 200){
            if (flowers.length < 20){
                let f = {
                    x: randint(0, canvas.width),
                    y: -10,
                    frameX:0,
                    frameY:0,
                    size: 50,
                    xChange: 0,
                    yChange: randint(10,1)
                }; 
                flowers.push(f);
            }
            if (score > 500){
                if (flowers.length < 30){
                    let f = {
                        x: randint(0, canvas.width),
                        y: -10,
                        frameX:0,
                        frameY:0,
                        size: 50,
                        xChange: 0,
                        yChange: randint(10,1)
                    }; 
                    flowers.push(f);
                }
            }
        }
    
    
    context.clearRect(0,0, canvas.width, canvas.height);
    
//   Background
    context.fillRect(0,0, canvas.width,canvas.height);
    context.fillRect(0,0, canvas.width, canvas.height);
    for (let r = 0; r < 20; r +=1){
        for(let c = 0; c < 32; c += 1){
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile/tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(IMAGES.background, tileCol * tileSize, tileRow * tileSize, tileSize, tileSize, c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }

    }

    for (let f of flowers) {
    context.drawImage(IMAGES.flowers,f.frameX,f.frameY, f.size,f.size,f.x,f.y, f.size, f.size);
    }

    // Bullet 
    context.fillStyle = "yellow";
    context.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);


    // Player
// Made player change images.
    context.drawImage(IMAGES.player, player.frameX, player.frameY, player.size, player.size, player.x, player.y, player.size, player.size);
    if (score >= 100){

    context.drawImage(IMAGES.player1, player.frameX, player.frameY, player.size, player.size, player.x, player.y, player.size, player.size);
    }


    for (let f of flowers) {
        if (player_collides(f)) {
        context.drawImage(IMAGES.playerdie, player.frameX, player.frameY, player.size, player.size, player.x, player.y, player.size, player.size); 
        stop("You Got Caught!");
            return;
        }

// Enemy collision
        if (bullet_collides(f)){
            Shoot.play();
            context.drawImage(IMAGES.flowersdie, f.frameX, f.frameY, f.size, f.size, f.x, f.y, f.size, f.size);
            // Increase out score.
            score = score + 5;
            // Didn't use flask so instead used this method.
            scoreUpdate.innerHTML = score
            flowers.splice(f, 1);
        };



}

    for (let f of flowers) {
        if (f.y + f.size > 650) {
            f.y = -10;
            f.x = randint(0, canvas.width)

        }
        else {
        f.x = f.x + f.xChange * 1.4;
        f.y = f.y + f.yChange * 1;
        }

        if (f.x > player.x){
            f.x = f.x - 5;
        } else if (f.x < player.x) {
            f.x = f.x + 5;
        } 

        if (f.y > player.y){
            f.y = f.y -1.4;
        } else if (f.y < player.y){
            f.y = f.y + 1.4;
        }


    }


    if (moveRight) {
        player.xChange = 15;
        bullet.xChange = 15;
    }

    if (moveLeft) {
        player.xChange = -15;
        bullet.xChange = -15;

    }

    if (moveUp) {
        player.yChange = -15;
        bullet.yChange = -15;

    }

    if (moveDown) {
        player.yChange = 15;
        bullet.yChange = 15;
    }

    if (Space) {
        bullet.yChange = -90;
        bullet.x = player.x + player.size/2 - bullet.size/2; 
        } else if (Space === false){
        bullet.x = player.x + player.size/2 - bullet.size/2;
        bullet.y = player.y + player.size/2 - bullet.size/2;
    }
        
        // Making speed slower
    player.xChange = player.xChange * 0.7;
    player.yChange = player.yChange * 0.7;

    bullet.xChange = bullet.xChange * 0.7;
    bullet.yChange = bullet.yChange * 0.7;

    player.x = player.xChange + player.x;
    player.y = player.yChange + player.y;
    bullet.x = bullet.xChange + bullet.x;
    bullet.y = bullet.yChange + bullet.y;

    
    
    if (bullet.y <= 0){
        bullet.y = player.y + player.size/2 - bullet.size/2;
        bullet.x = player.x + player.size/2 - bullet.size/2;
    }

    // canvas restrictions.
    if (player.x <= 1){
        player.x = 0
    } else if (player.x >= 1004){
        player.x = 1004
    }

    if (player.y <= 400){
        player.y = 400
    } else if ( player.y >= 585){
        player.y = 585
    }

    if(bullet.y + 1 === player.y + 1){
        console.log("go")
    }


}

function randint(min,max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function activate(event) {
    let key = event.key;
    if (key === "a" ){
        moveLeft =true;
    } else if (key === "w") {
        moveUp = true;
    }  else if (key === "d") {
        moveRight = true;
    }  else if (key === "s") {
        moveDown = true;
        // Space
    } else if (event.code === "Space"){
        Space = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "a"){
        moveLeft = false;
    } else if (key === "w") {
        moveUp = false;
    }  else if (key === "d") {
        moveRight = false;
    }  else if (key === "s") {
        moveDown = false;
    } else if (event.code === "Space") {
        Space = false;
    }
}

function player_collides(f) {
    if (player.x + player.size < f.x ||
        f.x + f.size < player.x ||
        player.y > f.y + f.size ||
        f.y > player.y + player.size) {
            return false;
        } else {
            return true;
        }
}

function bullet_collides(f){
    if (bullet.x + bullet.size < f.x ||
        f.x + f.size < bullet.x ||
        bullet.y > f.y + f.size ||
        f.y > bullet.y + bullet.size) {
            return false;
        } else {
            return true;    
        }
}



function stop(message) {
    window.cancelAnimationFrame(request_id);
    window.removeEventListener("keydown",activate, false)
    window.removeEventListener("keyup",deactivate, false)

    let outcome_element = document.querySelector("#outcome");
    outcome_element.innerHTML = message;

}

function load_images(callback) {
    let num_images = Object.keys(IMAGES).length;
    let loaded = function() {
        num_images = num_images - 1;
        if (num_images === 0) {
            callback();
        }
    };
    for (let name of Object.keys(IMAGES)) {
        let img = new Image();
        img.addEventListener("load", loaded, false);
        img.src = IMAGES[name];
        IMAGES[name] = img;
    }
}
