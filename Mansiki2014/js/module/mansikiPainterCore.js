define([
        'jquery',
        'underscore',
        'knockout',
        'minicolors',
        'indexeddb',
        'indexdbWrapper',
        'js/module/mansikiPainterCanvas',
        'js/module/mansikiPainterForm',
        'js/module/paintDataManager',
        'js/module/paintStateManager',
        'js/config/mansikiPainterConfig',
        'js/config/mansikiPainterInitData',
        ], function ($, _, ko,mc,idb,idbw,mpc,mpf,pdm,psm,mpConf,mpInitData
    ) {
    $.event.props.push('dataTransfer');//ドラッグアンドドロップのおまじない
    //DONE 画面サイズプルダウン
    //DONE 画面サイズプルダウン デフォルト
    //DONE 枠線背景
    //TODO 複数ページ情報表示
    //DONE 色選択
    //TODO 複数ページ切り替え
    //TODO 筆圧感知
    //TODO 複数ページ一括エクスポート、インポート
    //TODO 固定メニュー
    //DONE スクロールオフセット対応
    //TODO 作品設定
    //TODO 固有設定
    //TODO テキストデータ入力
    //TODO サムネイル表示
    var PainterCore = function(idbw,width,height,$area,$fileNameInput,$dlAncer,$fileForm,$clearButton){
    	this.width = width;
    	this.height = height;
    	this.$fileNameInput = $fileNameInput;
    	this.$fileForm = $fileForm;
    	this.$dlAncer = $dlAncer;
    	this.$clearButton = $clearButton;
    	//--------------------------------------------------------
    	this.$dlAncer.unbind("click",this.save);
    	this.$dlAncer.bind("click",{self:this},this.save);
    	this.$clearButton.bind("click",{self:this},this.clear);
    	//--------------------------------------------------------
    	this.pdmInst = new pdm("painter","layer1");
    	psm.setPainterDataManager(this.pdmInst);
    	this.mpcInst = new mpc("myCanvas","layer1",width,height,mpConf.imageMime,this.pdmInst.mpData);
    	psm.setPainterCanvas(this.mpcInst);
    	this.mpcInst.setOnDrow(this.pdmInst.saveToLS.bind(this.pdmInst));
    	mpf.buildSizeSelect($("#canvasSize"),this.mpcInst.resizeCanvas.bind(this.mpcInst));
    	//this.pdmInst.setLoaderImageFunc([this.mpcInst.loadToCurrent.bind(this.mpcInst)]);
    	this.pdmInst.setLoaderDataFunc([
    	     this.mpcInst.loadToCurrentDirect.bind(this.mpcInst)
    	     ,mpf.initSizeSelect.bind(mpf)
    	     ]);
    	var psmPromise = psm.load();
    	var changeFunc = function(hex, opacity) {
        		console.log(hex + ' - ' + opacity);
        		psm.changeColor(hex,opacity);
        	}
    	var settings= {
    		animationSpeed: 50,
    		animationEasing: 'swing',
    		change: changeFunc,
    		changeDelay: 0,
    		control: 'hue',
    		defaultValue: '#aaaaaa',
		hide: null,
		hideSpeed: 100,
		inline: false,
		letterCase: 'lowercase',
		opacity: false,
		position: 'bottom left',
		show: null,
		showSpeed: 100,
		theme: 'default'
    	};
    	$('#colorSetting').minicolors(settings);
    	psmPromise.done(function(){
    	    $('#colorSetting').minicolors({'value':psm.getCurrentBrush.color});
    	    $('#colorSetting').minicolors({
    	    });
	});
    	//alert("aaaa"+$('#colorSetting').val());
    	this.$fileForm.bind("drop",{self:this},this.load);
    }
    //定数宣言
    Object.defineProperty(PainterCore, "a", { value : 37,writable : false });
    
    PainterCore.prototype={
	chageSize:function(event){
	    var self = event.data.self;
	    
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
    				self.mpcInst.loadToCurrent(img);
    			    }
    			    reader.readAsDataURL(f);
    			}
    		}
    		return false;
    	},
    	clear:function(event){
    	    var self = event.data.self;
    	    self.mpcInst.clear();
    	    self.pdmInst.clearLS();
    	    event.preventDefault(); 
    	}
    }

    return {initialize:function(){
	$(document).ready(function(){
		var painter = new PainterCore(idbw,640,480,$("#myCanvas"),$("#fileName"),$("#downloadAncer"),$("#dropImage"),$("#clearAncer"));
	});
    	}
    }
});
