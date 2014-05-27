define([
        'indexeddb',
        'indexdbWrapper',
        'js/entity/mansikiTitleData',
        'js/entity/mansikiPaintData',
        ], function (idb,idbw
        	,mansikiTitleData
        	,mansikiPaintData
        ) {

	var PaintDataManager = function(dbName,defaultImageKey){
	    	this.defaultImageKey = defaultImageKey===undefined?"layerName":defaultImageKey;
	    	//----------------------------------------------------------------
	    	this.idbw = new $.indexedDBwrapper(this.dbName);
	    	this.dbName = dbName+"A7";
	    	this.TableName = "paintData";
	    	this.TableNames = [this.TableName];
	    	this.TableNameForAny = "anyData";
	    	this.pk = "imgId";
	    	this.pkAny = "dataId";
	    	this.idbw.createDB(this.dbName);
	    	this.createTable(this.TableName ,this.pk );
	    	this.createTable(this.TableNameForAny ,this.pkAny );
	    	try{
		    this.loadFromLS();
	    	}catch(e){
	    	    alert("データ不整合のためクリアします。");
	    	    this.dropObjectStore(this.TableName  );
	    	    var self = this;
	    	    setTimeout(
	    		    function(){
	    			self.createTable(self.TableName ,self.pk );
	    		    }
	    		    ,1000);
	    	} 
	    	this.mpData = new mansikiPaintData();
	};
	PaintDataManager.prototype={
		//欲しい機能を書こう。
		// データを作品単位で持ちたい。
		//　PKでmd5を作成してそれで持つか。
		//　素直にアレすればいいんじゃなかろうか。
		//　ただし件数はわからない。なので件数は外から数えるしか無い。
		//　横からのデータは非常に問題だが、この際無視する。
		// 
		saveData:function(){
		    
		},
		getCurrentData:function(){
		    
		},
		makePageKey:function(){
		    
		},
		setLoaderImageFunc:function(callbacks){
		    this.onLoadImageFunc = callbacks;
		},
		setLoaderDataFunc:function(callbacks){
		    this.onLoadDataFunc = callbacks;
		},
		createTable:function(TableName,keyName){
		    this.idbw.crateObjectStore(TableName,keyName);
		},
		//汎用
	    	saveAnyData:function(data,pk){
	    	    var self = this;
	    	    //clearTimeout(self.saveTimerForAny);
	    	    self.saveTimerForAny = setTimeout(function(){
	        	self.idbw.insertUpdate(self.TableNameForAny,data ,pk);
	    	    },200);
	    	    //console.log("saveAnyData pk:"+pk);
	    	},
		//汎用
	    	loadAnyData:function(pk,callback){
	    	    var self = this;
	    	    var loadFunc = function(data){
	    		callback(data);
	    	    };
	    	    var loadFuncFail = function(){
	    		//alert("nothing! pk:"+pk);
	    	    };
	    	    //console.log("loadAnyData pk:"+pk);
	    	    this.idbw.select(self.TableNameForAny ,pk ,loadFunc,loadFuncFail).then(loadFuncFail,loadFuncFail);
	    	},
	    	saveToLS:function(mpData,imageKey){
	    	    var self = this;
	    	    if(imageKey===undefined){
	    		imageKey = self.defaultImageKey;
	    	    }
	    	    clearTimeout(self.saveTimer);
	        	self.saveTimer = setTimeout(function(){
	        	    self.mpData = mpData;
	        	    self.idbw.insertUpdate(self.TableName,self.mpData ,imageKey);
	        	},1000);
	    	},
	    	loadFromLS:function(imageKey){
	    	    var self = this;
	    	    if(imageKey===undefined){
	    		imageKey = self.defaultImageKey;
	    	    }
	    	    var loadFunc = function(data){
	    		self.mpData = data;
	    		for(var index in self.onLoadDataFunc){
	    		    var onLoadDataFunc = self.onLoadDataFunc[index];
	    		    var promise = onLoadDataFunc(self.mpData);
	    		}
	    	    };
	    	    this.idbw.select(self.TableName ,imageKey ,loadFunc);
	    	},
	    	clearLS:function(imageKey){
	    	    var self = this;
	    	    if(imageKey===undefined){
	    		imageKey = self.defaultImageKey;
	    	    }
	    	    this.idbw.deleteData(self.TableName ,imageKey );
	    	    return false;
	    	}
	};
  return PaintDataManager;
});