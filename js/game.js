var game = {
	score:0,
	lives:3,
	activeScene:null,
	elements:["earth","air","fire","water"],

	//Generates a ball with a random element from the list
	getElementalBall:function(){
		var newElementalBall = new Ball();
		newElementalBall.element = this.elements[Math.floor(Math.random()*game.elements.length)];
		console.log("New ball is: "+newElementalBall.element);
		newElementalBall.runAction(newElementalBall.element);
		return newElementalBall;
	},

	//Actually adds the ball to the screen
	launchBall:function(){
		game.balls.push(game.getElementalBall());
		game.balls[0].position = {x:game.engine.size.width/2, y:game.engine.size.height/2};
		game.level.mainLayer.addNode(game.balls[0]);
	},

	//This takes care of the actual level setup the first time it needs done
	initLevel:function(){
		this.score = 0;
		this.lives = 3;

		var levelScreenImg = new pulse.Sprite({"src":"images/screens/levelScreen.png"});
		levelScreenImg.anchor = {x: 0, y:0};
		game.level.mainLayer.addNode(levelScreenImg);

		game.level.scoreLabel = new pulse.CanvasLabel({ text: 'Score: '+this.score });
      	game.level.scoreLabel.position = { x: 320, y: 320 };
      	game.level.scoreLabel.fillColor = "#ffffff";
      	game.level.mainLayer.addNode(game.level.scoreLabel);

      	game.level.livesLabel = new pulse.CanvasLabel({text: 'Lives: '+this.lives});
      	game.level.livesLabel.position = {x: 320, y: 350};
      	game.level.livesLabel.fillColor = "#ffffff";
      	game.level.mainLayer.addNode(game.level.livesLabel);

		//Create Paddles
		game.paddles = {};
		
		game.paddles.earth = new Paddle({"orientation":"horizontal", "buttonPos":"d", "buttonNeg":"a"});
		game.paddles.earth.position = {x:256, y:30};
		game.level.mainLayer.addNode(game.paddles.earth);

		game.paddles.air = new Paddle({"orientation":"vertical", "buttonPos":"arrowDown", "buttonNeg":"arrowUp"});
		game.paddles.air.position = {x:578, y:256};
		game.level.mainLayer.addNode(game.paddles.air);

		game.paddles.fire = new Paddle({"orientation":"horizontal", "buttonPos":"arrowRight", "buttonNeg":"arrowLeft"});
		game.paddles.fire.position = {x:256, y:578};
		game.level.mainLayer.addNode(game.paddles.fire);

		game.paddles.water = new Paddle({"orientation":"vertical", "buttonPos":"s", "buttonNeg":"w"});
		game.paddles.water.position = {x:30, y:256};
		game.level.mainLayer.addNode(game.paddles.water);

		game.balls = [];
	},

	//This resets the level variables so that the subsequent play throughs are fresh
	resetLevel:function(){
		this.score = 0;
		this.lives = 3;
		game.paddles.earth.setElement('normal');
		game.paddles.earth.position = {x:256, y:30};
		game.paddles.air.setElement('normal');
		game.paddles.air.position = {x:578, y:256};
		game.paddles.fire.setElement('normal');
		game.paddles.fire.position = {x:256, y:578};
		game.paddles.water.setElement('normal');
		game.paddles.water.position = {x:30, y:256};
		game.level.scoreLabel.text = "Score: "+game.score;
		game.level.livesLabel.text = "Lives: "+game.lives;
	},

	//This sets up all of the sounds we'll need and gives them appropriate names that we can use later
	initSounds:function() {
		game.sounds = {};
		game.sounds.paddleHit = new pulse.Sound({
			type:"html5",
			filename: "sounds/paddleHit"
		});
		game.sounds.score = new pulse.Sound({
			type:"html5",
			filename: "sounds/score"
		});
		game.sounds.explode = new pulse.Sound({
			type:"html5",
			filename: "sounds/explode"
		});
		game.sounds.bonus = new pulse.Sound({
			type:"html5",
			filename: "sounds/bonus"
		});
	},

	//This does what it says, and removes all nodes form a given pulse.layer
	removeAllNodesFromLayer:function(layer) {
		for(node in layer.objects) {
			layer.removeNode(node);
		}
	},

	//Event handler for when the starting screen is clicked
	sceneStartClicked:function(){
		game.sceneStart.events.unbindFunction('click', game.sceneStartClicked);
		initSceneLevel(true);
	},

	//Event handler for when the game over screen is clicked
	sceneEndClicked:function(){
		game.sceneEnd.events.unbindFunction('click', game.sceneEndClicked);
		initSceneLevel(false);
	}
};


