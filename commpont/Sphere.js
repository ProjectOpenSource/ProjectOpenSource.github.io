var Sphere = function (args) {
  this.counts = args['counts'];
  this.points = [];//图像由点组成
  this.parentPos = args['parentPos'] ? args['parentPos'] : { x: 0, y: 0, z: 0 };
  this.initSelfPos = args['pos'];//3d相对坐标初始值
  this.selfPos = args['pos'];//3d相对坐标
  this.r = args['r'] ? args['r'] : 20;
  this.size = this.r;
  this.color = args['color'] ? args['color'] : '#000';
  this.screenOrigin = args['origin'];//屏幕中心坐标2d绝对坐标w/2,h/2
  this.selfOrigin = {};//图像坐标2d绝对坐标w/2,h/2 由3d坐标投影而来
  this.option = args['option'];
  this.ctx = args['ctx'];
  this.percent = parseFloat(args['percent']);
  this.visibility = args['visibility'];//可视范围
  this.loop = true;
  this.clientWidth = args['clientWidth'];
  this.clientHeight = args['clientHeight'];
  this.cvs = args['cvs']
  this.pointSize = args['pointSize']
  this.rotate = args['rotate']
  // console.log(this)
  this.init();
};
Sphere.prototype = {
  resize: function () {
    this.clientWidth = document.body.clientWidth;
    this.clientHeight = document.body.clientHeight;
    this.cvs.width = this.clientWidth;
    this.cvs.height = this.clientHeight;
    // console.log('update')
    this.update();
  },
  update: function () {
    // console.log('update2')
    this.screenOrigin = {
      x: this.clientWidth / 2,
      y: this.clientHeight / 2
    }
    this.selfPos = {
      x: this.selfPos.x,
      y: this.selfPos.y,
      z: this.selfPos.z
    }
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = Utils.randomColor();
    this.initShape();
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
    vertex.forEach(function (e, i) {
      var point = new Point({
        self: {
          pos: e,//点坐标3d 相对位置-相对于球心3d
        },
        parent: {
          pos: {
            x:this.selfPos.x+this.parentPos.x,
            y:this.selfPos.y+this.parentPos.y,
            z:this.selfPos.z+this.parentPos.z,
          },//球心3d 绝对位置
          origin: origin,//球心2d 绝对位置
        },
        color: Utils.randomColor(),
        size: this.pointSize,//点的大小
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
  clear: function () {
    this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);
  },
  projection: function () {
    var scale = this.visibility / (this.visibility + (this.selfPos.z+this.parentPos.z));
    var prox = scale * (this.selfPos.x+this.parentPos.x) + this.screenOrigin.x;
    var proy = scale * (this.selfPos.y+this.parentPos.y) + this.screenOrigin.y;
    this.size = this.r * scale;
    this.selfOrigin.x = prox;
    this.selfOrigin.y = proy;
  },
  draw: function () {
    this.clear();
    this.pointSort();
    this.drawPoint();
    // this.drawLine();
  },
  drawPoint: function () {
    var that = this;
    this.points.forEach(function (e, i) {
      e.rotateY();
      e.projection();
      e.draw(this.ctx);
    }.bind(this));
  },
  drawLine: function () {
    this.ctx.beginPath();
    this.points.forEach(function (e, i) {
      e.update();
      this.ctx.lineTo(e.selfOrigin.x, e.selfOrigin.y);
    }.bind(this));
    this.ctx.stroke();
  },
  render: function () {
    this.draw();
  },
  animation: function () {
    var that = this;
    that.render();
    window.requestAnimationFrame(function () {
      that.animation();
    });
  },
  rotate: function () { },
  init: function () {
    var that = this;
    that.resize();
    window.addEventListener('resize', function () {
      that.resize();
    })
    this.initShape();
    this.projection();
    this.animation();
  }
}