var stage; //scene ou l'on va créé l'animation
var ennemis; //mes ennemis
var marteau; 
var score;
var home;
var duree="60";

function initGame(){
	//console.log('init game');
	stage = new createjs.Stage("taptap");
    window.stage = stage;
    
    //gestion des écrans du jeu
    game = new GameLogic();
    
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", onUpdate);
    
	function onUpdate(){
		//fonction qui va sexecuter 60 fois / seconde !
		stage.update();
	}

	//creation des éléments du jeu
    home = new HomeScreen();
    //home.create();
    
    ennemis = new Ennemis();
    //ennemis.create();
    
    marteau = new Marteau();
    //marteau.create();
    
    score = new Score();
    //score.create();
    
    end = new EndScreen();
//    temps = new Temps();
    
    game.startHome();
}



function GameLogic() {

    //////////////////////

    var obj = {
        startHome: _startHome,
        startGame: _startGame,
        endGame: _endGame,
    };
    return obj;

    //////////////////////

    function _startHome() {
        home.create();
        ennemis.destroy();
        marteau.destroy();
        score.destroy();
        stage.removeAllEventListeners("stagemousedown");
    }

    function _startGame() {
        home.destroy();
        end.destroy();
        ennemis.create(); //permet l'affichage de la fonction
        marteau.create(); //permet l'affichage de la fonction
        score.destroy();
        score.create();
        stage.on("stagemousedown", function (e) {
            e.preventDefault();
        });
    }
    
    function _endGame(score) {
        end.create(score);
        //score.destroy(); // LE PROBLEME VIENT DE LA CAR SCORE EST EN ARGUMENT DE LA FONCTION !!!!
        ennemis.destroy(); //permet l'affichage de la fonction
        marteau.destroy(); //permet l'affichage de la fonction

        stage.removeAllEventListeners("stagemousedown");
    }
}



function Ennemis() {

    var _container;
    var _position = +400;
    var _positionHide = -200;
    var _isHidden = false;

    var _chrono;
    var _monster;
    var _friend;
    var _currentEnnemi;
    var _mask;
    var _trou;

    var obj = {
        create : _create,
        currentEnnemi: null,
        destroy: _destroy,
        onTouched : _onTouched,
        isVisible : _isVisible,
    };
    return obj;

    function _create() {
        //console.log('create bonhomme !');
        if (!_container){
            _container = new createjs.Container();

            _trou = new createjs.Bitmap("assets/trou.png");
            _container.addChild(_trou);
            stage.addChild(_container);
            _trou.y = -10;
            _trou.x = 300;

            _monster = new createjs.Bitmap("assets/monstre.png");
            _monster.name = "monster";
            _container.addChild(_monster);
            _monster.y = -185;
            _monster.x = 340;

            _friend = new createjs.Bitmap("assets/cochon.png");
            _friend.name = "friend";
            _container.addChild(_friend);
            _friend.y = -185;
            _friend.x = 340;

            _mask = new createjs.Shape();
            _mask.graphics.beginFill('red').drawEllipse(0,0,460, 300);
            _mask.alpha = 1;
            _mask.y = -235;
            _mask.x = 190 ;

            _monster.mask = _mask;
            _friend.mask = _mask;

            _container.addChild(_friend, _monster);

            stage.addChild(_container);
            _container.x = 0;
            _container.y = _position;

            _chooseEnnemi();
            _startChrono();
        }

    }

    function _onTouched() {
            //console.log(_currentEnnemi.name);
            marteau.locked = true;
            _currentEnnemi.scaleX = _currentEnnemi.scaleY = 1;

            createjs.Tween.get(_currentEnnemi)
                .to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.quartOut)
                .to({scaleX: 1, scaleY: 1}, 800, createjs.Ease.elasticOut)
                .call(function () {
                marteau.locked = false;
            });
            if ( _isVisible() ) {

                if (_currentEnnemi.name == "friend") {
                    //COCHON !!
                    score.update(-20);
                } else {
                    //MONSTRE !!!
                    score.update(10);
                }      
            }
        }

    function _chooseEnnemi() {
        var random = getRandomRange(0, 7);
        if (random >= 4) {
            _currentEnnemi = _friend;
            _friend.visible = true;
            _monster.visible = false;
        } else {
            _currentEnnemi = _monster;
            _monster.visible = true;
            _friend.visible = false;
             //_createPictureGuy();
        }
    }
    
    function _stopChrono() {
        if (_chrono) {
            clearInterval(_chrono);
            _chrono = null;
        }
    }

    function _startChrono() {
        _stopChrono();
        _chrono = setInterval(_mouvement, 1000);
    }
    
    function _mouvement() {
        //function qui s'execute a chaque pulsation de mon chrono
        var pos = 0;
        if (_isHidden == true) {
            _isHidden = false;
            pos = _position; 
        } else {
            _isHidden = true;
            pos = _positionHide;
            _chooseEnnemi();
        }
        //_currentEnnemi.y = pos;
        createjs.Tween.get( _currentEnnemi).to({y: pos}, 500, createjs.Ease.quartOut);

    }
    
    function _isVisible () { return _isHidden }
    
    function _destroy() {
        if (_container) {
            stage.removeChild(_container);
            _container = null;
        }
    }
}



