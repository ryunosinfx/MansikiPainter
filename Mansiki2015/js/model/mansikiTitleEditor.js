define([
        'knockout',
        'js/entity/mansikiTitleData',]
	, function (ko,TitleData) {
      //Model
        var TitleEditorModel = function(value){
            self = this;
            self.todo  = ko.observable(value);
            self.check = ko.observable(false);
        };
        
      //ViewModel
	var TitleEditorViewModel = function(){
		this.name=name;//PK
	};
	TitleEditorViewModel.prototype={//
		setData:function(pd){//解凍用Func
			this.name=pd.name;
		}
	};
	ko.applyBindings( new TitleEditorViewModel() );
  return TitleEditorViewModel;
});