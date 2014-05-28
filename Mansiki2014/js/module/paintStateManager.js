define([
        'indexeddb',
        'indexdbWrapper',
        'js/entity/mansikiTitleData',
        'js/entity/mansikiPaintData',
        'js/entity/mansikiPaintBrushData',
        'js/config/mansikiPainterInitData',
        'js/entity/mansikiToolSelectionState',
        ], function (idb,idbw
        	,mansikiTitleData
        	,mansikiPaintData
        	,mansikiPaintBrushData
        	,mansikiPainterInitData
        	,mansikiToolSelectionState
        ) {
    	//欲しいのは作品に依存しない現在の情報
	var PaintStateManager = function(){
	    this.brushsKey = "brushsKey";
	    this.brushKey = "brushKey";
	    this.stateKey = "stateKey";
	    this.pdm=function(){};
	    this.mpc=function(){};
	    this.brushes = mansikiPainterInitData.brushes;//初期状態
	    this.ToolSelectionState = new mansikiToolSelectionState();
	    this.ToolSelectionState.brush = "Pen1";//デフォルトキー
	};
	PaintStateManager.prototype={
		setPainterDataManager:function(pdm){
		    this.pdm = pdm;
		},
		setPainterCanvas:function(mpc){
		    this.mpc = mpc;
		    this.mpc.currentBrush=this.getCurrentBrush();
		},
		change:function(brushKey){
		    this.ToolSelectionState.brush = brushKey;
		    this.mpc.currentBrush=this.getCurrentBrush();
		    this.save();
		},
		changeColor:function(hex,opacity){
		    var current = this.getCurrentBrush();
		    //alert("hex:"+hex);
		    current.color=hex;
		    current.opacity=opacity;
		    this.ToolSelectionState.color=hex;
		    this.ToolSelectionState.opacity=opacity;
		    this.mpc.setCurrentBrush(current);
		    this.save();
		},
		changeColor2nd:function(hex){
		    var current = this.getCurrentBrush();
		    this.ToolSelectionState.color2nd=hex;
		    this.save();
		},
		changeColor2nd:function(hex){
		    var current = this.getCurrentBrush();
		    this.ToolSelectionState.color2nd=hex;
		    this.save();
		},
		getCurrentBrush:function(){
		    var current = this.brushes[this.ToolSelectionState.brush];
		    if(current===undefined){
			this.brushes[this.ToolSelectionState.brush]=new mansikiPaintBrushData();
		    }
		    this.brushes[this.ToolSelectionState.brush];
		    return this.brushes[this.ToolSelectionState.brush];
		},
		save:function(){
		    this.pdm.saveAnyData(this.brushes,this.brushsKey);
		    this.pdm.saveAnyData(this.ToolSelectionState,this.stateKey);
		},
                load:function(){
                    var self = this;
		    var d= new $.Deferred();
		    var d1= new $.Deferred();
		    var d2= new $.Deferred();
                    var callback = function(data){
                	//alert("1data:"+data);
                        if(data!==undefined ){
                            self.brushes = data;
                        }
                        d1.resolve();
                    }
                    this.pdm.loadAnyData(this.brushsKey,callback);
                    var callback2 = function(data){
                        if(data!==undefined ){
                            
                            self.ToolSelectionState = new mansikiToolSelectionState();
                            self.ToolSelectionState.setData(data);
                        }
                	//alert("2data:"+data);
                        d2.resolve();
                    }
                    self.pdm.loadAnyData(self.stateKey,callback2);
                    $.when(d1, d2).done(
                	function(){
                	    self.mpc.setCurrentBrush(self.getCurrentBrush());
            		    d.resolve();
                	}
                    );
                    return d;
		}
	};
    
        return new PaintStateManager();
 });