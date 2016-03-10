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
	    requestAnimationFrame(step);
	  }.bind(this);

	  requestAnimationFrame(step);
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Scud = __webpack_require__(3);

	var Game = function () {
	  this.scuds = [];
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
	  this.drawSky(ctx);
	  ctx.fillStyle = 'black';
	  ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
	  for (var i = 0; i < this.scuds.length; i++) {
	    this.scuds[i].draw(ctx);
	    this.scuds[i].step();
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
/***/ function(module, exports) {

	var Scud = function (origin, dest, onFinish) {
	  this.origin = origin;
	  this.pos = origin;
	  this.dest = dest;
	  this.angle = this.getAngle(origin, dest);
	  this.isExploding = false;
	  this.explodeProgress = 0.0;
	  this.onFinish = onFinish;
	};

	Scud.prototype.SPEED = 10;

	Scud.prototype.step = function () {
	  if (this.atDest()) {
	    this.explode();
	  }

	  if (this.isExploding) {
	    if (this.explodeProgress > 1.0) {
	      this.finish();
	    } else {
	      this.explodeProgress += 0.04;
	    }
	  } else {
	    var stuff = this.angToCartesian(this.angle, this.SPEED);
	    this.pos.x -= stuff.x;
	    this.pos.y -= stuff.y;
	  }
	};

	Scud.prototype.getAngle = function (origin, dest) {
	  return Math.atan2(origin.y - dest.y, origin.x - dest.x);
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
	  var max = 50;
	  if (progress <= 0.5) {
	    return max * progress;
	  } else {
	    return max * Math.abs(1.0 - progress);
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

	Scud.prototype.explode = function () {
	  this.isExploding = true;
	};


	Scud.prototype.angToCartesian = function (angle, magnitude) {
	  return {x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle)};
	};

	Scud.prototype.finish = function () {
	  this.onFinish(this);
	};
	//
	//
	// Scud.prototype.extractAngle = function (vector) {
	//   var xVel = vector[0];
	//   var yVel = vector[1];
	//   var angle = Math.atan2(yVel, xVel);
	//   if (xVel === 0) {
	//     if (yVel > 0) {
	//       angle = 1.5 * Math.PI;
	//     } else {
	//       angle = 0.5 * Math.PI;
	//     }
	//   }
	//   return angle;
	// };
	//
	// Scud.prototype.extractMagnitude = function (vector) {
	//     var xVel = vector[0];
	//     var yVel = vector[1];
	//
	//     return Math.hypot(xVel, yVel);
	// };
	module.exports = Scud;


/***/ }
/******/ ]);