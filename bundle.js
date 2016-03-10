/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1);
	var Game = __webpack_require__(2);
	var canvas = document.getElementById("canvas");

	var v = new GameView(new Game(), canvas);
	v.start();


/***/ },
/* 1 */
/***/ function(module, exports) {

	function GameView(game, canvas) {
	    this.game = game;

	    canvas.addEventListener('click', function (event) {
	      this.game.clickAt(event.layerX, event.layerY);
	    }.bind(this));
	    this.ctx = canvas.getContext("2d");
	}

	GameView.prototype.start = function () {
	  var step = function () {
	    this.game.draw(this.ctx);
	    this.game.step();
	    requestAnimationFrame(step);
	  }.bind(this);

	  requestAnimationFrame(step);
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Scud = __webpack_require__(3),
	    Missile = __webpack_require__(6);

	var Game = function () {
	  this.scuds = [];
	  this.missiles = [];
	  this.xBound = 640;
	  this.yBound = 480;
	};

	Game.prototype.clickAt = function (x, y) {
	  console.log("x, y", x, y);
	  var origin = {x: this.xBound / 2, y: this.yBound - 30};
	  var dest = {x: x, y: y};
	  this.scuds.push(new Scud(origin, dest, this.onScudFinish.bind(this)));
	};

	Game.prototype.onScudFinish = function (scud) {
	  console.log(scud);
	  this.scuds.splice(this.scuds.indexOf(scud), 1);
	};

	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, this.xBound, this.yBound);
	  ctx.fillStyle = 'black';
	  this.drawSky(ctx);
	  this.drawMissiles(ctx);
	  this.drawScuds(ctx);

	  ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
	};

	Game.prototype.step = function () {
	  this.spawnMissileWave();
	  this.stepScuds();
	  this.stepMissiles();
	};

	Game.prototype.spawnMissileWave = function () {
	  var numTimes = Math.max(Math.floor(Math.random() * 12) - 6, 0);
	  var target = {x: this.xBound / 2, y: this.yBound - 30};
	  var missOrigin = {x: this.xBound * Math.random(), y: 0};
	  for (var i = 0; i < numTimes; i++) {
	    this.missiles.push(new Missile(missOrigin, target, new function () {
	      console.log("done");
	    }));
	  }


	};

	Game.prototype.stepScuds = function () {
	  for (var i = 0; i < this.scuds.length; i++) {
	    this.scuds[i].step();
	  }
	};

	Game.prototype.stepMissiles = function () {
	  for (var i = 0; i < this.missiles.length; i++) {
	    this.missiles[i].step();
	  }
	};

	Game.prototype.drawScuds = function (ctx) {
	  for (var i = 0; i < this.scuds.length; i++) {
	    this.scuds[i].draw(ctx);
	  }
	};

	Game.prototype.drawMissiles = function (ctx) {
	  for (var i = 0; i < this.missiles.length; i++) {
	    this.missiles[i].draw(ctx);
	  }
	};

	Game.prototype.drawSky = function (ctx) {
	  var oldStyle = ctx.fillStyle;
	  var gradient = ctx.createLinearGradient(0,0,0,this.yBound);
	  gradient.addColorStop(0,"rgb(2, 7, 49)");
	  gradient.addColorStop(1,"rgb(119, 181, 254)");
	  ctx.fillStyle = gradient;
	  ctx.fillRect(0,0,this.xBound,this.yBound);

	  ctx.fillStyle = oldStyle;
	};
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Projectile = __webpack_require__(4);
	var Util = __webpack_require__(5);
	var Scud = function (origin, dest, onFinish) {
	  Projectile.call(this, origin, dest, onFinish);
	};

	Util.prototype.inherits(Scud, Projectile);

	Scud.prototype.SPEED = 10;

	Scud.prototype.step = function () {
	  if (this.atDest()) {
	    this.explode();
	  }
	if (this.isExploding) {
	    if (this.explodeProgress > 1.0) {
	      this.finish();
	    } else {
	      this.explodeProgress += 0.025;
	    }
	  } else {
	    var stuff = this.angToCartesian(this.angle, this.SPEED);
	    this.pos.x -= stuff.x;
	    this.pos.y -= stuff.y;
	  }
	};

	Scud.prototype.draw = function (ctx) {
	  if (this.isExploding) {
	    ctx.beginPath();
	    if (this.explodeProgress <= 0.2) {
	      ctx.fillStyle = 'rgb(255, 159, 10)';
	    } else if (this.explodeProgress <= 0.4) {
	      ctx.fillStyle = 'rgb(232, 114, 10)';
	    } else if (this.explodeProgress <= 0.6) {
	      ctx.fillStyle = 'rgb(255, 211, 66)';
	    } else if (this.explodeProgress <= 0.8) {
	      ctx.fillStyle = 'rgb(232, 49, 10)';
	    } else {
	      // ctx.fillStyle = 'rgb(255, 18, 10)';
	      ctx.fillStyle = 'rgb(255, 211, 66)';

	    }
	    ctx.arc(this.pos.x, this.pos.y, this.getRadiusFromProgress(this.explodeProgress), 0, Math.PI * 2);
	    ctx.fill();
	    ctx.fillStyle = 'black';
	  } else {
	    ctx.fillStyle = 'rgb(255, 254, 130)';
	    ctx.fillRect(this.pos.x, this.pos.y, 5, 5);
	    ctx.fillStyle = 'black';
	  }
	};

	Scud.prototype.getRadiusFromProgress = function (progress) {
	  var max = 35;
	  var smallerMax = 20;
	  if (progress <= 0.5) {
	    return max * Math.sin(4.2 * progress);
	  } else {
	    return Math.abs( smallerMax * Math.sin(6 * (progress - 0.5522)));
	  }
	};

	Scud.prototype.atDest = function () {
	  var isLeft = false;
	  if (this.angle / Math.PI <= 0.5) {
	    isLeft = true;
	    return this.pos.x < this.dest.x && this.pos.y < this.dest.y;
	  }

	  return this.pos.x > this.dest.x && this.pos.y < this.dest.y;
	};
	module.exports = Scud;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Projectile = function (origin, dest, onFinish) {
	  this.origin = origin;
	  this.pos = {};
	  this.pos["x"] = origin.x;
	  this.pos["y"] = origin.y;
	  this.dest = dest;
	  this.angle = this.getAngle(origin, dest);
	  this.isExploding = false;
	  this.explodeProgress = 0.0;
	  this.onFinish = onFinish;
	};

	Projectile.prototype.SPEED = 10;

	Projectile.prototype.step = function () {
	  console.log("this should be overridden");
	};

	Projectile.prototype.getAngle = function (origin, dest) {
	  return Math.atan2(origin.y - dest.y, origin.x - dest.x);
	};

	Projectile.prototype.draw = function (ctx) {
	  console.log("should be overridden");
	};

	Projectile.prototype.atDest = function () {
	  console.log("override atDest");
	};

	Projectile.prototype.explode = function () {
	  this.isExploding = true;
	};


	Projectile.prototype.angToCartesian = function (angle, magnitude) {
	  return {x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle)};
	};

	Projectile.prototype.finish = function () {
	  this.onFinish(this);
	};
	module.exports = Projectile;


