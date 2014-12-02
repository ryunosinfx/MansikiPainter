define(['knockout',]
	, function (ko) {

	var TitleData = function(userId,title,pageCount,subTitle,detieal,updateTime,updateTime,syncTime,data,state,type,author){
		this.userId=ko.observable(userId);//PK
		this.title=ko.observable(title);//PK
		this.pageCount=ko.observable(pageCount);
		this.subTitle=ko.observable(subTitle);
		this.detieal=ko.observable(detieal);//TextData
		this.updateTime=ko.observable(updateTime);
		this.syncTime=ko.observable(syncTime);
		this.createTime = ko.observable(new Date().getTime());
		this.data = ko.observable(data);//MainData
		this.state = ko.observable(state);
		this.type = ko.observable(type);
		this.author = ko.observable(author);
		this.width = ko.observable(pd.width);
		this.height = ko.observable(pd.height);
		this.pages = ko.observableArray();
	};
	TitleData.prototype={//
		setData:function(pd){//解凍用Func
			this.title=ko.observable(pd.title);
			this.pageNo=ko.observable(pd.pageNo);
			this.subTitle=ko.observable(pd.subTitle);
			this.detieal=ko.observable(pd.detieal);
			this.updateTime=ko.observable(pd.updateTime);
			this.syncTime=ko.observable(pd.syncTime);
			this.updateTime=ko.observable(pd.updateTime);
			this.createTime=ko.observable(pd.createTime);
			this.gioInfo=ko.observable(pd.gioInfo);
			this.data=ko.observable(pd.data);
			this.state=ko.observable(pd.state);
			this.type=ko.observable(pd.type);
			this.pages = ko.observable(pd.pages);
		},
		addDataPageDataKey:function(pageKey){
		    this.pages.push(pageKey);
		}
	};
  return TitleData;
});