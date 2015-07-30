$(document).ready(main);

function main(){
	$('#ventana2').modal('show');
	$('.carousel').carousel({
  		interval: 700 * 10
	});
	hits = 1;
	infected_counter = 1;
	victims_counter = [];
	score = 0;
	init();
	mouseEvents();
}
/*
* It Validates when user is clicking 
*/
function mouseEvents(){
	$('.tile').mousedown(function(event) {
		refresh(0, 0);
		var color, chain;
   	 	switch (event.which) {
	        case 1:
	            if(isHealthy($(this))) {
	            	chain = validate($(this), $(this).attr('color'));
	           		if(chain > 0){
	           			playAudio(0);
	           			hits++;
	            		if((chain > 3) && (victims_counter.length > 0)){
	            			combo(chain);
	            		}
			            refresh(chain, (chain*10));
			            //console.log("infected_counter: " +infected_counter+" CHAIN: " +chain);
		            }
	            }else{
	            	special($(this));
	            	hits++;
	            }
            break;
	    }
	});		
}
/*
*It creates the board
*/
function init(){
	colorList = ['orange','blue','green', 'red', 'purple', 'yellow'];
	paintAllTiles(colorList);
}
/*
* This function paints the board.
*/
function paintAllTiles(colorList){
	var color;
	for(var f = 1; f <= 16; f++){
		for (var c = 1; c <= 16; c++) {
			color = colorList[Math.floor(Math.random()* colorList.length)];
			$('#'+f+'-'+c).addClass(color+'_victim');
			$('#'+f+'-'+c).attr('color', color);
			victims_counter.push(f + '-' + c);
		}
	}
	$('#1-1').removeClass('healthy').removeClass($('#1-1').attr('color') + '_victim').addClass('infected').addClass('green_zombie');
	$('#1-1').removeAttr( "color" );
	$('#1-1').attr('color','green');
	victims_counter.splice('1-1', 1);
}
/*
*This function spread the virus recursively by the adjacents positions
*/
function validate(tile, color_infected){
	var chain = 0;
	if((tile.length) && (tile.attr('color') == color_infected) && (isHealthy(tile)) && (isExposed(tile))){
		var actual = tile.attr('id');
		var coordinate = actual.split("-");
		var xAxis = parseInt(coordinate[0]);
		var yAxis = parseInt(coordinate[1]);
		var neighbors = [(xAxis-1), yAxis, 
					    xAxis, (yAxis-1),	
				        xAxis, (yAxis+1),
			            (xAxis+1), yAxis];
		infect(tile, color_infected);
		
		chain++;
		//Recursives calls
		chain += validate($('#'+neighbors[0]+'-'+(neighbors[1])), color_infected);
		chain += validate($('#'+neighbors[2]+'-'+(neighbors[3])), color_infected);
		chain += validate($('#'+neighbors[4]+'-'+(neighbors[5])), color_infected);
		chain += validate($('#'+neighbors[6]+'-'+(neighbors[7])), color_infected);	
	}
	return(chain);
}
/*
* this function finds out if a Tile is a Zombie or a victim
*/
function isHealthy(tile){
	var healthy = false;
	if(tile.hasClass('healthy')){
		healthy = true;
	}
	return(healthy);
}
/*
* This function finds out if a Tile clicked is exposed directly to a zombie virus, that is adjacent to a Zombie
*/
function isExposed(tile){
	var exposed = false;
	var counter = 0;
	var actual = tile.attr('id');
	var coordinate = actual.split("-");
	var xAxis = parseInt(coordinate[0]);
	var yAxis = parseInt(coordinate[1]);
	var neighbors= [(xAxis-1), yAxis, 
				   xAxis, (yAxis-1),	
			       xAxis, (yAxis+1),
		           (xAxis+1), yAxis];
	while((exposed==false) && (counter < 8)){
		var target = $('#'+neighbors[counter]+'-'+(neighbors[counter+1]));
		counter+=2;
		if((target.length) && (target.hasClass('infected'))){
			exposed = true;
		}
	}
	return(exposed);
}
/*
*It changes the image and marks as infected
*/
function infect(tile, color){
	tile.removeClass('healthy').removeClass(color+'_victim').addClass('infected').addClass('green_zombie');
	tile.removeAttr( "color" );
	tile.attr('color','green');
	//console.log('BORRANDO: '+ tile.attr('id'));
	victims_counter.splice(victims_counter.indexOf(tile.attr('id')), 1);
}
/*
* When the user achives a combo, this function turns randomly a healthy position into a Special Zombie 
*/
function combo(chain){
	var victim = Math.floor(Math.random()* victims_counter.length);
	var tile = $('#' + victims_counter[victim]);
	var color = tile.attr('color');
	switch(chain){
		case 4:
			tile.removeClass('healthy').removeClass(color + '_victim').addClass('infected').addClass('yellow_zombie');
			tile.removeAttr( "color" );
			tile.attr('color','yellow');
			victims_counter.splice(victim, 1);
			refresh(1,10);
		break;
		case 5:
			tile.removeClass('healthy').removeClass(color +'_victim').addClass('infected').addClass('blue_zombie');
			tile.removeAttr( "color" );
			tile.attr('color','blue');
			victims_counter.splice(victim, 1);
			refresh(1,50);
		break;
		case 6:
			tile.removeClass('healthy').removeClass(color +'_victim').addClass('infected').addClass('purple_zombie');
			tile.removeAttr( "color" );
			tile.attr('color','purple');
			victims_counter.splice(victim, 1);
			refresh(1,100);
		break;
		default:
			tile.removeClass('healthy').removeClass(color +'_victim').addClass('infected').addClass('red_zombie');
			tile.removeAttr( "color" );
			tile.attr('color','red');
			victims_counter.splice(victim, 1);
			refresh(1,200);
		break;
	}
}
/*
* Whe user clicks on a Special Zombie this function applies the special move according to the Zombie's color 
*/
function special(tile){
	var color = tile.attr('color'), neighbors = [];
	var actual = tile.attr('id');
	var coordinate = actual.split("-");
	var xAxis = parseInt(coordinate[0]);
	var yAxis = parseInt(coordinate[1]);
	switch(color){
		case 'green':
		break;
		case 'yellow':
			neighbors = [(xAxis),(yAxis-1),(xAxis),(yAxis+1),(xAxis-1),(yAxis),(xAxis+1),(yAxis)];
			special_infection(tile,neighbors);
			playAudio(1);
		break;
		case 'blue':
			neighbors = [(xAxis),(yAxis-1),(xAxis),(yAxis+1),(xAxis-1),(yAxis),(xAxis+1),(yAxis),
						(xAxis),(yAxis-2),(xAxis),(yAxis+2),(xAxis-2),(yAxis),(xAxis+2),(yAxis)];
			special_infection(tile,neighbors);
			playAudio(2);
		break;
		case 'purple':
			neighbors = [(xAxis),(yAxis-1),(xAxis),(yAxis+1),(xAxis-1),(yAxis),(xAxis+1),(yAxis),
						(xAxis-1),(yAxis-1),(xAxis-1),(yAxis+1),(xAxis+1),(yAxis+1),(xAxis+1),(yAxis-1),
						(xAxis),(yAxis-2),(xAxis),(yAxis+2),(xAxis-2),(yAxis),(xAxis+2),(yAxis)]
			special_infection(tile,neighbors);
			playAudio(3);
		break;
		case 'red':
			neighbors = [(xAxis),(yAxis-1),(xAxis),(yAxis+1),(xAxis-1),(yAxis),(xAxis+1),(yAxis),
						(xAxis-1),(yAxis-1),(xAxis-1),(yAxis+1),(xAxis+1),(yAxis+1),(xAxis+1),(yAxis-1),
						(xAxis),(yAxis-2),(xAxis),(yAxis+2),(xAxis-2),(yAxis),(xAxis+2),(yAxis),
						(xAxis-2),(yAxis-2),(xAxis-2),(yAxis+2),(xAxis+2),(yAxis+2),(xAxis+2),(yAxis-2)];
			special_infection(tile,neighbors);
			playAudio(4);
		break;
	}
}
/*
*It turns the images and the ids of the html
*/
function special_infection(tile, neighbors){
	var counter = 0, target, color, chain = 0;
	color = $(tile).attr('color');
	$(tile).removeClass(color+'_zombie').addClass('green_zombie');
	$(tile).attr('color', 'green');
	while(counter < neighbors.length){
		target = $("#" + neighbors[counter]+ "-" +neighbors[counter+1]);
		if(target.length && target.hasClass('healthy')){
			color = target.attr('color');
			target.removeClass('healthy').removeClass(color +'_victim').addClass('infected').addClass('green_zombie');
			target.removeAttr( "color" );
			target.attr('color','green');
			chain++;
			victims_counter.splice(victims_counter.indexOf(target.attr('id')), 1);
		}
		counter+=2;
	}
	refresh(chain, (chain*100));
}
/*
* It changes the left panel (score and leftovers)
*/
function refresh(newInfectedCounter, newScore){
	score += newScore;
	infected_counter += newInfectedCounter;
	$('#score_panel .media #score h3').html(score);
    $('#score_panel .media-body span h4').html((infected_counter) +'/256');
    if(infected_counter == 256){
    	$('#ventana1 .modal-body h2').html('Your score was: ' + score+' points');
    	$('#ventana1 .modal-body #hits h4').html('In ' + hits+' hits');
    	$('#ventana1 .modal-body #average h4').html('Ratio: '+Math.round((score/hits) * 100) / 100+' points per hit');
    	$('#ventana1').modal('show');
    	playAudio(5);
    }
}
/*
* This function activates the audio according to the event that is presenting
*/
function playAudio(type){
	var audio;
	switch(type){
		case 0:
			audio = new Audio('../audio/zombie-'+(Math.floor(Math.random() * 20))+'.wav');
			audio.volume = parseInt($('#volume').val())/100;
			audio.play();
		break;
		case 1:
			audio = new Audio('../audio/Carnage.wav');
			audio.volume = parseInt($('#volume').val())/100;
			audio.play();
		break;
		case 2:
			audio = new Audio('../audio/MegaKill.wav');
			audio.volume = parseInt($('#volume').val())/100;
			audio.play();
		break;
		case 3:
			audio = new Audio('../audio/KillingSpree.wav');
			audio.volume = parseInt($('#volume').val())/100;
			audio.play();
		break;
		case 4:
			audio = new Audio('../audio/Massacre.wav');
			audio.volume = parseInt($('#volume').val())/100;
			audio.play();
		break;
		case 5:
			audio = new Audio('../audio/applause.wav');
			audio.volume = parseInt($('#volume').val())/100;
			audio.play();
		break;
	}
}