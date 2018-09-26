//Gallery

// var contenucache = true;
// 	$ouvremoimonprojetstp = document.getElementsByClassName(".gallery container ul li a");
// 	$superprojet = document.getElementByClassName(".port");
// 	$fermemoimonprojetstp = document.getElementsByClassName(".close");


// function montremoisequejaicache()
// 	{
// 	if (contenucache)
// 		{
// 		contenucache = false;
// 		$superprojet.className = "superprojetaouvrir";
// 		}
// 	}

// function fermemoimonprojetstp(){
// 		{
// 		contenucache = true;
// 		$superprojetaouvrir.className = "superprojetaouvrir cache";
// 		}
// 	}

// 	$ouvremoimonprojetstp.onclick = function()
// {
// 	montremoisequejaicache();
// }

 // $('.section ul li a').click(function() {
 //     var itemID = $(this).attr('href');
 //     $('.gallery container ul').addClass('item_open');
 //     $(itemID).addClass('item_open');
 //     return false;
 // });

 // $('.close').click(function() {
 //     $('.port, .gallery container ul').removeClass('item_open');
 //     return false;
 // });




$(document).ready(function(){

// var ouvremoimonprojetstp = document.getElementsByClassName(".section ul li a");
// var cestcetruc = document.getElementsByClassName(".section ul");
// var fermemoimonprojetstp = document.getElementsByClassName(".close");
// var IDdeMonProjet = this.href;

	
//   	function ouvrirprojet() {
//      	cestcetruc.className += "item_open";
// 	    IDdeMonProjet.className += "item_open";
//     	return false;
//      	console.log("je montre mon projet");
//  	};

//  	function fermerprojet() {
//  		cestcetruc.removeClass('item_open');
// 	    IDdeMonProjet.removeClass('item_open');
//     	return false;
//     	console.log("je cache mon projet");
//  };

//      console.log("MERDE");

// if (ouvremoimonprojetstp.click) {
// 	ouvrirprojet();
// }

// if (fermemoimonprojetstp.click) {
// 	fermerprojet();
// }

 // portfolio
 $('.section ul li a').click(function() {
     var itemID = $(this).attr('href');
     $('.section ul').addClass('item_open');
     $(itemID).addClass('item_open');
     return false;
 });
 $('.close').click(function() {
     $('.port, .section ul').removeClass('item_open');
     return false;
 });
 $(".section ul li a").click(function() {
     $('html, body').animate({
         scrollTop: parseInt($("#top").offset().top)
     }, 400);
 });

});
