define([
        'js/model/dao/mansikiDataManager',
        'js/Util/DBUtil']
	, function (mansikiDataManager,DBUtil) {

	var PageDataDao = function(){
		
	};
	PageDataDao.prototype={//DAOでラッピング
		setData:function(pd){
		},
		addPage:function(titleId,pageData){
		    
		    this.pages.push(pageKey);
		},
		createNewPage:function(titleId){
		    var id = titleId + DBUtil.getNewIdAs64();
		}
	};
  return PageDataDao;
});