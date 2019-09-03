var Sphere = function (args) {
  this.counts = args['counts'];
  this.points = [];//图像由点组成
  this.parentPos = args['parent']['pos'] ? args['parent']['pos'] : this.parentPos;
  this.screenOrigin = args['parent']['origin'] ? args['parent']['origin'] : this.screenOrigin;
  this.initSelfPos = args['pos'];//3d相对坐标初始值
  this.selfPos = args['pos'];//3d相对坐标
  this.r = args['r'] ? args['r'] : 20;
  this.size = this.r;
  this.color = args['color'] ? args['color'] : '#000';
  this.selfOrigin = {};//图像坐标2d绝对坐标w/2,h/2 由3d坐标投影而来
  this.option = args['option'];
  this.percent = parseFloat(args['percent']);
  this.visibility = args['visibility'];//可视范围
  this.loop = true;
  this.clientWidth = args['clientWidth'];
  this.clientHeight = args['clientHeight'];
  this.cvs = args['cvs'];
  this.ctx = this.cvs.getContext('2d')
  this.pointSize = args['pointSize']
  this.rotate = args['rotate']
  this.init();
};
Sphere.prototype = {
  update: function (args) {
    this.parentPos = args['parent']['pos'] ? args['parent']['pos'] : this.parentPos;
    this.screenOrigin = args['parent']['origin'] ? args['parent']['origin'] : this.screenOrigin;
    this.visibility = args['visibility']?args['visibility']:1000;
  },
  initShape: function () {
    this.projection();
    var point_arr = [];
    var latitudeCount = Math.abs(Math.floor(this.counts));
    var longitudeCount = Math.abs(Math.floor(this.counts));
    for (var i = 0; i <= latitudeCount; i++) {
      var latitude = Math.PI * (i / latitudeCount)
      for (var j = 0; j < longitudeCount; j++) {
        var longitude = Math.PI * 2 * (j / longitudeCount)
        var x = this.r * Math.sin(latitude) * Math.cos(longitude);
        var y = this.r * Math.sin(latitude) * Math.sin(longitude);
        var z = this.r * Math.cos(latitude);
        point_arr.push({ x: x, y: y, z: z });
      }
    }
    this.createVertex(point_arr);
  },
  createVertex: function (vertex) {
    var origin = this.screenOrigin;
    this.points = [];
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = Utils.randomColor();
    vertex.forEach(function (e, i) {
      var point = new Point({
        self: {
          pos: e,
        },
        parent: {
          pos: {
            x: this.selfPos.x + this.parentPos.x,
            y: this.selfPos.y + this.parentPos.y,
            z: this.selfPos.z + this.parentPos.z,
          },
          origin: origin,
        },
        color: Utils.randomColor(),
        size: this.pointSize,
        visibility: this.visibility,
        rotate: this.rotate,
      });
      this.points.push(point);
    }.bind(this));
  },
  pointSort: function () {
    this.points.sort(function (a, b) {
      return b.selfPos.z - a.selfPos.z;
    })
  },
  projection: function () {
    var scale = this.visibility / (this.visibility + (this.selfPos.z + this.parentPos.z));
    var prox = scale * (this.selfPos.x + this.parentPos.x) + this.screenOrigin.x;
    var proy = scale * (this.selfPos.y + this.parentPos.y) + this.screenOrigin.y;
    this.size = this.r * scale;
    this.selfOrigin.x = prox;
    this.selfOrigin.y = proy;
  },
  draw: function () {
    this.drawPoint();
    this.drawLine();
  },
  drawLine: function () {
    this.ctx.beginPath();
    var origin = this.screenOrigin;
    this.points.forEach(function (e, i) {
      e.update({
        parent: {
          pos: {
            x: this.selfPos.x + this.parentPos.x,
            y: this.selfPos.y + this.parentPos.y,
            z: this.selfPos.z + this.parentPos.z,
          },
          origin: origin,
        },
        rotate: this.rotate,
      });
      this.ctx.lineTo(e.selfOrigin.x, e.selfOrigin.y);
    }.bind(this));
    this.ctx.closePath();
    this.ctx.stroke();
  },
  drawPoint: function (args) {
    var that = this;
    var origin = this.screenOrigin;
    this.points.forEach(function (e, i) {
      e.update({
        parent: {
          pos: {
            x: this.selfPos.x + this.parentPos.x,
            y: this.selfPos.y + this.parentPos.y,
            z: this.selfPos.z + this.parentPos.z,
          },
          origin: origin,
        },
        rotate: this.rotate,
      });
      e.projection();
      e.draw(this.ctx);
    }.bind(this));
  },
  rotateY: function () {
    var that = this;
    this.points.forEach(function (e, i) {
      e.rotateY();
    })
  },
  rotateX: function () {
    var that = this;
    this.points.forEach(function (e, i) {
      e.rotateX();
    })
  },
  rotateZ: function () {
    var that = this;
    this.points.forEach(function (e, i) {
      e.rotateZ();
    })
  },
  render: function (args) {
    this.draw();
    // this.pointSort();
  },
  init: function () {
    var that = this;
    this.initShape();
    this.projection();
  }
}