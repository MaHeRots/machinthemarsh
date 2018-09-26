//on va créé nos différents éléments de jeu ...
var stage;
var game;
var hero;
var ennemis;
var score;
var home;


function initGame() {

    //creation zone de jeu
    stage = new createjs.Stage("mmigame");
    window.stage = stage;


    //je créé un Rond rouge
    /*var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 70;
    stage.addChild(circle);
    stage.update();

    createjs.Tween.get(circle)
        .to({ x: 400 }, 1000, createjs.Ease.sineOut)
        .to({ y: 200 }, 2000, createjs.Ease.elasticOut)
        .to({ alpha: 0, y: 325 }, 700)

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(e){ stage.update(e); });
    return;*/



    //gestion des ecrans de jeu
    game = new GameLogic();

    //on créé les différents éléments
    home = new HomeScreen();
    score = new Score();
    hero = new SuperHero();
    ennemis = new Ennemis();

    game.startHome();

    //rendu du jeu ...
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(e){
        //function qui s'execute 60fois / s !!
        hero.move();

        //on rafraichit le tout ... pour redessiner !
        stage.update(e);
    });

}



///////////////////

function GameLogic() {

    //////////////////////

    var obj = {
        startHome: _startHome,
        startGame: _startGame
    };
    return obj;

    //////////////////////

    function _startHome() {
        home.create();
        score.destroy();
        hero.destroy();
        ennemis.destroy();
        stage.removeAllEventListeners("stagemousedown");
    }

    function _startGame() {
        home.destroy();
        score.create();
        hero.create();
        ennemis.create();
        stage.on("stagemousedown", function (e) {
            hero.gun.shoot();
            e.preventDefault();
        });
    }
}


//hero principal
function SuperHero() {
    var _spriteSheet, _animation, _portrait;
    var _vitesse = 3;
    var _sens = 1; /* soit 1 soit -1 */


    //////////////////////

    var obj = {
        create: _create,
        destroy: _destroy,
        move: _move,

        container: null,
        gun: null,
        height: null,
    };
    return obj;

    //////////////////////

    //on créé l'animation..
    function _create() {
        if (!obj.container) {

            obj.container = new createjs.Container();
            _spriteSheet = new createjs.SpriteSheet(game_assets.spritesheets.hero);
            _animation = new createjs.Sprite(_spriteSheet, 'fly');

            _portrait = new createjs.Bitmap(game_assets.pictures.hero);
            _portrait.scaleX = _portrait.scaleY = 0.2;
            _portrait.x = 99;
            _portrait.y = 5;
            _portrait.rotation = 25;

            obj.container.addChild(_animation, _portrait);
            obj.height = obj.container.getBounds().height;
            stage.addChild(obj.container);
            obj.gun = new LaserGun();
        }
    }

    function _destroy() {
        if (obj.container) {
            obj.gun.destroy();
            stage.removeChild(obj.container);
            obj.container = null;
        }
    }


    function _move() {
        if (!obj.container)return;

        //on bouge notre hero, sur la position y
        obj.container.y += _vitesse * _sens;
        //si _sens = -1 ==> _vitesse*-1 = -_vitesse
        if (obj.container.y >= stage.canvas.height - obj.height) {
            _sens = -1;
        }
        if (obj.container.y <= 0) {
            _sens = 1;
        }

        obj.gun.update();
    }
};


