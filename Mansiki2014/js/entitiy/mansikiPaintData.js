define([], function () {

	var PaintData = function(userId,title,pageNo,subTitle,detieal,updateTime,updateTime,syncTime,createTime,data,state,type){
		this.userId=userId;//PK
		this.title=title;//PK
		this.pageNo=pageNo;//PK
		this.subTitle=subTitle;
		this.detieal=detieal;//TextData
		this.updateTime=updateTime;
		this.syncTime=syncTime;
		this.createTime = createTime;
		this.imageData = imageData;//MainData
		this.state = state;
		this.type =type;
	};
	PaintData.prototype={//
		setData:function(pd){//解凍用Func
			this.title=pd.title;
			this.pageNo=pd.pageNo;
			this.subTitle=pd.subTitle;
			this.detieal=pd.detieal;
			this.updateTime=pd.updateTime;
			this.syncTime=pd.syncTime;
			this.syncTime=pd.syncTime;
			this.createTime=pd.createTime;
			this.gioInfo=pd.gioInfo;
			this.imageData=pd.imageData;
			this.state=pd.state;
			this.type=pd.type;
		}
	};
  return PaintData;
});