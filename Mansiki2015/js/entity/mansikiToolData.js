define([], function () {

	var TitleData = function(){
	    this.toolData =[];
	    this.toolData =[];
	};
	TitleData.prototype={//
		setData:function(pd){//解凍用Func
			this.title=pd.title;
		},
		addDataPageDataKey:function(pageKey){
		    this.pages.push(pageKey);
		}
	};
  return new TitleData();
});