define([], function () {

	var PaintBrushData = function(name,type,size,color,presserEffect,dispOrder,detail){
		this.name=name;//PK
		this.type=type;//PK
		this.size=size;//PK
		this.color=color;//TextData
		this.presserEffect=presserEffect;
		this.dispOrder=dispOrder;
		this.detail=detail;//TextData
	};
	PaintBrushData.prototype={//
		setData:function(pd){//解凍用Func
			this.name=pd.name;
			this.type=pd.type;
			this.size=pd.size;
			this.color=pd.color;
			this.presserEffect=pd.presserEffect;
			this.dispOrder=pd.dispOrder;
			this.detail=pd.detail;
		}
	};
  return PaintBrushData;
});