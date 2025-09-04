const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gravity = 0.7;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Sprite {
  constructor({ position, velocity, size, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 150,
      height: 50,
    };
    this.lastkey;
    this.isAttacking;
    this.isBlocking;
    this.canAttack = true;
    this.canBlock = true;
    this.canJump = true;
    this.size = size;
    this.color = color;
    this.health = 100;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );

    //attack box
    if (this.isAttacking) {
      ctx.fillStyle = "green";
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.size.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

//Sprites
const player = new Sprite({
  position: { x: 100, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { width: 50, height: 150 },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
});
const enemy = new Sprite({
  position: { x: 700, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { width: 50, height: 150 },
  color: "red",
  offset: {
    x: -100,
    y: 0,
  },
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
        player.canAttack = false;
      }
      break;
    case "s":
      if (player.canBlock) {
        player.block();
        player.canBlock = false;
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
        enemy.canAttack = false;
      }
      break;
    case "ArrowDown":
      if (enemy.canBlock) {
        enemy.block();
        enemy.canBlock = false;
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
    case "s":
      player.canBlock = true;
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
    case "ArrowDown":
      enemy.canBlock = true;
      break;
  }
});

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.size.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <=
      rectangle2.position.y + rectangle2.size.height
  );
}

//determine winner
function winner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#result").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#result").innerHTML = "Draw";
  } else if (player.health > enemy.health) {
    document.querySelector("#result").innerHTML = "Player 1 Wins";
  } else if (enemy.health > player.health) {
    document.querySelector("#result").innerHTML = "Player 2 Wins";
  }
}

//timer
let timer = 60;
let timerId;
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    winner({ player, enemy });
  }
}

decreaseTimer();
//animate
function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update(ctx);
  enemy.update(ctx);

  //player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
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
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 5;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    console.log("Ehit");
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 5;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    console.log("Phit");
  }
  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    winner({ player, enemy, timerId });
  }
}
animate();
