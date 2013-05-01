var Paddle = pulse.Sprite.extend({
   orientation:null,
   controls:null,
   velocity:0,
   buttonPos:null,
   buttonNeg:null,
   maxVelocity:300,
   newX:null,
   newY:null,
   buffer:60,
   element:null,

   init: function(args) {

      args = args || {};

      //Initialize defaults
      this.orientation = args.orientation || "vertical";
      this.buttonPos = args.buttonPos;
      this.buttonNeg = args.buttonNeg;

      if(this.orientation == "horizontal") {
         args.src = 'images/entities/paddle-horizontal.png';
      } else {
         args.src = 'images/entities/paddle-vertical.png';
      }

      //Call parent function
      this._super(args);

      //Set the anchor point
      this.anchor = {x:0,y:0};
      if(this.orientation == "horizontal") {
         this.size = { width: 128, height: 32 };
      } else {
         this.size = { width: 32, height: 128 };
      }
      this.setupAnimations();
   },

   setupAnimations: function(){
      // Setup the animation.
      var paddleNormal;
      var paddleEarth;
      var paddleAir;
      var paddleFire;
      var paddleWater;

      if(this.orientation == "horizontal") {
         paddleNormal = new pulse.AnimateAction({
            name: 'normal',
            size : { width:128, height:32 },
            bounds : { width: 640, height: 32},
            frames : [0],
            frameRate : 0 /* FPS */
         });

         paddleEarth = new pulse.AnimateAction({
            name: 'earth',
            size : { width:128, height:32 },
            bounds : { width: 640, height: 32},
            frames : [1],
            frameRate : 0 /* FPS */
         });

         paddleAir = new pulse.AnimateAction({
            name: 'air',
            size : { width:128, height:32 },
            bounds : { width: 640, height: 32},
            frames : [2],
            frameRate : 0 /* FPS */
         });

         paddleFire = new pulse.AnimateAction({
            name: 'fire',
            size : { width:128, height:32 },
            bounds : { width: 640, height: 32},
            frames : [3],
            frameRate : 0 /* FPS */
         });

         paddleWater = new pulse.AnimateAction({
            name: 'water',
            size : { width:128, height:32 },
            bounds : { width: 640, height: 32},
            frames : [4],
            frameRate : 0 /* FPS */
         });
      } else {
         paddleNormal = new pulse.AnimateAction({
            name: 'normal',
            size : { width:32, height:128 },
            bounds : { width: 160, height: 128},
            frames : [0],
            frameRate : 0 /* FPS */
         });

         paddleEarth = new pulse.AnimateAction({
            name: 'earth',
            size : { width:32, height:128 },
            bounds : { width: 160, height: 128},
            frames : [1],
            frameRate : 0 /* FPS */
         });

         paddleAir = new pulse.AnimateAction({
            name: 'air',
            size : { width:32, height:128 },
            bounds : { width: 160, height: 128},
            frames : [2],
            frameRate : 0 /* FPS */
         });

         paddleFire = new pulse.AnimateAction({
            name: 'fire',
            size : { width:32, height:128 },
            bounds : { width: 160, height: 128},
            frames : [3],
            frameRate : 0 /* FPS */
         });

         paddleWater = new pulse.AnimateAction({
            name: 'water',
            size : { width:32, height:128 },
            bounds : { width: 160, height: 128},
            frames : [4],
            frameRate : 0 /* FPS */
         });
      }
        
        this.addAction(paddleNormal);
        this.addAction(paddleEarth);
        this.addAction(paddleAir);
        this.addAction(paddleFire);
        this.addAction(paddleWater);

        this.runAction('normal');
   },

   setElement: function(element) {
      var actions = this.runningActions;
      for(var i = 0; i < actions.length; i++) {
         actions[i].stop();
      }
      this.runAction(element);
   },

   update: function(deltaT) {
      //Handle Key Presses
      if(game.keys[this.buttonPos]) {
         this.velocity = this.maxVelocity;
      } else if(game.keys[this.buttonNeg]) {
         this.velocity = this.maxVelocity*-1;
      } else {
         this.velocity = 0;
      }

      //Handle Movement within bounds
      if(this.orientation == "horizontal") {
         this.newX = this.position.x + this.velocity * (deltaT/1000);
         if(this.newX < this.buffer) {
            this.newX = this.buffer;
         }
         if(this.newX + this.size.width > game.engine.size.width-this.buffer) {
            this.newX = game.engine.size.width-this.buffer-this.size.width;
         }
         this.position.x = this.newX;
      } else {
         this.newY = this.position.y + this.velocity * (deltaT/1000);
         if(this.newY < this.buffer) {
            this.newY = this.buffer;
         }
         if(this.newY + this.size.height > game.engine.size.height-this.buffer) {
            this.newY = game.engine.size.height-this.buffer-this.size.height;
         }
         this.position.y = this.newY;
      }

      this._super(deltaT);
   }
});