//This sets up the entire game once pulse has loaded and is ready to go
pulse.ready(function(){
	//Setup Engine
	game.engine = new pulse.Engine( { gameWindow: "elementaryContainer", size: { width: 640, height: 640 } } );

	//Setup Sounds
	game.initSounds();

	//Setup Start Screen
	game.sceneStart = new pulse.Scene();
	game.sceneStart.mainLayer = new pulse.Layer();
	game.sceneStart.mainLayer.anchor = {x:0, y:0};
	game.sceneStart.addLayer(game.sceneStart.mainLayer);

	//Setup Level
	game.level = new pulse.Scene();
	game.level.mainLayer = new pulse.Layer();
	game.level.mainLayer.anchor = { x: 0, y: 0 };
	game.level.addLayer(game.level.mainLayer);

	//Setup End Screen
	game.sceneEnd = new pulse.Scene();
	game.sceneEnd.mainLayer = new pulse.Layer();
	game.sceneEnd.mainLayer.anchor = {x:0,y:0};
	game.sceneEnd.addLayer(game.sceneEnd.mainLayer);

	//Add scenes
	game.engine.scenes.addScene(game.sceneStart);
	game.engine.scenes.addScene(game.level);
	game.engine.scenes.addScene(game.sceneEnd);


	bindKeys();

	initSceneStart();

	game.engine.go(17, loop);
});

var initSceneStart = function() {
	game.removeAllNodesFromLayer(game.sceneStart.mainLayer);

	game.engine.scenes.activateScene(game.sceneStart);
	game.activeScene = game.sceneStart;
	var startScreenImg = new pulse.Sprite({"src":"images/screens/startScreen.png"});
	startScreenImg.anchor = {x: 0, y:0};
	game.sceneStart.mainLayer.addNode(startScreenImg);

	game.sceneStart.events.bind('click', game.sceneStartClicked);
};

var initSceneLevel = function(firstRun) {
	if(firstRun) {
		game.initLevel();
	} else {
		game.resetLevel();
	}
	game.engine.scenes.activateScene(game.level);
	game.activeScene = game.level;

	game.launchBall();
};

var initSceneEnd = function() {
	game.removeAllNodesFromLayer(game.sceneEnd.mainLayer);

	game.engine.scenes.activateScene(game.sceneEnd);
	game.activeScene = game.sceneEnd;
	var endScreenImg = new pulse.Sprite({"src":"images/screens/endScreen.png"});
	endScreenImg.anchor = {x: 0, y:0};
	game.sceneEnd.mainLayer.addNode(endScreenImg);

	game.sceneEnd.events.bind('click', game.sceneEndClicked);
};


//This is the main game loop itself and it handles the main game logic
var loop = function() {
	if(game.activeScene == game.level) {
		for(var i = 0; i < game.balls.length; i++) {
			var element = game.balls[i].checkBounds().element;
			if(element) {
				
				if(element == game.balls[i].element) {
					game.score++;
					game.sounds.score.play();
					game.level.scoreLabel.text = "Score: "+game.score;
				} else {
					game.lives--;
					game.sounds.explode.play();
					game.level.livesLabel.text = "Lives: "+game.lives;
				}
				game.level.mainLayer.removeNode(game.balls[i].name);
				game.balls.splice(i,1);
				if(game.lives == 0) {
					initSceneEnd();
				} else {
					//Wait 2 seconds, then launch the next ball
					setTimeout(game.launchBall, 2000);
				}
			}
		}
	}
}

//This function essentially sets up a global object called game.keys that will give us the keys status at any time.
var bindKeys = function() {
	game.keys = {};
	game.level.events.bind('keydown', function(e) {
		if(e.keyCode == 87) {
	      game.keys.w = true;
	    }
	    if(e.keyCode == 65) {
	      game.keys.a = true;
	    }
	    if(e.keyCode == 83) {
	      game.keys.s = true;
	    }
	    if(e.keyCode == 68) {
	      game.keys.d = true;
	    }
	    if(e.keyCode == 37) {
	      game.keys.arrowLeft = true;
	    }
	    if(e.keyCode == 39) {
	      game.keys.arrowRight = true;
	    }
	    if(e.keyCode == 38) {
	      game.keys.arrowUp = true;
	    }
	    if(e.keyCode == 40) {
	      game.keys.arrowDown = true;
	    }
  	});

  	game.level.events.bind('keyup', function(e) {
		if(e.keyCode == 87) {
	      game.keys.w = false;
	    }
	    if(e.keyCode == 65) {
	      game.keys.a = false;
	    }
	    if(e.keyCode == 83) {
	      game.keys.s = false;
	    }
	    if(e.keyCode == 68) {
	      game.keys.d = false;
	    }
	    if(e.keyCode == 37) {
	      game.keys.arrowLeft = false;
	    }
	    if(e.keyCode == 39) {
	      game.keys.arrowRight = false;
	    }
	    if(e.keyCode == 38) {
	      game.keys.arrowUp = false;
	    }
	    if(e.keyCode == 40) {
	      game.keys.arrowDown = false;
	    }
  	});
}