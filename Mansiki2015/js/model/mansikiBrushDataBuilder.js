define([
        'js/entity/mansikiPaintBrushData',
        'js/entity/mansikiToolSelectionState',
        ], function (mansikiPaintBrushData,ToolSelectionState) {

	var BrushDataBuilder = function(){
	};
	BrushDataBuilder.prototype={//
		setData:function(pd){//解凍用Func
		},
		build:function(ToolSelectionState,type){
		    var mpbd = new mansikiPaintBrushData();
		    if(type===undefined){
			mpbd.color = ToolSelectionState.color;
		    }else{
			mpbd.color = ToolSelectionState.color2nd;
		    }
		}
	};
  return BrushDataBuilder;
});