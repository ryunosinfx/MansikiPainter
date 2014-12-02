define([
        'jquery',
        'underscore',
        'knockout',
        'md5',
        'js/config/mansikiPainterConfig',
        'js/entity/mansikiTitleData',
        'js/entity/mansikiPaintData',
        ], function ($, _, ko ,md5,mpConf
        	,mansikiTitleData
        	,mansikiPaintData
    ) {
//タイトル管理
var mansikiTitleManager = function(){
    this.titleKey="";
    this.titleData = new mansikiTitleData();
    this.titleListKey = "タイトルリスト";
    this.titleList = [];
    this.titleMetaMap= {};
    var promise = this.loadTitleList();
}
mansikiTitleManager.prototype={
	setPainterDataManager:function(pdm){
	    this.pdm = pdm;
	},
	init:function(){
	    var self = this;
	    promise.done(function(){
		if(this.titleList===undefined){
		    this.titleList=[];
		    this.titleMetaMap= {};
		}
	    });
	},
	createTitle:function(name,auther,pageNo,subTitle){
	    this.titleData = new mansikiTitleData();
	    this.updateTitle(name,auther,pageNo,subTitle);
	    this.titleList.push(this.makeTitleKey());
	    this.saveTitleList();
	},
	updateTitle:function(name,auther,pageNo,subTitle,detieal){
	    this.titleData.title=name;
	    this.titleData.pageNo=pageNo;
	    this.titleData.subTitle=subTitle;
	    this.detieal=detieal;
	    this.updateTime = new Date().getTime();
	    this.syncTime=syncTime;
	},
	makeTitleKey:function(){
	    var seed = this.titleData.title + new Date().getTime();
	    var key = md5(seed);
	    return key ;
	},
	save:function(){
	    var currentKey = makeTitleKey();
	    this.pdm.saveAnyData(this.titleData,currentKey);
	},
	saveTitleList:function(){
	    var saveData ={};
	    saveData.list = self.titleList ;
	    saveData.map  = self.titleMetaMap;
	    this.pdm.saveAnyData(this.titleList,this.titleListKey);
	},
	load:function(titleKey){//ここはタイトルのみ
            var self = this;
	    var d= new $.Deferred();
            var callback = function(data){
                if(data!==undefined ){
                    self.titleData = data;
                }
                d.resolve();
            }
            self.pdm.loadAnyData(titleKey,callback);
            return d;
	},
	loadTitleList:function(){//ここはタイトルリストのみ
            var self = this;
	    var d= new $.Deferred();
            var callback = function(data){
                if(data!==undefined ){
                    self.titleList = data.list;
                    self.titleMetaMap= data.map;
                }
                d.resolve();
            }
            self.pdm.loadAnyData(self.titleListKey,callback);
            return d;
	},
	loadPageInfoByIndex:function(pageIndex){
	    var pageKey = this.getPageKeyByIndex(pageIndex);
	    this.pdm.loadFromLS(pageKey);
	},
	getPageKeyByIndex :function(pageIndex){
	    for(var index in this.titleData.pages){
		var current = this.titleData.pages[index];
		if(index === pageIndex){
		    return current;
		}
	    }
	},
	addPage:function(){
	    var currentSize = this.titleData.pages.length;
	    this.insertPage(currentSize-1);
	},
	insertPage:function(pageIndex){
	    var mpd = new mansikiPaintData();
	    var currentSize = this.titleData.pages.length;
	    var currentTime = this.mpd.getTime;
	    var seed = makeTitleKey() + currentTime + currentSize;
	    var pagekey = md5(seed);
	    this.titleData.pages.push();
	    this.pdm.saveToLS(mpd,pagekey);
	    var isInserted = false;
	    var newIndexedPages = [];
	    for(var i = 0; i<currentSize;i++){
		var current = this.titleData.pages[i];
		if(pageIndex === i){
		    newIndexedPages.push(pagekey);
		    isInserted = true;
		}
		newIndexedPages.push(current);
	    }
	    if(isInserted === false){
		newIndexedPages.push(pagekey);
	    }
	    this.titleData.pages = newIndexedPages;
	    this.save();
	},
	deleteTitle:function(titleKey){
	    var promise = this.load(titleKey);
	    var self = this;
	    promise.done(
		function(){
		    var list = self.titleData.pages;
		    for(var pageIndex in list){
			self.deletePageByKey(self.getPageKeyByIndex(pageIndex));
			
		    }
		}
	    );
	    
	},
	deletePage:function(pageIndex){
	    this.deletePageByKey(this.getPageKeyByIndex(pageIndex));
	},
	deletePageByKey:function(pagekey){
	    this.pdm.clearLS(pagekey);
	    var newIndexedPages = [];
	    for(var index in this.titleData.pages){
		var current = this.titleData.pages[index];
		if(current!==pagekey){
		    newIndexedPages.push(current);
		}
	    }
	    this.titleData.pages = newIndexedPages;
	    this.save();
	},
	changePage:function(nextIndex){
	    //ここじゃない気がする。
	},
	upPageNo:function(currentIndex){
	    this.movePageNo(currentIndex,false);
	    this.save();
	},
	downPageNo:function(currentIndex){
	    this.movePageNo(currentIndex,true);
	    this.save();
	},
	movePageNo:function(pageIndex, isNext){
	    var isInserted = false;
	    var newIndexedPages = [];
	    var offset = isNext? 1:-1;
	    var targetKey = this.titleData.pages[pageIndex];
	    for(var i = 0; i<currentSize;i++){
		var current = this.titleData.pages[i];
		if(pageIndex + offset === i){
		    newIndexedPages.push(targetKey);
		    isInserted = true;
		}
		newIndexedPages.push(current);
	    }
	    if(isInserted === false){
		newIndexedPages.push(targetKey);
	    }
	    this.titleData.pages = newIndexedPages;
	}
}

return new mansikiTitleManager();
});