//le laser
function LaserGun() {
    var _container;

    //////////////////////

    var obj = {
        shoot: _shoot,
        destroy: _destroy,
        update: _update,
        locked: false
    };
    return obj;

    //////////////////////

    //on créé l'animation..
    function _create() {
        if (!_container) {
            _container = new createjs.Container();
            stage.addChild(_container);
        }
    }

    function _destroy() {
        if (_container) {
            stage.removeChild(_container);
            _container = null;
        }
    }


    function _shoot() {
        if (obj.locked)return;

        _create();

        var blurFilter = new createjs.BlurFilter(15, 5, 1);
        var bounds = blurFilter.getBounds();

        var laser = new createjs.Shape();
        laser.graphics.beginFill("#ff0000").drawRect(0, 0, 20, 4);
        laser.filters = [blurFilter];
        laser.setBounds(0, 0, 20, 4);
        laser.cache(bounds.x, bounds.y, 20 + bounds.width, 4 + bounds.height);


        laser.x = hero.container.x + 125;
        laser.y = hero.container.y + 62;

        _container.addChild(laser);


    }

    function _update() {
        _create();

        var nbLasers = _container.getNumChildren();
        //for(var i = 0; i < nbLasers; i++){
        for (var i = nbLasers - 1; i >= 0; i--) {
            var monLaser = _container.getChildAt(i);
            monLaser.x += 40;


            //supprime le lase si trop loin
            if (monLaser.x > stage.canvas.width) {
                _container.removeChildAt(i);
            }

            if (!obj.locked) {
                //si je touche un ennemi ...
                if (checkCollision2(monLaser, ennemis.currentEnnemi)) {
                    //on supprime le laser
                    _container.removeChildAt(i);

                    //ennemis touches !
                    ennemis.onTouched();
                }
            }


        }
    }
};


