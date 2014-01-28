define([
        'js/module/mansikiCanvasFrame',
        ]
	, function (mansikiCanvasFrame) {

	var MansikiPainterCanvas = function(id,imageId,width,height,imageMime,mpdata){
	    this.isMouseDown = false;
	    $ancer = $("#"+id);
	    this.offsetX = $ancer.position().left*1;
	    this.offsetY = $ancer.position().top*1;;
	    this.oldX = this.offsetX*-1;
	    this.oldY = this.offsetY*-1;
	    this.mpdata = mpdata;
	    this.mpdata.width = width;
	    this.mpdata.height = height;
	    this.imageMime = imageMime;
	    this.onDrow= function(){};
	    this.rebuildCanvas($ancer,imageId,null);
	    this.baseColor ="#ffffff";
	    this.init();
	    this.currentBrush=undefined;
	};
	MansikiPainterCanvas.prototype={//baseColor
		init:function(){
		    var self = this;
		    var $window = $(window);
		    $window.unbind("scroll",this.onScroll);
		    $window.bind("scroll",{self:this},this.onScroll);
		    self.initPointer();
		},
		initPointer:function(){
		    var self = this;
		    var $window = $(window);
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
		setOnDrow:function(callback){
		    this.onDrow = callback;
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
		    this.$canvas = $ancer.find("canvas");
		    this.$canvas.attr("width" ,width);
		    this.$canvas.attr("height", height);
		    
		    
		    this.$canvas.bind("touchstart",{self:this},this.mouseDown);
		    this.$canvas.bind("touchend",{self:this},this.mouseUp);
		    this.$canvas.bind("touchcancel",{self:this},this.mouseOut);
		    this.$canvas.bind("touchmove",{self:this},this.draw);
		    
		    
		    this.$canvas.bind("mousedown",{self:this},this.mouseDown);
		    this.$canvas.bind("mouseup",{self:this},this.mouseUp);
		    this.$canvas.bind("mouseout",{self:this},this.mouseOut);
		    this.$canvas.bind("mouseenter",{self:this},this.mouseEnter);
		    this.$canvas.bind("mousemove",{self:this},this.draw);
		    this.can = this.$canvas.get(0);
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
		    promise.done(function(){self.execOnDrow();});
		},
		execOnDrow:function(){
		    var self = this;
		    setTimeout(
			function(){
			    self.mpdata.imageData = self.getImageData();
			    self.onDrow(self.mpdata,self.imageId);
			}
			,1000);
		},
	    	mouseEnter:function(event){
	    	    var self = event.data.self;
	    	    clearTimeout( self.mouseOutTimer );
	    	    self.$canvas.css("cursor","crosshair");
		    self.initPointer();
	            self.oldX = event.clientX-self.offsetX + self.scrollOffsetX;
	            self.oldY = event.clientY-self.offsetY + self.scrollOffsetY;
	    	    return false;
	    	},
	    	mouseDown:function(event){
	    	    var self = event.data.self;
		    self.initPointer();
	    	    self.isMouseDown = true;
	    	    self.$canvas.css("cursor","crosshair");
	            self.oldX = event.clientX-self.offsetX + self.scrollOffsetX;
	            self.oldY = event.clientY-self.offsetY + self.scrollOffsetY;
	            console.log(event.type);
	            self.mpdata.imageData = self.getImageData();
	    	    self.onDrow(self.mpdata,self.imageId);
	            return false;
	    	},
	    	mouseUp:function(event){
	    	    var self = event.data.self;
	    	    self.isMouseDown = false;
	    	    self.$canvas.css("cursor","crosshair");
	    	    console.log(event.type);
	            self.mpdata.imageData = self.getImageData();
	    	    self.onDrow(self.mpdata,self.imageId);
	    	    return false;
	    	},
	    	mouseOut:function(event){
	    	    var self = event.data.self;
	    	    if(self.isMouseDown !== true){
	    		return;
	    	    }
	    	    clearTimeout( self.mouseOutTimer );
    	    	    self.mouseOutTimer = setTimeout(function(){
        	    	    self.isMouseDown = false;
        	    	    self.$canvas.css("cursor","auto");
        	            console.log(event.type);
        	            self.mpdata.imageData = self.getImageData();
        	    	    self.onDrow(self.mpdata,self.imageId);
	    	    },1000);
	            return false;
	    	},
	    	draw:function(event){
	    	    var self = event.data.self;
		    self.initPointer();
	    	    if(self.isMouseDown === false){
	    		return ;
	    	    }
	    	    setTimeout(function(){
	    			self.initPointer();
		    	    var x = event.clientX - self.offsetX + self.scrollOffsetX;
		    	    var y = event.clientY - self.offsetY + self.scrollOffsetY;
		    	    if(self.currentBrush===undefined){
		    		self.drowCtx.strokeStyle = "rgba(255,0,0,1)";
				self.drowCtx.lineWidth = 1;
		    	    }else{
		    		//alert(self.currentBrush.color);
		    		self.drowCtx.strokeStyle = self.currentBrush.color;
		    		self.drowCtx.lineWidth = self.currentBrush.size*1;
		    	    }
		    	    self.drowCtx.beginPath();
		    	    self.drowCtx.moveTo(self.oldX, self.oldY);
		    	    self.drowCtx.lineTo(x, y);
		    	    self.drowCtx.stroke();
		    	    self.drowCtx.closePath();
		    	    self.oldX = x;
		    	    self.oldY = y;
		    	mansikiCanvasFrame.doMix( self.context ,[self.drowCan],self.mpdata.width,self.mpdata.height);
	    	    },0);
	    	    return false;
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