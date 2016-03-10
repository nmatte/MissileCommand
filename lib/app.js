var GameView = require('./game_view');
var Game = require('./game');
var canvas = document.getElementById("canvas");

var v = new GameView(new Game(), canvas);
v.start();