//les ennemis
function Ennemis() {
    var _container;


    var _positionMin = stage.canvas.height - 300;
    var _positionMax = stage.canvas.height - 40;
    var _positionHide = stage.canvas.height + 400;
    var _isHidden = false; //si true -> mon podium est caché

    var _chrono;

    var _animGuys, _animCat, /*_bmpGuy,*/ _guy;

    //////////////////////

    var obj = {
        create: _create,
        destroy: _destroy,
        onTouched: _onTouched,
        currentEnnemi: null,
    };
    return obj;

    //////////////////////

    //on créé l'animation..
    function _create() {
        if (!_container) {
            _container = new createjs.Container();

            var podium = new createjs.Bitmap('assets/podium.png');
            _container.addChild(podium);


            var spriteSheetGuys = new createjs.SpriteSheet(game_assets.spritesheets.ennemis);
            _animGuys = new createjs.Sprite(spriteSheetGuys, 'guy1');


            _guy = new createjs.Container();
            _guy.name = "guys";
            _guy.addChild(_animGuys);
            _guy.regX = 40;
            _guy.regY = 180;
            _guy.setBounds(0, 0, 80, 180);
            _guy.x = 65;
            _guy.y = 15;

            //_createPictureGuy();


            var spriteSheetCat = new createjs.SpriteSheet(game_assets.spritesheets.cat);
            _animCat = new createjs.Sprite(spriteSheetCat, 'love');
            _animCat.name = "cat";
            _animCat.regX = 130 / 2;
            _animCat.regY = 130;
            _animCat.x = 60;
            _animCat.y = 15;


            _container.addChild(_animCat, _guy);

            //on place le container ...
            stage.addChild(_container);
            _container.x = stage.canvas.width - 170;
            _container.y = _positionMin;

            _chooseEnnemi();
            _startChrono();

        }
    }

    /*function _createPictureGuy() {
        if (_bmpGuy) {
            _guy.removeChild(_bmpGuy);
            _bmpGuy = null;
        }
        _bmpGuy = new createjs.Bitmap(window.MMI_FB.getRandomFriend());
        _bmpGuy.scaleX = _bmpGuy.scaleY = 0.39;
        _bmpGuy.x = 10;
        _bmpGuy.y = 33;
        _guy.addChild(_bmpGuy);
    }*/

    function _destroy() {
        _stopChrono();
        if (_container) {
            stage.removeChild(_container);
            _container = null;
        }
    }


    function _onTouched() {
        hero.gun.locked = true;
        obj.currentEnnemi.scaleX = obj.currentEnnemi.scaleY = 1;

        createjs.Tween.get(obj.currentEnnemi)
            .to({scaleX: 1.5, scaleY: 1.5}, 300, createjs.Ease.quartOut)
            .to({scaleX: 1, scaleY: 1}, 800, createjs.Ease.elasticOut)
            .call(function () {
                hero.gun.locked = false;
            });

        if (obj.currentEnnemi.name == "cat") {
            //CHAT !!
            score.update(-100);
        } else {
            //HIPSTER !!!
            score.update(10);
        }
    }


    function _chooseEnnemi() {
        var random = getRandomRange(0, 7);
        if (random >= 4) {
            obj.currentEnnemi = _animCat;
            _animCat.visible = true;
            _guy.visible = false;
        } else {
            obj.currentEnnemi = _guy;
            _guy.visible = true;
            _animCat.visible = false;
            _animGuys.gotoAndStop(random);
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
        _chrono = setInterval(_onTickPodium, 1000);
    }

    function _onTickPodium() {
        //function qui s'execute a chaque pulsation de mon chrono
        var pos = 0;
        if (_isHidden == true) {
            //mon podium est cache, on l'affiche
            _isHidden = false;
            pos = getRandomRange(_positionMin, _positionMax);
            _chooseEnnemi();
        } else {
            //mon podium est affiche, on le cache
            _isHidden = true;
            pos = _positionHide;
        }
        //_container.y = pos;
        createjs.Tween.get(_container).to({y: pos}, 500, createjs.Ease.quartOut);

    }

};


// Affichage du score
function Score() {
    var _text;
    var _score = 0;
    //////////////////////

    var obj = {
        create: _create,
        destroy: _destroy,
        update: _update
    };
    return obj;

    //////////////////////

    function _create() {
        _text = new createjs.Text("Score : " + _score, "30px bowlby_oneregular", "#ff7700");
        _text.x = stage.canvas.width / 2;
        _text.y = 20;
        _text.textAlign = "center";
        stage.addChild(_text);
    }

    function _destroy() {
        if (_text) {
            stage.removeChild(_text);
            _text = null;
        }
    }

    function _update(score) {
        _score += score;
        _text.text = "Score : " + _score;
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

        _container = new createjs.Container();
        _container.x = stage.canvas.width / 2;
        _container.y = stage.canvas.height / 2;

        var text, animation, spriteSheet;

        text = new createjs.Text("Mmi Game", "50px bowlby_oneregular", "#ff5382");
        text.y = -70;
        text.textAlign = "center";
        _container.addChild(text);

        createjs.Tween.get(text)
            .to({y: 800}, 0, createjs.Ease.quartOut)
            .wait(300)
            .to({y: -70}, 1000, createjs.Ease.quartOut);


        text = new createjs.Text("Tape tes amis et ne bute pas le chat !", "20px bowlby_oneregular", "#ff5382");
        text.textAlign = "center";
        _container.addChild(text);

        createjs.Tween.get(text)
            .to({y: 800}, 0, createjs.Ease.quartOut)
            .wait(500)
            .to({y: 0}, 1000, createjs.Ease.quartOut);


        spriteSheet = new createjs.SpriteSheet(game_assets.spritesheets.hero);
        animation = new createjs.Sprite(spriteSheet, 'fly');
        _container.addChild(animation);
        animation.x = -200;
        animation.y = -200;


        createjs.Tween.get(animation)
            .to({x: -800}, 0)
            .wait(1000)
            .to({x: -200}, 1000, createjs.Ease.quadInOut);

        spriteSheet = new createjs.SpriteSheet(game_assets.spritesheets.cat);
        animation = new createjs.Sprite(spriteSheet, 'love');
        _container.addChild(animation);
        animation.x = 50;
        animation.y = -200;

        createjs.Tween.get(animation)
            .to({x: 800}, 0)
            .wait(600)
            .to({x: 50}, 1000, createjs.Ease.quadInOut);


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














