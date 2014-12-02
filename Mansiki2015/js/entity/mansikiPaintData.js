define([], function () {

	var PaintData = function(userId,title,pageNo,subTitle,detieal,updateTime,updateTime,syncTime,createTime,imageData,state,type){
		this.userId=userId;//PK
		this.title=title;//PK
		this.pageNo=pageNo;//PK
		this.subTitle=subTitle;
		this.detieal=detieal;//TextData
		this.updateTime=updateTime;
		this.syncTime=syncTime;
		this.createTime = new Date().getTime();
		this.imageData = imageData;//MainData
		this.state = state;
		this.type =type;
		this.width =0;
		this.height =0;
	};
	PaintData.prototype={//
		setData:function(pd){//解凍用Func
			this.title=pd.title;
			this.pageNo=pd.pageNo;
			this.subTitle=pd.subTitle;
			this.detieal=pd.detieal;
			this.updateTime=pd.updateTime;
			this.syncTime=pd.syncTime;
			this.createTime=pd.createTime;
			this.imageData=pd.imageData;
			this.state=pd.state;
			this.type=pd.type;
			this.width = pd.width;
			this.height = pd.height;
		}
	};
  return PaintData;
});