define([], function () {

	var ToolSelectionState = function(brush,color,color2nd,opatity){
		this.brush=brush;//PK
		this.color=color;//PK
		this.color2nd=color2nd;//PK
		this.opatity=opatity;//PK
	};
	ToolSelectionState.prototype={//
		setData:function(pd){//解凍用Func
			this.brush=pd.brush;
			this.color=pd.color;
			this.color2nd=pd.color2nd;
			this.opatity=pd.opatity;
		}
	};
  return ToolSelectionState;
});