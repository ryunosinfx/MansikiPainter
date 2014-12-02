define([], function () {

	var ImageData = function(imageId,pageId,imageData){
		this.imageId=imageId;//PK
		this.pageId=pageId;//PK
		this.imageData = imageData;//MainData
	};
	ImageData.prototype={//
		setData:function(pd){//解凍用Func
			this.imageId=pd.imageId;
			this.pageId=pd.pageId;
			this.imageData=pd.imageData;
		}
	};
  return ImageData;
});