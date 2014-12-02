define([
        'js/entity/mansikiPaintBrushData',
        ], function (mansikiPaintBrushData) {
    var PainterInitData = {};
    Object.defineProperty(PainterInitData, "canvasSizes", { //定数
	value : ["1280x800","1920x1080","800x480","800x600"]
	,writable : false });
    //欲しいのは
    //初期ブラシ情報
    //用意されているブラシ
    Object.defineProperty(PainterInitData, "brushes", { //定数
	value : {
	    //name,type,size,color,presserEffect,dispOrder,detail
	    pen1 :new mansikiPaintBrushData("ペン","pen",1,"#000",true,1,"ぺんぺん")
    	   ,eraser :new mansikiPaintBrushData("消すゴム","eraser",5,"#fff",true,2,"消しゴム")
	}
	         	
	,writable : false });
    return PainterInitData;
});