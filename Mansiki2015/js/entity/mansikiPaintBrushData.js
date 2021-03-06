define([], function () {
    	//Brush　Data
	var PaintBrushData = function(name,type,size,color,opacity,presserEffect,dispOrder,detail){
	    	if(name===undefined ){
	    	    name="default";
	    	}
	    	if(type===undefined ){
	    	    type="pen";
	    	}
	    	if(size===undefined ){
	    	    size=1;
	    	}
	    	if(color===undefined ){
	    	    color="#0000ff";
	    	}
	    	if(opacity===undefined ){
	    	    opacity=1;
	    	}
		this.name=name;//PK
		this.type=type;//PK
		this.size=size;//PK
		this.color=color;//TextData
		this.opacity=opacity;//TextData
		this.presserEffect=presserEffect;
		this.dispOrder=dispOrder;
		this.detail=detail;//TextData
	};
	PaintBrushData.prototype={//
		setData:function(pd){//解凍用Func
			this.name=pd.name!=undefined ? pd.name:this.name;
			this.type=pd.type!=undefined ? pd.type:this.type;
			this.size=pd.size!=undefined ? pd.size:this.size;
			this.color=pd.color!=undefined ? pd.color:this.color;
			this.presserEffect=pd.presserEffect!=undefined ? pd.presserEffect:this.presserEffect;
			this.dispOrder=pd.dispOrder!=undefined ? pd.dispOrder:this.dispOrder;
			this.detail=pd.detail!=undefined ? pd.detail:this.detail;
		}
	};
  return PaintBrushData;
});