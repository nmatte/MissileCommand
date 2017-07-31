const SPEED = 10;

class Projectile {
  /**
   * 
   * @param  {[{x: number, y: number}]} origin
   * @param  {[x: number, y: number]} dest
   * @param  {[callback () => Projectile]}
   * @return {[this]}
   */
  constructor(origin, dest, onFinish) {
    this.SPEED = SPEED;
    this.origin = origin;
    this.pos = {
      x: origin.x,
      y: origin.y
    };
    this.dest = dest;
    this.angle = this.getAngle(origin, dest);
    this.isExploding = false;
    this.explodeProgress = 0.0;
    this.onFinish = onFinish;
  }

  step() {
    throw 'Projectile step()';
  }

  getAngle(origin, dest) {
    return Math.atan2(origin.y - dest.y, origin.x - dest.x);
  }

  draw(ctx) {
    throw 'Projectile draw()';
  }

  atDest() {
    throw 'Projectile atDest()';
  }

  explode() {
    this.isExploding = true;
  }

  angToCartesian(angle, magnitude) {
    return {
      x: magnitude * Math.cos(angle),
      y: magnitude * Math.sin(angle)
    };
  }

  finish() {
    this.onFinish(this);
  }
}

module.exports = Projectile;
