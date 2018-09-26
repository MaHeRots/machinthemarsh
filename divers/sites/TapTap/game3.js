//on va créé nos différents éléments de jeu ...
var stage;
var game;
var hero;
var ennemis;
var score;
var home;

function initGame() {

    //creation zone de jeu
    console.log('init game');
    stage = new createjs.Stage("TapTaupe");
    window.stage = stage;

    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", onUpdate);
    function onUpdate(){
        stage.update();
    }
   

    ennemis = new Ennemis();
    ennemis.create();
    
    marte

}

function Ennemis(){
    var _container;
    var _monster;
    
    var obj = {
        create: _create
     };
    return obj;
}

function Marteau(){
    
}

function _create(){
    console.log('create ennemis');
    _container = new createjs.Container();
    
    var beer = new createjs.Bitmap("assets/beer.png");
    beer.regX = 250;
    beer.regY = 230/ + 36;
    container.addChild (Beer);
    
    stage.addChild(_container);
    _container.x = stage.canvas.width-200;
    _container.y = 100;    
}

function _update(){
    
}