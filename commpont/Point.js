var Point = function (args) {
  this.initSelfPos = args['self']['pos'];
  this.selfPos = args['self']['pos'];
  this.selfOrigin = { x: 0, y: 0 };//由3d坐标投影而来
  this.parentPos = args['parent']['pos'];
  this.screenOrigin = args['parent']['origin'];
  this.color = args['color'];
  this.size = args['size'];
  this.r = args['size']
  this.visibility = args['visibility'];
  this.angle = args['rotate'];
  // console.log(this)
}
Point.prototype = {
  rotateX: function () {
    var cosx = Math.cos(this.angle),
      sinx = Math.sin(this.angle),
      y1 = this.selfPos.y * cosx + this.selfPos.z * sinx,
      z1 = this.selfPos.z * cosx - this.selfPos.y * sinx;

    this.selfPos.y = y1;
    this.selfPos.z = z1;
  },
  rotateZ: function () {
    var cosz = Math.cos(this.angle),
      sinz = Math.sin(this.angle),
      y1 = this.selfPos.y * cosz + this.selfPos.x * sinz,
      x1 = this.selfPos.x * cosz - this.selfPos.y * sinz;

    this.selfPos.x = x1;
    this.selfPos.y = y1;
  },
  rotateY: function () {
    var cosy = Math.cos(this.angle),
      siny = Math.sin(this.angle),
      x1 = this.selfPos.x * cosy + this.selfPos.z * siny,
      z1 = this.selfPos.z * cosy - this.selfPos.x * siny;

    this.selfPos.x = x1;
    this.selfPos.z = z1;
  },
  projection: function () {
    if (this.selfPos.z > -this.visibility) {
      var scale = this.visibility / (this.visibility + this.selfPos.z + this.parentPos.z);
      // console.log(scale)
      this.selfOrigin.x = scale * (this.selfPos.x + this.parentPos.x) + this.screenOrigin.x;
      this.selfOrigin.y = scale * (this.selfPos.y + this.parentPos.y) + this.screenOrigin.y;
      this.size = this.r * scale;
    }
  },
  draw: function (ctx) {
    // this.rotateX();
    // this.rotateZ();
    // console.log('画')
    ctx.beginPath();
    // console.log(thisX
    ctx.arc(this.selfOrigin.x, this.selfOrigin.y, this.size, 0, Math.PI * 2, false);  //canvas中绘制圆会比绘制方块消耗更多性能
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },
  update: function () {
    this.rotateX();
    this.rotateY();
    this.rotateZ();
    this.projection();
  }
}