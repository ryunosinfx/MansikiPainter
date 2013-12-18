//ドラッグアンドドロップのおまじない
jQuery.event.props.push('dataTransfer');
var Painter = function(width,height,$area,$fileNameInput,$dlAncer,$fileForm,$clearButton){
	this.width = width;
	this.height = height;
	this.lsKey = "painter";
	this.isMouseDown = false;
	this.offsetX = $area.parent().position().left*1;
	this.offsetY = $area.parent().position().top*1;;
	this.oldX = this.offsetX*-1;
	this.oldY = this.offsetY*-1;
	this.$area = $area;
	this.$area.attr("width" ,this.width);
	this.$area.attr("height", this.height);
	this.$fileNameInput = $fileNameInput;
	this.$fileForm = $fileForm;
	this.$dlAncer = $dlAncer;
	this.$clearButton = $clearButton;
	this.imageMime = "image/png";
	this.$area.bind("mousedown",{self:this},this.mouseDown);
	this.$area.bind("mouseup",{self:this},this.mouseUp);
	this.$area.bind("mouseout",{self:this},this.mouseOut);
	this.$area.bind("mouseenter",{self:this},this.mouseEnter);
	this.$area.bind("mousemove",{self:this},this.draw);
	this.$dlAncer.unbind("click",this.save);
	this.$dlAncer.bind("click",{self:this},this.save);
	this.$clearButton.bind("click",{self:this},this.clearLS);
	this.can = this.$area.get(0);
	this.context = this.can.getContext("2d");
	this.$fileForm.bind("drop",{self:this},this.load);
	//----------------------------------------------------------------
	this.READ_WRITE = 1;
	this.dbName = this.lsKey+"B";
	this.TableNames = ["test"];
	this.TableName = "test";
	var self = this;
	this.keys ={};
	this.keys[this.TableName] = "imgId";
	var dbDeleteRequest = indexedDB.deleteDatabase(this.dbName);
	dbDeleteRequest.onsuccess = function(e){
	};
	$.indexedDB(this.dbName, {
		"schema": {
			1: function(versionTransaction){
				versionTransaction.createObjectStore(self.TableName, {
					"keyPath": self.keys[self.TableName],
					"autoIncrement": true
				});
			}
		}
	});
	this.firstExecute();
	this.loadFromLS();
}
//定数宣言
Object.defineProperty(Painter, "a", { value : 37,writable : false });

Painter.prototype={
	mouseEnter:function(event){
		var self = event.data.self;
		self.$area.css("cursor","crosshair");
		return false;
	},
	mouseDown:function(event){
		var self = event.data.self;
		self.isMouseDown = true;
		self.$area.css("cursor","crosshair");
        self.oldX = event.clientX-self.offsetX;
        self.oldY = event.clientY-self.offsetY;
        console.log(event.type);
        self.saveToLS();
		return false;
	},
	mouseUp:function(event){
		var self = event.data.self;
		self.isMouseDown = false;
		self.$area.css("cursor","crosshair");
        console.log(event.type);
        //self.saveToLS();
		return false;
	},
	mouseOut:function(event){
		var self = event.data.self;
		if(self.isMouseDown !== true){
			return;
		}
		self.isMouseDown = false;
		self.$area.css("cursor","auto");
        console.log(event.type);
        //self.saveToLS();
		return false;
	},
	draw:function(event){
		var self = event.data.self;
		if(self.isMouseDown === false){
			return ;
		}
		
		var x = event.clientX - self.offsetX;
		var y = event.clientY - self.offsetY;
		self.context.strokeStyle = "rgba(255,0,0,1)";
		self.context.lineWidth = 1;
		self.context.beginPath();
		self.context.moveTo(self.oldX, self.oldY);
		self.context.lineTo(x, y);
		self.context.stroke();
		self.context.closePath();
		self.oldX = x;
		self.oldY = y;
		return false;
	},
	save:function(event){
		var self = event.data.self;
		var imgData = self.can.toDataURL(self.imageMime ); 
		self.$dlAncer.attr("href",imgData);
		self.$dlAncer.attr("download",self.$fileNameInput.val()+"_.png");
	},
	load:function(event){
    	var files = event.dataTransfer.files;
		var self = event.data.self;
		var img = new Image();
		for (var i=0; i< files.length; i++) {
			var f = files[i];
			var reader = new FileReader();
			if (!f.type.match('image.*') && !f.type.match('text.*')) {
				alert("画像ファイル以外は表示できません。");
				continue;
			}

			// エラー発生時の処理
			reader.onerror = function (evt) {
				alert("読み取り時にエラーが発生しました。");
			}

			// 画像ファイルの場合の処理
			if (f.type.match('image.*')) {
				reader.onload = function (event) {
					img.src = event.target.result;
				}
				img.onload=function(event){
    				self.context.drawImage(img,0,0);
				}
				reader.readAsDataURL(f);
			}
		}
		return false;
	},
	saveToLS:function(){
		var self = this;
		var imgData = self.can.toDataURL(self.imageMime ); 
		self.imgData = imgData;

		self.saveExecute();
		localStorage.setItem(this.lsKey ,imgData);
		$.indexedDB(this.dbName).objectStore(self.TableName).get("layer1").then(function(result, event){
				result; // Result of the operation. Some operations like delete will return undefined
				event; // Success Event
				alert("saveExecute result:"+result);
			}, console.error);
	},
	firstExecute:function(){
		var self = this;
		var trans = $.indexedDB(this.dbName).transaction(this.TableNames, $.indexedDB.IDBTransaction.READ_WRITE);
		trans.then(console.info, console.error);
		trans.progress(function(t){
			var data = {};
			//data[self.keys[self.TableName] ]="layer1";
			data["imgData"] = self.imgData ;
			t.objectStore(self.TableName).add(data,"layer1").then(console.info, console.error);
		});
   		return;
		
	},
	saveExecute:function(){
		var self = this;
		var trans = $.indexedDB(self.dbName).transaction(self.TableNames, $.indexedDB.IDBTransaction.READ_WRITE);
		trans.then(console.info, console.error);
		trans.progress(function(t){
			var data = {};
			//data[self.keys[self.TableName] ]="layer1";
			data["imgData"] = self.imgData ;
			//alert("saveExecute data:"+data.toSource());
			t.objectStore(self.TableName).put(data,"layer1").then(console.info, console.error);
		});
   		return;
		
	},
	loadFromLS:function(){
		if(localStorage.getItem(this.lsKey) !== null){
			var img = new Image();
			img.src = localStorage.getItem(this.lsKey);
			var self = this;
			img.onload=function(event){
				self.context.drawImage(img, 0, 0);
			}
		}
	},
	clearLS:function(event){
		var self = event.data.self;
		
		self.context.fillStyle = '#ffffff';
		self.context.fillRect(0,0,self.width,self.height);
		localStorage.clear();
		return false;
	}
}







