
var xc = xc || {};

xc.Pinata = cc.Layer.extend({
  
  ctor:function () {
  
   this._super();

    cc.spriteFrameCache.addSpriteFrames(xc.Pinata.res.pinata_plist);

    var gameBg = ccs.load(xc.Pinata.res.pinata_json,xc.path);
    this.addChild(gameBg.node);
   
    this.player = {
        x : 0,
        y: 0,
        prevX : 0,
        prevY : 0,
        angle : 90
    }

    this.map =  goa.TextGenerator.getInstance().getAntonyms(3);
    var mapKeyArray = Object.keys(this.map);
    this.mapKey = mapKeyArray[this.getRandomInt(0,(mapKeyArray.length-1))];

    this.bubblePlayer =  new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("pinata/player.png"));
    this.bubblePlayer.setPosition(cc.director.getWinSize().width * 0.5,cc.director.getWinSize().height * 0.2);
    this.addChild(this.bubblePlayer,1);
    this.player.x = this.bubblePlayer.x;    this.player.y = this.bubblePlayer.y;
    
    this.rightLine = new cc.DrawNode();
    this.rightLine.drawSegment(cc.p(this.player.x - (this.bubblePlayer.width *2),this.player.y), cc.p(this.player.x - (this.bubblePlayer.width/2),this.player.y),5,new cc.color(158,45,45,255));
    this.addChild(this.rightLine);

    this.leftLine = new cc.DrawNode(); 
    this.leftLine.drawSegment(cc.p(this.player.x + (this.bubblePlayer.width * 2),this.player.y),cc.p(this.player.x + (this.bubblePlayer.width/2),this.player.y),5,new cc.color(158,45,45,255));
    this.addChild(this.leftLine);

    var classReference = this;
    
    var listnerBg = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: false,
            onTouchBegan :function(touch, event){
                var target = event.getCurrentTarget();
                var targetSize = target.getContentSize();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetRectangle = cc.rect(0,0, target.width, target.height);
                if (cc.rectContainsPoint(targetRectangle, location)){return true;}
                return false;
            },
            onTouchMoved : function(touch, event){
                var target = event.getCurrentTarget();
                target.setPosition(touch.getLocation());

                if(classReference.rightLine != undefined){
                    classReference.removeChild(classReference.rightLine);
                }
                classReference.rightLine = new cc.DrawNode();
                classReference.rightLine.drawSegment(cc.p(classReference.player.x - (classReference.bubblePlayer.width *2),classReference.player.y), cc.p(touch.getLocation().x - (classReference.bubblePlayer.width/2),touch.getLocation().y),5,new cc.color(158,45,45,255));
                classReference.addChild(classReference.rightLine);

                if(classReference.leftLine != undefined){
                    classReference.removeChild(classReference.leftLine);
                }
                classReference.leftLine = new cc.DrawNode();
                classReference.leftLine.drawSegment(cc.p(classReference.player.x + (classReference.bubblePlayer.width *2),classReference.player.y), cc.p(touch.getLocation().x + (classReference.bubblePlayer.width/2),touch.getLocation().y),5,new cc.color(158,45,45,255));
                classReference.addChild(classReference.leftLine);

                return true;
            },
            onTouchEnded : function(touch, event){
                classReference.player.angle = classReference.radToDeg(Math.atan2((touch.getLocation().y - classReference.player.y),(-touch.getLocation().x + classReference.player.x)));

                if(classReference.rightLine != undefined){
                    classReference.removeChild(classReference.rightLine);
                }
                classReference.rightLine = new cc.DrawNode();
                classReference.rightLine.drawSegment(cc.p(classReference.player.x - (classReference.bubblePlayer.width *2),classReference.player.y), cc.p(classReference.player.x + 10,classReference.player.y),5,new cc.color(158,45,45,255));
                classReference.addChild(classReference.rightLine);

                if(classReference.leftLine != undefined){
                    classReference.removeChild(classReference.leftLine);
                }
                classReference.leftLine = new cc.DrawNode();
                classReference.leftLine.drawSegment(cc.p(classReference.player.x + (classReference.bubblePlayer.width * 2),classReference.player.y),cc.p(classReference.player.x - 10,classReference.player.y),5,new cc.color(158,45,45,255));
                classReference.addChild(classReference.leftLine);
                classReference.shootingFlag = true;
            }
     });
      
    cc.eventManager.addListener(listnerBg,this.bubblePlayer);

    this.scheduleUpdate();
    
    return true;
    
  },
  
    update : function (dt) {
       
       if(this.shootingFlag){
           this.stateShootBubble(dt);
           if(!(this.bubblePlayer.y >=0)){               
               this.bubblePlayer.setPosition(cc.director.getWinSize().width * 0.5,cc.director.getWinSize().height * 0.2);
               this.player.x = this.bubblePlayer.x;    this.player.y = this.bubblePlayer.y;
               this.shootingFlag = false;
           }
       }
    },

    stateShootBubble : function(dt){
        this.bubblePlayer.x += dt * 2500 * Math.cos(this.degToRad(this.player.angle));
        this.bubblePlayer.y += dt * 2500 * -1 * Math.sin(this.degToRad(this.player.angle));

        if (this.bubblePlayer.x < (this.bubblePlayer.width/2)) {
            // Left edge
            this.player.angle = 180 - this.player.angle;
        } else if (this.bubblePlayer.x > cc.director.getWinSize().width - (this.bubblePlayer.width/2)) {
            // Right edge
            this.player.angle = 180 - this.player.angle;
        } 
        if (this.bubblePlayer.y > cc.director.getWinSize().height-(this.bubblePlayer.width/2)) {
            // Top collision
            this.player.angle = 360 - this.player.angle;
        }
    },

    radToDeg : function (angle) {
        return angle * (180 / Math.PI);
    },

    // Convert degrees to radians
    degToRad : function (angle) {
        return angle * (Math.PI / 180);
    },
     getRandomInt : function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
})

xc.Pinata.res = {
    pinata_plist : xc.path +"pinata/pinata.plist",
    pinata_png : xc.path +"pinata/pinata.png",
    pinata_json : xc.path +"pinata/pinata.json",

};      

