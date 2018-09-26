//function qui va calculer un chiffre
//aleatoire entre un min et un max
function getRandomRange(min, max) {
    var n = Math.random();
    // -> me donne un aléatoire entre 0 et 1 ex : 0.768657
    var nRange = (n * (max - min + 1)) + min;
    // -> me calcule un chiffre aléatoire a virgule
    // -> entre un min et un max
    var nRangeRound = Math.floor(nRange);
    // -> arrondi mon chiffre a l'inférieur
    return nRangeRound;
}


//detecte la collision entre 2 objets
function checkCollision2(obj1, obj2) {
    var pt1 = obj1.localToGlobal(0, 0);
    var bound1 = obj1.getBounds();
    var pt2 = obj2.localToGlobal(0, 0);
    var bound2 = obj2.getBounds();

    if (
        pt1.x >= pt2.x + bound2.width ||
        pt1.x + bound1.width <= pt2.x ||
        pt1.y >= pt2.y + bound2.height ||
        pt1.y + bound1.height <= pt2.y
    ) {
        return false;
    }

    return true;
}


//MODELE DE "CLASSE OBJET JS"

///////////////////

/*function MonObjetManager() {

    var _maproprietePrivee = "valeur";

    //////////////////////

    //on retourne un objet JS representant ce qu'on souhaite voir à l'exterieur
    var obj = {
        mafunctionpublique: _mafunctionprivee,

        maproprietepublique: "valeur"
    };
    return obj;
    //a partir de ce moment, juste des functions privées...

    //////////////////////

    //ici c'est privé !
    function _mafunctionprivee() {
        console.log("c'est privé")
    }
}*/


///////////////////



/*function Modele() {

    var _prop;

    //////////////////////

    var obj = {

    };
    return obj;

    //////////////////////

    function _dosomething() {

    }
}*/