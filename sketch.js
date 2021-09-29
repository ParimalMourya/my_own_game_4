const Engine = Matter.Engine;
const World = Matter.World;

var spaceCraft_img;
var background_img;
var alienShip_img;
var asteroid1_img, asteroid2_img;
var bullet_img, gun_img, repairTool_img, shield_img; 

var spaceCraft, shieldSprite;
var asteroidsGroup, bulletsGroup, shieldGroup;

var life = 200;
var fixedLife = 200;
var score = 0;
var count = 0;

var isGameOver = false;
var soundPlaying = false;
var shieldOn = false;

function preload() {
  //backgroundImg = loadImage("assets/Background.gif");
  backgroundImg = loadImage("assets/space_2.png");
  spaceCraft_img = loadImage("assets/SpaceCraft.png");
  alienShip_img = loadImage("assets/Alien_ship.png");
  asteroid1_img = loadImage("assets/Asteroid_1.png");
  asteroid2_img = loadImage("assets/Asteroid_2.png");
  bullet_img = loadImage("assets/Bullet.png");
  gun_img = loadImage("assets/Gun.png");
  repairTool_img = loadImage("assets/Repair_tool.png");
  shield_img = loadImage("assets/Shield.png");

  bgSound = loadSound("sounds/bgMusic.wav");
  blast1 = loadSound("sounds/blast1.ogg");
  blast2 = loadSound("sounds/blast2.wav");
  gameOverSound = loadSound("sounds/gameOver.wav");
  shootSound = loadSound("sounds/laser.wav");
  shieldSound = loadSound("sounds/shieldOn.wav");
}

function setup() {
  canvas = createCanvas(windowWidth,windowHeight);
  engine = Engine.create();
  world = engine.world;

  bg = createSprite(width/2, 0);
  bg.addImage(backgroundImg);
  bg.scale = 2;
  bg.y = height/20;
  bg.velocityY = (7 + 3*(score/200));

  bgSound.loop();

  spaceCraft = createSprite(600, 800, 20, 20);
  spaceCraft.addImage(spaceCraft_img);
  spaceCraft.scale = 0.25;

  shieldSprite = createSprite(spaceCraft.x, spaceCraft.y);
  shieldSprite.addImage(shield_img);
  shieldSprite.scale = 0.4;
  shieldSprite.visible = false;

  asteroidsGroup = new Group();
  bulletsGroup = new Group();
  shieldGroup = new Group();
}

function draw() {

  background(backgroundImg);

  if (bg.y-180>height){
    bg.y = height/20;
  }

  shieldSprite.depth = spaceCraft.depth;
  spaceCraft.depth += 1;

  if(keyIsDown(RIGHT_ARROW) && !isGameOver && spaceCraft.x<=width-200){
    spaceCraft.x += 15;
    shieldSprite.x += 15;
  }
  if(keyIsDown(LEFT_ARROW) && !isGameOver && spaceCraft.x>=200){
    spaceCraft.x -= 15;
    shieldSprite.x -= 15;
  }

  if (keyWentDown("space") && !isGameOver){
    shootSound.play();
    shootBullet();
  }

  if(bulletsGroup.isTouching(asteroidsGroup)){
    blast2.play();
    bulletsGroup.overlap(asteroidsGroup, function(collector, collected){
      collector.remove();
      collected.remove();
    });

    score += 10;
  }

  if(spaceCraft.isTouching(asteroidsGroup) && !shieldOn){
    spaceCraft.overlap(asteroidsGroup, function(collector, collected){
      collected.remove()
    });

    life -= fixedLife/5;
  }

  if(spaceCraft.isTouching(shieldGroup)){
    spaceCraft.overlap(shieldGroup, function(collector, collected){
      collected.remove()
    });

    shieldSprite.visible = true;
    shieldOn = true;
  }

  if(shieldSprite.isTouching(asteroidsGroup) && shieldOn){
    shieldSprite.overlap(asteroidsGroup, function(collector, collected){
      collected.remove()
    });

    shieldOn = false;
    shieldSprite.visible = false;
  }

  if(life === 0){
    if(!soundPlaying && !gameOverSound.isPlaying()){
      gameOverSound.play();
      soundPlaying = true;
    }
  isGameOver = true;
  gameOver();
  }


  if (!isGameOver){
    spawnObstacles();
    spawnShield();
  }
  drawSprites();
  displayScore();
  showLife();
  

}

function spawnObstacles(){
  if(frameCount%30 === 0){
    var asteroid = createSprite(random(200,width-200),20);

    var rand = Math.round(random(1,2));

    switch (rand){
      case 1:asteroid.addImage(asteroid1_img);
      asteroid.scale = 0.2;
      break;
      case 2:asteroid.addImage(asteroid2_img);
      asteroid.scale = 0.3;
      break;
  }

    asteroid.velocityY = (8 + 3*(score/200));
    asteroid.lifetime = 200;
    asteroidsGroup.add(asteroid);
    count += 1;
    console.log(count);
  }
  
  
}

function shootBullet(){
  var bullet = createSprite(spaceCraft.x, spaceCraft.y);
  bullet.addImage(bullet_img);
  bullet.scale = 0.05;
  bullet.velocityY = -10;
  bullet.lifetime = 100;
  bulletsGroup.add(bullet);
}

function showLife(){
  push();
    textSize(25);
    fill("yellow")
    text("HEALTH", 150, 75);
    fill("white");
    rect(120, 100, 200, 20);
    fill("red");
    rect(120, 100, life, 20);
    noStroke();

    pop();
}

function displayScore(){
  push();
  textSize(30);
  fill("yellow")
  text("SCORE : "+score, width-300, 75);
  pop();
}

function spawnShield(){
  if(frameCount%500 === 0){
    var shield = createSprite(random(200,width-200),20);
    shield.addImage(shield_img);
    shield.scale = 0.2;
    shield.velocityY = (8 + 3*(score/200));
    shield.lifetime = 200;
    shieldGroup.add(shield);
  }
}

function gameOver(){
  swal({
    title:`GAME OVER`,
    text:"You Score is "+score,
    imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize:"100x100",
    confirmButton:"Thanks for playing!!"
  },
  function(isConfirm) {
    if (isConfirm) {
      location.reload();
    }
  });

  bg.velocityY=0;
}