/***/ },
/* 5 */
/***/ function(module, exports) {

	function Util() {

	}

	Util.prototype.inherits = function (childClass, superClass) {
	  function Surrogate(){ }
	  Surrogate.prototype = superClass.prototype;

	  childClass.prototype = new Surrogate();
	  childClass.prototype.constructor = childClass;
	};

	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(5),
	    Projectile = __webpack_require__(4);

	var Missile = function (origin, dest, onFinish) {
	  Projectile.call(this, origin, dest, onFinish);
	};

	Util.prototype.inherits(Missile, Projectile);


	Missile.prototype.SPEED = 2;

	Missile.prototype.step = function () {
	  // if (this.atDest()) {
	  //   this.explode();
	  // }
	  //
	  // if (this.isExploding) {
	  //   if (this.explodeProgress > 1.0) {
	  //     this.finish();
	  //   } else {
	  //     this.explodeProgress += 0.025;
	  //   }
	  // } else {
	    var stuff = this.angToCartesian(this.angle, this.SPEED);
	    this.pos.x -= stuff.x;
	    this.pos.y -= stuff.y;
	  // }
	};


	Missile.prototype.draw = function (ctx) {
	  // if (this.isExploding) {
	  //   ctx.beginPath();
	  //   if (this.explodeProgress <= 0.2) {
	  //     ctx.fillStyle = 'rgb(255, 159, 10)';
	  //   } else if (this.explodeProgress <= 0.4) {
	  //     ctx.fillStyle = 'rgb(232, 114, 10)';
	  //   } else if (this.explodeProgress <= 0.6) {
	  //     ctx.fillStyle = 'rgb(255, 211, 66)';
	  //   } else if (this.explodeProgress <= 0.8) {
	  //     ctx.fillStyle = 'rgb(232, 49, 10)';
	  //   } else {
	  //     // ctx.fillStyle = 'rgb(255, 18, 10)';
	  //     ctx.fillStyle = 'rgb(255, 211, 66)';
	  //
	  //   }
	  //   ctx.arc(this.pos.x, this.pos.y, this.getRadiusFromProgress(this.explodeProgress), 0, Math.PI * 2);
	  //   ctx.fill();
	  //   ctx.fillStyle = 'black';
	  // } else {
	  ctx.strokeStyle = 'rgb(232, 45, 10)';
	  ctx.fillStyle = "white";
	  ctx.beginPath();
	  ctx.moveTo(this.origin.x, this.origin.y);

	  ctx.lineTo(this.pos.x, this.pos.y);
	  ctx.stroke();

	    ctx.fillRect(this.pos.x, this.pos.y, 5, 5);
	    ctx.fillStyle = 'black';
	  // }
	};


	Missile.prototype.atDest = function () {
	  // var isLeft = false;
	  // if (this.angle / Math.PI <= 0.5) {
	  //   isLeft = true;
	  //   return this.pos.x < this.dest.x && this.pos.y < this.dest.y;
	  // }
	  //
	  // return this.pos.x > this.dest.x && this.pos.y < this.dest.y;
	};

	Missile.prototype.finish = function () {
	  this.onFinish(this);
	};
	module.exports = Missile;


/***/ }
/******/ ]);