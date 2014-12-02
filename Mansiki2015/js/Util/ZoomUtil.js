
define([]
	, function () {
      //Util
        var ZoomUtil = function(){
            self = this;
            self.currentScale = 1;
        }
        ZoomUtil.prototype={
            up:function(event){/*拡大実行関数*/
        	var self = event.data.self;
        	var $target = event.data.$target;
        	if($target!==undefined && $target.length > 0){
        	    self.currentScale=self.currentScale*2;
        	    $target.css("transform-origin","left top");
        	    $target.css("transform","scale("+self.currentScale+", "+self.currentScale+")");
        	}
        	return false;
            },
            down:function (event){/*縮小スクリーン終了*/
        	var self = event.data.self;
        	var $target = event.data.$target;
        	if($target!==undefined && $target.length > 0){
        	    self.currentScale=self.currentScale/2;
        	    $target.css("transform-origin","left top");
        	    $target.css("transform","scale("+self.currentScale+", "+self.currentScale+")");
        	}
        	return false;
            },
            clear:function(event){
        	var self = event.data.self;
        	var $target = event.data.$target;
        	if($target!==undefined && $target.length > 0){
        	    self.currentScale=1;
        	    $target.css("transform-origin","left top");
        	    $target.css("transform","scale("+self.currentScale+", "+self.currentScale+")");
        	}
        	return false;
            },
            set:function(event){
        	var self = event.data.self;
        	var $target = event.data.$target;
        	if($target!==undefined && $target.length > 0){
        	    $target.css("transform-origin","left top");
        	    $target.css("transform","scale("+self.currentScale+", "+self.currentScale+")");
        	}
        	return false;
            },
            getScale:function(){
        	return this.currentScale ;
            }
        };
        return new ZoomUtil();
});