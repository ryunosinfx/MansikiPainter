
define([
        'jquery',
        'underscore',
        'knockout',
        'minicolors',
        'js/config/mansikiPainterConfig',
        'js/entity/mansikiTitleData',
        'js/entity/mansikiPaintData',
        ], function ($, _, ko ,mc,mpConf
        	,mansikiTitleData
        	,mansikiPaintData
    ) {
    //ミックスフレーム
var mansikiCanvasFrame = function(){
}
mansikiCanvasFrame.prototype={
	buildBackground:function($canvas,width,height){
	    this.$canvas = $canvas;
	    var canvas = this.$canvas.get(0);
	    var context = canvas.getContext('2d');
	    context.fillStyle = "#ffffff";
	    context.strokeStyle = "#dfe5f0";
	    context.fillRect(0,0,width,height);
	    context.beginPath();
	    var innerW = 150;
	    var innerH = 220;
	    var outerW = 182;
	    var outerH = 257;
	    var outerWa = 192;
	    var outerHa = 267;
	    var yOffset = -5;
	    var oRect = this.calcRect(width,outerWa,outerHa,outerW,outerH);
	    context.strokeRect(oRect.sx,oRect.sy-yOffset,oRect.ex,oRect.ey);
	    var iRect = this.calcRect(width,outerWa,outerHa,innerW,innerH);
	    context.strokeRect(iRect.sx,iRect.sy-yOffset,iRect.ex,iRect.ey);
	    context.strokeRect(iRect.sx+iRect.ex/2,0-yOffset,1,iRect.sy);
	    context.strokeRect(iRect.sx+iRect.ex/2,iRect.sy+iRect.ey-yOffset,1,iRect.sy);
	    context.strokeRect(0,iRect.sy+iRect.ey/2-yOffset,iRect.sx,1);
	    context.strokeRect(iRect.sx+iRect.ex,iRect.sy+iRect.ey/2-yOffset,iRect.sx,1);
	    var aRect = this.calcRect(width,outerWa,outerHa,outerWa,outerHa);
	    context.strokeRect(aRect.sx,aRect.sy-yOffset,aRect.ex,aRect.ey);
	    return this.$canvas;
	},
	calcRect:function(width,ow,oh,iw,ih){
	    var height = width*oh/ow;
	    var iWidth = width * (iw/ow);
	    var iheight = height * (ih/oh);
	    var sx = (width-iWidth)/2;
	    var sy = (height-iheight)/2;
	    var ex = iWidth*1;
	    var ey = iheight*1;
	    return {sx:sx,sy:sy,ex:ex,ey:ey};
	},
	buildLayer:function($base,width,height){
	    var $canvas = $("<canvas class='mansiki-layer' />");
	    var canvas = $canvas.get(0);
	    if (canvas.getContext) {
		$canvas.attr("width" ,width);
		$canvas.attr("height", height);
		var context = canvas.getContext("2d");
		context.fillStyle ="rgba(255,255,255,0)";
		context.fillRect(0,0,width,height);
		context.clearRect(0,0,width,height);
	    }
	    $base.append($canvas);
	    return $canvas;
	},
	clearLayer:function($canvas){
	    var canvas = $canvas.get(0);
	    if (canvas.getContext) {
		var width = $canvas.attr("width" );
		var height = $canvas.attr("height");
		var context = canvas.getContext("2d");
		context.fillStyle ="rgba(255,255,255,0)";
		context.fillRect(0,0,width,height);
		context.clearRect(0,0,width,height);
	    }
	},
	doMix:function(baseCtx,layerCans,width,height){

	    //alert(width);
//	    baseCtx.fillRect(0,0,width,height);
//	    var bkCan = this.buildBackground(width,height);
//	    baseCtx.drawImage(bkCan, 0, 0, width, height);
//	    for(var index in layerCans){
//		var layerCan = layerCans[index];
//		baseCtx.drawImage(layerCan, 0, 0, width, height);
//	    }
	}
}

return new mansikiCanvasFrame();
});
