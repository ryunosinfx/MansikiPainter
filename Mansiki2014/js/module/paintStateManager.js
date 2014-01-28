define([
        'indexeddb',
        'indexdbWrapper',
        'js/entity/mansikiTitleData',
        'js/entity/mansikiPaintData',
        'js/entity/mansikiPaintBrushData',
        'js/config/mansikiPainterInitData',
        ], function (idb,idbw
        	,mansikiTitleData
        	,mansikiPaintData
        	,mansikiPaintBrushData
        	,mansikiPainterInitData
        ) {
    	//欲しいのは作品に依存しない現在の情報
	var PaintStateManager = function(){
	    this.brushsKey = "brushsKey";
	    this.brushKey = "brushKey";
	    this.pdm=function(){};
	    this.mpc=function(){};
	    this.brushes = mansikiPainterInitData.brushes;//初期状態
	    this.currentBrush = "Pen1";//デフォルトキー
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
		    this.currentBrush = brushKey;
		    this.mpc.currentBrush=this.getCurrentBrush();
		    this.save();
		},
		changeColor:function(hex,opacity){
		    var current = this.getCurrentBrush();
		    //alert("hex:"+hex);
		    current.color=hex;
		    this.mpc.currentBrush=current;
		    this.save();
		},
		getCurrentBrush:function(){
		    return this.brushes[this.currentBrush];
		},
		save:function(){
		    this.pdm.saveAnyData(this.brushes,this.brushsKey);
		    this.pdm.saveAnyData(this.currentBrush,this.brushKey);
		},
                load:function(){
                    var self = this;
		    var d= new $.Deferred();
		    var d1= new $.Deferred();
		    var d2= new $.Deferred();
                    var callback = function(data){
                        if(data!==undefined ){
                            self.brushes = data;
                        }
                        d1.resolve();
                    }
                    this.pdm.loadAnyData(this.brushsKey,callback);
                    var callback2 = function(data){
                        if(data!==undefined ){
                            self.currentBrush = data;
                        }
                        d2.resolve();
                    }
                    self.pdm.loadAnyData(self.brushKey,callback2);
                    $.when(d1, d2).done(
                	function(){
                	    //alert("zzz:"+self.getCurrentBrush()+"/"+self.currentBrush);
                	    self.mpc.currentBrush = self.getCurrentBrush();
            		    d.resolve();
                	}
                    );
                    return d;
		}
	};
    
        return new PaintStateManager();
 });