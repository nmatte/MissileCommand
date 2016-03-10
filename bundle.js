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
	    Missile = __webpack_require__(6),
	    City = __webpack_require__(7);

	var GROUND_LEVEL = 30;
	var Game = function () {
	  this.scuds = [];
	  this.missiles = [];
	  this.cities = [];
	  this.xBound = 640;
	  this.yBound = 480;
	  this.score = 0;
	  this.difficulty = 1;
	  this.missilesRemaining = 15;
	  this.origin = {x: this.xBound / 2, y: this.yBound - GROUND_LEVEL};
	  this.spawnCities();
	  this.spawnMissileWave(true);
	};


	Game.prototype.clickAt = function (x, y) {
	  console.log("x, y", x, y);
	  var origin = this.origin;
	  var dest = {x: x, y: y};

	  var provideMissiles = function () {
	    return this.missiles;
	  }.bind(this);

	  this.scuds.push(new Scud(origin, dest, this.onScudFinish.bind(this), provideMissiles));
	};

	Game.prototype.onScudFinish = function (scud) {
	  this.scuds.splice(this.scuds.indexOf(scud), 1);
	  this.score += scud.points;
	};

	Game.prototype.onMissileFinish = function (missile) {
	  if (missile.destroyedTarget) {
	    var city = this.cities.find(
	      function (someCity) {
	        return someCity.location.x === missile.dest.x;
	      }
	    );

	    if (city) {
	      city.destroy();
	    }
	  }
	  this.missiles.splice(this.missiles.indexOf(missile), 1);
	  this.spawnMissileWave();
	};

	Game.prototype.spawnCities = function () {
	  var y = this.yBound - GROUND_LEVEL;
	  var interval = this.xBound / 8;
	  for (var i = 0; i < 6; i++) {
	    var x;
	    if (i < 3) {
	      x = interval * i;
	    } else {
	      x = this.xBound - interval * (6 - i);
	    }
	    x += interval / 2;
	    var coords = {x: x, y: y};
	    this.cities.push(new City(coords));
	  }
	};

	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, this.xBound, this.yBound);
	  this.drawSky(ctx);
	  this.drawCities(ctx);
	  this.drawMissiles(ctx);
	  this.drawScuds(ctx);

	  ctx.fillStyle = 'black';
	  ctx.fillRect(0, this.yBound - 30, this.xBound, 30);
	  ctx.fillStyle = "white";
	  ctx.font = "24px monospace";
	  ctx.fillText("Score: " + this.score, 20, 40);
	  var levelText = "Level " + this.difficulty;
	  var width = ctx.measureText(levelText).width;

	  ctx.fillText(levelText, this.xBound - (width + 20), 40);
	};

	Game.prototype.step = function () {
	  this.stepScuds();
	  this.stepMissiles();
	  if (this.missilesRemaining <= 0) {
	    this.stepDifficulty();
	  }
	};

	var maxMissiles = 3;
	var maxTotal = 5;

	Game.prototype.stepDifficulty = function () {
	  this.difficulty += 1;
	  maxMissiles += 1;
	  maxTotal += 2;
	  this.missilesRemaining = 15 + this.difficulty * 3;
	};

	Game.prototype.spawnMissileWave = function (force) {
	  var numTimes = Math.ceil(Math.random() * maxMissiles);
	  if (force) {
	    numTimes = Math.max(Math.ceil(Math.random() * maxMissiles));
	  }

	  if (this.missiles.length < maxTotal) {
	    var targets = [this.origin];
	    for (var i = 0; i < this.cities.length; i++) {
	      if (!this.cities[i].isDestroyed) {
	        targets.push(this.cities[i].location);
	      }
	    }
	    var randIndex = Math.floor(Math.random() * targets.length);
	    var target = targets[randIndex];
	    if(!target) {
	      target = this.origin;
	    }
	    for (var i = 0; i < numTimes; i++) {
	      var missOrigin = {x: this.xBound * Math.random(), y: 0};
	      this.missiles.push(new Missile(missOrigin, target, this.onMissileFinish.bind(this)));
	      this.missilesRemaining -=1;
	    }

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

	Game.prototype.drawCities = function (ctx) {
	  for (var i = 0; i < this.cities.length; i++) {
	    this.cities[i].draw(ctx);
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
	var Scud = function (origin, dest, onFinish, getMissiles) {
	  Projectile.call(this, origin, dest, onFinish);
	  this.getMissiles = getMissiles;
	  this.points = 0;
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
	      this.destroyMissiles();
	      this.explodeProgress += 0.025;
	    }
	  } else {
	    var stuff = this.angToCartesian(this.angle, this.SPEED);
	    this.pos.x -= stuff.x;
	    this.pos.y -= stuff.y;
	  }
	};

	Scud.prototype.destroyMissiles = function () {
	  var numMissiles = 0;
	  if (this.isExploding) {
	    this.getMissiles().forEach(
	      function (missile) {

	        var radius = this.getRadiusFromProgress(this.explodeProgress);
	        var xDiff = missile.pos.x - this.pos.x;
	        var yDiff = missile.pos.y - this.pos.y;

	        if (Math.hypot(xDiff, yDiff) < radius) {
	          if (!missile.isDestroyed) {
	            numMissiles += 1;
	          }
	          missile.destroy();

	        }
	      }.bind(this)
	    );
	  }
	  this.points += numMissiles * 100;
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
	  this.destroyedTarget = false;
	  this.isDestroyed = false;
	  Projectile.call(this, origin, dest, onFinish);
	};

	Util.prototype.inherits(Missile, Projectile);


	Missile.prototype.SPEED = 1;

	Missile.prototype.step = function () {
	  if (this.atDest()) {
	    this.destroyedTarget = true;
	    this.explode();
	  }
	  //
	  if (this.isExploding) {
	    if (this.explodeProgress > 1.0) {
	      this.finish();
	    } else {
	      this.explodeProgress += 0.015;
	    }
	  } else {
	    var stuff = this.angToCartesian(this.angle, this.SPEED);
	    this.pos.x -= stuff.x;
	    this.pos.y -= stuff.y;
	  }
	};


	Missile.prototype.draw = function (ctx) {
	  if (this.isExploding) {
	    this.drawMushroomCloud(ctx);
	  } else {
	  ctx.strokeStyle = 'rgb(232, 45, 10)';
	  ctx.fillStyle = "white";
	  ctx.lineWidth = 2;
	  ctx.beginPath();
	  ctx.moveTo(this.origin.x, this.origin.y);

	  ctx.lineTo(this.pos.x, this.pos.y);
	  ctx.stroke();

	    ctx.fillRect(this.pos.x - 1, this.pos.y - 1, 2, 2);
	    ctx.fillStyle = 'black';
	  }
	};

	Missile.prototype.drawMushroomCloud = function (ctx) {
	  if (this.explodeProgress <= 0.2) {
	    ctx.fillStyle = 'rgb(230,230,230)';
	  } else if (this.explodeProgress <= 0.4) {
	    ctx.fillStyle = 'rgb(232, 114, 10)';
	    var top = this.drawMushroomTop(ctx);
	    this.drawMushroomStalk(ctx, top);
	  } else if (this.explodeProgress <= 0.6) {
	    ctx.fillStyle = 'rgb(230,230,230)';
	    var top = this.drawMushroomTop(ctx);
	    this.drawMushroomStalk(ctx, top);
	  } else if (this.explodeProgress <= 0.8) {
	    ctx.fillStyle = 'rgb(232, 49, 10)';
	    var top = this.drawMushroomTop(ctx);
	    this.drawMushroomStalk(ctx, top);
	  } else {
	    // ctx.fillStyle = 'rgb(255, 18, 10)';
	    ctx.fillStyle = 'rgb(230,230,230)';
	    var top = this.drawMushroomTop(ctx);
	    this.drawMushroomStalk(ctx, top);
	  }


	  ctx.beginPath();
	  ctx.moveTo(this.pos.x, this.pos.y);
	  ctx.arc(this.pos.x, this.pos.y, 25, Math.PI, 0);
	  ctx.fill();
	};

	Missile.prototype.drawMushroomStalk = function (ctx, top) {
	  var startY = top + 4;
	  var bottomLeft = {x: this.pos.x - 5, y: this.pos.y};
	  var topLeft = {x: bottomLeft.x, y: startY};
	  var bottomRight = {x: this.pos.x + 5, y: this.pos.y};
	  var topRight = {x: bottomRight.x, y: startY};
	  // ctx.fillRect(this.pos.x - 5, startY, 10, Math.abs(top - this.pos.y));
	  ctx.beginPath();
	  ctx.moveTo(bottomLeft.x, bottomLeft.y);
	  ctx.lineTo(topLeft.x, topLeft.y);
	  ctx.bezierCurveTo(topLeft.x, top, topRight.x, top, topRight.x, topRight.y);
	  ctx.lineTo(bottomRight.x, bottomRight.y);
	  ctx.fill();
	};

	Missile.prototype.drawMushroomTop = function (ctx) {
	  var progressDiff = Math.min(this.explodeProgress * 30 + 5, 15);
	  var pointLeft = {x: this.pos.x - progressDiff, y: this.pos.y - progressDiff * 2};
	  var pointRight = {x: this.pos.x + progressDiff, y: this.pos.y - progressDiff * 2};
	  ctx.beginPath();
	  ctx.moveTo(pointLeft.x, pointLeft.y);
	  var ctrlLeft = {x: pointLeft.x - 10, y: pointLeft.y - (10 + progressDiff)};
	  var ctrlRight = {x: pointRight.x + 10, y: pointRight.y - (10 + progressDiff)};
	  ctx.bezierCurveTo(ctrlLeft.x - 10, ctrlLeft.y, ctrlRight.x + 10, ctrlRight.y, pointRight.x, pointRight.y);

	  var ctrlLeft2 = {x: pointLeft.x - 3, y: pointLeft.y - 7};
	  var ctrlRight2 = {x: pointRight.x + 3 , y: pointRight.y - 7};
	  ctx.bezierCurveTo(ctrlLeft2.x, ctrlLeft2.y, ctrlRight2.x, ctrlRight2.y, pointLeft.x, pointLeft.y);
	  // ctx.arc(this.pos.x, this.pos.y - this.explodeProgress * 7, this.explodeProgress * 25, Math.PI * 1, 0);
	  // ctx.arc(this.pos.x, this.pos.y - this.explodeProgress * 10, this.explodeProgress * 30, Math.PI * 1, 0);
	  ctx.fill();
	  return pointLeft.y;
	};


	Missile.prototype.atDest = function () {
	  return (this.dest.y < this.pos.y);
	};

	Missile.prototype.finish = function () {
	  this.onFinish(this);
	};

	Missile.prototype.destroy = function () {
	  this.isDestroyed = true;
	  this.finish();
	};

	module.exports = Missile;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var City = function (location) {
	  this.location = location;
	  this.isDestroyed = false;
	  this.rubblePoints = [];
	};

	City.prototype.WIDTH = 40;

	City.prototype.HEIGHT = 15;

	City.prototype.draw = function (ctx) {
	  ctx.fillStyle = "purple";
	  if (this.isDestroyed) {
	    this.drawRubble(ctx);
	  } else {
	    ctx.fillRect(this.location.x - this.WIDTH / 2, this.location.y - this.HEIGHT, this.WIDTH, this.HEIGHT);
	  }
	};

	City.prototype.destroy = function () {
	  this.isDestroyed = true;
	  this.makeRubblePoints();
	};

	City.prototype.makeRubblePoints = function () {
	  if (this.rubblePoints.length === 0){
	    for (var i = 0; i < 6; i++) {
	      var rX = Math.random() * this.WIDTH + this.location.x;
	      var rY = this.location.y - Math.random() * this.HEIGHT;
	      this.rubblePoints.push({x: rX, y: rY});
	    }
	  }
	  return this.rubblePoints;
	};

	City.prototype.drawRubble = function (ctx) {
	  ctx.beginPath();
	  ctx.moveTo(this.location.x, this.location.y);
	  for (var j = 0; j < this.rubblePoints.length; j++) {
	    var x = this.rubblePoints[j].x;
	    var y = this.rubblePoints[j].y;
	    ctx.lineTo(x, y);
	    ctx.lineTo(x, this.location.y);
	  }
	  ctx.fill();
	};

	module.exports = City;


/***/ }
/******/ ]);