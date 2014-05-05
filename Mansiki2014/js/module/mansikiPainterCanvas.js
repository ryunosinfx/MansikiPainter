define([
        'js/module/mansikiCanvasFrame',
        ]
	, function (mansikiCanvasFrame) {

    	var MansikiDataViewManager = function(){
        	this.ab = new ArrayBuffer(32678); // 256-byte ArrayBuffer.
        	this.abOffset = new ArrayBuffer(32678); // 256-byte ArrayBuffer.
        	this.dv = new DataView(this.ab);
        	this.dvOffset = new DataView(this.abOffset);
        	this.vector_length = 246;this.dv.getUint8(0);
        	this.offset = this.ox*this.oy*this.nx*this.ny;

        	this.queueCount = 0;
    	}
    	MansikiDataViewManager.prototype={
    		get:function(index){
    		    if(this.queueCount < 0){
    			return undefined;
    		    }
    		    this.queueCount--;
        	    var indexA = this.queueCount*8;
    		    var ox = this.dv.getInt16(indexA+3, true);
    		    var oy = this.dv.getInt16(indexA+4+3, true);
    		    var nx = this.dv.getInt16(indexA+8+3, true);
    		    var ny = this.dv.getInt16(indexA+12+3, true);
    		    //console.log("["+this.queueCount +"] BB:"+[ox,oy,nx,ny]);
    		    return {ox:ox, oy:oy, nx:nx, ny:ny};
    		},
    		add:function(ox,oy,nx,ny){
    		    //console.log("["+this.queueCount+"] AA:"+[ox,oy,nx,ny]);
        	    var indexA = this.queueCount*8;
    		    this.dv.setInt16(indexA+3, ox, true);
    		    this.dv.setInt16(indexA+4+3, oy, true);
    		    this.dv.setInt16(indexA+8+3, nx, true);
    		    this.dv.setInt16(indexA+12+3, ny, true);
    		    //console.log("["+this.queueCount+"] AB:"+[ox,oy,nx,ny]);
    		    this.queueCount++;
    		},
    		size:function(){
    		    return this.queueCount;
    		}
    	}
	var MansikiPainterCanvas = function(id,imageId,width,height,imageMime,mpdata){
	    this.isMouseDown = false;
	    this.memoryView = new MansikiDataViewManager();
	    $ancer = $("#"+id);
	    this.offsetX = $ancer.position().left*1;
	    this.offsetY = $ancer.position().top*1;;
	    this.oldX = this.offsetX*-1;
	    this.oldY = this.offsetY*-1;
	    this.mpdata = mpdata;
	    this.mpdata.width = width;
	    this.mpdata.height = height;
	    this.imageMime = imageMime;
	    this.onDraw= function(){};
	    this.rebuildCanvas($ancer,imageId,null);
	    this.baseColor ="#ffffff";
	    this.animationID ;
	    this.init();
	    this.currentBrush=undefined;
	};
	MansikiPainterCanvas.prototype={//baseColor
		init:function(){
		    var self = this;
		    var $window = $(window);
		    $window.unbind("scroll",this.onScroll);
		    $window.bind("scroll",{self:this},this.onScroll);
		    self.$window = $window;
		    self.initPointer();
		    self.startAnimation();
		},
		startAnimation:function(){
		    var self = this;
		    ( function loop(){
			    self.animationID = requestAnimationFrame( loop );
			    self.drowexec(self);
			} )();
		},
		stopAnimation:function(){
		    cancelAnimationFrame(this.animationID);
		},
		initPointer:function(){
		    var self = this;
		    var $window = self.$window===undefined ?$(window):self.$window;
		    self.scrollOffsetY = $window.scrollTop();
		    self.scrollOffsetX = $window.scrollLeft();
		},
		setData:function(pd){//解凍用Func
		    
		},
		loadToCurrentDirect:function(mpdata,imageId){
		    var d= new $.Deferred();
		    var self = this;
		    if(mpdata===undefined){
			mpdata=self.mpdata;
		    }
		    var img = new Image();
		    self.mpdata = mpdata;
		    self.$canvas.attr("width" ,self.mpdata.width);
		    self.$canvas.attr("height", self.mpdata.height);
		    self.can = self.$canvas.get(0);
		    self.context = self.can.getContext("2d");
		    self.drowCan = mansikiCanvasFrame.buildLayer(self.mpdata.width,self.mpdata.height);
		    self.drowCtx = this.drowCan.getContext("2d");
		    img.src = self.mpdata.imageData;
		    img.onload=function(event){
			self.context.fillStyle = self.baseColor;
			self.loadToCurrent(img,imageId);
		    	mansikiCanvasFrame.doMix( self.context ,[self.drowCan],self.mpdata.width,self.mpdata.height);
			d.resolve();
		    }
		    return d;
		},
		loadToCurrent:function(img,imageId){
		    this.drowCtx.drawImage(img,0,0);
		    if(imageId!==undefined){
			this.imageId=imageId;
		    }
		},
		setOnDraw:function(callback){
		    this.onDraw = callback;
		},
		clear:function(){
		    var self = this;
		    self.context.fillStyle = self.baseColor;
		    self.context.fillRect(0,0,self.mpdata.width,self.mpdata.height);
		    self.drowCan = mansikiCanvasFrame.buildLayer(self.mpdata.width,self.mpdata.height);
		    self.drowCtx = self.drowCan.getContext("2d");
		    mansikiCanvasFrame.doMix( self.context ,[self.drowCan],self.mpdata.width,self.mpdata.height);
		},
		getImageData:function(){
		    var self = this;
		    var imgData = self.drowCan.toDataURL(self.imageMime ); 
		    return imgData;
		},
		newCanvas:function(id,imageId,width,height){
		    
		},
		rebuildCanvas:function($ancer,imageId,data,width,height){
		    var self = this;
		    if(width === undefined){
			width = self.mpdata.width;
		    }
		    if(height === undefined){
			height = self.mpdata.height;
		    }
		    this.imageId = imageId;
		    $ancer.find("canvas").remove();
		    $ancer.append("<canvas/>");
		    var $canvas = $ancer.find("canvas");
		    this.$canvas = $canvas;
		    $canvas.attr("width" ,width);
		    $canvas.attr("height", height);
		    
		    
		    $canvas.on("touchstart",{self:this,isTouch:true},this.mouseDown);
		    $canvas.on("touchend",{self:this,isTouch:true},this.mouseUp);
		    $canvas.on("touchcancel",{self:this,isTouch:true},this.mouseOut);
		    //$canvas.on("touchmove",{self:this,isTouch:true},this.draw);
		    $canvas.get(0).addEventListener( "touchmove", this.draw.bind({data:{self:this,isTouch:true}}), false );
		    
		    
		    $canvas.on("mousedown",{self:this},this.mouseDown);
		    $canvas.on("mouseup",{self:this},this.mouseUp);
		    $canvas.on("mouseout",{self:this},this.mouseOut);
		    $canvas.on("mouseenter",{self:this},this.mouseEnter);
		    //$canvas.bind("mousemove",{self:this},this.draw);
		    $canvas.get(0).addEventListener( "mousemove", this.draw.bind({data:{self:this,isTouch:false}}), false );
		    this.can = $canvas.get(0);
		    this.context = this.can.getContext("2d");
		    this.drowCan = mansikiCanvasFrame.buildLayer(width,height);
		    this.drowCtx = this.drowCan.getContext("2d");
		    //this.context.globalAlpha = 0.4;
		    this.initPointer();
		},
		resizeCanvas:function(mpdata){
		    var self = this;
		    self.mpdata = mpdata;
		    self.mpdata.imageData = self.getImageData();
		    var promise = self.loadToCurrentDirect(self.mpdata);
		    //self.execOnDrow();
		    promise.done(function(){self.execOnDraw();});
		},
		execOnDraw:function(){
		    var self = this;
		    clearTimeout(self.onDrawTimer);
		    self.onDrawTimer =
		    setTimeout(
			function(){
			    self.mpdata.imageData = self.getImageData();
			    self.onDraw(self.mpdata,self.imageId);
			}
			,1000);
		},
	    	mouseEnter:function(event){
	    	    var self = event.data.self;
	    	    var isTouch = event.data.isTouch;
	    	    clearTimeout( self.mouseOutTimer );
	    	    self.$canvas.css("cursor","crosshair");
		    self.initPointer();
	    	    var pageX = isTouch? event.originalEvent.changedTouches[0].pageX:event.clientX;
	    	    var pageY = isTouch? event.originalEvent.changedTouches[0].pageY:event.clientY;
	            self.oldX = pageX-self.offsetX + self.scrollOffsetX;
	            self.oldY = pageY-self.offsetY + self.scrollOffsetY;
	    	    return false;
	    	},
	    	mouseDown:function(event){
	    	    var self = event.data.self;
	    	    var isTouch = event.data.isTouch;
		    self.setBrush(event);
		    self.initPointer();
	    	    self.isMouseDown = true;
		    self.startAnimation();
	    	    self.$canvas.css("cursor","crosshair");
	    	    var pageX = isTouch? event.originalEvent.changedTouches[0].pageX:event.clientX;
	    	    var pageY = isTouch? event.originalEvent.changedTouches[0].pageY:event.clientY;
	            self.oldX = pageX-self.offsetX + self.scrollOffsetX;
	            self.oldY = pageY-self.offsetY + self.scrollOffsetY;
	            //console.log(event.type);
	            self.execOnDraw();
	            return false;
	    	},
	    	mouseUp:function(event){
	    	    var self = event.data.self;
	    	    var isTouch = event.data.isTouch;
	    	    self.isMouseDown = false;
	    	    self.stopAnimation();
	    	    self.$canvas.css("cursor","crosshair");
	    	    //console.log(event.type);
	            self.execOnDraw();
	    	    return false;
	    	},
	    	mouseOut:function(event){
	    	    var self = event.data.self;
	    	    var isTouch = event.data.isTouch;
	    	    if(self.isMouseDown !== true){
	    		return;
	    	    }
	    	    clearTimeout( self.mouseOutTimer );
    	    	    self.mouseOutTimer = setTimeout(function(){
        	    	    self.isMouseDown = false;
        	    	    self.stopAnimation();
        	    	    self.$canvas.css("cursor","auto");
        	            //console.log(event.type);
        	            self.execOnDraw();
	    	    },1000);
	            return false;
	    	},
	    	diray:function(time) {
	    	    var d1 = new Date().getTime();
	    	    var d2 = new Date().getTime();
	    	    while (d2 < d1 + time) {
        	    		d2 = new Date().getTime();
        	    	}
        	    	return;
        	    },
        	setBrush:function(event){
	    	    var self = event.data.self;
	    	    if(self.currentBrush===undefined){
	    		self.drowCtx.strokeStyle = "rgba(255,0,0,1)";
			self.drowCtx.lineWidth = 1;
	    	    }else{
	    		//alert(self.currentBrush.color);
	    		self.drowCtx.strokeStyle = self.currentBrush.color;
	    		self.drowCtx.lineWidth = self.currentBrush.size*1;
	    	    }
        	    
        	},
	    	draw:function(event){
	    	    var self = this.data.self;
	    	    var isTouch = this.data.isTouch;
		    self.initPointer();
	    	    if(self.isMouseDown === false){
	    		return ;
	    	    }
	    	    var pageX = isTouch? event.changedTouches[0].pageX:event.clientX;
	    	    var pageY = isTouch? event.changedTouches[0].pageY:event.clientY;
	    		//alert("pageX:"+pageX+"/pageY:"+pageY);
	    		    self.initPointer();
		    	    var x = pageX - self.offsetX + self.scrollOffsetX;
		    	    var y = pageY - self.offsetY + self.scrollOffsetY;
		    	    self.memoryView.add(self.oldXLast, self.oldYLast, x, y);
		    	    self.oldXLast = self.oldX;
		    	    self.oldYLast = self.oldY;
		    	    self.oldX = x;
		    	    self.oldY = y;
		    		clearTimeout(self.drawTimerDoMix);
		    	    self.drawTimerDoMix=setTimeout(
		    		    function(){
		    			mansikiCanvasFrame.doMix( self.context ,[self.drowCan],self.mpdata.width,self.mpdata.height);
		    		    }
		    		 ,0);
		    	    //self.lastDrawTime = current;
	    	    return false;
	    	},
	    	drowexec:function(self){
	    	    self.initPointer();
	    	    var size = self.memoryView.size();
	    	    if(size < 1){
	    		return ;
	    	    }
	    	    var context = self.drowCtx;
	    	    context.beginPath();
	    	    var oldX =self.oldXLast;
	    	    var oldY =self.oldYLast;
	    	    for(var index = 0;index < size; index ++){
	    		var vector = self.memoryView.get(index);
	    		//{ox:ox, oy:oy, nx:nx, ny:ny};
		    	context.moveTo(oldX, oldY);
		    	context.lineTo(vector.nx, vector.ny);
		    	//console.log(vector);
		    	oldX = vector.nx;
		    	oldY = vector.ny;
	    	    }
	    	    context.stroke();
	    	    context.closePath();
	    	    //------------------------------------------------------------
//	    	    var current = new Date().getTime();
//	    	    if(self.lastDrawTime !== undefined && current - self.lastDrawTime < 32){
//	    		clearTimeout(self.drawTimerDoMix);
//	    	    }
//	    	    clearTimeout(self.drawTimerDoMix);
//	    	    self.drawTimerDoMix=setTimeout(
//	    		    function(){
//	    			//mansikiCanvasFrame.doMix( self.context ,[self.drowCan],self.mpdata.width,self.mpdata.height);
//	    		    }
//	    		 ,100);
//	    	    self.lastDrawTime = current;
	    	    
	    	},
	    	asBezier:function(p1x,p2x,p3x,p4x,p1y,p2y,p3y,p4y){
	    	  for(var i = 0;i <= 100;i++){
	    	    var t = i/100;		
	    	    var omt = (1-t);
	    	    //x,yそれぞれの座標を計算する
	    	    var bX = omt * omt * omt * p1x + 3 * omt * omt * t * p2x + 3 * omt * t * t * p3x + t * t * t * p4x;
	    	    var bY = omt * omt * omt * p1y + 3 * omt * omt * t * p2y + 3 * omt * t * t * p3y + t * t * t * p4y;
	    	    //ellipse(bX,bY,3,3);			//直径３の円を描画
	    	  }
	    	},
	    	onScroll:function(event){
	    	    var self = event.data.self;
	    	    clearTimeout(self.scrollTimer);
	    	    self.scrollTimer = setTimeout(function(){
			    self.initPointer();
	    	    },300);
	    	}
	};
  return MansikiPainterCanvas;
});