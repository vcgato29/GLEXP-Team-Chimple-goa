xc.TabBar = xc.ScrollableButtonPanel.extend({
    ctor:function(position, size, numButtonsPerScreen, menuDef, callBackFunction, callBackContext) {
        this._super(position, size, numButtonsPerScreen, 1, menuDef, callBackFunction, callBackContext, true);
        this.setColor(xc.PRIMARY_COLOR);
    },
}); 