function Marteau() {

    var _container;
    var obj = {
        create : _create,
        destroy: _destroy,
        update : _update,
        locked : false
    };
    return obj;

    function _create() {
        //console.log('create ennemis !');

        _container = new createjs.Container();

        //image du fût
        var beer = new createjs.Bitmap("assets/beer.png");
        beer.regX = 250;
        beer.regY = 230/2 + 30;
        _container.addChild(beer);

        stage.addChild(_container);
        _container.x = stage.canvas.width - 200;
        _container.y = 100;
        
        stage.on("stagemousedown", function(){
            if ( marteau.locked ) return;
            //console.log('TAP !!');
            ennemis.onTouched();
            createjs.Tween.get(beer)
            .to({rotation : -60}, 300, createjs.Ease.quartOut)
            .to({rotation : 0}, 400, createjs.Ease.quartOut)
            .call(function(){
                //console.log('animation finie');
            });
            
        });
    }
    
    function _destroy() {
        if (_container) {
            stage.removeChild(_container);
            _container = null;
        }
    }
    
    function _update(){
        var nbBeer = _container.getNumChildren();
        for (var i = nbBeer - 1; i >= 0; i--){
            var MyBeer = _container.getChildAt(i);
            MyBeer.x += 40;
            
        }
        
        if (!ennemis.locked) {
            //si je touche un ennemi...
            if (checkCollision2(MyBeer, ennemis.currentEnnemi)) {
                //on empêche de frapper plus
                _container.removeChildAt(i);
            }
        } 
    }

   
}



function Score() {
    var _text;
    var _score = 0;
    var _timeLeft = 99;
    //////////////////////

    var obj = {
        create: _create,
        destroy: _destroy,
        update: _update,
        initTime: _initTime
    };
    return obj;

    //////////////////////

    function _create() {
        _text = new createjs.Text("Score : " + _score, "30px bowlby_oneregular", "#ff7700");
        _text.x = stage.canvas.width / 2;
        _text.y = 20;
        _text.textAlign = "center";
        stage.addChild(_text);
        _initTime();
    }

    function _destroy() {
        if (_text) {
            stage.removeChild(_text);
            _text = null;
            _score = 0;
        }
    }

    function _update(score) {
        _score += score;
        _text.text = "Score : " + _score + " | Temps restant : " + _timeLeft
    }
    
    function _initTime() {
        _timeLeft = 60;
        var timer = setInterval(function() {
            _calculateTime(timer)
            }, 1000)
        }
    
    function _calculateTime(timer) {
        _timeLeft--;
        if ( _timeLeft == 0) {
            clearInterval(timer);
            game.endGame(_score)
        }
        _text.text = "Score : " + _score + " | Temps restant : " + _timeLeft;
    } 

}


