var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

var bgReady = false;
var bgImage = new Image();
bgImage.src = "move/background.png";
bgImage.onload = function(){
	bgReady = true;
}

var heroReady = false;
var heroImage = new Image();
heroImage.src = "move/hero.png";
heroImage.onload = function(){
	heroReady = true;
}

var monsterReady = false;
var monsterImage = new Image();
monsterImage.src = "move/monster.png";
monsterImage.onload = function(){
	monsterReady = true;
}


var hero = {
	speed: 256,
	x: canvas.width/2,
	y: canvas.height/2
}

function monster() {
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.speed = 100;
	this.xDirection = 1;
	this.yDirection = 1;
	this.move = function (modifier) {
		this.x += this.xDirection * this.speed * modifier;
		this.y += this.yDirection * this.speed * modifier;
		if (this.x >= canvas.width - 32)
		{
			this.x = canvas.width - 32;
			this.xDirection = -1;
		}else if (this.x <= 0)
		{
			this.x = 0;
			this.xDirection = 1;
		}else if (this.y >= canvas.height - 32)
		{
			this.y = canvas.height - 32;
			this.yDirection = -1;
		}else if (this.y <= 0)
		{
			this.y = 0;
			this.yDirection = 1;
		}

	};
}

var monsterSum = 0;
var monsterList = new Array();
monsterList[monsterSum] = new monster();


var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
});


var Move = function (modifier) {

	if (38 in keysDown) {
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) {
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) {
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) {
		hero.x += hero.speed * modifier;
	}
	
	if (hero.x >= canvas.width - 32) {
		hero.x = 0;
	}else if (hero.x <= 0) {
		hero.x = canvas.width - 32;
	}
	if (hero.y >= canvas.height - 32) {
		hero.y = 0;
	}else if (hero.y <= 0) {
		hero.y = canvas.height - 32;
	}

	for (var i = 0; i <= monsterSum; i++) {
		monsterList[i].move(modifier);	
	}
	
}

var Draw = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0 ,0);
	}
	
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	
	if (monsterReady) {
		for (var i = 0; i <= monsterSum; i++)
		ctx.drawImage(monsterImage, monsterList[i].x, monsterList[i].y);
	}
	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font =  "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	
	last = Date.now() - start;

	ctx.fillText(last/1000, 32, canvas.height - 64);
}

var Check = function () {
	
	if (monsterSum != Math.floor(last / 5000)){
		monsterSum ++;
		monsterList[monsterSum] = new monster();
	}


	for (var i = 0; i <= monsterSum; i++) {
		if (
			(monsterList[i].x - 32) <= hero.x
			&& hero.x <= (monsterList[i].x + 32)
			&& (monsterList[i].y - 32) <= hero.y
			&& hero.y <= (monsterList[i].y + 32)
		) {
			end = Date.now();
			alert("你坚持了" + (end - start)/1000 + "秒");
			End();
		}
	}
}

var End = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0 ,0);
	}
	window.clearInterval(timer);
	return;
}

var main = function () {
	var now = Date.now();
	var delta = now - then;
	Move(delta / 1000);//每次间隔时间根本不是1ms
	Draw();
	Check();
	
	then = now;
}


//reset();
var then = Date.now();
var start = then;
timer = setInterval(main, 1); //1s //bug所在

