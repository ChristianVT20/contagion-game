$(document).ready(main);
function main(){
	drawParticle();
}
canvas = document.querySelector('canvas');
context = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
particles = 13;
imagesArray = ['images/characters/bz.png','images/characters/gz.png','images/characters/pz.png','images/characters/rz.png','images/characters/yz.png'];
var x, y, vy, particleArray = [];
particleImage = new Image();
particleImage.src = imagesArray[Math.floor(Math.random()*imagesArray.length)];
for (var i = 0; i < particles; i++){
	particleArray.push(new createParticle(i));
} 
function createParticle(i){
	this.x = Math.round(Math.random()*canvas.width);
	this.y = Math.round(Math.random()*canvas.height);
	this.vy= Math.round(Math.random() + 1);
	this.particleImage = new Image();
	this.particleImage.src = imagesArray[Math.floor(Math.random()*imagesArray.length)];
}
function drawParticle(){
	context.fillStyle = '#000';
	context.rect(0,0,canvas.width, canvas.height);
	context.fill();

	for(var i = 0; i < particleArray.length; i++){
		var f = particleArray[i];
		context.drawImage(f.particleImage, f.x, f.y);
		f.x+=(f.vy * 2);
		if(f.x > canvas.width){
			f.x = -particleImage.width;
		}
	}
	requestAnimationFrame(drawParticle);
}


