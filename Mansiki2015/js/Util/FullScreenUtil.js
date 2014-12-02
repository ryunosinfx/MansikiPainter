
define([]
	, function () {
      //Util
        var FullScreenUtil = function(){
            self = this;
            self.isFullscreen = false;
        }
        FullScreenUtil.prototype={
            request:function(event){/*フルスクリーン実行関数*/
        	var self = event.data.self;
        	self.isFullscreen= true;
                var target = document.getElementsByTagName("body")[0];
            	if (target.webkitRequestFullscreen) {
            		target.webkitRequestFullscreen(); //Chrome15+, Safari5.1+, Opera15+
            	} else if (target.mozRequestFullScreen) {
            		target.mozRequestFullScreen(); //FF10+
            	} else if (target.msRequestFullscreen) {
            		target.msRequestFullscreen(); //IE11+
            	} else if (target.requestFullscreen) {
            		target.requestFullscreen(); // HTML5 Fullscreen API仕様
            	} else {
            	    return;
            	}
            },
            exit:function (event){/*フルスクリーン終了*/
        	var self = event.data.self;
        	self.isFullscreen = false;
            	if (document.webkitCancelFullScreen) {
            		document.webkitCancelFullScreen(); //Chrome15+, Safari5.1+, Opera15+
            	} else if (document.mozCancelFullScreen) {
            		document.mozCancelFullScreen(); //FF10+
            	} else if (document.msExitFullscreen) {
            		document.msExitFullscreen(); //IE11+
            	} else if(document.cancelFullScreen) {
            		document.cancelFullScreen(); //Gecko:FullScreenAPI仕様
            	} else if(document.exitFullscreen) {
            		document.exitFullscreen(); // HTML5 Fullscreen API仕様
            	}
            },
            toggle:function(event){
        	var self = event.data.self;
        	if(self.isFullscreen ){
        	    self.exit(event);
        	}else{
        	    self.request(event);
        	}
            }
        };
        return new FullScreenUtil();
});