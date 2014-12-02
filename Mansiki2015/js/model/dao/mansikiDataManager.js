define([
        'indexeddb',
        'indexdbWrapper',
        'js/entity/mansikiTitleData',
        'js/entity/mansikiPaintData',
        ], function (idb,idbw
        	,mansikiTitleData
        	,mansikiPaintData
        ) {
var DataManager = (function() {
	var self = this;
	self.isFromGetInstance = false;
	self.instance;
	function PaintDataManager() {
	    	if (self.isFromGetInstance !== true) {
			throw new Error("must use the getInstance.");
	    	}
	    	self.isFromGetInstance = false;
	    	var dbName="";
	    	var defaultImageKey=undefined;
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
		//カウント
		//キー一覧
		//全削除：Truncate
		truncate:function(TableName){
		    this.idbw.dropObjectStore(TableName);
		},
		setLoaderDataFunc:function(callbacks){
		    this.onLoadDataFunc = callbacks;
		},
		createTable:function(tableName,keyName){
		    this.idbw.crateObjectStore(TableName,keyName);
		},
		//汎用
		insertUpdate:function(tableName,data,pk){
	    	    var self = this;
	    	    //clearTimeout(self.saveTimerForAny);
	    	    self.saveTimerForAny = setTimeout(function(){
	        	self.idbw.insertUpdate(tableName,data ,pk);
	    	    },200);
	    	    //console.log("saveAnyData pk:"+pk);
	    	},
		//汎用
	    	select:function(tableName,pk,callback,failCallBack){
	    	    var self = this;
	    	    var loadFunc = function(data){
	    		callback(data);
	    	    };
	    	    var loadFuncFail = failCallBack!==undefined ? failCallBack:function(){
	    		//alert("nothing! pk:"+pk);
	    	    };
	    	    //console.log("loadAnyData pk:"+pk);
	    	    this.idbw.select(tableName ,pk ,loadFunc,loadFuncFail).then(loadFuncFail,loadFuncFail);
	    	},
	    	// titleId(※上３桁)+PageID(※上３桁)+KomaID(※上３桁)＋Version
	    	// Delete+Insertをした場合IDはID３桁＋４桁（Version）で構成＋
	    	// Versionは64進数(a-zA-Z0-9_%)26+26+10+2
	    	// Versionは発番が不可能なので、ミリ秒で代用する。
		//汎用
	    	selectWhere:function(tableName,range,callback,failCallBack){
	    	    var self = this;
	    	    var loadFunc = function(request,elms){
	    		callback(elms[0].key ,elms[0].value);
	    	    };
	    	    var loadFuncFail = failCallBack!==undefined ? failCallBack:function(){
	    		//alert("nothing! pk:"+pk);
	    	    };
	    	    //console.log("loadAnyData pk:"+pk);
	    	    this.idbw.selectWhere(tableName ,range ,loadFunc,loadFuncFail).then(loadFuncFail,loadFuncFail);
	    	},
		//汎用 start<= key <= end
	    	selectRangeWithToWith:function(tableName,start, end,callback,failCallBack){
	    	    var self = this;
	    	    self.selectWhere(tableName,[start,end],callback,failCallBack);
	    	},
		//汎用 start< key <= end
	    	selectRangeOpenToWith:function(tableName,start, end,callback,failCallBack){
	    	    var self = this;
	    	    self.selectWhere(tableName,[start,end,true,false],callback,failCallBack);
	    	},
		//汎用 start<= key < end
	    	selectRangeWithToOpen:function(tableName,start, end,callback,failCallBack){
	    	    var self = this;
	    	    self.selectWhere(tableName,[start,end,false,true],callback,failCallBack);
	    	},
		//汎用 start< key < end
	    	selectRangeOpenToOpen:function(tableName,start, end,callback,failCallBack){
	    	    var self = this;
	    	    self.selectWhere(tableName,[start,end,true,true],callback,failCallBack);
	    	},
	    	deleteRow:function(tableName,pk){
	    	    var self = this;
	    	    this.idbw.deleteData(tableName ,pk );
	    	    return false;
	    	}
	};
	//事実上のClassMethodとして追加
	PaintDataManager.getInstance = function() {
	    if (self.instance) {
		return self.instance;
	    }
	    self.fromGetInstance = true;
	    self.instance = new this();
	    return self.instance;
	}
	
	return PaintDataManager;
})();
  return DataManager;
});