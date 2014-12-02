
define([]
, function () {
//Util for Screen Orientation API 
var ScreenOrientationLockUtil = function(){
    self = this;
    self.lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
    self.unlockOrientation = screen.unlockOrientation || screen.mozUnlockOrientation || screen.msUnlockOrientation;
    self.isFullscreen = false;
}
ScreenOrientationLockUtil.prototype={
    lockToPortrait:function(event){/*縦固定実行関数*/
	var self = event.data.self;
	if(self.lockOrientation){
	    self.lockOrientation("portrait");
	}
    },
    lockToLandscape:function(event){/*横固定実行関数*/
	var self = event.data.self;
	if(self.lockOrientation){
	    self.lockOrientation("landscape");
	}
    },
    unlock:function (event){/*固定終了*/
	var self = event.data.self;
	if(self.unlockOrientation){
	    self.unlockOrientation();
	}
    }
};
return new ScreenOrientationLockUtil();
});