const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gravity = 0.7;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Sprite {
  constructor({ position, velocity, size, color = "red" }) {
    this.position = position;
    this.velocity = velocity;
    this.attackBox = {
        position:position,
        width: 100,
        height: 50
    };
    this.lastkey;
    this.canJump = true;
    this.size = size;
    this.color = color;
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
    ctx.fillStyle = "green";
    ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
    )
  }
  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.size.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

//Sprites
const player = new Sprite({
  position: { x: 100, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { width: 50, height: 150 },
  color: "blue",
});
const enemy = new Sprite({
  position: { x: 700, y: 0 },
  velocity: { x: 0, y: 10 },
  size: { width: 50, height: 150 },
  color: "red",
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
        if(player.canJump){
            player.velocity.y = -15;
            player.canJump = false;
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
        if(enemy.canJump){
            enemy.velocity.y = -15;
            enemy.canJump = false;
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

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      enemy.canJump = true;
      break;
  }
});

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
  

}
animate();
