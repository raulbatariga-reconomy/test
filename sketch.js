let objects = [];
let score = 0;
let objectTimer = 0;
let objectInterval = 60;
let playerSpeed = 4;

let playerX = 0;
let playerY = 0;

let worldWidth = 6000;
let worldHeight = 4000;

let playerSize = 40;
let minPlayerSize = 20;
let maxPlayerSize = 200;
let growing = true;

var bg;

function preload(){
    bg = loadImage("https://raw.githubusercontent.com/raulbatariga-reconomy/test/refs/heads/main/wallpaper.jpg"); 
}

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 20; i++) {
    objects.push(new Catchable(random(-worldWidth / 2, worldWidth / 2), random(-worldHeight / 2, worldHeight / 2)));
  }
}

function draw() {
  background(bg);

  let dx = 0;
  let dy = 0;

  if (keyIsDown(LEFT_ARROW)) dx = -playerSpeed;
  if (keyIsDown(RIGHT_ARROW)) dx = playerSpeed;
  if (keyIsDown(UP_ARROW)) dy = -playerSpeed;
  if (keyIsDown(DOWN_ARROW)) dy = playerSpeed;

  // Update world position
  playerX += dx;
  playerY += dy;

  // Update objects' screen positions
  for (let obj of objects) {
    obj.screenX = obj.x - playerX + width / 2;
    obj.screenY = obj.y - playerY + height / 2;
  }

  // Spawn new objects
  if (frameCount - objectTimer > objectInterval) {
    objects.push(new Catchable(
      playerX + random(-width, width),
      playerY + random(-height, height)
    ));
    objectTimer = frameCount;
  }

  for (let i = objects.length - 1; i >= 0; i--) {
    let obj = objects[i];
    obj.display();

    let d = dist(obj.screenX, obj.screenY, width / 2, height / 2);
    if (d < obj.r + playerSize / 2) {
      score++;
      objects.splice(i, 1);

      // Handle pulsing size
      if (growing) {
        playerSize += 4;
        if (playerSize >= maxPlayerSize) {
          playerSize = maxPlayerSize;
          growing = false;
        }
      } else {
        playerSize -= 4;
        if (playerSize <= minPlayerSize) {
          playerSize = minPlayerSize;
          growing = true;
        }
      }
    }
  }

  // Draw player
  drawPlayer();

  // Draw score
  fill(255);
  textSize(18);
  text("Score: " + score, 10, 10);

  // Draw minimap
  drawMiniMap();
}

function drawPlayer() {
  textAlign(CENTER, CENTER);
  textSize(playerSize);
  text('🚗', width / 2, height / 2);
}

// function drawPlayer() {
//   fill(255, 80, 80);
//   noStroke();
//   ellipse(width / 2, height / 2, playerSize);
// }

// function drawPlayer() {
//   let x = width / 2;
//   let y = height / 2;
//   let w = playerSize;
//   let h = playerSize * 0.6;

//   // Car body
//   fill(200, 50, 50);
//   rectMode(CENTER);
//   rect(x, y, w, h, 5);

//   // Roof
//   fill(255);
//   rect(x, y - h / 4, w * 0.6, h / 2, 3);

//   // Wheels
//   fill(30);
//   ellipse(x - w * 0.35, y + h / 2, h / 3, h / 4);
//   ellipse(x + w * 0.35, y + h / 2, h / 3, h / 4);
// }

function drawMiniMap() {
  let mapW = width / 5;
  let mapH = height / 5;
  let mapX = width - mapW - 10;
  let mapY = 10;
  let mapScaleX = mapW / worldWidth;
  let mapScaleY = mapH / worldHeight;

  // Map background
  fill(50);
  stroke(200);
  rect(mapX, mapY, mapW, mapH);

  // Player dot (red)
  let px = mapX + (playerX + worldWidth / 2) * mapScaleX;
  let py = mapY + (playerY + worldHeight / 2) * mapScaleY;
  fill(255, 0, 0);
  noStroke();
  ellipse(px, py, 4);

  // Food dots (blue)
  for (let obj of objects) {
    let ox = mapX + (obj.x + worldWidth / 2) * mapScaleX;
    let oy = mapY + (obj.y + worldHeight / 2) * mapScaleY;
    fill(80, 150, 255);
    ellipse(ox, oy, 3);
  }
}

// ---------------- Object class ----------------



// class Catchable {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.r = random(10, 20);
//     this.color = color(random(255), random(255), random(255));
//   }

//   display() {
//     fill(this.color);
//     noStroke();
//     ellipse(this.screenX, this.screenY, this.r * 2);
//   }
// }



// class Catchable {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.r = random(10, 25); // Vary scoop size
//     this.color = color(random(180, 255), random(100, 200),               random(180, 255)); // Pastel
//   }
  
//   display() {
//     fill(this.color);
//     noStroke();
//     ellipse(this.screenX, this.screenY, this.r * 2);
//   } 
// }



// class Catchable {
//    constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.r = random(10, 20);
//     this.color = color(random(255), random(255), random(255));
//   }
  
//    display() {
//     textSize(this.r * 2);
//     textAlign(CENTER, CENTER);
//     text('🍦', this.screenX, this.screenY);
//   }
// }


class Catchable {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(10, 25); // Vary scoop size
    this.charList = [
      '🍦', '🍕', '🍩', '🍪', '🍉', '🍓', '🍊', '🍇', '🍒', '🍍', // Fruit & food emojis
      '🦄', '🐱', '🐶', '🐍', '🦁', '⚡', '🌟', '💎', '🍔', '🍟' // Animals, stars, and other fun ones
    ];
    this.foodChar = random(this.charList); // Pick a random character
  }

  display() {
    textSize(this.r * 2);
    textAlign(CENTER, CENTER);
    text(this.foodChar, this.screenX, this.screenY);
  }
}
