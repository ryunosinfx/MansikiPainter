(function($){
	$.extend({indexedDBwrapper:function(dbName){
		this.firstTable = "test";
		this.currentDB = dbName ===undefined ? "test": dbName;
		this.pkMap={};//でもこれってあれが必要だよね。
		this.pkMapKey="pkMap";
		if(this.toSource ===undefined){
			Object.defineProperty(Object.prototype, "toSource", { // 拡張
				configurable: true, // false is immutable
				enumerable: false,  // false is invisible
				writable: true,     // false is read-only
				value: function() {
					return JSON.stringify(this);
				}
			});
		}
		this.createDB
	}
	});//バージョン管理の考えを入れるべき。
	$.indexedDBwrapper.prototype={
		createDB:function(dbName){
			this.currentDB = dbName ===undefined ? this.currentDB : dbName;
			var self = this;
			$.indexedDB(this.currentDB, {
				"schema": {
					1: function(tran){
						tran.createObjectStore(self.pkMapKey, {
							"keyPath": self.pkMapKey+"key",
							"autoIncrement": true
						});
					}
				}
			});
		},
		getPkData:function(storeName,keyPath){
			var self = this;
			var data ={keyPath:keyPath};
			data[self.pkMapKey+"key"] = storeName;
			$.indexedDB(this.currentDB).objectStore(storeName, false);
			return data;
		},
		getPkByObjectStore:function(storeName,data,key,callback){
			var self = this;
			var d= new $.Deferred();
			var dataA = data;
			var keyA = key;
			var func = function(result){
				callback(storeName,dataA,result.keyPath,keyA);
				d.resolve();
			}
			this.selectExecPk(this.pkMapKey,storeName,func);
			return d.promise();
		},
		crateObjectStore:function(storeName,pkPath){//Need Data
			var self = this;
			self.crateObjectStoreExec(storeName,pkPath);
			var data = self.getPkData(storeName,pkPath);
			self.insertUpdateExecPK(self.pkMapKey,data,storeName);
		},
		crateObjectStoreExec:function(storeName,pkPath){
			var self = this;
			var obj ={key:"crateObjectStore"};
			var initDummyData = {};
			initDummyData[pkPath] ="dummy";
			try{
			$.indexedDB(this.currentDB).objectStore(storeName, {
					"keyPath": pkPath,
					"autoIncrement": true
				}).add(initDummyData);//.then(self.consolLogSuccess, self.consolLogFailure.bind(obj));
			}catch(e){
				//console.log("e:"+e.toSource());
			}
		},
		dropObjectStore:function(StoreName){
			var self = this;
			var obj ={key:"dropObjectStore"};
			console.log("dropObjectStore :"+StoreName);
			$.indexedDB(self.currentDB).then(self.consolLogSuccess, self.consolLogFailure.bind(obj)
				, function(tran){
					tran.deleteObjectStore(StoreName);
					console.log("Object Store deleted :"+StoreName);
				});
		},
		changeDB:function(db){
			this.currentDB = db;
		},
		beginTran:function(objctStoreNames,key){
			var self = this;
			return $.indexedDB(self.currentDB).transaction(objctStoreNames, $.indexedDB.IDBTransaction.READ_WRITE);
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		insertUpdate:function(storeName,data,key){
			this.getPkByObjectStore(storeName,data,key,this.insertUpdateExec.bind(this));
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		insertUpdateExecPK:function(storeName,data,key,keyPath){//PK専用
			var d= new $.Deferred();
			var self = this;
			var trans = self.beginTran([storeName],key);
			var obj ={key:"insertUpdateExecPK storeName:"+storeName+"/key:"+key+"/"+keyPath};
			trans.then(self.consolLogSuccess, self.consolLogFailure.bind(obj));
			trans.progress(function(tran){
				tran.objectStore(storeName);
				tran.objectStore(storeName).get(key).then(
					function(result, event){
						if(result===undefined){
							var obj ={key:"add"};
							tran.objectStore(storeName).add(data).then(self.consolLogSuccess, self.consolLogFailure.bind(obj));
						}else{
							console.log("ccccc");
							tran.objectStore(storeName).put(data).then(self.consolLogSuccess, self.consolLogFailure.bind(obj));
						}
		    			d.resolve();
					}
				, console.error);
			});
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		insertUpdateExec:function(storeName,data,keyPath,key){
			var self = this;
			var dataObj = {data:data};
		
			dataObj[keyPath] = key;
			var obj ={key:"add2"};
			$.indexedDB(self.currentDB).objectStore(storeName).get(key).then(
				function(result){
					if(result!==undefined){
						var obj ={key:"add2 CCC"};
						$.indexedDB(self.currentDB).objectStore(storeName).put(dataObj).then(
							function(result){}
							,self.consolLogFailure.bind(obj));
					}else{
						var obj ={key:"add2 AAA"};
						$.indexedDB(self.currentDB).objectStore(storeName).add(dataObj).then(
							function(result){}
							,self.consolLogFailure.bind(obj)); 
					}
				}
				,self.consolLogFailure.bind(obj)
			);
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		deleteData:function(storeName,key){
			this.getPkByObjectStore(storeName,"",key,this.deleteDataExec.bind(this));
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		deleteDataExec:function(storeName,data,keyPath,key){
			var self=this;
			var obj ={key:"selectExec"};
			$.indexedDB(self.currentDB).objectStore(storeName).each(function(elem){
					if (elem.value && elem.value[keyPath]===key) {
						//console.log("Deleting", elem.value);
						elem["delete"]();
						return true;
					}
				});
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		select:function(storeName,key,callback){
			return this.selectExec(storeName,key,callback);
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		//range:IDBKeyRange.bound(range[0], range[1], (typeof range[2] === 'undefined') ? false : range[2], (typeof range[3] === 'undefined') ? false : range[3]);
		selectAll:function(storeName,callback){//callback = function(key,value){}
			return this.selectExecBounds(storeName,undefined,callback,undefined);
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		//range:IDBKeyRange.bound(range[0], range[1], (typeof range[2] === 'undefined') ? false : range[2], (typeof range[3] === 'undefined') ? false : range[3]);
		selectWhere:function(storeName,range,callback,direction){
			return this.selectExecBounds(storeName,range,callback,direction);
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		selectExecPk:function(storeName,key,callback){//更新系のみ使用（PKが自明でないから）
			var self = this;
			var trans = self.beginTran([storeName]);
			var obj ={key:"selectExec"};
			trans.then(self.consolLogSuccess, self.consolLogFailure.bind(obj));
			trans.progress(function(tran){
				var obj ={key:"selectExec progress"};
				tran.objectStore(storeName, true).get(key)
				.then(
					function(result, event){
						if(result!==undefined){
							callback(result);
						}
						self.consolLogSuccess(result);
					}
					, self.consolLogFailure.bind(obj));
			});
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		selectExec:function(storeName,key,callback){
			var d= new $.Deferred();
			var promise = d.promise();
			var self = this;
			var trans = self.beginTran([storeName]);
			var obj ={key:"selectExec"};
			trans.then(self.consolLogSuccess, self.consolLogFailure.bind(obj));
			trans.progress(function(tran){
				var obj ={key:"selectExec progress"};
				tran.objectStore(storeName, true).get(key)
				.then(
					function(result, event){
						if(result!==undefined){
							callback(result.data);
						}
						promise.result=result;
						promise.event=event;
		    			d.resolve();
						self.consolLogSuccess(result);
					}
					, function(result, event){
						promise.result=result;
						promise.event=event;
						d.reject('DB Open Error!!');
						self.consolLogFailure.bind(obj)
					});
			});
			return d.promise();
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		selectExecBounds:function(storeName,range,callback,direction){
			var d= new $.Deferred();
			var promise = d.promise();
			var self = this;
			var trans = self.beginTran([storeName]);
			var obj ={key:"selectExec"};
			var callBackWrapperByCursor = {apply:function(cursorReq, elems){callback(elems[0].key,elems[0].value);return true;}};
			trans.then(self.consolLogSuccess, self.consolLogFailure.bind(obj));
			trans.progress(function(tran){
				var obj ={key:"selectExecBounds progress"};
				tran.objectStore(storeName, true).each(callBackWrapperByCursor,range,direction)
				.then(
					function(result, event){
						if(result!==undefined){
							//callback(result.data);//ここはこれでいい？
						}
						promise.result=result;
						promise.event=event;
		    			d.resolve();
						self.consolLogSuccess(result);
					}
					, function(result, event){
						promise.result=result;
						promise.event=event;
						d.reject('DB Open Error!!');
						self.consolLogFailure.bind(obj)
					});
			});
			return d.promise();
		},
		//------------------------------------------------------------------------------------------------------------------------------------------------
		consolLogSuccess:function(result){
			console.log(result);
		},
		consolLogFailure:function(result){
			console.log("##############"+(this!==undefined?this.key:this));
			console.log("consolLogFailure");
			console.log(result);
		}
	}
})(jQuery);
