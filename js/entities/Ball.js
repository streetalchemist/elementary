var Ball = pulse.Sprite.extend({
   velocity:{},
   newX:null,
   newY:null,
   element:null,

   init: function(args) {

      args = args || {};

      //Initialize defaults
      args.src = 'images/entities/ball.png';

      //Call parent function
      this._super(args);

      //Pick random direction
      var newDirection = Math.random()*(2*Math.PI);
      this.velocity.total = 125;
      this.velocity.x = this.velocity.total*Math.cos(newDirection);
      this.velocity.y = this.velocity.total*Math.sin(newDirection);

      this.size = { width: 32, height: 32 };

      this.setupAnimations();

   },

   setupAnimations: function() {
      // Setup the animation.
      var ballNormal, ballEarth, ballAir, ballFire, ballWater;

      ballNormal = new pulse.AnimateAction({
         name: 'normal',
         size : { width:32, height:32 },
         bounds : { width: 160, height: 32},
         frames : [0],
         frameRate : 0 /* FPS */
      });

      ballEarth = new pulse.AnimateAction({
         name: 'earth',
         size : { width:32, height:32 },
         bounds : { width: 160, height: 32},
         frames : [1],
         frameRate : 0 /* FPS */
      });

      ballAir = new pulse.AnimateAction({
         name: 'air',
         size : { width:32, height:32 },
         bounds : { width: 160, height: 32},
         frames : [2],
         frameRate : 0 /* FPS */
      });

      ballFire = new pulse.AnimateAction({
         name: 'fire',
         size : { width:32, height:32 },
         bounds : { width: 160, height: 32},
         frames : [3],
         frameRate : 0 /* FPS */
      });

      ballWater = new pulse.AnimateAction({
         name: 'water',
         size : { width:32, height:32 },
         bounds : { width: 160, height: 32},
         frames : [4],
         frameRate : 0 /* FPS */
      });

      this.addAction(ballNormal);
      this.addAction(ballEarth);
      this.addAction(ballAir);
      this.addAction(ballFire);
      this.addAction(ballWater);

      this.runAction('normal');


   },

   checkPaddles: function() {
      for(paddle in game.paddles) {
         if(util.intersects(this.bounds,game.paddles[paddle].bounds)) {
            var paddleHit = {};
            paddleHit.paddle = paddle;
            paddleHit.direction = util.getIntersectingSide(this.bounds,game.paddles[paddle].bounds);
            game.sounds.paddleHit.play();
            game.paddles[paddle].setElement(this.element);
            return paddleHit;
         }
      }
      return false;
   },

   checkBounds: function() {
      var bound = {};
      if(this.position.x - this.size.width/2 > game.engine.size.width) {
         bound.element = "air";
      } else if(this.position.y - this.size.height/2 > game.engine.size.height) {
         bound.element = "fire";
      } else if(this.position.x + this.size.width/2 < 0) {
         bound.element = "water";
      } else if(this.position.y + this.size.height/2 < 0) {
         bound.element = "earth";
      }
      return bound;
   },

   update: function(deltaT) {

      //Handle Movement within bounds
      this.newX = this.position.x + this.velocity.x * (deltaT/1000);

      this.newY = this.position.y + this.velocity.y * (deltaT/1000);

      var paddleHit = this.checkPaddles() || {};
      if(paddleHit.direction) {
         var activePaddle = game.paddles[paddleHit.paddle];
         switch(paddleHit.direction) {
            case "north":
               this.newY = (this.size.height/2+1)+activePaddle.position.y + activePaddle.size.height;
               this.velocity.y *= -1;
               break;
            case "east":
               this.newX = activePaddle.position.x-1 - (this.size.width/2);
               this.velocity.x *= -1;
               break;
            case "south":
               this.newY = activePaddle.position.y-1 - (this.size.height/2);
               this.velocity.y *= -1;
               break;
            case "west":
               this.newX = (this.size.width/2+1)+activePaddle.position.x + activePaddle.size.width;
               this.velocity.x *= -1;
               break;
         }
      }

      this.position.x = this.newX;
      this.position.y = this.newY;

      this._super(deltaT);
   }
});