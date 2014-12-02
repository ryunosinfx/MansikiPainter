define([], function () {

	var ThumbnailData = function(thumbnailId,imageId,pageId,imageData,width,height){
	    	//thumbnailId=pageId(3)+imageId(Version)+thumbnailId(Version)
		this.thumbnailId=thumbnailId;//PK
		this.imageId=imageId;//PK
		this.pageId=pageId;//PK
		this.imageData = imageData;//MainData
		this.width = width;//MainData
		this.height = height;//MainData
	};
	ThumbnailData.prototype={//
		setData:function(pd){//解凍用Func
			this.thumbnailId=pd.thumbnailId;
			this.imageId=pd.imageId;
			this.pageId=pd.pageId;
			this.imageData=pd.imageData;
			this.width=pd.width;
			this.height=pd.height;
		}
	};
  return ThumbnailData;
});