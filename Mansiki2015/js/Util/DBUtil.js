
define([]
	, function () {
      //Util
        var DBUtil = {
            letters : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_#",
            getNewIdAs64:function(offset){
	        	var result = "";
	        	if(offset===undefined){
	        	    offset = 0;
	        	}
            	var self = this;
                var exec = function (input){
                    var mod = input%64;
                    result = self.letters.substr(mod,1)+result;
                    return input > 64 ? exec(Math.floor(input/64)): 0;
                }
                var milisec = +new Date() + offset;
                exec(milisec);
                alert(+new Date()+"/"+result);
                return result;
            },
        };
		//RDMSふうに考える。
		//必要なキーを上げよ※これらは文字列でキーの保持が可能、ただし内容はあれ
		//シリーズ-連載-作品-ページ-コマ-エフェクト
		//シリーズ-世界設定
		//シリーズ-連載-設定
		//各内容は　xxxYYY
		//ｘxxはIndex３桁６４進数24bit
		//YYYはバージョン３桁６４進数24bit
		//と言う事はMaxキーを取得する奴が必要
		// コピーを行う場合は？キーを新しく発行して
		// キーの分割
		Object.defineProperty(DBUtil, 'split', {//makeKeyNextVersion
			value:function(curenntMaxKey){
				var retArray = [];
				var baseLength = 3;
				var stepCount = Math.floor(curenntMaxKey.length/baseLength)；
				for(var i = 0 ; i<stepCount ; i++){
					retArray.push(curenntMaxKey.substr(baseLength*i,baseLength));
				}
				return retArray;
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のバージョンを記載※３桁づつ放り込むこと。
		Object.defineProperty(DBUtil, 'addVersion', {//
			value:function(curenntVersionString,addValue){
				var total = 0;
				for(var i = 0 ; i<curenntVersionString.length;i++ ){
					var digit = curenntVersionString.substr(i,1));
					total*64 + letters.indexOf(digit);
				}
				total= addValue===undefined?total+1:total+addValue；
				var execAs64 = function (result,input){
					var mod = input%64;
					result = self.letters.substr(mod,1)+result;
					return input > 64 ? execAs64(result,Math.floor(input/64)): result;
				}
				var newVersion = execAs64("",total);
				return newVersion;
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のバージョンを計算。ただし、+-両方受け付けます。LevelはIndex、Versionのペアトークン数で考えること。1始まり
		//例：xxxYYYの場合はYYYのみが対象。
		Object.defineProperty(DBUtil, 'makeKeyNextVersion', {//
			value:function(curenntVersionString,level,addValue){
				var keyLevels = DBUtil.split(curenntVersionString);
				var newVersion = "";
				var count = keyLevels.length;
				var lengthStart = keyLevels.length-1;
				if(level===undefined){
					level = Math.floor(count/2) ;
				}
				for(var index in keyLevels){
					var key  = keyLevels[lengthStart-index];//おしりから
					if(level *2 ===count ){
						newVersion = DBUtil.addVersion(key,addValue) + newVersion;
					}else{
						newVersion = key + newVersion ;
					}
					count--;
				}
				return newVersion;
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のIndexを計算。ただし、+-両方受け付けます。LevelはIndex、Versionのペアトークン数で考えること。１始まり
		//例：xxxYYYの場合はXXXのみが対象。でYYYは001になります。
		Object.defineProperty(DBUtil, 'makeKeyNewNextIndex', {//
			value:function(curenntVersionString,level,addValue){
				var keyLevels = DBUtil.split(curenntVersionString);
				var newVersion = "";１１
				var count = keyLevels.length;
				var lengthStart = keyLevels.length-1;
				if(level===undefined){
					level = Math.floor(count/2)-1;
				}
				for(var index in keyLevels){
					var key  = keyLevels[lengthStart-index];//おしりから
					count--;
					if(level *2 ===count ){
						newVersion = DBUtil.addVersion(key,addValue) +  newVersion;
					}else if(level *2+1 ===count ){
						newVersion =  "001"+newVersion;
					}else{
						newVersion = newVersion + key;
					}
				}
				return newVersion;
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のIndexでのスタートを記述します。指定レベルより下は開始０００になります。
		//例：xxxYYYの場合はYYYは000になります。
		Object.defineProperty(DBUtil, 'makeCurrentIndexStart', {//
			value:function(curenntVersionString,level,addValue){
				return this.makeCurrentXXXCore(curenntVersionString,level,addValue,  "000", 1);
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のIndexでのエンドを記述します。指定レベルより下は終了###になります。
		//例：xxxYYYの場合はYYYは###になります。
		Object.defineProperty(DBUtil, 'makeCurrentIndexEnd', {//
			value:function(curenntVersionString,level,addValue){
				return this.makeCurrentXXXCore(curenntVersionString,level,addValue,  "###", 1);
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のIndexでのスタートを記述します。指定レベルより下は開始０００になります。
		//例：xxxYYYの場合はYYYは000になります。
		Object.defineProperty(DBUtil, 'makeCurrentLevelStart', {//
			value:function(curenntVersionString,level,addValue){
				return this.makeCurrentXXXCore(curenntVersionString,level,addValue,  "000", 0);
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のIndexでのエンドを記述します。指定レベルより下は終了###になります。
		//例：xxxYYYの場合はYYYは###になります。
		Object.defineProperty(DBUtil, 'makeCurrentLevelEnd', {//
			value:function(curenntVersionString,level,addValue){
				return this.makeCurrentXXXCore(curenntVersionString,level,addValue,  "###", 0);
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// 次のIndexでのエンドを記述します。指定レベルより下は終了###になります。
		//例：xxxYYYの場合はYYYは###になります。
		Object.defineProperty(DBUtil, 'makeCurrentXXXCore', {//
			value:function(curenntVersionString,level,addValue,token,offset){
				var keyLevels = DBUtil.split(curenntVersionString);
				var newVersion = "";１１
				var count = keyLevels.length;
				var lengthStart = keyLevels.length-1;
				if(level===undefined){
					level = Math.floor(count/2)-1;
				}
				var isFixed=true;
				for(var index in keyLevels){
					var key  = keyLevels[lengthStart-index];//おしりから
					count--;
					if(isFixed){
						newVersion = oken +  newVersion ;
					}else if(level *2+offset ===count ){
						newVersion = token +  newVersion;
						isFixed=false;
					}else{
						newVersion = newVersion + key;
					}
				}
				return newVersion;
			},
			enumerable:false,
			writable:false,
			configurable:true
		});
		// バージョンを出す。
		Object.defineProperty(DBUtil, 'makeKeyStartVersion', {//
			value:function(level){
				var newVersion = "";
				for(var i = 0;i<level ;i++ ){
					newVersion += "000000";
				}
				return newVersion;
			},
			enumerable:false,
			writable:false,
			configurable:true
		});


        return DBUtil;
});
