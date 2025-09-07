const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gravity = 0.7;

canvas.width = 1024;
canvas.height = 576;

const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  size:{
    width:canvas.width,
    height:canvas.height
  },
  imageSrc:"./assets/background.png"
})
const shop = new Sprite({
  position:{
    x:600,
    y:128
  },
  size:{
    width:canvas.width,
    height:canvas.height
  },
  imageSrc:"./assets/shop.png",
  scale:2.75,
  framesMax:6
})

//Sprites
const player = new Fighter({
  position: { x: 100, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { width: 50, height: 150 },
  color: "blue",
  offset: { x: 0, y: 0 },
  imageSrc:"./assets/samuraiMack/Idle.png",
  framesMax:8,
  scale:2.5,
  offset:{x:215,y:157},
  sprites:{
    idle:{
      imageSrc:"./assets/samuraiMack/Idle.png",
      framesMax:8
    },
    run:{
      imageSrc:"./assets/samuraiMack/Run.png",
      framesMax:8,
    },
    jump:{
      imageSrc:"./assets/samuraiMack/Jump.png",
      framesMax:2
    },
    fall:{
      imageSrc:"./assets/samuraiMack/Fall.png",
      framesMax:2 
    },
    attack1:{
      imageSrc:"./assets/samuraiMack/Attack1.png",
      framesMax:8
    },
    takeHit:{
      imageSrc:"./assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax:3
    },
    death:{
      imageSrc:"./assets/samuraiMack/Death.png",
      framesMax:7
    }
  }
});
const enemy = new Fighter({
  position: { x: 700, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { width: 50, height: 150 },
  color: "red",
  offset: { x: -100, y: 0 },
  imageSrc:"./assets/kenji/Idle.png",
  framesMax:4
});

//control keys
const keys = {
  a: { pressed: false },
  d: { pressed: false },

  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

//controls
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (player.canJump) {
        player.velocity.y = -15;
        player.canJump = false;
      }
      break;
    case " ":
      if (player.canAttack) {
        player.attack();
        player.isAttacking = true;
        player.canAttack = false;
      }
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (enemy.canJump) {
        enemy.velocity.y = -15;
        enemy.canJump = false;
      }
      break;
    case "Enter":
      if (enemy.canAttack) {
        enemy.attack();
        enemy.isAttacking = true;
        enemy.canAttack = false;
      }
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      player.canJump = true;
      break;
    case " ":
      player.canAttack = true;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      enemy.canJump = true;
      break;
    case "Enter":
      enemy.canAttack = true;
      break;
  }
});


decreaseTimer();
//animate
function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update(ctx);
  enemy.update(ctx);

  //player movement

  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite('run');
  }else{
      player.switchSprite("idle");
  }

  //jumping
  if(player.velocity.y<0){
    player.switchSprite('jump');
  }else if(player.velocity.y>0){
    player.switchSprite('fall');
  }

  //enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detect for collision
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    console.log("hit");
    player.isAttacking = false;
    enemy.health -= 5;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    console.log("E hit");
    enemy.isAttacking = false;
    player.health -= 5;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  if (enemy.health <= 0 || player.health <= 0) {
    winner({ player, enemy,timerID });
  }
}
animate();
