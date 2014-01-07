define([], function () {

	var TitleData = function(userId,title,pageCount,subTitle,detieal,updateTime,updateTime,syncTime,data,state,type,author){
		this.userId=userId;//PK
		this.title=title;//PK
		this.pageCount=pageCount;
		this.subTitle=subTitle;
		this.detieal=detieal;//TextData
		this.updateTime=updateTime;
		this.syncTime=syncTime;
		this.createTime = new Date().getTime();
		this.data = data;//MainData
		this.state = state;
		this.type = type;
		this.author = author;
		this.pages = [];
	};
	TitleData.prototype={//
		setData:function(pd){//解凍用Func
			this.title=pd.title;
			this.pageNo=pd.pageNo;
			this.subTitle=pd.subTitle;
			this.detieal=pd.detieal;
			this.updateTime=pd.updateTime;
			this.syncTime=pd.syncTime;
			this.updateTime=pd.updateTime;
			this.createTime=pd.createTime;
			this.gioInfo=pd.gioInfo;
			this.data=pd.data;
			this.state=pd.state;
			this.type=pd.type;
			this.width = pd.width;
			this.height = pd.height;
			this.pages = [];
		},
		addDataPageDataKey:function(pageKey){
		    this.pages.push(pageKey);
		}
	};
  return TitleData;
});