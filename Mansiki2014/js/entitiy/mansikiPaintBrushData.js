define([], function () {

	var PaintBrushData = function(name,type,size,presserEffect,dispOrder,detail){
		this.name=name;//PK
		this.type=type;//PK
		this.size=size;//PK
		this.presserEffect=presserEffect;
		this.dispOrder=dispOrder;
		this.detail=detail;//TextData
	};
	PaintBrushData.prototype={//
		setData:function(pd){//解凍用Func
			this.name=name;//PK
			this.type=type;//PK
			this.size=size;//PK
			this.presserEffect=presserEffect;
			this.dispOrder=dispOrder;
			this.detail=detail;//TextData
		}
	};
  return PaintBrushData;
});