function HomeScreen() {

    var _container;
    var _btnStart;
    //////////////////////

    var obj = {
        create: _create,
        destroy: _destroy
    };
    return obj;

    //////////////////////

    function _create() {
        _destroy();

        _container = new createjs.Container("#ffffff");
        _container.x = stage.canvas.width / 2;
        _container.y = stage.canvas.height / 2;

        var text, animation, spriteSheet;

        text = new createjs.Text("Tap Taupe sans Taupes", "50px bowlby_oneregular", "#FFFFFF");
        text.y = -70;
        text.textAlign = "center";
        _container.addChild(text);

        createjs.Tween.get(text)
            .to({y: 800}, 0, createjs.Ease.quartOut)
            .wait(300)
            .to({y: -70}, 1000, createjs.Ease.quartOut);


        text = new createjs.Text("Tape le monstre et ne casse pas la gueule au cochon !", "20px bowlby_oneregular", "#FFFFFF");
        text.textAlign = "center";
        _container.addChild(text);

        createjs.Tween.get(text)
            .to({y: 800}, 0, createjs.Ease.quartOut)
            .wait(500)
            .to({y: 0}, 1000, createjs.Ease.quartOut);



        //btn
        var background = new createjs.Shape();
        background.name = "background";
        background.graphics.beginFill("#6a7bff").drawRoundRect(-70, -30, 140, 60, 10);

        var label = new createjs.Text("START", "20px bowlby_oneregular", "#FFFFFF");
        label.name = "label";
        label.textAlign = "center";
        label.textBaseline = "middle";

        _btnStart = new createjs.Container();
        _btnStart.name = "button";
        _btnStart.y = 120;
        _btnStart.addChild(background, label);
        _btnStart.mouseChildren = false;
        _container.addChild(_btnStart);
        _btnStart.addEventListener('click', _onClickStart);

        createjs.Tween.get(_btnStart)
            .to({y: 800}, 0)
            .wait(500)
            .to({y: 120}, 1000, createjs.Ease.quadInOut);

        stage.addChild(_container);
    }

    function _destroy() {
        if (_container) {
            _btnStart.removeAllEventListeners();
            stage.removeChild(_container);
            _container = null;
            _btnStart = null;
        }
    }

    function _onClickStart() {
        game.startGame();
    }
}

function EndScreen() {

    var _container;
    var _btnStart;
    //////////////////////

    var obj = {
        create: _create,
        destroy: _destroy
    };
    return obj;

    //////////////////////

    function _create(score) {
//        _destroy();
        _container = new createjs.Container("#ffffff");
        _container.x = stage.canvas.width / 2;
        _container.y = stage.canvas.height / 2;

        var text, animation, spriteSheet;

        text = new createjs.Text("Finis", "50px bowlby_oneregular", "#FFFFFF");
        text.y = -70;
        text.textAlign = "center";
        _container.addChild(text);

        
        text = new createjs.Text("Tu as obtenu un score de : " + score,"20px bowlby_oneregular","#FFFFFF");
        text.textAlign = "center";
        text.alpha = 0;
        text.scaleX = text.scaleY = 4;
        _container.addChild(text);

        createjs.Tween.get(text)
            .wait(500)
            .to({y: 0,
                 alpha : 1,
                 scaleX :1,
                 scaleY : 1}, 1000, createjs.Ease.quartOut);
        
        createjs.Tween.get(text)
            .to({y: 800}, 0, createjs.Ease.quartOut)
            .wait(300)
            .to({y: -70}, 1000, createjs.Ease.quartOut);

        createjs.Tween.get(text)
            .to({y: 800}, 0, createjs.Ease.quartOut)
            .wait(500)
            .to({y: 0}, 1000, createjs.Ease.quartOut);



        //btn
        var background = new createjs.Shape();
        background.name = "background";
        background.graphics.beginFill("#6a7bff").drawRoundRect(-70, -30, 140, 60, 10);

        var label = new createjs.Text("RESTART", "20px bowlby_oneregular", "#FFFFFF");
        label.name = "label";
        label.textAlign = "center";
        label.textBaseline = "middle";

        _btnStart = new createjs.Container();
        _btnStart.name = "button";
        _btnStart.y = 120;
        _btnStart.addChild(background, label);
        _btnStart.mouseChildren = false;
        _container.addChild(_btnStart);
        _btnStart.addEventListener('click', _onClickStart);

        createjs.Tween.get(_btnStart)
            .to({y: 800}, 0)
            .wait(500)
            .to({y: 120}, 1000, createjs.Ease.quadInOut);

        stage.addChild(_container);
    }

    function _destroy() {
        if (_container) {
            _btnStart.removeAllEventListeners();
            stage.removeChild(_container);
            _container = null;
            _btnStart = null;
        }
    }

    function _onClickStart() {
        game.startGame();
    }
}