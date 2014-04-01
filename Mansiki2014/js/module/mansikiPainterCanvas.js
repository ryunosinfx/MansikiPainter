define([
        'js/module/mansikiCanvasFrame',
        ]
	, function (mansikiCanvasFrame) {

    	var MansikiDataViewManager = function(){
        	this.ab = new ArrayBuffer(32678); // 256-byte ArrayBuffer.
        	this.dv = new DataView(this.ab);
        	this.vector_length = 246;this.dv.getUint8(0);
        	this.ox = 2;this.dv.getUint16(1); // 0+uint8 = 1 bytes offset
        	this.oy = 2;this.dv.getUint16(3); // 0+uint8+uint16 = 3 bytes offset
        	this.nx = 2;this.dv.getUint16(1); // 0+uint8 = 1 bytes offset
        	this.ny = 2;this.dv.getUint16(3); // 0+uint8+uint16 = 3 bytes offset
        	this.offset = this.ox*this.oy*this.nx*this.ny;
        	this.vectors = new Float32Array(this.offset*this.vector_length);
    	    	alert(this.vectors.length);
    	    	var offsetOX = this.ox;
    	    	var offsetOY = this.ox+this.oy;
    	    	var offsetNX = this.ox+this.oy+this.nx;
    	    	var offsetNY = this.ox+this.oy+this.nx+this.ny;
        	for (var i=0, offox=0,offoy=offsetOX,offnx=offsetOY,offny=offsetNX;
        		i<this.vectors.length;
        		i++, offox+=offsetOX, offox+=offsetOY, offnx+=offsetNX, offny+=offsetNY
        	) {
        	    this.vectors[i] =[
        	        this.dv.getUint16(offox),
        	        this.dv.getUint16(offoy),
        	        this.dv.getUint16(offnx),
        	        this.dv.getUint16(offny)
        	    ];
        	}
        	this.queueCount = 0;
    	}
    	MansikiDataViewManager .prototype={
    		get:function(index){
    		    if(this.queueCount < 0){
    			return undefined;
    		    }
    		    this.queueCount--;
    		},
    		add:function(ox,oy,nx,ny){
    		    this.queueCount++;
    		    var window = this.vectors[this.queueCount] ;
    		    
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
	    this.init();
	    this.currentBrush=undefined;
	    this.memory = new Uint16Array(1024*1024);//0-255
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
		    this.$canvas = $ancer.find("canvas");
		    this.$canvas.attr("width" ,width);
		    this.$canvas.attr("height", height);
		    
		    
		    this.$canvas.on("touchstart",{self:this,isTouch:true},this.mouseDown);
		    this.$canvas.on("touchend",{self:this,isTouch:true},this.mouseUp);
		    this.$canvas.on("touchcancel",{self:this,isTouch:true},this.mouseOut);
		    this.$canvas.on("touchmove",{self:this,isTouch:true},this.draw);
		    
		    
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
	    	    var self = event.data.self;
	    	    var isTouch = event.data.isTouch;
		    self.initPointer();
	    	    if(self.isMouseDown === false){
	    		return ;
	    	    }
	    	    var pageX = isTouch? event.originalEvent.changedTouches[0].pageX:event.clientX;
	    	    var pageY = isTouch? event.originalEvent.changedTouches[0].pageY:event.clientY;
	    	    self.drawTimer=setTimeout(function(){
	    		//alert("pageX:"+pageX+"/pageY:"+pageY);
	    		    self.initPointer();
		    	    var x = pageX- self.offsetX + self.scrollOffsetX;
		    	    var y = pageY - self.offsetY + self.scrollOffsetY;
		    	    self.drowCtx.beginPath();
		    	    self.drowCtx.moveTo(self.oldX, self.oldY);
		    	    self.drowCtx.lineTo(x, y);
		    	    self.drowCtx.stroke();
		    	    self.drowCtx.closePath();
		    	    self.oldX = x;
		    	    self.oldY = y;
		    	    var current = new Date().getTime();
		    	    if(self.lastDrawTime !== undefined && current - self.lastDrawTime < 32){
		    		clearTimeout(self.drawTimerDoMix);
		    	    }
		    	    self.drawTimerDoMix=setTimeout(
		    		    function(){
		    			mansikiCanvasFrame.doMix( self.context ,[self.drowCan],self.mpdata.width,self.mpdata.height);
		    		    }
		    		 ,0);
		    	    self.lastDrawTime = current;
	    	    },0);
	    	    return false;
	    	},
	    	drowexec:function(event){
	    	    var self = event.data.self;
	    	    //alert("pageX:"+pageX+"/pageY:"+pageY);
	    	    self.initPointer();
	    	    var x = pageX- self.offsetX + self.scrollOffsetX;
	    	    var y = pageY - self.offsetY + self.scrollOffsetY;
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
	    	    var current = new Date().getTime();
	    	    if(self.lastDrawTime !== undefined && current - self.lastDrawTime < 32){
	    		clearTimeout(self.drawTimerDoMix);
	    	    }
	    	    self.drawTimerDoMix=setTimeout(
	    		    function(){
	    			mansikiCanvasFrame.doMix( self.context ,[self.drowCan],self.mpdata.width,self.mpdata.height);
	    		    }
	    		 ,0);
	    	    self.lastDrawTime = current;
	    	    
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