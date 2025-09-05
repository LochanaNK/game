class Sprite {
  constructor({ position, size, imageSrc, scale = 1 }) {
    this.position = position;
    this.size = size;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
  }
  draw() {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width * this.scale,
      this.image.height * this.scale
    );
  }
  update() {
    this.draw();
  }
}
class Fighter {
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
    this.isAttacking;
    this.canAttack = true;
    this.lastkey;
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

    if (
      this.position.y + this.size.height + this.velocity.y >=
      canvas.height - 96
    ) {
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
