define([
        'indexeddb',
        'indexdbWrapper',
        ], function (idb,idbw) {

	var MansikiPainterExporter = function(dataManager){
		
	};
	MansikiPainterExporter.prototype={
		//欲しい機能を書こう。
		// データを作品単位で持ちたい。
		//　PKでmd5を作成してそれで持つか。
		//　素直にアレすればいいんじゃなかろうか。
		//　ただし件数はわからない。なので件数は外から数えるしか無い。
		//　横からのデータは非常に問題だが、この際無視する。
		// 
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
	        				self.mpcInst.loadToCurrent(img);
	    				}
	    				reader.readAsDataURL(f);
	    			}
	    		}
	    		return false;
	    	},
	};
  return MansikiPainterExporter;
});