var sketchProc = function(processingInstance) {
    with (processingInstance) {
      size(600, 600); 
      frameRate(60);    
      smooth();
      
  {
      /**/// // Do not remove this line
      angleMode = "radians";
      
      textAlign(CENTER, CENTER);
      textFont(createFont("Verdana"));
      
      var game, player;
  } //Globals
  
  {
      //Key|Button stuff
      var clicked = false, hover = false;
      var keys = [];
      keyPressed = function(){ 
          keys[keyCode] = true; 
      };
      keyReleased = function(){ 
          keys[keyCode] = false; 
      };
      mouseClicked = function(){
          clicked = true;
      };
  } //Keys/Mouse
  
  {
      var Button = function(config) {
          this.x = config.x || 0;
          this.y = config.y || 0;
          this.size = config.size || 100;
          this.content = config.content || "Home";
          this.page = config.page || "home";
          this.level = config.level || 0;
          this.textSize = config.textSize || this.size * 0.2;
          this.borderColor = color(119, 22, 22, 30);
          this.backColor = color(119, 22, 22, 200);
          this.textColor = color(245, 242, 242, 150);
          this.backColorHover = color(50, 50, 50, 200);
          this.textColorHover = color(200, 200, 200, 200);
          this.growth = 0;
      };
      
      Button.prototype.draw = function () {
          textSize(this.textSize + (this.growth * 0.1));
          noStroke();
  
          //circles
          if (dist(mouseX, mouseY, this.x, this.y) <= this.size / 2) { //hover
              this.growth = constrain(this.growth + 0.5, 0, 10);
              if(clicked) {
                  game.page = this.page;
                  if(this.page === "level") {
                      game.level = this.level;
                  }
                  game.reset();
              }
              pushStyle();
                  textAlign(CENTER, CENTER);
                  fill(this.backColorHover);
                  stroke(this.borderColor);
                  strokeWeight(this.size * 0.1);
                  ellipse(this.x, this.y, this.size + this.growth, this.size + this.growth);
                  fill(this.textColorHover);
                  text(this.content, this.x, this.y);
              popStyle();
          }
          else { //not hover
              this.growth = constrain(this.growth - 0.5, 0, 10);
              pushStyle();
                  textAlign(CENTER, CENTER);
                  fill(this.backColor);
                  stroke(this.borderColor);
                  strokeWeight(2);
                  noStroke();
                  ellipse(this.x, this.y, this.size + this.growth, this.size + this.growth);
                  fill(this.textColor);
                  text(this.content, this.x, this.y);
              popStyle();
          }
      };
  } //Buttons
  
  {
      //Coin object
      var Coin = function(x, y, w, h, timeToLive) {
          this.pos = new PVector(x, y);
          this.w = w || 5;
          this.h = h || 5;
          this.timeToLive = timeToLive || 200;
      };
      
      Coin.prototype.update = function() {
          this.timeToLive--;
      };
      
      //Bone Object - Inherits from Coin
      var Bone = function(x, y) {
          this.w = 15;
          this.h = 3;
          this.timeToLive = 200;
          Coin.call(this, x, y, this.w, this.h, this.timeToLive);
      };
      
      Bone.prototype = Object.create(Coin.prototype);
      
      Bone.prototype.display = function() {
          fill(200, 200, 200, 200);
          rect(this.pos.x, this.pos.y, this.w, this.h, 5);
          ellipse(this.pos.x, this.pos.y+this.h/2, 5, 6);
          ellipse(this.pos.x, this.pos.y-this.h/2, 6, 5);
          
          ellipse(this.pos.x + this.w, this.pos.y+this.h/2, 6, 5);
          ellipse(this.pos.x + this.w, this.pos.y-this.h/2, 5, 6);
      };
      
      Bone.prototype.run = function() {
          this.update();
          this.display();
      };
  } //Coins
  
  {
      //Ammo Object
      var Ammo = function(x, y) {
          this.pos = new PVector(x, y);
          this.w = 36;
          this.h = 30;
          this.timeToLive = 200;
      };
      
      Ammo.prototype.update = function() {
          this.pos.y = constrain(this.pos.y + 3, -50, 470);
          if(this.pos.y === 470) {
              this.timeToLive--;
          }
      };
      
      Ammo.prototype.display = function() {
          noStroke();
          strokeWeight(1);
          stroke(222, 222, 222, 30);
          fill(20, 19, 19, 200);
          rect(this.pos.x, this.pos.y, this.w, this.h, 2);
          fill(240, 240, 240);
          textSize(8);
          textAlign(CENTER, CENTER);
          text("AMMO", this.pos.x + this.w/2, this.pos.y + this.h/2);
      };
      
      Ammo.prototype.run = function() {
          this.update();
          this.display();
      };
  } //Ammo
  
  {
      var Cross = function(config) {
          this.pos = config.pos || new PVector(0, 0);
          this.scale = config.scale || new PVector(1, 1);
          this.angle = config.angle || 0;
          this.lightColor = color(92, 94, 92);
          this.darkColor = color(87, 89, 87);
      };
      
      Cross.prototype.display = function() {
          noStroke();
          fill(this.lightColor);
          pushMatrix();
              translate(this.pos.x, this.pos.y);
              scale(this.scale.x, this.scale.y);
              rotate(radians(this.angle));
              rect(-10, 0, 20, 100);
              rect(-30, 20, 60, 20);
              
              fill(this.darkColor);
              rect(0, 0, 10, 100);
              rect(0, 20, 30, 20);
          popMatrix();
      };
  } //Cross
  
  {
      var GraveStone = function(config) {
          this.pos = config.pos || new PVector(0, 0);
          this.scale = config.scale || new PVector(1, 1);
          this.angle = config.angle || 0;
          this.lightColor = color(132, 135, 132);
          this.darkColor = color(123, 128, 123);
      };
      
      GraveStone.prototype.display = function() {
          noStroke();
          fill(this.lightColor);
          pushMatrix();
              translate(this.pos.x, this.pos.y);
              scale(this.scale.x, this.scale.y);
              rotate(radians(this.angle));
              arc(0, 0, 150, 120, 181, 360);
              rect(-75, 0, 150, 100);
              
              fill(this.darkColor);
              arc(0, 0, 150, 120, 271, 360);
              rect(0, 0, 75, 100);
              
              pushStyle();
                  textSize(40);
                  fill(59, 57, 57);
                  textAlign(CENTER, CENTER);
                  text("R.I.P", 0, 0);
              popStyle();
          popMatrix();
      };
  } //Gravestone
  
  {
      //Spider Web Object
      var SpiderWeb = function(config) {
          this.pos = config.pos || new PVector(0, 0);
          this.scale = config.scale || new PVector(1, 1);
          this.webColor = color(255, 255, 255, 50);
      };
      
      SpiderWeb.prototype.display = function() {
          noFill();
          strokeWeight(2);
          stroke(this.webColor);
          
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          scale(this.scale.x, this.scale.y);
          
          beginShape();
          vertex(320, 80);
          bezierVertex(280, 53, 270, 53, 220, 0);
          endShape();
          
          beginShape();
          vertex(320, 80);
          bezierVertex(320, 63, 300, 53, 290, 0);
          endShape();
          
          beginShape();
          vertex(320, 80);
          bezierVertex(330, 63, 320, 55, 350, 0);
          endShape();
          
          beginShape();
          vertex(320, 80);
          bezierVertex(340, 78, 345, 72, 400, 42);
          endShape();
          
          beginShape();
          vertex(320, 80);
          bezierVertex(345, 98, 355, 98, 400, 110);
          endShape();
          
          beginShape();
          vertex(320, 80);
          bezierVertex(335, 118, 345, 128, 400, 190);
          endShape();
          
          //first row
          beginShape();
          vertex(287, 58);
          bezierVertex(298, 56, 300, 56, 305, 46);
          endShape();
          beginShape();
          vertex(305, 46);
          bezierVertex(312, 56, 320, 56, 329, 50);
          endShape();
          beginShape();
          vertex(329, 50);
          bezierVertex(335, 66, 335, 66, 344, 73);
          endShape();
          beginShape();
          vertex(344, 73);
          bezierVertex(340, 76, 340, 80, 346, 95);
          endShape();
          beginShape();
          vertex(346, 95);
          bezierVertex(338, 104, 338, 97, 339, 116);
          endShape();
          
          //second row
          beginShape();
          vertex(260, 38);
          bezierVertex(280, 37, 285, 35, 296, 23);
          endShape();
          beginShape();
          vertex(296, 23);
          bezierVertex(310, 35, 320, 33, 338, 26);
          endShape();
          beginShape();
          vertex(338, 26);
          bezierVertex(340, 45, 350, 52, 368, 61);
          endShape();
          beginShape();
          vertex(368, 61);
          bezierVertex(355, 80, 360, 82, 371, 102);
          endShape();
          beginShape();
          vertex(371, 102);
          bezierVertex(355, 120, 360, 122, 357, 139);
          endShape();
          
          //third row
          beginShape();
          vertex(235, 16);
          bezierVertex(270, 17, 280, 15, 290, 0);
          endShape();
          beginShape();
          vertex(290, 0);
          bezierVertex(315, 17, 330, 15, 347, 5);
          endShape();
          beginShape();
          vertex(347, 5);
          bezierVertex(360, 37, 350, 35, 392, 47);
          endShape();
          beginShape();
          vertex(392, 47);
          bezierVertex(380, 67, 370, 90, 395, 108);
          endShape();
          beginShape();
          vertex(395, 108);
          bezierVertex(380, 117, 370, 140, 378, 165);
          endShape();
          
          //forth row
          beginShape();
          vertex(372, 0);
          bezierVertex(380, 27, 385, 25, 400, 26);
          endShape();
          beginShape();
          vertex(400, 137);
          bezierVertex(384, 163, 392, 175, 393, 182);
          endShape();
          
          popMatrix();
      };
  } //Spiderweb
  
  {
      var Tree = function(config) {
          this.x = config.x || width/2;
          this.y = config.y || height;
          this.length = config.length || 60;
          this.depth = config.depth || 4;
          this.weight = config.weight || 6;
          this.baseColor = config.baseColor || color(20);
      };
  
      Tree.prototype.branch = function(length, depth, weight) {
          strokeWeight(weight);
          stroke(this.baseColor);
          
          line(0, 0, 0, -length);
          translate(0, -length);
          
          if (depth > 0) {
              depth--;
              for(var i = 0; i < random(2, 4); i++) {
                  var dir = random() < 0.5 ? 1 : -1;
                  pushMatrix();
                      rotate(radians(random(10, 40) * dir));
                      this.branch(length * random(0.65, 0.75), depth, weight * 0.65);
                  popMatrix();
              }
          }
      };
      
      Tree.prototype.display = function() {
          pushMatrix();
          translate(this.x, this.y);
          this.branch(this.length, this.depth, this.weight);
          popMatrix();
      };
  } //Tree
  
  {
      //Lightning object
      var Lightning = function(config) {    
          this.minx = config.minx || width/3;
          this.maxx = config.maxx || width-width/3;
          this.y = config.y || 0;
          this.length = config.length || 30;
          this.depth = config.depth || 18;
          this.weight = config.weight || 3;
          this.angleRange = config.angleRange || 60; //should always be less than 90 so forks always move down
          this.forkColor = config.forkColor || color(255);
          this.flashColor = config.flashColor || color(75);
      };
  
      //Recursive function for displaying the lightning forks
      Lightning.prototype.fork = function(length, depth, weight, maxAngle) {
          var angle = 0;
          var valid = false;
  
          while(!valid) {
              angle = random(-30, 30);
              if(maxAngle + angle > -this.angleRange && maxAngle + angle < this.angleRange) { //ensure forks only ever within n degree area (moving downwards)
                  valid = true;
              }
          }
          
          maxAngle+= angle; //Store the total angle
          depth--;
  
          strokeWeight(weight);
          stroke(this.forkColor);
          line(0, 0, 0, length);
          translate(0, length);
          
          //Only generate more forks for given depth
          if (depth >= 0) {
              pushMatrix();
              if(angleMode === "radians") {rotate(radians(angle));} else {rotate(angle);} //rotate based on current angleMode
              this.fork(length, depth, weight*0.75, maxAngle);
              popMatrix();
  
              //Randomly add a new fork
              if(random() < 0.1) {
                  angle = random(-30, 30);
                  pushMatrix();
                  if(angleMode === "radians") {rotate(radians(angle));} else {rotate(angle);} //rotate based on current angleMode
                  this.fork(length*0.85, depth, weight*0.5, angle);
                  popMatrix();
              }
          }
      };
  
      //Display the lightning
      Lightning.prototype.display = function() {
          background(this.flashColor);
          pushMatrix();
          translate(random(this.minx, this.maxx), this.y);
          this.fork(this.length, this.depth, this.weight, 0);
          popMatrix();
      };
  
      
  } //Lightening
      
  //Lightning object (fractal)
  var Lightning = (function() {
      Lightning = function(args) {    
          this.min = args.min || width/6;
          this.max = args.max || width-width/6;
          this.y = args.y || 0;
          this.length = args.length || ~~(height / 11);
          this.depth = constrain(args.depth || ~~(height / 32), 5, 25);
          this.weight = constrain(args.weight || 4, 2, 8);
          this.forkColor = args.forkColor || color(255);
          this.flashColor = args.flashColor || color(200);
          this.angleRange = constrain(args.angleRange || 60, 40, 80);
          this.arr = [];
      };
      Lightning.prototype = {
          //recursive function generate the random lightning
          fork: function(length, depth, weight, px, py) {
              var angle = random(-this.angleRange, this.angleRange);
              
              //decrease the depth so can exit the recursive function
              depth--;
              
              //calculate the next x/y coordinate for the fork
              var x = px + cos(radians(angle - 90)) * length;
              var y = py + sin(radians(angle + 90)) * length;
              
              //add fork to the start of the array
              this.arr.unshift({
                  weight: weight,
                  stroke: this.forkColor,
                  px: px,
                  py: py,
                  x: x,
                  y: y,
                  length: length,
                  opacity: 255,
                  angle: angle
              });
          
              //Only generate more forks for given depth
              if (depth >= 0) {
                  this.fork(length, depth, weight*0.8, x, y);
          
                  //Randomly add a new fork
                  if(random() < 0.15) {
                      angle = random(-this.angleRange, this.angleRange);
                      this.fork(length*0.85, depth, weight*0.5, x, y);
                  }
              }
          },
          draw: function() {
              //draw the lightning
              pushStyle();
                  for(var i = this.arr.length - 1; i >= 0; i--) {
                      strokeWeight(this.arr[i].weight);
                      stroke(this.arr[i].stroke, this.arr[i].opacity);
                      line(this.arr[i].px, this.arr[i].py+this.arr[i].weight, this.arr[i].x, this.arr[i].y);
                      this.arr[i].opacity-=10;
                      if(this.arr[i].opacity <= 0) {
                          this.arr.splice(i, 1);
                      }
                  }
              popStyle();
          },
          generate: function() {
              //initiates a new lightning strike
              this.fork(
                  this.length, //length of each strike
                  this.depth, //how deep you want to recurse
                  this.weight, //starting weight of the strike
                  random(this.min, this.max), //starting (previous) x pos
                  this.y //starting (previous) y pos
              );
          }
      };
      return Lightning;
  })();
  
  {
      var RedBack = function(config) {
          this.pos = config.pos || new PVector(0, 0);
          this.webY = config.webY || this.pos.y - 50;
          this.w = 55;
          this.h = 70;
          this.scale = config.scale || 1;
          this.bodyColor = config.bakColor || color(0);
          this.stripeColor = config.stripeColor || color(201, 26, 26, 200);
          this.webColor = config.webColor || color(255, 255, 255, 50);
          this.yOffset = config.yOffset || 0;
          this.yDir = config.yDir || 1;
          this.img = this.getImage();
      };
      
      RedBack.prototype.getImage = function() {
          background(0, 0, 0, 0);
      
          pushMatrix();
          translate(0, 0);
          
          noStroke();
          fill(this.bodyColor);
          
          //body
          ellipse(350, 220, 20, 25);
          //head
          ellipse(350, 237, 10, 10);
          
          //stripe
          noFill();
          stroke(this.stripeColor);
          strokeWeight(3);
          ellipse(350, 216, 3, 8);
          ellipse(350, 223, 2, 2);
          
          noFill();
          stroke(this.bodyColor);
          strokeWeight(2);
          
          //eyes
          line(348, 240, 348, 242);
          line(352, 240, 352, 242);
          
          strokeWeight(1);
          
          //back legs
          beginShape();
          vertex(340, 220);
          bezierVertex(325, 210, 326, 206, 326, 199);
          endShape();
          beginShape();
          vertex(360, 220);
          bezierVertex(375, 210, 374, 206, 374, 199);
          endShape();
          
          beginShape();
          vertex(341, 212);
          bezierVertex(327, 202, 334, 196, 333, 190);
          endShape();
          beginShape();
          vertex(359, 212);
          bezierVertex(373, 202, 366, 196, 367, 190);
          endShape();
          
          //front legs
          beginShape();
          vertex(340, 223);
          bezierVertex(336, 225, 336, 228, 328, 230);
          endShape();
          beginShape();
          vertex(328, 230);
          bezierVertex(332, 250, 332, 248, 334, 250);
          endShape();
          
          beginShape();
          vertex(360, 223);
          bezierVertex(364, 225, 364, 228, 372, 230);
          endShape();
          beginShape();
          vertex(372, 230);
          bezierVertex(368, 250, 368, 248, 366, 250);
          endShape();
          
          beginShape();
          vertex(342, 227);
          bezierVertex(340, 229, 340, 232, 334, 234);
          endShape();
          beginShape();
          vertex(334, 234);
          bezierVertex(338, 254, 343, 252, 342, 255);
          endShape();
          
          beginShape();
          vertex(358, 227);
          bezierVertex(360, 229, 360, 232, 366, 234);
          endShape();
          beginShape();
          vertex(366, 234);
          bezierVertex(362, 254, 357, 252, 358, 255);
          endShape();
          
          popMatrix();
          
          return get(321, 185, this.w, this.h);
      };
      
      RedBack.prototype.display = function() {
          pushMatrix();
          scale(this.scale);
          strokeWeight(1);
          stroke(this.webColor);
          line(this.pos.x + this.w * 0.5, this.webY, this.pos.x + this.w * 0.5, this.pos.y + this.yOffset + this.h * 0.5);
          image(this.img, this.pos.x, this.pos.y + this.yOffset);
          popMatrix();
      };
      
      RedBack.prototype.update = function() {
          this.yOffset+= 0.6 * this.yDir;
          if(this.yOffset > 60 || this.yOffset < 0)
          {
              this.yDir*= -1;
          }
      };
      
      RedBack.prototype.run = function() {
          this.update();
          this.display();
      };
  } //Red Back
  
  {
      
  {
      //Enemy Object
      var Enemy = function(config) {
          this.pos = config.pos || new PVector(0, 470); //default location is on the ground
          this.w = config.w || 30;
          this.h = config.h || 30;
          this.speed = config.speed || 3;
          this.dir = config.dir || random() < 0.5 ? 1 : -1;
          if(config.pos === null) {
              if(this.dir === 1) {
                  this.pos.x = floor(random(-250, -50));
              }
              else {
                  this.pos.x = floor(random(650, 850));
              }
          }
      };
  } //Enemy
  
  {
      //Mummy Object
      var Mummy = function(config) {
          Enemy.call(this, config);
          this.backColor = color(218, 224, 195);
          this.bandageColor = color(66, 63, 63, 100);
          this.eyeBandColor = color(71, 65, 65);
          this.eyeColor = color(184, 171, 170);
      };
      
      Mummy.prototype = Object.create(Enemy.prototype);
      
      Mummy.prototype.display = function() {
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          if(this.dir === -1) {
              scale(-1, 1);
              translate(-this.w, 0);        
          }
  
          //body
          noStroke();
          fill(this.backColor);
          rect(0, 0, this.w, this.h, 3);
  
          //bandages
          stroke(this.bandageColor);
          strokeWeight(1);
          line(0, 0, this.w, this.h * 0.1);
          line(0, this.h * 0.1, this.w, this.h * 0.15);
          line(0, this.h * 0.3, this.w, this.h * 0.2);
          line(0, this.h * 0.2, this.w, this.h * 0.4);
          line(0, this.h * 0.5, this.w, this.h * 0.3);
          line(0, this.h * 0.6, this.w, this.h * 0.35);
          line(0, this.h * 0.45, this.w, this.h * 0.5);
          line(0, this.h * 0.7, this.w, this.h * 0.6);
          line(0, this.h * 0.75, this.w, this.h * 0.7);
          line(0, this.h * 0.6, this.w, this.h * 0.7);
          line(0, this.h * 0.8, this.w, this.h * 0.9);
          line(0, this.h * 0.9, this.w, this.h * 0.8);
          
          noStroke();
          fill(this.eyeBandColor);
          beginShape();
              vertex(0, this.h * 0.2);
              vertex(this.w, this.h * 0.25);
              vertex(this.w, this.h * 0.4);
              vertex(0, this.h * 0.4);
          endShape(CLOSE);
          
          //eyes
          fill(this.eyeColor);
          ellipse(this.w/3 + this.w/6, this.h/3.5, 4, 4);
          ellipse(this.w - this.w/3 + this.w/6, this.h/3.5, 4, 4);
      
          popMatrix();
      };
      
      Mummy.prototype.update = function() {
          this.pos.x += this.speed * this.dir;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Mummy.prototype.run = function() {
          this.update();
          this.display();
      };
  } //Mummies
  
  {
      //Skeleton Object - Inhertis from Enemy
      var Skeleton = function(config) {
          Enemy.call(this, config);
          this.headColor = color(31, 29, 28);
          this.bodyColor = color(3, 3, 3);
          this.eyeColor = color(180, 180, 180);
          this.legColor = color(8, 8, 8);
      };
      
      Skeleton.prototype = Object.create(Enemy.prototype);
      
      Skeleton.prototype.display = function() {
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          if(this.dir === -1) {
              scale(-1, 1);
              translate(-this.w, 0);        
          }
      
          //body
          noStroke();
          fill(222, 222, 222);
          rect(0, 0, this.w, this.h/2, 3);
      
          stroke(222, 222, 222);
          strokeWeight(1);
          noFill();
      
          //spine
          line(this.w/2, this.h/2, this.w/2, this.h);
          
          //ribs
          line(this.w/8, this.h * 0.65, this.w - this.w/8, this.h * 0.65);    
          line(this.w/8, this.h * 0.8, this.w - this.w/8, this.h * 0.8);    
          line(this.w/8, this.h * 0.95, this.w - this.w/8, this.h * 0.95);
      
          //arms
          line(this.w/8, this.h * 0.65, -this.w/75, this.h * 0.9);    
          line(this.w - this.w/8, this.h * 0.65, this.w + this.w/75, this.h * 0.9);
      
          noStroke();
          //eyes
          fill(38, 38, 38);
          var dir = -0;
          ellipse(this.w/3 + this.speed, this.h/3.5, 4, 4);
          ellipse(this.w - this.w/3 + this.speed, this.h/3.5, 4, 4);
          
          popMatrix();
      };
      
      Skeleton.prototype.update = function() {
          this.pos.x += this.speed * this.dir;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Skeleton.prototype.run = function() {
          this.update();
          this.display();
      };
      
      //ZamikazeSkeleton - Inhertis from Skeleton > Enemy
      var KamikazeSkeleton = function(config) {
          Skeleton.call(this, config);
          this.timeToFall = config.timeToFall || random(200, 700);
          this.dropSpeed = config.dropSpeed || 1;
          this.isOnGround = false;
      };
      
      KamikazeSkeleton.prototype = Object.create(Skeleton.prototype);
  
      KamikazeSkeleton.prototype.display = function() {
          if(this.pos.y < 500 + this.h) {
              this.h = 500 - this.pos.y;
          }
          else {
              this.h = 0;
          }
          Skeleton.prototype.display.call(this);
      };
      
      KamikazeSkeleton.prototype.drop = function() {
          if(!this.isOnGround) {
              this.timeToFall--;
              
              if(this.timeToFall < 0) {
                  this.pos.y -= this.dropSpeed;
                  if(this.pos.y <= 470) {
                      this.isOnGround = true;
                  }
              }
          }
          this.display();
      };
      
  } //Skeleton
  
  {
      //Vampire Object - Inhertis from Enemy
      var Vampire = function(config) {
          Enemy.call(this, config);
          this.headColor = color(214, 213, 171);
          this.bodyColor = color(12, 12, 12);
          this.hairColor = color(22, 22, 22);
          this.eyeColor = color(38, 38, 38);
          this.fangColor = color(245, 242, 242);
          this.capeColor = random() < 0.5 ? color(115, 13, 13) : color(12, 12, 12);
      
          this.batColor = color(0);
      
          this.isBat = false;
      
          this.theta = 0.0;
          this.amplitude = 20.0;
          this.dy = 0.0;
          this.ybase = this.pos.y;
      };
      
      Vampire.prototype = Object.create(Enemy.prototype);
      
      Vampire.prototype.display = function() {
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          if(this.dir === -1) {
              scale(-1, 1);
              translate(-this.w, 0);        
          }
      
          if(this.isBat) {
              fill(this.batColor);
              //wings
              noStroke();
              pushMatrix();
                  translate(0, 0);
                  rotate(radians(this.dy*1.5));
                  beginShape();
                      vertex(0, 3);
                      vertex(-30, 3);
                      bezierVertex(-29, 6, -26, 9, -27, 12);
                      bezierVertex(-24, 8, -19, 8, -13, 10);
                      bezierVertex(-10, 7, 5, 7, 0, 6);
                      vertex(0, 3);
                  endShape();
              popMatrix();
              pushMatrix();
                  translate(15, 0);
                  rotate(radians(-this.dy*1.5));
                  beginShape();
                      vertex(0, 3);
                      vertex(30, 3);
                      bezierVertex(29, 6, 26, 9, 27, 12);
                      bezierVertex(24, 8, 19, 8, 13, 10);
                      bezierVertex(10, 7, -5, 7, 0, 6);
                      vertex(0, 3);
                  endShape();
              popMatrix();
              //body
              noStroke();
              fill(this.batColor);
              rect(0, 0, 15, 15, 3);
              //ears
              triangle(2, 0, 5, -6, 8, 0);
              triangle(this.w-2, 0, this.w-5, -6, this.w-8, 0);
              //eyes
              fill(255);
              ellipse(5, 4, 3, 3);
              ellipse(this.w-5, 4, 3, 3);
          }
          else { //vampire
              //body
              noStroke();
              fill(this.headColor);
              rect(0, 0, this.w, this.h, 3);
              fill(this.bodyColor);
              rect(0, this.h/2, this.w, this.h/2);
      
              //cape
              fill(this.capeColor);
              triangle(0, this.h/4, 0, this.h*0.6, -this.w/6, this.h/4);
              triangle(this.w, this.h/4, this.w, this.h*0.6, this.w + this.w/6, this.h/4);
              
              //fangs
              fill(this.fangColor);
              triangle(this.w * 0.3, this.h/2, this.w * 0.4, this.h * 0.75, this.w * 0.45, this.h/2);
              triangle(this.w * 0.75, this.h/2, this.w * 0.8, this.h * 0.75, this.w * 0.9, this.h/2);
              
              triangle(this.w * 0.45, this.h/2, this.w * 0.5, this.h * 0.65, this.w * 0.55, this.h/2);
              triangle(this.w * 0.65, this.h/2, this.w * 0.7, this.h * 0.65, this.w * 0.75, this.h/2);
              triangle(this.w * 0.55, this.h/2, this.w * 0.6, this.h * 0.65, this.w * 0.65, this.h/2);
              
              //eyes
              fill(this.eyeColor);
              ellipse(this.w/3 + this.w/6, this.h/3.5, 4, 4);
              ellipse(this.w - this.w/3 + this.w/6, this.h/3.5, 4, 4);
              
              //hair
              stroke(this.hairColor);
              strokeWeight(4);
              line(0, 0, this.w-1, 0);
          }
      
          popMatrix();
          
          noStroke();
      };
      
      Vampire.prototype.update = function() {
          this.pos.x += this.speed * this.dir;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Vampire.prototype.run = function() {
          this.update();
          this.display();
      };
      
      //ZamikazeVampire - Inhertis from Vampire > Enemy
      var KamikazeVampire = function(config) {
          Vampire.call(this, config);
          this.timeToFall = random(200, 700);
          this.dropSpeed = 5;
          this.isOnGround = false;
          this.amplitude = 20.0;
          this.ybase = this.pos.y;
          this.isBat = true;
          this.w = 15;
          this.h = 15;
          this.flyUp = config.flyUp || random(100, 100);
      };
      
      KamikazeVampire.prototype = Object.create(Vampire.prototype);
      
      KamikazeVampire.prototype.drop = function() {
          if(!this.isOnGround) {
              this.timeToFall--;
              
              if(this.timeToFall < 0) {
                  this.pos.y += this.dropSpeed;
                  if(this.pos.y >= 470) {
                      this.isOnGround = true;
                  }
              }
          }
          this.display();
      };
  } //Vampire
  
  {
      //Spider Object - Inherits from Enemy
      var Spider = function(config) {
          Enemy.call(this, config);
          this.headColor = color(31, 29, 28);
          this.bodyColor = random() < 0.5 ? color(115, 60, 11) : color(3, 3, 3);
          this.eyeColor = color(180, 180, 180);
          this.legColor = color(8, 8, 8);
      };
      
      Spider.prototype = Object.create(Enemy.prototype);
      
      Spider.prototype.display = function() {
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          if(this.dir === -1) {
              scale(-1, 1);
              translate(-this.w, 0);        
          }
      
          //legs - eight of them :)
          strokeWeight(1);
          stroke(this.legColor);
          for(var i = 0; i < 4; i++) {
              //left leg
              line(0, this.h * 0.2 + this.h/7*i, -this.w/8, this.h * 0.2 + this.h/7*i);
              line(-this.w/8, this.h * 0.2 + this.h/7*i, -this.w/4, this.h * 0.5 + this.h/6*i);
              //right leg
              line(this.w, this.h * 0.2 + this.h/7*i, this.w + this.w/8, this.h * 0.2 + this.h/7*i);
              line(this.w + this.w/8, this.h * 0.2 + this.h/7*i, this.w + this.w/4, this.h * 0.5 + this.h/6*i);
          }
      
          //body
          noStroke();
          fill(this.headColor);
          rect(0, 0, this.w, this.h/2, 8, 8, 0, 0);
          fill(this.bodyColor);
          rect(0, this.h/2, this.w, this.h/2.5, 0, 0, 8, 8);
      
          //eyes - eight of them :)
          fill(this.eyeColor);
          for(var i = 1; i <= 4; i++) {
              ellipse(this.w/5 * i + this.speed/2, this.h/6, 3, 3);
              ellipse(this.w/5 * i + this.speed/2, this.h/2.7, 3, 3);
          }
      
          //fangs
          triangle(this.w * 0.4, this.h/2, this.w * 0.5, this.h * 0.75, this.w * 0.55, this.h/2);
          triangle(this.w * 0.65, this.h/2, this.w * 0.7, this.h * 0.75, this.w * 0.8, this.h/2);
          
          popMatrix();
      
          noStroke();
      };
      
      Spider.prototype.update = function() {
          this.pos.x += this.speed * this.dir;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Spider.prototype.run = function() {
          this.update();
          this.display();
      };
      
      //ZamikazeSpider - Inhertis from Spider > Enemy
      var KamikazeSpider = function(config) {
          Spider.call(this, config);
          this.timeToFall = random(200, 700);
          this.dropSpeed = 7;
          this.yDir = 1;
          this.isOnGround = false;
      };
      
      KamikazeSpider.prototype = Object.create(Spider.prototype);
      
      KamikazeSpider.prototype.drop = function() {
          if(!this.isOnGround) {
              this.timeToFall--;
              
              if(this.timeToFall < 0) {
                  this.pos.y += this.dropSpeed;
                  if(this.pos.y >= 470) {
                      this.isOnGround = true;
                  }
              }
          }
          this.display();
      };
  } //Spider
  
  {
      //Zombie Object - Inherits from Enemy
      var Zombie = function(config) {
          Enemy.call(this, config);
          this.skinColor = random() < 0.5 ? color(60, 99, 36) : color(79, 53, 110);
          this.shirtColor = random() < 0.5 ? color(10, 10, 9) : color(18, 33, 38);
          this.hairColor = color(33, 30, 29);
      };
      
      Zombie.prototype = Object.create(Enemy.prototype);
      
      Zombie.prototype.display = function() {
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          if(this.dir === -1) {
              scale(-1, 1);
              translate(-this.w, 0);        
          }
      
          //back arm
          stroke(this.skinColor);
          strokeWeight(3);
          line(this.w, this.h/1.5, this.w+this.w/3, this.h/1.8);
          //fingers
          strokeWeight(2);
          line(this.w+this.w/3, this.h/1.8, this.w+this.w/2, this.h/1.4);
          line(this.w+this.w/3, this.h/1.8, this.w+this.w/2.5, this.h/1.3);
          line(this.w+this.w/3, this.h/1.8, this.w+this.w/3.5, this.h/1.3);
          //body
          noStroke();
          fill(this.skinColor);
          rect(0, 0, this.w, this.h, 3);
          //shirt
          fill(this.shirtColor);
          rect(0, this.h/2, this.w, this.h/2);
          //front arm
          stroke(this.skinColor);
          strokeWeight(3);
          line(this.w/2, this.h/1.5, this.w, this.h/1.4);
          //fingers
          strokeWeight(2);
          line(this.w, this.h/1.4, this.w+this.w/8, this.h/1.2);
          line(this.w, this.h/1.4, this.w+this.w/20, this.h/1.1);
          line(this.w, this.h/1.4, this.w-this.w/10, this.h/1.1);
          
          //hair
          stroke(this.hairColor);
          strokeWeight(4);
          line(2, 0, this.w-2, 0);
          noStroke();
          //eyes
          fill(251, 249, 166);
          ellipse(this.w/3 + 5, this.h/3.5, 10, 10);
          ellipse(this.w - this.w/3 + 5, this.h/3.5, 10, 10);
          fill(43, 40, 40);
          ellipse(this.w/3 + 7, this.h/3.1, 2, 2);
          ellipse(this.w - this.w/3 + 7, this.h/3.9, 2, 2);
          
          popMatrix();
          
          noStroke();
      };
      
      Zombie.prototype.update = function() {
          this.pos.x += this.speed * this.dir;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Zombie.prototype.run = function() {
          this.update();
          this.display();
      };
      
      //ZamikazeZombie - Inhertis from Zombie > Enemy
      var KamikazeZombie = function(config) {
          Zombie.call(this, config);
          this.timeToFall = random(200, 500);
          this.dropSpeed = 7;
          this.isOnGround = false;
      };
      
      KamikazeZombie.prototype = Object.create(Zombie.prototype);
      
      KamikazeZombie.prototype.drop = function() {
          if(!this.isOnGround) {
              this.timeToFall--;
              
              if(this.timeToFall < 0) {
                  this.pos.y += this.dropSpeed;
                  if(this.pos.y >= 470) {
                      this.isOnGround = true;
                  }
              }
          }
          this.display();
      };
  
  } //Zombie
  
  {
      //Grim Object - Inherits from Enemy
      var Grim = function(config) {
          Enemy.call(this, config);
          this.bodyColor = config.bodyColor || random() < 0.5 ? color(32, 35, 36) : color(87, 7, 4);
          this.hairColor = config.hairColor || color(33, 30, 29);
          this.eyeColor = config.eyeColor || color(38, 38, 38);
      };
      
      Grim.prototype = Object.create(Enemy.prototype);
      
      Grim.prototype.display = function() {
          pushMatrix();
              translate(this.pos.x, this.pos.y);
              if(this.dir === -1) {
                  scale(-1, 1);
                  translate(-this.w, 0);        
              }
              
              //body/head
              noStroke();
              fill(this.bodyColor);
              rect(0, 0, this.w, this.h);
              fill(74, 13, 5);
              ellipse(this.w * 0.47, this.h * 0.3, this.w * 0.85, this.h * 0.5);
              fill(252, 252, 249);
              ellipse(this.w * 0.5, this.h * 0.3, this.w * 0.78, this.h * 0.5);
              
              //hoody
              fill(this.bodyColor);
              beginShape();
                  vertex(0, this.h * 0.3);
                  vertex(-this.w * 0.1, this.h * 0.1);
                  vertex(0, -this.h * 0.1);
                  vertex(this.w * 0.7, -this.h * 0.3);
                  vertex(this.w * 1.3, 0);
                  vertex(this.w, 0);
                  vertex(this.w * 1.2, this.h * 0.2);
                  vertex(this.w, this.h * 0.3);
                  vertex(this.w * 0.8, this.h * 0.2);
                  vertex(this.w * 0.4, 0);
                  vertex(0, 0);
              endShape(CLOSE);
              
              //teeth
              fill(245, 242, 242);
              rect(this.w * 0.29, this.w * 0.45, this.w * 0.02, this.h * 0.15, 8);
              rect(this.w * 0.43, this.w * 0.45, this.w * 0.02, this.h * 0.15, 8);
              rect(this.w * 0.56, this.w * 0.45, this.w * 0.02, this.h * 0.15, 8);
              rect(this.w * 0.7, this.w * 0.45, this.w * 0.02, this.h * 0.15, 8);
              
              //eyes
              fill(38, 38, 38);
              var dir = 0.2;
              ellipse(this.w/3 + dir*this.w/6, this.h/3.5, 10, 10);
              ellipse(this.w - this.w/3 + dir*this.w/6, this.h/3.5, 9, 9);
  
              //scythe
              noStroke();
              fill(130, 125, 125);
              
              beginShape();
                  vertex(-this.w * 0.2, -this.h * 0.2);
                  bezierVertex(-this.w * 0.35, 0, -this.w * 0.7, 0, -this.w * 0.7, this.h * 0.5);
                  bezierVertex(-this.w * 0.5, this.h * 0.2, -this.w * 0.3, 0, -this.w * 0.2, -this.h * 0.1);
              endShape(CLOSE);
              
              noFill();
              stroke(77, 51, 7);
              strokeWeight(3);
              line(this.w * 0.2, this.h * 0.6, -this.w * 0.2, -this.h * 0.2);        
              strokeWeight(1);
              noStroke();
          popMatrix();
      };
      
      Grim.prototype.update = function() {
          this.pos.x += this.speed * this.dir;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Grim.prototype.run = function() {
          this.update();
          this.display();
      };
      
      //ZamikazeGrim - Inhertis from Grim > Enemy
      var KamikazeGrim = function(config) {
          Grim.call(this, config);
          this.timeToFall = config.timeToFall || random(200, 500);
          this.dropSpeed = config.dropSpeed || 7;
          this.isOnGround = false;
      };
      
      KamikazeGrim.prototype = Object.create(Grim.prototype);
      
      KamikazeGrim.prototype.drop = function() {
          if(!this.isOnGround) {
              this.timeToFall--;
              
              if(this.timeToFall < 0) {
                  this.pos.y += this.dropSpeed;
                  if(this.pos.y >= 470) {
                      this.isOnGround = true;
                  }
              }
          }
          this.display();
      };
  
  } //Grim
  
  {
  
      var Witch = function(config) {
          this.startpos = config.pos || new PVector(0, 0);
          this.pos = config.pos || new PVector(0, 0);
          this.w = config.w || 30;
          this.h = config.h || 30;
          this.dir = random() < 0.5 ? 1 : -1;
          this.speed = random(2, 3);
          this.skinColor = random() < 0.5 ? color(137, 209, 123) : color(201, 123, 54);
          this.broom = this.getBroom();
      };
      
      Witch.prototype.update = function() {
          this.pos.x -= this.speed * this.dir;
      };
  
      Witch.prototype.display = function() {
          pushMatrix();
              translate(this.pos.x + this.w * this.dir * -1.4, this.pos.y); //adjust the position so the cat is at the back of the broom with the witch
              if(this.dir === -1) {
                  scale(-1, 1);
                  translate(-this.w, 0);        
              }
              //body
              noStroke();
              fill(this.skinColor);
              rect(0, 0, this.w, this.h, 3);
              //clothes
              fill(12, 13, 12);
              rect(0, this.h/2, this.w, this.h/2);
          
              //eyes
              fill(38, 38, 38);
              //var dir = -0;
              ellipse(this.w/3 + this.dir*this.w/6, this.h/3.5, 4, 4);
              ellipse(this.w - this.w/3 + this.dir*this.w/6, this.h/3.5, 4, 4);
              
              //hair
              stroke(12, 13, 12);
              strokeWeight(2);
              line(this.w * 0.05, 0, -this.w * 0.05, this.h * 0.3);
              line(this.w * 0.05, 0, -this.w * 0.1, this.h * 0.2);
              line(this.w * 0.95, 0, this.w * 1.05, this.h * 0.3);
              line(this.w * 0.95, 0, this.w * 1.1, this.h * 0.2);
              
              //hat
              stroke(38, 38, 38);
              strokeWeight(4);
              line(-this.w * 0.2, 0, this.w * 1.2, 0);
              noStroke();
              beginShape();
                  vertex(this.w * 0.1, 0);
                  vertex(this.w * 0.4, -this.h * 0.4);
                  vertex(this.w * 0.8, -this.h * 0.6);
                  vertex(this.w * 0.7, -this.h * 0.3);
                  vertex(this.w * 0.9, 0);
              endShape(CLOSE);
              
              image(this.broom, -this.w * 2, this.h * 0.65);
          popMatrix();
      
      };
      
      Witch.prototype.getBroom = function(w, h) {
          background(0, 0, 0, 0);
          var w = 140;
          var h = 3;
          noStroke();
          fill(0);
          rect(50, 10, w, h, 10);
          stroke(61, 40, 11);
          strokeWeight(1);
          noFill();
          for(var i = 0; i < 20; i++) {
              var xOffset = random(10, 25);
              var yOffset = random(-15, 15);
              line(55, 11.5, 50-xOffset, 10 + yOffset);
          }
  
          return get(0, 0, w + 50, 20);
      };
      
  } //Witch
  
  {
      //Cat Object - Inherits from Enemy
      var Cat = function(config) {
          Enemy.call(this, config);
          this.headColor = config.headColor || color(31, 29, 28);
          this.bodyColor = config.bodyColor || color(3, 3, 3);
          this.eyeColor = config.eyeColor || color(163, 230, 108);
      };
      
      Cat.prototype = Object.create(Enemy.prototype);
      
      Cat.prototype.display = function() {
          pushMatrix();
              translate(this.pos.x, this.pos.y);
              if(this.dir === -1) {
                  scale(-1, 1);
                  translate(-this.w, 0);        
              }
          
              //body
              noStroke();
              fill(this.headColor);
              rect(0, 0, this.w, this.h/2);
              fill(this.bodyColor);
              rect(0, this.h/2, this.w, this.h/2);
  
              //ears
              triangle(this.w * 0.1, 0, this.w * 0.4, 0, this.w * 0.2, -this.h * 0.3);
              triangle(this.w * 0.9, 0, this.w * 0.6, 0, this.w * 0.8, -this.h * 0.3);
          
              //eyes
              fill(this.eyeColor);
  
              //left
              beginShape();
                  vertex(
                      this.w * 0.15 + 5, this.h * 0.25);
                  bezierVertex(
                      this.w * 0.2 + 5, this.h * 0.15, 
                      this.w * 0.3 + 5, this.h * 0.15, 
                      this.w * 0.4 + 5, this.h * 0.25);
                  bezierVertex(
                      this.w * 0.3 + 5, this.h * 0.35, 
                      this.w * 0.2 + 5, this.h * 0.35, 
                      this.w * 0.15 + 5, this.h * 0.25);
              endShape(CLOSE);
  
              //right
              beginShape();
                  vertex(
                      this.w * 0.5 + 5, this.h * 0.25);
                  bezierVertex(
                      this.w * 0.55 + 5, this.h * 0.15, 
                      this.w * 0.65 + 5, this.h * 0.15, 
                      this.w * 0.75 + 5, this.h * 0.25);
                  bezierVertex(
                      this.w * 0.65 + 5, this.h * 0.35, 
                      this.w * 0.55 + 5, this.h * 0.35, 
                      this.w * 0.5 + 5, this.h * 0.25);
              endShape(CLOSE);
              
              //eye balls
              stroke(0);
              strokeWeight(1);
              line(this.w * 0.27 + 5, this.h * 0.15, this.w * 0.27 + 5, this.h * 0.35);
              line(this.w * 0.62 + 5, this.h * 0.15, this.w * 0.62 + 5, this.h * 0.35);
          
              //fangs
              noStroke();
              fill(245, 242, 242);
              triangle(this.w * 0.35 + 4, this.h/2, this.w * 0.4 + 4, this.h * 0.65, this.w * 0.45 + 4, this.h/2);
              triangle(this.w * 0.55 + 4, this.h/2, this.w * 0.6 + 4, this.h * 0.65, this.w * 0.65 + 4, this.h/2);
              triangle(this.w * 0.45 + 4, this.h/2, this.w * 0.5 + 4, this.h * 0.65, this.w * 0.55 + 4, this.h/2);
              noStroke();
  
          popMatrix();
      };
      
      Cat.prototype.update = function() {
          this.pos.x += this.speed * this.dir;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Cat.prototype.run = function() {
          this.update();
          this.display();
      };
      
      //ZamikazeCat - Inhertis from Cat > Enemy
      var KamikazeCat = function(config) {
          Cat.call(this, config);
          this.timeToFall = config.timeToFall || random(200, 700);
          this.dropSpeed = config.dropSpeed || 7;
          this.yDir = 1;
          this.isOnGround = false;
      };
      
      KamikazeCat.prototype = Object.create(Cat.prototype);
      
      KamikazeCat.prototype.drop = function() {
          if(!this.isOnGround) {
              this.timeToFall--;
              
              if(this.timeToFall < 0) {
                  this.pos.y += this.dropSpeed;
                  if(this.pos.y >= 470) {
                      this.isOnGround = true;
                  }
              }
          }
          this.display();
      };
  
  } //Cat
  
  {
      //Ghost Object - Inhertis from Enemy
      var Ghost = function(config) {
          Enemy.call(this, config);
          //this.bodyColor = color(240, 237, 235, 200);
          this.bodyR = 240;
          this.bodyG = 237;
          this.bodyB = 235;
          this.opacity = config.opacity || 150;
          this.eyeColor = config.eyeColor || color(38, 38, 38);
          this.theta = 0.0;
          this.amplitude = 20.0;
          this.dy = 0.0;
          this.ybase = this.pos.y;
          this.scale = config.scale || 1;
      };
      
      Ghost.prototype = Object.create(Enemy.prototype);
      
      Ghost.prototype.display = function() {
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          if(this.dir === -1) {
              scale(-this.scale, this.scale);
              //scale(-1, 1);
              translate(-this.w, 0);        
          }
  
          //new body
          noStroke();
          fill(this.bodyR, this.bodyG, this.bodyB, this.opacity);
          beginShape();
              vertex(this.w * 0.5, 0);
              bezierVertex(this.w * 0.9, 0, this.w, this.h * 0.25, this.w, this.h * 0.5);
              bezierVertex(this.w, this.h, this.w * 0.8, this.h * 1.2, this.w * 0.66, this.h * 0.66);
              bezierVertex(this.w * 0.66, this.h * 1.1, this.w * 0.33, this.h * 1.1, this.w * 0.33, this.h * 0.66);
              bezierVertex(this.w * 0.33, this.h, 0, this.h * 1.2, 0, this.h * 0.5);
              bezierVertex(0, this.h * 0.25, this.w * 0.1, 0, this.w * 0.5, 0);
          endShape(CLOSE);
      
          //eyes
          fill(this.eyeColor);
          ellipse(this.w/3 + this.speed, this.h/3.5, 4, 4);
          ellipse(this.w - this.w/3 + this.speed, this.h/3.5, 4, 4);
          
          popMatrix();
      };
      
      Ghost.prototype.update = function() {
          this.theta += 3;
          this.dy = sin(radians(this.theta)) * this.amplitude;
      
          this.pos.x += this.speed * this.dir;
          this.pos.y = this.ybase + this.dy;
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Ghost.prototype.run = function() {
          this.update();
          this.display();
      };
      
      //ZamikazeGhost - Inhertis from Ghost > Enemy
      var KamikazeGhost = function(config) {
          Ghost.call(this, config);
          this.timeToFall = config.timeToFall || random(200, 700);
          this.dropSpeed = config.dropSpeed || 5;
          this.isOnGround = false;
          this.amplitude = 30.0;
          this.ybase = this.pos.y;
      };
      
      KamikazeGhost.prototype = Object.create(Ghost.prototype);
  
      KamikazeGhost.prototype.drop = function() {
          if(!this.isOnGround) {
              
              this.timeToFall--;
              
              if(this.timeToFall < 0) {
                  this.pos.y += this.dropSpeed;
                  if(this.pos.y >= 470) {
                      this.isOnGround = true;
                  }
              }
          }
          this.display();
      };
      
  } //Ghost
  
  {
      //Werewolf Object
      var Werewolf = function(config) {
          Enemy.call(this, config);
          this.isWolf = config.isWolf || random() < 0.5 ? true : false;
          this.manTimer = 0;
          this.wolfTimer = 0;
          this.transitionTime = random(100, 200);
          this.manSpeed = 2;
          this.wolfSpeed = 5;
  
          this.skinColor = color(215, 177, 112);
          this.wolfSkinColor = color(92, 48, 10);
          this.shirtColor = random() < 0.5 ? color(32, 49, 82) : color(59, 34, 5);
          this.hairColor = color(54, 31, 14);
          this.eyeColor = color(150, 23, 14);
          this.wolfEyeColor = color(245, 35, 8);
      };
      
      Werewolf.prototype = Object.create(Enemy.prototype);
      
      Werewolf.prototype.display = function() {
          pushMatrix();
          translate(this.pos.x, this.pos.y);
          if(this.dir === -1) {
              scale(-1, 1);
              translate(-this.w, 0);        
          }
  
          if(this.isWolf) {
              //body
              noStroke();
              fill(this.wolfSkinColor);
              rect(0, 0, this.w, this.h, 3);
              fill(this.hairColor);
              rect(0, this.h/2, this.w, this.h/2);
              
              //eyes
              fill(this.wolfEyeColor);
              ellipse(this.w/3 + this.speed, this.h/3.5, 4, 4);
              ellipse(this.w - this.w/3 + this.speed, this.h/3.5, 4, 4);
              
              //ears
              fill(this.hairColor);
              //right
              beginShape();
                  vertex(0, this.h * 0.1);
                  vertex(-this.w * 0.2, -this.h * 0.1);
                  bezierVertex(-this.w * 0.2, this.h * 0.15, -this.w * 0.2, this.h * 0.25, 0, this.h * 0.4);
              endShape(CLOSE);
              //left
              beginShape();
                  vertex(this.w, this.h * 0.1);
                  vertex(this.w * 1.2, -this.h * 0.1);
                  bezierVertex(this.w * 1.2, this.h * 0.15, this.w * 1.2, this.h * 0.25, this.w, this.h * 0.4);
              endShape(CLOSE);
          
              //fangs
              noStroke();
              fill(245, 242, 242);
              triangle(this.w * 0.35 + 4, this.h/2, this.w * 0.4 + 4, this.h * 0.65, this.w * 0.45 + 4, this.h/2);
              triangle(this.w * 0.55 + 4, this.h/2, this.w * 0.6 + 4, this.h * 0.65, this.w * 0.65 + 4, this.h/2);
              //triangle(this.w * 0.45 + 4, this.h/2, this.w * 0.5 + 4, this.h * 0.65, this.w * 0.55 + 4, this.h/2);
          }
          else {
              //body
              noStroke();
              fill(this.skinColor);
              rect(0, 0, this.w, this.h, 3);
              fill(this.shirtColor);
              rect(0, this.h/2, this.w, this.h/2);
              fill(this.hairColor);
              rect(-2, -2, this.w + 4, 3);
          
              //eyes
              fill(this.eyeColor);
              ellipse(this.w/3 + this.speed, this.h/3.5, 4, 4);
              ellipse(this.w - this.w/3 + this.speed, this.h/3.5, 4, 4);
          }
  
          popMatrix();
      };
      
      Werewolf.prototype.update = function() {
          if(this.isWolf) {
              this.pos.x += this.wolfSpeed * this.dir;
              if(this.wolfTimer++ >= this.transitionTime) {
                  this.isWolf = false;
                  this.wolfTimer = 0;
              }
          }
          else {
              this.pos.x += this.manSpeed * this.dir;
              if(this.manTimer++ >= this.transitionTime) {
                  this.isWolf = true;
                  this.manTimer = 0;
              }
          }        
      
          if(random() < 0.005) {
              game.coins.push(new Bone(this.pos.x, 495));
          }
      };
      
      Werewolf.prototype.run = function() {
          this.update();
          this.display();
      };
  
  } //Werewolf
  
  } //Enemies (Inherited)
  
  {
      //Player Object
      var Player = function(x, y, w, h) {
          this.startpos = new PVector(x, y);
          this.pos = new PVector(x, y);
          this.w = w;
          this.h = h;
          this.xs = 0;
          this.ys = 0;
          this.canJump = false;
      
          this.gravity = 0.5;
          this.jumpPower = 10;
          this.acceleration = 0.5;
          this.maxSpeed = 5;
          this.momentum = 0.5;
          
          this.armed = 0; //angle of the guns - 0 (loaded) or 70 (unloaded) 
      
          this.fired = false;
          this.bulletsInit = 2;
          this.bullets = game.levels[game.level].bullets || this.bulletsInit;
          this.bullet = {
              pos: new PVector(0, 0),
              w: 5,
              h: 5,
              dir: 0,
              speed: 10
          };
      };
      
      Player.prototype.display = function() {
          noStroke();
          //body
          fill(215, 177, 112);
          rect(this.pos.x, this.pos.y, this.w, this.h, 3);
          fill(68, 112, 53);
          rect(this.pos.x, this.pos.y+this.h/2, this.w, this.h/2);
          //dark green spots (camo)
          fill(37, 78, 36);
          ellipse(this.pos.x + this.w/8, this.pos.y + this.h / 1.4, 7, 7);
          ellipse(this.pos.x + this.w/5, this.pos.y + this.h / 1.5, 5, 5);
          ellipse(this.pos.x + this.w/3, this.pos.y + this.h / 1.2, 9, 7);
          ellipse(this.pos.x + this.w/2, this.pos.y + this.h / 1.5, 9, 7);
          ellipse(this.pos.x + this.w/1.8, this.pos.y + this.h / 1.2, 5, 5);
          ellipse(this.pos.x + this.w/1.4, this.pos.y + this.h / 1.3, 5, 5);
          ellipse(this.pos.x + this.w/1.2, this.pos.y + this.h / 1.4, 9, 9);
          //eyes
          fill(28, 28, 28);
          //moving eyes in direction of player
          ellipse(this.pos.x + this.w/3 + this.xs/this.maxSpeed*this.w/6, this.pos.y + this.h/3.5, 5, 5);
          ellipse(this.pos.x + this.w - this.w/3 + this.xs/this.maxSpeed*this.w/6, this.pos.y + this.h/3.5, 5, 5);
          //helmet
          stroke(68, 112, 53);
          strokeWeight(4);
          line(this.pos.x, this.pos.y, this.pos.x + this.w-1, this.pos.y);
      
          noStroke();
      
          //hands and guns...
          pushMatrix();
          translate(this.pos.x + this.w/2, this.pos.y + this.h/1.8);
          
              //hands
              fill(215, 177, 112);
              ellipse(-this.w/2, this.h/6, 8, 8);
              ellipse(this.w/2, this.h/6, 8, 8);
              
              //guns
              // stroke(38, 38, 38);
              stroke(102, 102, 102);
              strokeWeight(4);
              //left gun
              pushMatrix();
                  translate(-this.w/2, this.h/10);
                  rotate(radians(this.armed));
                  line(0, 0, -this.w/4, 0);
              popMatrix();
              
              //right gun
              pushMatrix();
                  translate(this.w/2, this.h/10);
                  rotate(radians(-this.armed));
                  line(0, 0, this.w/4, 0);
              popMatrix();    
          
          popMatrix();
      
          noStroke();
      
          if(this.fired) {
              this.bullet.pos.x+= this.bullet.speed * this.bullet.dir;
              // fill(8, 8, 8);
              fill(200, 200, 200);
              ellipse(this.bullet.pos.x, this.bullet.pos.y, this.bullet.w, this.bullet.h);
          }
      };
      
      Player.prototype.setMovement = function() {
          var speed = 0.1;
          
          if(keys[RIGHT]) {
              this.xs = constrain(this.xs + this.acceleration, -this.maxSpeed, this.maxSpeed);
          }
          else if(keys[LEFT]) {
              this.xs = constrain(this.xs - this.acceleration, -this.maxSpeed, this.maxSpeed);
          }
          else {
              this.xs *= this.momentum;
          }
          
          if(this.canJump && keys[UP]) {
              this.ys = -this.jumpPower;
          }
      };
      
      Player.prototype.update = function() {
          this.setMovement();
      
          if(!this.canJump) {
              this.ys += this.gravity;
          }
          
          this.canJump = false;
          
          this.pos.y = constrain(this.pos.y + this.ys, 0, 550);
          this.pos.x = constrain(this.pos.x + this.xs, 0, 600 - this.w);
          
          if(this.pos.y + this.h > 500){
              this.ys = 0;
              this.pos.y = 500 - this.h;
              this.canJump = true;
          }
      
          if(this.bullets > 0) {
              this.armed = 0;
          }
          else {
              this.armed = 70;
          }
      };
      
      Player.prototype.shoot = function() {
          //Check if already fired - can only fire one bullet at a time
          if(this.fired === false) {
              //If have bullets then fire
              if(this.bullets > 0) {
                  if(keyPressed && keyCode === 68) { //D - shoot right
                      this.bullet.pos.x = this.pos.x + this.w + this.w/3;
                      this.bullet.pos.y = this.pos.y + this.h/1.6;
                      this.bullet.dir = 1;
                      this.fired = true;
                      this.bullets--;
                      keyCode = 0;
                  }
                  else if(keyPressed && keyCode === 65) { //A - shoot left
                      this.bullet.pos.x = this.pos.x - this.w/3;
                      this.bullet.pos.y = this.pos.y + this.h/1.6;
                      this.bullet.dir = -1;
                      this.fired = true;
                      this.bullets--;
                      keyCode = 0;
                  }
              }
          }
          else {
              //Check if killed enemy or gone off the screen
              for(var i = game.enemies.length - 1; i >= 0; i--)
              {
                  var enemy = game.enemies[i];
                  if( this.bullet.pos.x + this.bullet.w > enemy.pos.x &&
                      this.bullet.pos.x < enemy.pos.x + enemy.w &&
                      this.bullet.pos.y + this.bullet.h > enemy.pos.y &&
                      this.bullet.pos.y < enemy.pos.y + enemy.h) {
                          game.enemies.splice(i, 1);
                          game.score+= game.levels[game.level].enemyPoints;
                          game.enemiesKilled++;
                          this.fired = false;
                          break;
                      }
              }
              
              //If bullet goes off the screen then able to fire again
              if(this.bullet.pos.x < 0 || this.bullet.pos.x > width) {
                  this.fired = false;   
              }
          }
      };
      
      Player.prototype.run = function() {
          this.update();
          this.shoot();
          this.display();
      };
  } //Player
  
  {
      //Game Object
      var Game = function() {
          this.page = "home"; //Mulai on the home page
          this.level = 0; //Mulai on level 0 (home)
          this.levels = [
              { //Home | Level | Tutor | Skor
                  groundColors: [color(119, 22, 22), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 1 - Mummies
                  enemiesToKill: 10,
                  story: ("Misi kamu menghancurkan mumi kecil🤏"),
                  bullets: 2,
                  enemyPoints: 10,
                  cointPoints: 10,
                  groundColors: [color(38, 7, 3), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 2 - Grims
                  enemiesToKill: 10,
                  story: ("Kerja bagus!!\nMisi kamu selanjutnya adalah menghancurkan 10 Monster yang mengerikan"),
                  bullets: 2,
                  enemyPoints: 20,
                  cointPoints: 10,
                  groundColors: [color(12, 24, 36), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 3 - Werewolves
                  enemiesToKill: 15,
                  story: ("Luar biasa!!\nHati-hati dengan 15 manusia serigala liar ygy"),
                  bullets: 2,
                  enemyPoints: 30,
                  cointPoints: 15,
                  groundColors: [color(31, 17, 8), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 4 - Zombies
                  enemiesToKill: 15,
                  story: ("Keren!!\nSelanjutnya bunuh zombie mungil itu👌"),
                  bullets: 2,
                  enemyPoints: 40,
                  cointPoints: 15,
                  groundColors: [color(36, 75, 74), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 5 - Skeletons
                  enemiesToKill: 15,
                  story: ("GG banget lu bang!!\nNext ambil itu skeleton GJ"),
                  bullets: 3,
                  enemyPoints: 50,
                  cointPoints: 20,
                  groundColors: [color(26, 26, 26), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 6 - Spiders
                  enemiesToKill: 15,
                  story: ("Nice gapake Try🤣!!\nHati hati dengan 15 laba-laba licik"),
                  bullets: 3,
                  enemyPoints: 75,
                  cointPoints: 20,
                  groundColors: [color(82, 47, 30), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 7 - Ghosts
                  enemiesToKill: 15,
                  story: ("Pehh keren!!\nSaatnya membantai 15 hantu mengerikan gess"),
                  bullets: 4,
                  enemyPoints: 100,
                  cointPoints: 25,
                  groundColors: [color(59,69,99), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 8 - Cats
                  enemiesToKill: 25,
                  story: ("Kerja yang luar biasa!!\nkeren kan melihat 25 kucing lucu yang menyeramkan itu"),
                  bullets: 4,
                  enemyPoints: 150,
                  cointPoints: 25,
                  groundColors: [color(82, 47, 30), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 9 - Vampires
                  enemiesToKill: 30,
                  story: ("Hampir end gaes!!\nSapa... 30 vampir ganas itu!"),
                  bullets: 5,
                  enemyPoints: 200,
                  cointPoints: 25,
                  groundColors: [color(119,22,22), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              },
              { //Level 10 - All Together
                  enemiesToKill: 30,
                  story: ("Hebat!!\n Oke Misi terakhirmu adalah membuat 30 monster monster ini thuru"),
                  bullets: 8,
                  enemyPoints: 250,
                  cointPoints: 50,
                  groundColors: [color(119,22,22), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)]
              }
          ];
          this.currentScene = this.images.spookyHouse1; //Set initial scene
          this.enemiesKilled = 0; //Set number of enemies killed
          this.enemies = []; //Holds all types of enemy objects
          this.witches = []; //Holds witches used within the Cat level
          this.zombies = []; //Holds the kamikaze zombies and floating ledges
          this.redback = new RedBack({
              pos: new PVector(950, 800),
              scale: 0.4
          });
          this.coins = []; //Holds coins
          this.ammunition = []; //Holds ammunition
          this.enemyFrequency = 100; //Tutor often a new enemy appears
          this.ammoFrequency = 400; //Tutor often ammo appears
          this.score = 0; //Initial score
          this.totalScore = 0; //Initial total score
          this.finalScore = 0; //Initial final score
          this.highSkor = [
              {
                  user: "Pencapaian kamu",
                  score: 0
              },
              {
                  user: "Pencapaian kamu",
                  score: 0
              },
              {
                  user: "Pencapaian kamu",
                  score: 0
              },
              {
                  user: "Pencapaian kamu",
                  score: 0
              },
              {
                  user: "Pencapaian kamu",
                  score: 0
              },
              {
                  user: "Pencapaian kamu",
                  score: 0
              },
              {
                  user: "Pencapaian kamu",
                  score: 0
              },
              {
                  user: "Pencapaian kamu",
                  score: 0
              }];
          this.textColor = color(240, 240, 240, 100); //Default text color
          this.defaultBackgroundColor = color(43, 40, 40); //Default background color
          this.backgroundColor = this.defaultBackgroundColor;//Set background as default color
          // this.lightning = new Lightning({
          //         minx: width * 0.2,
          //         maxx: width * 0.8,
          //         y: 0,
          //         length: 30,
          //         depth: 18,
          //         weight: 4
          //     });
          this.lightning = new Lightning({});
          {
          this.homeButton = new Button ({
              x: 240,
              y: 320,
              content: "Home",
              page: "home"
          });
          this.backButton = new Button ({
              x: 520,
              y: 520,
              content: "Home",
              page: "home"
          });
          this.completeButton = new Button ({
              x: 300,
              y: 420,
              content: "Home",
              page: "home"
          });
          this.howButton = new Button({
              x: 120,
              y: 250,
              content: "Tutor",
              page: "how"
          });
          this.levelsButton = new Button({
              x: 360,
              y: 250,
              content: "Level",
              page: "levels"
          });
          this.scoresButton = new Button({
              x: 480,
              y: 250,
              content: "Skor",
              page: "scores"
          });
          this.startButton = new Button({
              x: 240,
              y: 250,
              content: "Mulai",
              page: "start"
          });
          this.playButton = new Button({
              x: 360,
              y: 320,
              content: "Play",
              page: "play"
          });
          this.replayButton = new Button({
              x: 360,
              y: 320,
              content: "Replay",
              page: "replay"
          });
          this.nextButton = new Button({
              x: 360,
              y: 320,
              content: "Next",
              page: "next"
          });
          this.level1Button = new Button({
              x: width * 0.2,
              y: 160,
              size: 100,
              textSize: 11,
              content: "Level 1\n\nMorbid\nMummies",
              page: "level",
              level: 1
          });
          this.level2Button = new Button({
              x: width * 0.4,
              y: 160,
              size: 100,
              textSize: 11,
              content: "Level 2\n\nGrisly\nGrims",
              page: "level",
              level: 2
          });
          this.level3Button = new Button({
              x: width * 0.6,
              y: 160,
              size: 100,
              textSize: 11,
              content: "Level 3\n\nWild\nWerewolves",
              page: "level",
              level: 3
          });
          this.level4Button = new Button({
              x: width * 0.8,
              y: 160,
              size: 100,
              textSize: 11,
              content: "Level 4\n\nZany\nZombies",
              page: "level",
              level: 4
          });
          this.level5Button = new Button({
              x: width * 0.2,
              y: 280,
              size: 100,
              textSize: 11,
              content: "Level 5\n\nScary\nSkeletons",
              page: "level",
              level: 5
          });
          this.level6Button = new Button({
              x: width * 0.4,
              y: 280,
              size: 100,
              textSize: 11,
              content: "Level 6\n\nSneaky\nSpiders",
              page: "level",
              level: 6
          });
          this.level7Button = new Button({
              x: width * 0.6,
              y: 280,
              size: 100,
              textSize: 11,
              content: "Level 7\n\nGhastly\nGhosts",
              page: "level",
              level: 7
          });
          this.level8Button = new Button({
              x: width * 0.8,
              y: 280,
              size: 100,
              textSize: 11,
              content: "Level 8\n\nCreepy\nCats",
              page: "level",
              level: 8
          });
          this.level9Button = new Button({
              x: width * 0.2,
              y: 400,
              size: 100,
              textSize: 11,
              content: "Level 9\n\nVicious\nVampires",
              page: "level",
              level: 9
          });
          this.level10Button = new Button({
              x: width * 0.4,
              y: 400,
              size: 100,
              textSize: 11,
              content: "Level 10\n\nMonsterous\nMonsters",
              page: "level",
              level: 10
          });
      } //Buttons
      };
      
      //Resets Kamikaze Spiders array
      Game.prototype.resetSpiders = function(n) {
          this.kamikazeSpiders = [];
          for(var i = 0; i < n; i++) {
              this.kamikazeSpiders.push(new KamikazeSpider({
                  pos: new PVector(random(30, width-30), random(50, 100))
              }));
          }
      };
  
      //Resets Kamikaze Vampires array
      Game.prototype.resetVampires = function(n) {
          this.kamikazeVampires = [];
          for(var i = 0; i < n; i++) {
              this.kamikazeVampires.push(new KamikazeVampire({
                  pos: new PVector(random(30, width-30), random(50, 150))
              }));
          }
      };
  
      //Resets Kamikaze Zombies and Floating Ledges
      Game.prototype.resetZombies = function(n) {
          this.zombies = [];
  
          for(var i = 0; i < n; i++) {
              var y = random(height * 0.2, height * 0.25) * (i+1);
              var dir = random() < 0.5 ? 1 : -1;
              var x = random(width * 0.1, width * 0.8);
  
              this.zombies.push(
                  {
                      kamikazeZombie: new KamikazeZombie({
                          pos: new PVector(x + 35, y-30)
                      }),
                      ledgeX: x,
                      ledgeY: y,
                      ledgeDir: dir,
                      ledgeSpeed: random(0.4, 0.8)
                  }
              );
          }
      };
  
      //Resets Kamikaze Grim and Floating Ledge
      Game.prototype.resetGrims = function() {
          this.kamikazeGrim = new KamikazeGrim({
              pos: new PVector(350, 260)
          });
      };
      
      //Resets Kamikaze Cats array
      Game.prototype.resetCats = function(n) {
          this.kamikazeCats = [];
          this.witches = [];
          for(var i = 0; i < n; i++) {
              var pos = new PVector(random(30, width-30), random(50, 300));
              var kamikazeCat = new KamikazeCat({
                  pos: pos
              });
              var witch = new Witch({
                  pos: new PVector(pos.x, pos.y)
              });
              kamikazeCat.dir = witch.dir;
  
              this.kamikazeCats.push(kamikazeCat);
              this.witches.push(witch);
          }
      };
  
      //Sets the ghost with a random window
      Game.prototype.setGhost = function() {
          var window = random();
          var opacity = random(5, 50);
          var ghost;
  
          if(window < 0.25) {
              ghost = new KamikazeGhost({
                  pos: new PVector(275, 155),
                  scale: 0.1,
                  opacity: opacity
              });
          }
          else if(window < 0.5) {
              ghost = new KamikazeGhost({
                  pos: new PVector(155, 270),
                  scale: 0.1,
                  opacity: opacity
              });
          }
          else if(window < 0.75) {
              ghost = new KamikazeGhost({
                  pos: new PVector(245, 240),
                  scale: 0.1,
                  opacity: opacity
              });
          }
          else {
              ghost = new KamikazeGhost({
                  pos: new PVector(390, 210),
                  scale: 0.1,
                  opacity: opacity
              });
          }
  
          this.kamikazeGhosts.push(ghost);
      };
      
      //Resets Kamikaze Ghosts array
      Game.prototype.resetGhosts = function(n) {
          this.kamikazeGhosts = [];
  
          for(var i = 0; i < n; i++) {
              this.setGhost();
          }
      };
      
      //Resets Kamikaze Skeletons array
      Game.prototype.resetSkeletons = function(n) {
          this.kamikazeSkeletons = [];
          for(var i = 0; i < n; i++) {
              this.kamikazeSkeletons.push(new KamikazeSkeleton({
                  pos: new PVector(random(30, width-30), random(520, 560))
              }));
          }
      };
  
      //Resets Kamikaze Monsters (mixed) array
      Game.prototype.resetMonsters = function() {
          this.resetGrims();
          this.resetZombies(1);
          this.resetSkeletons(2);
          this.resetSpiders(1);
          this.resetGhosts(1);
          this.resetCats(1);
          this.resetVampires(1);
      };
      
      //Resets Level
      Game.prototype.resetLevel = function() {
          player.bullets = this.levels[this.level].bullets;
          player.fired = false;
          keyCode = 0;
      
          switch(this.level) {
              case 1: //mummies
                  this.backgroundColor = color(66, 29, 23);
                  this.currentScene = this.images.spookyHouse1;
                  break;
              case 2: //grims
                  this.backgroundColor = color(33, 43, 59);
                  this.currentScene = this.images.spookyHouse2;
                  this.resetGrims();
                  break;
              case 3: //werewolves
                  this.backgroundColor = color(61, 34, 21);
                  this.currentScene = this.images.spookyHouse3;
                  break;
              case 4: //zombies
                  this.backgroundColor = color(38, 62, 62);
                  this.currentScene = this.images.spookyHouse4;
                  this.resetZombies(2);
                  break;
              case 5: //skeletons
                  this.backgroundColor = color(33, 32, 31);
                  this.currentScene = this.images.spookyHouse5;
                  this.resetSkeletons(4);
                  break;
              case 6: //spiders
                  this.backgroundColor = color(82, 47, 30);
                  this.currentScene = this.images.spookyHouse6;
                  this.resetSpiders(3);
                  break;
              case 7: //ghosts
                  this.backgroundColor = color(59, 69, 99);
                  this.currentScene = this.images.spookyHouse7;
                  this.resetGhosts(3);
                  break;
              case 8: //cats
                  this.backgroundColor = color(82, 47, 30);
                  this.currentScene = this.images.spookyHouse8;
                  this.resetCats(4);
                  break;
              case 9: //vampires
                  this.backgroundColor = color(33, 32, 31);
                  this.currentScene = this.images.spookyHouse9;
                  this.resetVampires(3);
                  break;
              case 10: //monsters
                  this.backgroundColor = color(33, 32, 31);
                  this.currentScene = this.images.spookyHouse4;
                  this.resetMonsters();
                  break;
          }
      };
      
      //Called from the Button to reset initial values
      Game.prototype.reset = function() {
          switch(this.page) {
              case "start":
                  this.enemiesKilled = 0;
                  this.finalScore = 0;
                  this.totalScore = 0;
                  this.level = 1;
                  this.resetLevel();
              break;
              case "play":
                  break;
              case "replay":
                  this.enemiesKilled = 0;
                  this.resetLevel();
                  break;
              case "next":
              case "level":
                  this.enemiesKilled = 0;
                  this.resetLevel();
                  this.page = "play";
                  break;
              default:
                  this.level = 0;
                  break;
          }
      };
      
      //Main Ground used in home and level scenes
      Game.prototype.baseGround = function(level) {
          //BASE GROUND
          var groundColors = this.levels[level].groundColors;
          var n = 0;
          noStroke();
      
          for(var i = 0; i < 100; i+=20) {
              fill(groundColors[n % 5]);
              rect(0, 500 + i, 600, 20);
              n++;
          }
      
          n = 0;
      
          for(var i = 0; i < 100; i+=20) {
              fill(groundColors[n % 5]);
              for(var j = 0; j < 30; j++) {
                  var x = random(0, 600);
                  var y = random(525 + i, 530 + i);
      
                  triangle(x, 520 + i, x + 5, y, x + 10, 520 + i);
              }
              n++;
          }
      
          for(var i = 0; i < 100; i++) {
              strokeWeight(random(2, 5));
              stroke(random(20, 50));
              point(random(0, 600), random(510, 600));
          }
      };
  
      //Get spooky house for home and level screens
      Game.prototype.getSpookyHouse = function(index) {
          var windowImage = function () {
              background(0, 0, 0, 0);
              noStroke();
          
              var groundColor = game.levels[index].groundColors[0];            
              var r = red(groundColor);
              var g = green(groundColor);
              var b = blue(groundColor);
              fill(r, g, b, 150);
          
              //left window
              beginShape();
              vertex(170, 420);
              vertex(210, 420);
              vertex(210, 320);
              vertex(165, 320);
              endShape(CLOSE);
          
              //middle left window
              beginShape();
              vertex(240, 290);
              vertex(280, 290);
              vertex(280, 225);
              vertex(235, 225);
              endShape(CLOSE);
          
              //top center window (circle)
              ellipse(290, 170, 60, 60);
          
              //middle left window (arched)
              beginShape();
              vertex(150, 300);
              vertex(150, 280);
              bezierVertex(150, 250, 190, 250, 190, 280);
              vertex(190, 300);
              endShape(CLOSE);
          
              //middle right window (arched)
              beginShape();
              vertex(385, 250);
              vertex(385, 210);
              bezierVertex(390, 180, 425, 180, 430, 210);
              vertex(430, 250);
              endShape(CLOSE);
          
              //middle right window
              beginShape();
              vertex(300, 290);
              vertex(340, 290);
              vertex(340, 225);
              vertex(300, 225);
              endShape(CLOSE);
          
              beginShape();
              vertex(250, 440);
              vertex(320, 440);
              vertex(325, 335);
              vertex(245, 335);
              endShape(CLOSE);
          
              //arch at top of door
              beginShape();
              vertex(245, 330);
              bezierVertex(255, 300, 315, 300, 325, 330);
              endShape(CLOSE);
              
              return get();
          }();
  
          var houseColor = color(10, 10, 10, 250);
          
          noStroke();
          fill(houseColor);
          
          //Main House
          beginShape();
          vertex(100, 485);
          vertex(500, 485);
          vertex(475, 460);
          vertex(450, 440);
          vertex(430, 410);
          vertex(350, 410);
          vertex(350, 300);
          vertex(450, 300);
          vertex(430, 290);
          vertex(425, 270);
          vertex(435, 260);
          vertex(445, 250);
          vertex(440, 250);
          vertex(440, 200);
          vertex(450, 200);
          vertex(405, 120);
          vertex(360, 200);
          vertex(330, 120);
          vertex(250, 120);
          vertex(220, 200);
          vertex(190, 220);
          vertex(160, 150);
          vertex(120, 260);
          vertex(135, 260);
          vertex(140, 300);
          vertex(120, 320);
          vertex(150, 320);
          vertex(160, 440);
          vertex(120, 460);
          endShape(CLOSE);
          
          //balcony pole
          beginShape();
          vertex(415, 410);
          vertex(415, 300);
          vertex(408, 300);
          vertex(408, 410);
          endShape(CLOSE);
          
          //balcony fence
          beginShape();
          vertex(408, 380);
          vertex(350, 380);
          vertex(350, 385);
          vertex(408, 385);
          endShape(CLOSE);
          
          //posts
          beginShape();
          vertex(358, 385);
          vertex(362, 385);
          vertex(362, 410);
          vertex(358, 410);
          endShape(CLOSE);
          beginShape();
          vertex(374, 385);
          vertex(378, 385);
          vertex(378, 410);
          vertex(374, 410);
          endShape(CLOSE);
          beginShape();
          vertex(390, 385);
          vertex(394, 385);
          vertex(394, 410);
          vertex(390, 410);
          endShape(CLOSE);
          
          //display windows
          image(windowImage, 0, 0);
          
          fill(houseColor);
          //middle right window - bars
          beginShape();
          vertex(318, 290);
          vertex(322, 290);
          vertex(322, 225);
          vertex(318, 225);
          endShape(CLOSE);
          beginShape();
          vertex(300, 246);
          vertex(340, 246);
          vertex(340, 250);
          vertex(300, 250);
          endShape(CLOSE);
          beginShape();
          vertex(300, 268);
          vertex(340, 268);
          vertex(340, 272);
          vertex(300, 272);
          endShape(CLOSE);
          
          //arch beams at top of door
          fill(houseColor);
          beginShape();
          vertex(283, 330);
          vertex(283, 300);
          vertex(287, 300);
          vertex(287, 330);
          endShape(CLOSE);
          beginShape();
          vertex(283, 335);
          vertex(250, 300);
          vertex(254, 300);
          vertex(287, 335);
          endShape(CLOSE);
          beginShape();
          vertex(283, 335);
          vertex(320, 300);
          vertex(324, 300);
          vertex(287, 335);
          endShape(CLOSE);
          
          //door
          beginShape();
              vertex(240, 338);
              vertex(280, 341);
              vertex(280, 434);
              vertex(240, 441);
          endShape(CLOSE);
          
          //spikes at top of roof
          beginShape();
              vertex(250, 120);
              vertex(255, 110);
              vertex(260, 120);
              vertex(265, 110);
              vertex(270, 120);
              vertex(275, 110);
              vertex(280, 120);
              vertex(285, 110);
              vertex(290, 120);
              vertex(295, 110);
              vertex(300, 120);
              vertex(305, 110);
              vertex(310, 120);
              vertex(315, 110);
              vertex(320, 120);
              vertex(325, 110);
              vertex(330, 120);
          endShape(CLOSE);
          
          //door handle
          fill(50);
          ellipse(270, 370, 7, 10);
  
          //spider web
          //updated so that it uses a web image for better performance
          image(this.images.web, 0, 0);
          // var spiderWeb = new SpiderWeb({
          //     pos: new PVector(430, 300), 
          //     scale: new PVector(-0.2, 0.2)
          // });
          // spiderWeb.display();
      };
  
      Game.prototype.getTree = function() {
          background(0, 0, 0, 0);
          noStroke();
  
          var tree = new Tree({
              x: 75,
              y: 460,
              length: 45,
              weight: 2,
              depth:4
          });
  
          tree.display();
      };
  
      Game.prototype.getWeb = function() {
          background(0, 0, 0, 0);
          //spider web
          var spiderWeb = new SpiderWeb({
              pos: new PVector(430, 300), 
              scale: new PVector(-0.2, 0.2)
          });
          spiderWeb.display();
      };
  
      //Get main scene for home and level screens
      Game.prototype.getScene = function(index) { //used for all levels
          noStroke();
  
          //updated so that all scenes use the same tree image for better performance
          image(this.images.tree, 0, 0);
          // var tree = new Tree({
          //     x: 75,
          //     y: 460,
          //     length: 45,
          //     weight: 2,
          //     depth:4
          // });        
          // tree.display();
          
          var graveStone = new GraveStone(
          {
              pos: new PVector(550, 410),
              scale: new PVector(0.3, 0.3),
              angle: 5
          });
          graveStone.display();
  
          var cross = new Cross(
              {
                  pos: new PVector(490, 410),
                  scale: new PVector(0.4, 0.4),
                  angle: -5
              });
          cross.display();
  
          //smooth hill
          fill(20, 20, 20);
          noStroke();
          beginShape();
              vertex(0, 440);
              bezierVertex(50, 445, 200, 460, 320, 470);
              bezierVertex(400, 480, 500, 420, 600, 430);
              vertex(600, 500);
              vertex(0, 500);
              vertex(0, 440);
          endShape();
          
          //moon
          noStroke();            
          fill(200, 200, 200, 5);
          ellipse(500, 140, 150, 150);
          ellipse(500, 140, 140, 140);
          ellipse(500, 140, 130, 130);
          ellipse(500, 140, 120, 120);
          ellipse(500, 140, 110, 110);
          
          fill(200, 200, 200, 20);
          ellipse(500, 140, 100, 100);
  
          game.baseGround(index);
      };
  
      //Spiderweb used in Spider level
      Game.prototype.getSpiderWeb = function() {
          var spiderWeb = new SpiderWeb({pos: new PVector(300, 0), scale: new PVector(0.75, 0.75)});
          spiderWeb.display();
          var spiderWeb2 = new SpiderWeb({pos: new PVector(400, 0), scale: new PVector(-1, 1)});
          spiderWeb2.display();
      };
      
      //Images used in the Game - Preloaded later
      Game.prototype.images = {
          tree: function() { //home, how, levels, scores
              background(0, 0, 0, 0);
              game.getTree();
              return get(0, 0, width, height);         
          },
          web: function() { //home, how, levels, scores
              background(0, 0, 0, 0);
              game.getWeb();
              return get(0, 0, width, height);         
          },
          scene: function() { //home, how, levels, scores
              background(0, 0, 0, 0);
              game.getScene(9);
              return get(0, 0, width, height);         
          },
          spookyHouse: function() { //home            
              background(0, 0, 0, 0);
              game.getSpookyHouse(9);
              return get(0, 0, width, height);
          },
          spookyHouse1: function() { //mummies            
              background(0, 0, 0, 0);
              game.getSpookyHouse(1);
              game.getScene(1);
              return get(0, 0, width, height);
          },
          spookyHouse2: function() { //grims            
              background(0, 0, 0, 0);
              game.getSpookyHouse(2);
              game.getScene(2);
              return get(0, 0, width, height);
          },
          spookyHouse3: function() { //werewolves           
              background(0, 0, 0, 0);
              game.getSpookyHouse(3);
              game.getScene(3);
              return get(0, 0, width, height);
          },
          spookyHouse4: function() { //zombies           
              background(0, 0, 0, 0);
              game.getSpookyHouse(4);
              game.getScene(4);
              return get(0, 0, width, height);
          },
          spookyHouse5: function() { //skeletons            
              background(0, 0, 0, 0);
              game.getSpookyHouse(5);
              game.getScene(5);
              return get(0, 0, width, height);
          },
          spookyHouse6: function() { //spiders           
              background(0, 0, 0, 0);
              game.getSpookyHouse(6);
              game.getScene(6);
              game.getSpiderWeb();
              return get(0, 0, width, height);
          },
          spookyHouse7: function() { //ghosts            
              background(0, 0, 0, 0);
              game.getSpookyHouse(7);
              game.getScene(7);
              return get(0, 0, width, height);
          },
          spookyHouse8: function() { //cats           
              background(0, 0, 0, 0);
              game.getSpookyHouse(8);
              game.getScene(8);
              return get(0, 0, width, height);
          },
          spookyHouse9: function() { //vampires          
              background(0, 0, 0, 0);
              game.getSpookyHouse(9);
              game.getScene(9);
              return get(0, 0, width, height);
          },
          characters: function() { //home
              //back mountain
              background(0, 0, 0, 0);
      
              var p = new Player(280, 470, 30, 30);
              p.display();
      
              var grim = new Grim({
                  pos: new PVector(365, 350),
                  dir: 1
              });
              grim.display();
  
              var werewolf = new Werewolf({
                  pos: new PVector(500, 470),
                  dir: 1,
                  isWolf: true
              });
              werewolf.display();
      
              var skeleton = new Skeleton({
                  pos: new PVector(360, 540),
                  dir: -1
              });
              skeleton.display();
      
              var cat = new Cat({
                  pos: new PVector(50, 470),
                  dir: 1
              });
              cat.display();
      
              var mummy = new Mummy({
                  pos: new PVector(390, 470),
                  dir: -1
              });
              mummy.display();
  
              var vampire = new Vampire({
                  pos: new PVector(160, 470),
                  dir: -1
              });
              vampire.display();
  
              var ghost = new Ghost({
                  pos: new PVector(275, 155),
                  dir: -1
              });
              ghost.display();
  
              var kamizazeSpider = new KamikazeSpider({
                  pos: new PVector(50, 100),
                  dir: -1
              });
              strokeWeight(1);
              stroke(255, 255, 255, 50);
              line(kamizazeSpider.pos.x + kamizazeSpider.w/2, 0, kamizazeSpider.pos.x + kamizazeSpider.w/2, kamizazeSpider.pos.y);
              kamizazeSpider.display();
      
              return get(0, 0, width, height);
          },
          floatingLedge: function() { //zombies
              var groundColors = [color(36, 75, 74), color(29, 29, 29)];
      
              var n = 0;
              var index = 0;
              noStroke();
      
              for(var i = 0; i < 40; i+=20) {
                  fill(groundColors[n]);
                  rect(0, 0 + i, 100, 20);
                  n++;
              }
      
              n = 0;
              
              for(var i = 0; i < 40; i+=20) {
                  fill(groundColors[n]);
                  for(var j = 0; j < 7; j++) {
                      var x = random(0, 90);
                      var y = random(25 + i, 30 + i);
          
                      triangle(x, i + 20, x + 5, y, x + 10, i + 20);
                  }
                  n++;
              }
              
              for(var i = 0; i < 15; i++) {
                  strokeWeight(random(2, 5));
                  stroke(random(20, 50));
                  point(random(0, 100), random(0, 40));
              }
      
              return get(0, 0, 100, 60);
          }
      };
      
      //Drops Ammo using ammoFrequency
      Game.prototype.dropAmmo = function() {
          if(frameCount % this.ammoFrequency === 0) {
              this.ammunition.push(new Ammo(random(20, 550), -50));
          }
      };
      
      //Check if player collides with enemy
      Game.prototype.checkCollisionEnemy = function(player) {
          var collision = false;
          for(var i = 0; i < this.enemies.length; i++) {
              var enemy = this.enemies[i];
              if( player.pos.x + player.w > enemy.pos.x &&
                  player.pos.y + player.h > enemy.pos.y &&
                  player.pos.x < enemy.pos.x + enemy.w &&
                  player.pos.y < enemy.pos.y + enemy.h) {
                  collision = true;
                  break;
              }
          }
      
          return collision;
      };
      
      //Check if player collides with ammo
      Game.prototype.checkCollisionAmmo = function(player) {
          var collision = false;
          for(var i = this.ammunition.length - 1; i >= 0; i--) {
              var ammo = this.ammunition[i];
              if( player.pos.x + player.w > ammo.pos.x &&
                  player.pos.y + player.h > ammo.pos.y &&
                  player.pos.x < ammo.pos.x + ammo.w &&
                  player.pos.y < ammo.pos.y + ammo.h) {
                  collision = true;
                  this.ammunition.splice(i, 1);
                  break;
              }
          }
      
          return collision;
      };
      
      //Check if player collides with coin
      Game.prototype.checkCollisionCoin = function(player, coin) {
          var collision = false;
      
          if( player.pos.x + player.w > coin.pos.x &&
              player.pos.y + player.h > coin.pos.y &&
              player.pos.x < coin.pos.x + coin.w &&
              player.pos.y < coin.pos.y + coin.h) {
              collision = true;
          }
      
          return collision;
      };
  
      //Updates the Kamikaze Spiders
      Game.prototype.updateKamikazeSpiders = function() { //level 3 - spiders
          for(var i = this.kamikazeSpiders.length - 1; i >= 0 ; i--) {
              var kamizazeSpider = this.kamikazeSpiders[i];
  
              if(kamizazeSpider.timeToFall > 0) {
                  strokeWeight(1);
                  stroke(255, 255, 255, 50);
                  line(kamizazeSpider.pos.x + kamizazeSpider.w/2, 0, kamizazeSpider.pos.x + kamizazeSpider.w/2, kamizazeSpider.pos.y);
                  kamizazeSpider.pos.y += 0.5 * kamizazeSpider.speed * kamizazeSpider.yDir;
          
                  if(kamizazeSpider.pos.y < 50 || kamizazeSpider.pos.y + kamizazeSpider.h > 200) {
                      kamizazeSpider.yDir *= -1;
                  }
              }
          
              kamizazeSpider.drop();
          
              if(kamizazeSpider.isOnGround) {
                  kamizazeSpider.pos.y = 470;
                  this.enemies.push(kamizazeSpider);
                  this.kamikazeSpiders.splice(i, 1);
                  this.kamikazeSpiders.push(new KamikazeSpider({
                      pos: new PVector(random(30, width-30), random(50, 100))
                  }));
              }
          }
      };
  
      //Updates the Kamikaze Vampires
      Game.prototype.updateKamikazeVampires = function() { //level 5 - vampires
          for(var i = this.kamikazeVampires.length - 1; i >= 0 ; i--) {
              var kamizazeVampire = this.kamikazeVampires[i];
      
              if(kamizazeVampire.timeToFall > 0) {
                  kamizazeVampire.theta += 10;
                  kamizazeVampire.dy = sin(radians(kamizazeVampire.theta)) * kamizazeVampire.amplitude;
      
                  kamizazeVampire.pos.x += kamizazeVampire.speed * kamizazeVampire.dir;
                  kamizazeVampire.pos.y = kamizazeVampire.ybase + kamizazeVampire.dy;
                  if(kamizazeVampire.flyUp > 0 && kamizazeVampire.pos.y > kamizazeVampire.flyUp) {
                      kamizazeVampire.ybase-=2;
                  }
          
                  if(kamizazeVampire.pos.x < 50 || kamizazeVampire.pos.x + kamizazeVampire.w > width-50) {
                      kamizazeVampire.dir *= -1;
                  }
              }
          
              kamizazeVampire.drop();
          
              if(kamizazeVampire.isOnGround) {
                  var vampire = new Vampire({
                      pos: new PVector(kamizazeVampire.pos.x, 470)
                  });
      
                  this.enemies.push(vampire);
                  this.kamikazeVampires.splice(i, 1);
                  this.kamikazeVampires.push(new KamikazeVampire({
                      pos: new PVector(random(30, width-30), random(50, 150))
                  }));
              }
          }
      };
  
      //Updates the Vampires (transition from vampire to bat)
      Game.prototype.updateVampires = function() { //level 5 - vampires
          for(var i = this.enemies.length - 1; i >= 0 ; i--) {
              var vampire = this.enemies[i];
      
              if(random() < 0.002) {
                  this.enemies.splice(i, 1);
                  var kamikazeVampire = new KamikazeVampire({
                      pos: new PVector(vampire.pos.x, 430)
                  });
                  this.kamikazeVampires.push(kamikazeVampire);
              }
          }
      };
  
      //Updates the Kamizaze Zombies
      Game.prototype.updateKamikazeZombies = function() { //level 4 - zombies
          for(var i = 0; i < this.zombies.length; i++) {
              var zombie = this.zombies[i];
  
              zombie.ledgeX+= zombie.ledgeSpeed * zombie.ledgeDir;
              if(zombie.kamikazeZombie.timeToFall > 0) {
                  if(zombie.kamikazeZombie.pos.x <= zombie.ledgeX || zombie.kamikazeZombie.pos.x + zombie.kamikazeZombie.w >= zombie.ledgeX + 100) {
                      zombie.kamikazeZombie.dir *= -1;
                      zombie.kamikazeZombie.pos.x += zombie.kamikazeZombie.speed * zombie.kamikazeZombie.dir;
                  }
                  else {
                      zombie.kamikazeZombie.pos.x += 0.5 * zombie.kamikazeZombie.speed * zombie.kamikazeZombie.dir;
                  }                
              }
  
              zombie.kamikazeZombie.drop();
      
              if(zombie.kamikazeZombie.isOnGround) {
                  zombie.kamikazeZombie.pos.y = 470;
                  this.enemies.push(zombie.kamikazeZombie);
                  zombie.kamikazeZombie = new KamikazeZombie({
                      pos: new PVector(zombie.ledgeX + 30, zombie.ledgeY - 30)
                  });
              }
          
              if(zombie.ledgeX + 100 >= width || zombie.ledgeX <= 0) {
                  zombie.ledgeDir*= -1;
              }
          }
      };
      
      //Updates the Kamizaze Grim
      Game.prototype.updateKamikazeGrim = function() { //level 2 - grims
          if(this.kamikazeGrim.timeToFall > 0) {
              this.kamikazeGrim.pos.x += 0.5 * this.kamikazeGrim.speed * this.kamikazeGrim.dir;
      
              if(this.kamikazeGrim.pos.x <= 230 || this.kamikazeGrim.pos.x + this.kamikazeGrim.w >= 430) {
                  this.kamikazeGrim.dir *= -1;
              }
          }
      
          this.kamikazeGrim.drop();
      
          if(this.kamikazeGrim.isOnGround) {
              this.enemies.push(this.kamikazeGrim);
              this.kamikazeGrim = new KamikazeGrim({
                  pos: new PVector(350, 260)
              });
          }
      };
      
      //Updates the Kamikaze Cats
      Game.prototype.updateKamikazeCats = function() { //level 3 - cats
          for(var i = this.kamikazeCats.length - 1; i >= 0 ; i--) {
              var kamikazeCat = this.kamikazeCats[i];
              var witch = this.witches[i];
  
              witch.pos.x += witch.speed * witch.dir;            
      
              if(kamikazeCat.timeToFall > 0) {
                  kamikazeCat.pos.x += witch.speed * kamikazeCat.dir;
              }
  
              witch.display();
              kamikazeCat.drop();
          
              if(kamikazeCat.isOnGround) {
                  var cat = new Cat({
                      pos: new PVector(kamikazeCat.pos.x, 470),
                      bodyColor: kamikazeCat.bodyColor
                  });
  
                  this.enemies.push(cat);
  
                  kamikazeCat.pos = new PVector(witch.pos.x, witch.pos.y);
                  kamikazeCat.dir = witch.dir;
                  kamikazeCat.isOnGround = false;
                  kamikazeCat.timeToFall = random(200, 500);
              }
  
              if(witch.pos.x < -200 || witch.pos.x > width + 100)
              {
                  witch.pos.y = random(50, 300);
                  witch.dir*= -1;
                  witch.speed = random(1.5, 2.5);
                  kamikazeCat.dir = witch.dir;
                  kamikazeCat.pos.y = witch.pos.y;
              }
          }
      };
      
      //Updates the Kamikaze Ghosts
      Game.prototype.updateKamikazeGhosts = function() { //level 4 - ghosts
          for(var i = this.kamikazeGhosts.length - 1; i >= 0 ; i--) {
              var kamikazeGhost = this.kamikazeGhosts[i];
      
              kamikazeGhost.opacity = constrain(kamikazeGhost.opacity + 0.5, 0, 150);
  
              if(kamikazeGhost.timeToFall > 0) {
                  if(kamikazeGhost.opacity >= 50) {
                      kamikazeGhost.theta += 1;
                      kamikazeGhost.dy = sin(radians(kamikazeGhost.theta)) * kamikazeGhost.amplitude;
          
                      kamikazeGhost.pos.y = kamikazeGhost.ybase + kamikazeGhost.dy;
                  }
  
                  kamikazeGhost.scale = constrain(kamikazeGhost.scale + 0.005, 0, 1);
              }
          
              kamikazeGhost.drop();
          
              if(kamikazeGhost.isOnGround) {
                  var ghost = new KamikazeGhost({
                      pos: new PVector(kamikazeGhost.pos.x, kamikazeGhost.pos.y),
                      scale: 1,
                      opacity: 150
                  });
  
                  this.enemies.push(ghost);
                  this.kamikazeGhosts.splice(i, 1);
                  this.setGhost();
              }
          }
      };
      
      //Updates the Kamikaze Skeletons
      Game.prototype.updateKamikazeSkeletons = function() { //level 5 - skeletons
          for(var i = this.kamikazeSkeletons.length - 1; i >= 0 ; i--) {
              var kamizazeSkeleton = this.kamikazeSkeletons[i];
      
              if(kamizazeSkeleton.timeToFall > 0) {
                  //
              }
          
              kamizazeSkeleton.drop();
          
              if(kamizazeSkeleton.isOnGround) {
                  var skeleton = new Skeleton({
                      pos: new PVector(kamizazeSkeleton.pos.x, 470)
                  });
      
                  this.enemies.push(skeleton);
                  this.kamikazeSkeletons.splice(i, 1);
                  this.kamikazeSkeletons.push(new KamikazeSkeleton({
                      pos: new PVector(random(30, width-30), random(520, 560))
                  }));
              }
          }
      };
  
      Game.prototype.updateRedBack = function() {
          this.redback.run();
      };
    
      Game.prototype.runLightning = function() {
        //randomly generate new lightning
        if(random() < 0.009) {
          // background(this.lightning.flashColor);
          background(0);
          this.lightning.generate();
        }
        //draw the lightning
        this.lightning.draw();
      }
  
      //Displays the stats at the top of the screen
      Game.prototype.stats = function() {
          fill(50, 50, 50, 220);
          rect(0, 0, width, 40);
          fill(200, 200, 200, 150);
          textSize(18);
          textAlign(LEFT, TOP);
          text("Level: " + this.level, 50, 10);
          text("Peluru: " + player.bullets, 160, 10);
          text("Harus thuru: " + (this.levels[this.level].enemiesToKill - this.enemiesKilled), 280, 10);
          text("Skor: " + (this.finalScore + this.score), 420, 10);
      };
      
      //Updates Enemies
      Game.prototype.updateEnemies = function() {
          for(var i = this.enemies.length - 1; i >= 0; i --){
              this.enemies[i].run();
              if(this.enemies[i].pos.x < -300 || this.enemies[i].pos.x > 900){
                  this.enemies.splice(i, 1);
              }
          }
      };
      
      //Updates Ammo
      Game.prototype.updateAmmo = function() {
          this.dropAmmo();
      
          for(var i = this.ammunition.length - 1; i >= 0; i --){
              this.ammunition[i].run();
              if(this.ammunition[i].timeToLive < 0) {
                  this.ammunition.splice(i, 1);
              }
          }
      
          if(this.checkCollisionAmmo(player)) {
              player.bullets += this.levels[this.level].bullets;
          }
      };
      
      //Updates Coins
      Game.prototype.updateCoins = function() {
          for(var i = this.coins.length - 1; i >= 0; i--) {
              this.coins[i].run();
              if(this.checkCollisionCoin(player, this.coins[i])) {
                  this.score += this.levels[this.level].cointPoints;
                  this.coins.splice(i, 1);
              }
              else if(this.coins[i].timeToLive < 0) {
                  this.coins.splice(i, 1);
              }
          }
      };
  
      //Checks if game over (if player collides with enemy)
      Game.prototype.checkGameOver = function() {
          if(this.checkCollisionEnemy(player)) {
              this.totalScore = this.finalScore + this.score;
              this.score = 0;
      
              //reset starting values
              player.pos = player.startpos.get();
              player.fired = false;
              player.bullets = this.levels[this.level].bullets; // player.bulletsInit;
              this.enemies = [];
              this.coins = [];
              this.ammunition = [];
      
              this.page = "gameover";
          }
      };
      
      //Check if level complete (if player destroys the required number of enemies for that level)
      Game.prototype.checkLevelComplete = function() {
          if(this.levels[this.level].enemiesToKill === this.enemiesKilled) {
              this.finalScore += this.score;
              this.score = 0;
      
              //reset starting values
              player.pos = player.startpos.get();
              player.fired = false;
              player.bullets = player.bulletsInit;
              this.enemies = [];
              this.coins = [];
              this.ammunition = [];
      
              this.level++;
      
              if(this.level < this.levels.length) {
                  this.page = "next";
              }
              else {
                  this.page = "gamecomplete";
              }
              
          }
      };
  
      //Run the game
      Game.prototype.run = function() {
          player.run();
          this.stats();
          this.updateEnemies();
          this.updateAmmo();
          this.updateCoins();
          this.updateRedBack();
          this.checkLevelComplete();
          this.checkGameOver();
      };
  
      //Play (runs the appropriate level)
      Game.prototype.play = function() {
          switch(this.level) {
              case 1:
                  this.level1();
                  this.run();
                  break;
              case 2:
                  this.level2();
                  this.run();
                  break;
              case 3:
                  this.level3();
                  this.run();
                  break;
              case 4:
                  this.level4();
                  this.run();
                  break;
              case 5:
                  this.level5();
                  this.run();
                  break;
              case 6:
                  this.level6();
                  this.run();
                  break;
              case 7:
                  this.level7();
                  this.run();
                  break;
              case 8:
                  this.level8();
                  this.run();
                  break;
              case 9:
                  this.level9();
                  this.run();
                  break;
              case 10:
                  this.level10();
                  this.run();
                  break;
              case 11:
                  this.gameComplete();
                  break;
          }
      };
      
      //Home Page
      Game.prototype.home = function() {
          background(this.defaultBackgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.images.spookyHouse, 0, 0);
          image(this.images.scene, 0, 0);
          image(this.images.characters, 0, 0);
  
          fill(this.textColor);
          textAlign(CENTER, TOP);
          textSize(40);
          text("LAUTAN MONSTER", width/2, 18);
          textSize(30);
          text("Rumah Horor", width/2, 60);
          textSize(10);
          text("Gk pernah dibuat ngaji wk🥲", width/2, 90);
      
          this.howButton.draw();
          this.startButton.draw();
          this.levelsButton.draw();
          this.scoresButton.draw();
      };
      
      //Tutor Page
      Game.prototype.how = function() {
          background(this.defaultBackgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.images.scene, 0, 0);
  
          fill(this.textColor);
          textSize(40);
          text("Tutor", width/2, 50);
          textSize(16);
          textAlign(CENTER, TOP);
          text("Gunakan tombol panah untuk bergerak ke kiri, kanan, dan lompat\nTekan tombol A dan D untuk menembak\nHindari musuh di kiri, kanan, atas, dan bawah\n\nIngat yagesya, Jumlah peluru kamu terbatas\nUntuk memuat ulang, pastikan kamu punya lebih banyak amunisi\n\nSetiap level memiliki sejumlah monster yang harus kamu hancurkan\nsebelum kamu dapat naik ke level berikutnya\n\nJika kamu ingin memainkan level tertentu, kamu\n dapat langsung menuju ke setiap level di halaman level", width/2, 120);
          this.backButton.draw();
      };
      
      //Level Page
      Game.prototype.gameLevel = function() {
          background(this.defaultBackgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.images.scene, 0, 0);
  
          fill(this.textColor);
          textSize(40);
          textAlign(CENTER, TOP);
          text("Level", width/2, 50);
          this.backButton.draw();
          this.level1Button.draw();
          this.level2Button.draw();
          this.level3Button.draw();
          this.level4Button.draw();
          this.level5Button.draw();
          this.level6Button.draw();
          this.level7Button.draw();
          this.level8Button.draw();
          this.level9Button.draw();
          this.level10Button.draw();
      };
      
      //High Skor Page
      Game.prototype.scores = function() {
          background(this.defaultBackgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.images.scene, 0, 0);
  
          fill(this.textColor);
          textSize(40);
          textAlign(CENTER, TOP);
          text("Skor tertinggi", width/2, 50);
          textSize(16);
      
          var hs = "";
          for(var i = 0; i < this.highSkor.length; i++) {
              hs+= (i+1) + ". " + this.highSkor[i].user + ": " + this.highSkor[i].score + "\n\n";
          }
      
          text(hs, width/2, 120);
          this.backButton.draw();
      };
      
      //Level 1 - Mummys
      Game.prototype.level1 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
  
          if(frameCount % this.enemyFrequency === 0){        
              this.enemies.push(new Mummy({
                  pos: null
              }));
          }
      };
  
      //Level 2 - Grims
      Game.prototype.level2 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
      
          this.updateKamikazeGrim();
          
          if(frameCount % this.enemyFrequency === 0){
              this.enemies.push(new Grim({
                  pos: null
              }));
          }
      };
  
      //Level 3 - Werewolves
      Game.prototype.level3 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
  
          if(frameCount % this.enemyFrequency === 0){        
              this.enemies.push(new Werewolf({
                  pos: null
              }));  
          }
      };
  
      //Level 4 - Zombies
      Game.prototype.level4 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
  
          for(var i = 0; i < this.zombies.length; i++) {
              var zombie = this.zombies[i];
              image(this.images.floatingLedge, zombie.ledgeX, zombie.ledgeY);
          }
      
          this.updateKamikazeZombies();
          
          if(frameCount % this.enemyFrequency === 0){
              this.enemies.push(new Zombie({
                  pos: null
              }));
          }
      };
  
      //Level 5 - Skeletons
      Game.prototype.level5 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
  
          this.updateKamikazeSkeletons();
  
          if(frameCount % this.enemyFrequency === 0){        
              this.enemies.push(new Skeleton({
                  pos: null
              }));
          }
      };
  
      //Level 6 - Spiders
      Game.prototype.level6 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
          
          this.updateKamikazeSpiders();
      
          if(frameCount % this.enemyFrequency === 0){        
              this.enemies.push(new Spider({
                  pos: null
              }));
          }
      };
      
      //Level 7 - Ghosts
      Game.prototype.level7 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
          
          this.updateKamikazeGhosts();
      
          if(frameCount % this.enemyFrequency === 0){        
              this.enemies.push(new Ghost({
                  pos: null
              }));
          }
      };
  
      //Level 8 - Cats
      Game.prototype.level8 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
          
          this.updateKamikazeCats();
      
          if(frameCount % this.enemyFrequency === 0){ 
              this.enemies.push(new Cat({
                  pos: null
              }));     
          }
      };
  
      //Level 9 - Vampires
      Game.prototype.level9 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
          
          this.updateVampires();
          this.updateKamikazeVampires();
      
          if(frameCount % this.enemyFrequency === 0){ 
              this.enemies.push(new Vampire({
                  pos: null
              }));     
          }
      };
  
      //Level 10 - Monsters (mixed)
      Game.prototype.level10 = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
  
          for(var i = 0; i < this.zombies.length; i++) {
              var zombie = this.zombies[i];
              image(this.images.floatingLedge, zombie.ledgeX, zombie.ledgeY);
          }
          
          this.updateKamikazeGrim();
          this.updateKamikazeZombies();
          this.updateKamikazeSkeletons();
          this.updateKamikazeSpiders();
          this.updateKamikazeGhosts();
          this.updateKamikazeCats();
          //this.updateVampires();
          this.updateKamikazeVampires();
      
          if(frameCount % this.enemyFrequency === 0){
              var n = random();
              var monster;
              if(n < 0.11) {
                  monster = new Mummy({pos: null});
              }
              else if(n < 0.22) {
                  monster = new Grim({pos: null});
              }
              else if(n < 0.33) {
                  monster = new Werewolf({pos: null});
              }
              else if(n < 0.44) {
                  monster = new Zombie({pos: null});
              }
              else if(n < 0.55) {
                  monster = new Skeleton({pos: null});
              }
              else if(n < 0.66) {
                  monster = new Spider({pos: null});
              }
              else if(n < 0.77) {
                  monster = new Ghost({pos: null});
              }
              else if(n < 0.88) {
                  monster = new Cat({pos: null});
              }
              else {
                  monster = new Vampire({pos: null});
              }
  
              this.enemies.push(monster);                 
          }
      };
  
      //Next Page
      Game.prototype.next = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
      
          textAlign(CENTER, TOP);
      
          if(this.level === 1) {
              textSize(40);
              fill(this.textColor);
              text("MISI KAMU", 300, 130);
              this.homeButton.draw();
              this.playButton.draw();
          }
          else if(this.level <= this.levels.length) {
              textSize(40);
              fill(this.textColor);
              text("KAMU BERHASIL🥳🤩", 300, 130);
              this.homeButton.draw();
              this.nextButton.draw();
          }
          fill(this.textColor);
          textSize(18);
          text(this.levels[this.level].story, 300, 180);
      };
      
      //Game Over Page
      Game.prototype.gameover = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
  
          textAlign(CENTER, TOP);
          textSize(40);
          fill(this.textColor);
          text("NICE TRY", 300, 130);
          textSize(30);
          text("Score: " + (this.totalScore + this.score), 300, 180);
          text("Monster turu: " + this.enemiesKilled + "/" + (this.levels[this.level].enemiesToKill), 300, 215);
          this.homeButton.draw();
          this.replayButton.draw();
      };
  
      //Game Complete Page
      Game.prototype.gameComplete = function() {
          background(this.backgroundColor);
          // this.showLightning();
          this.runLightning();
          image(this.currentScene, 0, 0);
      
          textSize(40);
          textAlign(CENTER, TOP);
          fill(this.textColor);
          text("EZZ KAN? WKWK", 300, 60);
          text("Total Skor: " + this.finalScore, 300, 110);
          textSize(16);
          text("Selamat, Kamu telah menghancurkan bagian monster kamu.\n\nMonster yang tersisa sekarang telah memutuskan untuk menjadi teman Anda\nkarena kamu sangat pro pler.\n\n jika Anda ingin menghancurkan lebih banyak monster,\nklik tombol Beranda untuk Main lagi.", 300, 200);
          this.completeButton.draw();
      };
      
  } //Game
  
  {
      game = new Game();
      player = new Player(200, 300, 30, 30);
  } //Initialize game and player
  
  {
      for(var i in game.images){
          if(typeof game.images[i] !== 'object'){
              background(0, 0, 0, 0);
              game.images[i] = game.images[i]();
          }
      }
  } //Preload Images
  
  draw = function() {
      background(game.backgroundColor);
      noStroke();
  
      switch(game.page) {
          case "home":
              game.home();
              break;
          case "how":
              game.how();
              break;
          case "levels":
              game.gameLevel();
              break;
          case "scores":
              game.scores();
              break;
          case "play":
          case "replay":
              game.play();
              break;
          case "start":
          case "next":
              game.next();
              break;
          case "gamecomplete":
              game.gameComplete();
              break;
          case "gameover":
              game.gameover();
              break;
      }
  
      //Mouse actions
      cursor(hover ? 'pointer' : 'default');    
      clicked = false;
      hover = false;
  };
      
    }
  }
  
  var canvas = document.getElementById("canvas"); 
  var processingInstance = new Processing(canvas, sketchProc);
