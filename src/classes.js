

// class Sprite {
//   constructor({ position, size }) {
//     this.position = position;
//     this.size = size;
//   }
//   draw() {
//   }
//   update() {
//     this.draw();
//   }
// }

// class Fighter {
//   constructor({ position, velocity, size, color = "red" }) {
//     this.position = position;
//     this.velocity = velocity;
//     this.attackBox = {
//         position:position,
//         width: 100,
//         height: 50
//     };
//     this.lastkey;
//     this.canJump = true;
//     this.size = size;
//     this.color = color;
//   }
//   draw() {
//     ctx.fillStyle = this.color;
//     ctx.fillRect(
//       this.position.x,
//       this.position.y,
//       this.size.width,
//       this.size.height
//     );

//     //attack box
//     ctx.fillStyle = "green";
//     ctx.fillRect(
//         this.attackBox.position.x,
//         this.attackBox.position.y,
//         this.attackBox.width,
//         this.attackBox.height
//     )
//   }
//   update() {
//     this.draw();

//     this.position.x += this.velocity.x;
//     this.position.y += this.velocity.y;

//     if (this.position.y + this.size.height + this.velocity.y >= canvas.height) {
//       this.velocity.y = 0;
//     } else {
//       this.velocity.y += gravity;
//     }
//   }
// }