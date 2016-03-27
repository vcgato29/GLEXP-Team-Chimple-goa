export default class RoundButton extends Phaser.Button {
    constructor(game, x, y, maxButtonWidth, maxButtonHeight, key, frame, callback, callbackContext, frameData, style) {
        let buttonLength = Math.min(maxButtonWidth, maxButtonHeight);
        let halfButtonLength = buttonLength / 2;
        let frame1 = new Phaser.Frame(0, 0, 0, buttonLength, buttonLength, 'button_over.png');
        let frame2 = new Phaser.Frame(1, buttonLength + 1, 0, buttonLength, buttonLength, 'button_up.png');
        let frame3 = new Phaser.Frame(2, buttonLength * 2 + 2, 0, buttonLength, buttonLength, 'button_down.png');
        let fd = new Phaser.FrameData();
        fd.addFrame(frame1);
        fd.addFrame(frame2);
        fd.addFrame(frame3);

        let bmd = new Phaser.BitmapData(game, frame, buttonLength * 3 + 3, buttonLength);
        bmd.context.fillStyle = style.overFillStyle;
        bmd.circle(halfButtonLength, halfButtonLength, halfButtonLength);
        bmd.context.fillStyle = style.upFillStyle;
        bmd.circle(buttonLength + halfButtonLength + 1, halfButtonLength, halfButtonLength);
        bmd.context.fillStyle = style.downFillStyle;
        bmd.circle(buttonLength * 2 + halfButtonLength + 2, halfButtonLength, halfButtonLength);

        game.cache.addBitmapData(frame, bmd, fd);

        super(game, x, y, game.cache.getBitmapData(frame), callback, callbackContext, 'button_over.png', 'button_up.png', 'button_down.png', 'button_up.png');

        this.input.priorityID = 5;
        this.name = frame;
        // this.scale.multiply(maxButtonWidth / this.width, maxButtonHeight / this.height);
        this.anchor.setTo(0.5, 0.5);
        let buttonImage = null;
        if (frameData && frameData[frame]) {
            let info = frameData[frame];
            if (info.key) {
                key = info.key;
                frame = info.frame;
                if (frame) {
                    // buttonImage = new Phaser.Sprite(game, layoutX, layoutY, key, frame);    
                    buttonImage = new Phaser.Sprite(game, 0, 0, key, frame);
                } else {
                    buttonImage = new Phaser.Sprite(game, 0, 0, key);
                    //  buttonImage = new Phaser.Sprite(game, layoutX, layoutY, key);
                }

            } else if (info.image_data) {
                //create sprite from image_data
                // buttonImage = new Phaser.Sprite(game, layoutX, layoutY, frame);
                buttonImage = new Phaser.Sprite(game, 0, 0, frame);
            }
        } else {
            // buttonImage = new Phaser.Sprite(game, layoutX, layoutY, key, frame);
            buttonImage = new Phaser.Sprite(game, 0, 0, key, frame);
        }
        if (buttonImage) {
            buttonImage.anchor.setTo(0.5, 0.5);
            let buttonScale = Math.min(buttonLength / buttonImage.width, buttonLength / buttonImage.height, 1);
            buttonScale = Math.sqrt(buttonScale * buttonScale / 2);
            buttonImage.scale.multiply(buttonScale, buttonScale);
            // buttonPanel.addChild(buttonImage);
            this.addChild(buttonImage);
        }
    }
}
