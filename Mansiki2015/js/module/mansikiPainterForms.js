//フォーム構築

define([
        'jquery',
        'underscore',
        'knockout',
        'minicolors',
        'js/config/mansikiPainterConfig',
        'js/entity/mansikiTitleData',
        'js/entity/mansikiPaintData',
        'js/config/mansikiPainterInitData',
        ], function ($, _, ko ,mc,mpConf
        	,mansikiTitleData
        	,mansikiPaintData
        	,mansikiPainterInitData
    ) {
    	
$.event.props.push('dataTransfer');
var mansikiPainterForms = function(){
    this.currentSize=[];
    this.bindFuncOfSizeSelect = function(){};
    this.$sizeSelect ={};
    this.$brushSelect ={};
    this.mpdata = new mansikiPaintData();
}
mansikiPainterForms.prototype={
	funcBinderA:function($obj, eventType,funcToObj,height,width){
	    this.mpdata.height = height;
	    this.mpdata.width = width;
	    var mpdata = new mansikiPaintData();
	    mpdata.setData(this.mpdata);
	    this.funcBinder($obj,eventType,funcToObj,mpdata);
	},
	funcBinderB:function($obj, eventType,funcToObj,argObj){
	    this.funcBinder($obj,eventType,funcToObj,argObj);
	},
	funcBinder:function($obj, eventType,funcToObj,arg1,arg2,arg3){
	    $obj.bind(eventType,function(){funcToObj(arg1,arg2,arg3);});
	},
	funcBinderParent:function($obj,$parent, eventType,funcToParent,arg1,arg2,arg3){
	    $obj.bind(eventType,function(){funcToParent($parent, arg1,arg2,arg3);});
	},
	buildSizeSelect:function($select,bindFunc){
	    this.$sizeSelect = $select;
	    var $parent = $select.find("a.dropdown-toggle span.title");
	    this.bindFuncOfSizeSelect = bindFunc;
	    $select.find("li").remove();
	    var $selectBody =  $select.find("ul");
	    for(var index in mansikiPainterInitData.canvasSizes){
		var size = mansikiPainterInitData.canvasSizes[index];
		var $option = $("<li><a href='#'>"+size+"</a></li>");
		var sizes=size.split("x");
		var $a = $option.find("a");
		this.funcBinderA($a,"click",bindFunc,sizes[0],sizes[1]);
		this.funcBinderParent($a,$parent,"click",this.onSizeSelect.bind(this),sizes[0],sizes[1]);
		$selectBody.append($option);
	    }
	},
	onSizeSelect:function($parent,arg1,arg2){
	    this.currentSize=[arg1,arg2];
	    $parent.text(arg1+"x"+arg2);
	},
	initSizeSelect:function(mpdata){
	    this.mpdata = mpdata;
	    var $parent = this.$sizeSelect.find("a.dropdown-toggle span.title");
	    //this.bindFuncOfSizeSelect(mpdata);
	    this.onSizeSelect($parent,mpdata.height,mpdata.width);
	},
	buildBrushSelect:function($select,bindFunc,psm){
	    this.$brushSelect = $select;
	    var $brother = $select.find("ul.dropdown-menu li.MansikiBrushSelectHead");
	    this.bindFuncOfSizeSelect = bindFunc;
	    $select.find("li.MansikiBrushSelect").empty();
	    for(var index in mansikiPainterInitData.brushes){
		var brush = mansikiPainterInitData.brushes[index];
		var name = brush.name;
		var $option = $("<li class='MansikiBrushSelect'><a href='#'>"+brush.name+"</a></li>");
		var $a = $option.find("a");
		$option.attr("id","MansikiBrushSelect_"+index);
		this.funcBinderB($a,"click", bindFunc, brush);
		$option.click(function(){
		    $("li.MansikiBrushSelect").each(function(){
			$(this).find("a").text($(this).find("a").text().replace("☆",""));
		    });
		    $(this).find("a").text($(this).find("a").text()+"☆");
		    });
		//this.funcBinderParent($a,$parent,"click",this.onSizeSelect.bind(this),sizes[0],sizes[1]);
		$brother.after($option);
	    }
	},
	onBrushSizeSelect:function($parent,brushName){
	    alert("brushName:"+brushName);
	}
}

return new mansikiPainterForms();
});






