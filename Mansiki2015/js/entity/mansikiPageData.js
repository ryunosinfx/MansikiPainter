define([], function() {
    // meta data
    var PageData = function(pageId, nextPageId, pageNo, updateTime, updateTime, syncTime, createTime, imageId, thumbnaliId) {
	this.pageId = pageId;// PK
	this.nextPageId = nextPageId;// LinkedList
	this.pageNo = pageNo;// PK
	this.updateTime = updateTime;
	this.syncTime = syncTime;
	this.createTime = new Date().getTime();
	this.imageId = imageId;// MainData
	this.thumbnaliId = thumbnaliId;// MainData
	this.state = state;
    };
    PageData.prototype = {//
	 
	setData : function(pd) {// 解凍用Func
	    this.title = pd.title;
	    this.pageNo = pd.pageNo;
	    this.subTitle = pd.subTitle;
	    this.detieal = pd.detieal;
	    this.updateTime = pd.updateTime;
	    this.syncTime = pd.syncTime;
	    this.createTime = pd.createTime;
	    this.imageId = pd.imageId;
	    this.state = pd.state;
	}
    };
    return PageData;
});