/// <reference path="../../cocos2d-typescript-definitions/cocos2d/cocos2d-lib.d.ts" />
var level2Layer = cc.Layer.extend({
    
    counterLevel2 : 1,
    level2SpriteScaleX : 0.23,
    level2SpriteScaleY : 0.23,
    
    ctor:function () {
        
        this._super();

        var self = this;

        var eventListener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetSize = target.getContentSize();
                var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
                   
                
                if (self.counterLevel2 == 6) {
                    
                 
                    
                    cc.director.runScene(new level3Scene());
                    
                }
                   
                return true;
            }

        }, this);

        // this.audioEngine = cc.audioEngine;
        // this.audioEngine.playEffect(res.explosive_mp3);

    

        var size = cc.winSize;

        /////////////////////////////////////////
       
         this.bg = ccs.load(SortIt.level2bg_json);
         this.bg.setAnchorPoint(0.5, 0.5 );
         this.bg.setPosition(size.width / 2, size.height / 2); 
         this.addChild(this.bg);
         cc.eventManager.addListener(eventListener.clone(), this.bg);

         
         this.character = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/charctertwo.png"));
         this.character.setAnchorPoint(0.5, 0.5 );
         this.character.setPosition(size.width*0.78 , size.height*0.46); 
         this.character.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.character);

         
         this.table = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/table.png"));
         this.table.setAnchorPoint(0.5, 0.5);
         this.table.setPosition(size.width*0.52 , size.height*0.17); 
         this.table.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.table);
           
        /*
         cc.spriteFrameCache.getSpriteFrame("sortit/charcterone.png")
         this.minClock = new cc.Sprite(res.minClock_png);
         this.minClock.setAnchorPoint(0.5, 0.5);
         this.minClock.setPosition(size.width*0.575 , size.height*0.79); 
         this.minClock.setScale(2, 2);
         this.addChild(this.minClock);
         */
/*
cc.spriteFrameCache.getSpriteFrame("sortit/charcterone.png")
         this.hourClock = new cc.Sprite(res.hourClock_png);
         this.hourClock.setAnchorPoint(0.5, 0.5);
         this.hourClock.setPosition(size.width*0.575 , size.height*0.79); 
         this.hourClock.setScale(2, 2);
         this.addChild(this.hourClock);
*/

         //for transparent
        
        
         this.stand = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/stand.png"));
         this.stand.setAnchorPoint(0.5, 0.5);
         this.stand.setPosition(size.width*0.45 , size.height*0.12); 
         this.stand.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.stand);
         

         this.cake1t = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/cake1t.png"));
         this.cake1t.setAnchorPoint(0.5, 0.5);
         this.cake1t.setPosition(size.width*0.45 , size.height*0.20); 
         this.cake1t.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.cake1t);
        

         this.cake2t = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/cake2t.png"));
         this.cake2t.setAnchorPoint(0.5, 0.5);
         this.cake2t.setPosition(size.width*0.45 , size.height*0.28); 
         this.cake2t.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.cake2t);

         this.cake3t = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/cake3t.png"));
         this.cake3t.setAnchorPoint(0.5, 0.5);
         this.cake3t.setPosition(size.width*0.45 , size.height*0.35); 
         this.cake3t.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.cake3t);

         this.cake4t = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/cake4t.png"));
         this.cake4t.setAnchorPoint(0.5, 0.5);
         this.cake4t.setPosition(size.width*0.45 , size.height*0.41); 
         this.cake4t.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.cake4t);


         this.cake5t = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("sortit/cake5t.png"));
         this.cake5t.setAnchorPoint(0.5, 0.5);
         this.cake5t.setPosition(size.width*0.45 , size.height*0.50); 
         this.cake5t.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.addChild(this.cake5t);


         this.cake1 = new MovableItem2(cc.spriteFrameCache.getSpriteFrame("sortit/cake1.png"), this.cake1t, this);
         this.cake1.setAnchorPoint(0.5, 0.5);
         this.cake1.setPosition(size.width*0.70 , size.height*0.10); 
         this.cake1.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.cake1.xP = this.cake1.getPosition().x;
         this.cake1.yP = this.cake1.getPosition().y;
         this.cake1.id = 1;
         this.addChild(this.cake1);
         

         this.cake2 = new MovableItem2(cc.spriteFrameCache.getSpriteFrame("sortit/cake2.png"), this.cake2t, this);
         this.cake2.setAnchorPoint(0.5, 0.5);
         this.cake2.setPosition(size.width*0.07 , size.height*0.23); 
         this.cake2.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.cake2.xP = this.cake2.getPosition().x;
         this.cake2.yP = this.cake2.getPosition().y;
         this.cake2.id = 2;
         this.addChild(this.cake2);
         

         
         this.cake3 = new MovableItem2(cc.spriteFrameCache.getSpriteFrame("sortit/cake3.png"), this.cake3t, this);
         this.cake3.setAnchorPoint(0.5, 0.5);
         this.cake3.setPosition(size.width*0.74 , size.height*0.25); 
         this.cake3.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.cake3.xP = this.cake3.getPosition().x;
         this.cake3.yP = this.cake3.getPosition().y;
         this.cake3.id = 3;
         this.addChild(this.cake3);
         


         this.cake4 = new MovableItem2(cc.spriteFrameCache.getSpriteFrame("sortit/cake4.png"), this.cake4t, this);
         this.cake4.setAnchorPoint(0.5, 0.5);
         this.cake4.setPosition(size.width*0.11 , size.height*0.07); 
         this.cake4.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.cake4.xP = this.cake4.getPosition().x;
         this.cake4.yP = this.cake4.getPosition().y;
         this.cake4.id = 4;
         this.addChild(this.cake4);
         

         this.cake5 = new MovableItem2(cc.spriteFrameCache.getSpriteFrame("sortit/cake5.png"), this.cake5t, this);
         this.cake5.setAnchorPoint(0.5, 0.5);
         this.cake5.setPosition(size.width*0.93 , size.height*0.32); 
         this.cake5.setScale(this.level2SpriteScaleX, this.level2SpriteScaleY);
         this.cake5.xP = this.cake5.getPosition().x;
         this.cake5.yP = this.cake5.getPosition().y;
         this.cake5.id = 5;
         this.addChild(this.cake5);
         

        return true;
        
    }


});

var level2Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new level2Layer();
        this.addChild(layer);
    }
});


