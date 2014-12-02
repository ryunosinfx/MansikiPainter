var getIndexeddbHelper = function ($) {
	var IndexeddbHelper={};
	var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;
	Object.defineProperty(IndexeddbHelper, 'makeKeyRange', {//
		value:function(start, end, isNotEqualStart, isNotEqualEnd){
			if(isNotEqualStart===undefined && isNotEqualEnd===undefined){
				return IDBKeyRange.bound(start, end, false, false);
			}
			return IDBKeyRange.bound(start, end,isNotEqualStart,isNotEqualEnd);;
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	Object.defineProperty(IndexeddbHelper, 'makeKeyRangeUpper', {//
		value:function(start, isNotEqualStart){
			if(isNotEqualStart!==true ){
				return IDBKeyRange.upperBound(start);
			}
			return IDBKeyRange.upperBound(start,isNotEqualStart);
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	Object.defineProperty(IndexeddbHelper, 'makeKeyRangeLower', {//
		value:function(end, isNotEqualEnd){
			if(isNotEqualStart!==true ){
				return IDBKeyRange.lowerBound(end);
			}
			return IDBKeyRange.lowerBound(end,isNotEqualEnd);
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	Object.defineProperty(IndexeddbHelper, 'makeKeyRangeOnly', {//
		value:function(only){
			if(isNotEqualStart!==true ){
				return IDBKeyRange.only(only);
			}
			return IDBKeyRange.lowerBound(end,isNotEqualEnd);
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	Object.defineProperty(IndexeddbHelper, 'getKeyPath', {//
		value:function(dbName,tableName,callback){
			var $d = $.Deferred();
			var request = indexedDB.open(dbName);
			request.onsuccess = function(event) {
				var db = request.result;
				var transaction = db.transaction([tableName], "readonly");
				transaction.oncomplete = function(event) {
			    		db.close();
					$d.resolve();
				};
				transaction.onerror = function(event) {
			    		db.close();
					$d.resolve();
				};
				var objectStore = transaction.objectStore(tableName);
			    db.close();
			    if(callback){callback(objectStore.keyPath);}
			    $d.resolve();
			};
			request.onerror = function(e) {
			    callback(-1);
			    $d.resolve();
			};
			return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	Object.defineProperty(IndexeddbHelper, 'getCurrentVersion', {//
		value:function(dbName,callback){
			var $d = $.Deferred();
			var request = indexedDB.open(dbName);
			request.onsuccess = function(event) {
			    var db = event.target.result;
			    var version = db.version;
		    	    db.close();
			    callback(version);
			    $d.resolve();
			};
			request.onerror = function(e) {
			    callback(-1);
			    $d.resolve();
			};
			return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//Select In-line-Keyで返す。
	Object.defineProperty(IndexeddbHelper, 'selectAll', {//
		value:function(dbName,tableName,callback,range,direction){
			var list = [];
			var $d = $.Deferred();
			IndexeddbHelper.getKeyPath(dbName,tableName);
			var request = indexedDB.open(dbName);
			request.onsuccess = function(event) {
			    var db = event.target.result;
			    var objectStore =  db.transaction(tableName).objectStore(tableName);
			    var req = range === undefined ? objectStore.openCursor() : objectStore.openCursor(range);
			    req.onsuccess = function(event) {
				var cursor = event.target.result;
					if (cursor) {
						list.push(cursor.value);
			    	    cursor.continue();
			    	} else {
			    		db.close();
			    		$d.resolve();
			    	}
			    };
			    req.onerror = function(e) {
			        console.log("erroerror!!!!!!!!!!!!!!!!!"+e);
		    		db.close();
		    		$d.resolve();
			    };
			};
			request.onabort = function(e) {
		        console.log("erroeobjrror!!!!!!!!!!!!!!!!!"+e);
	    		$d.resolve();
		    };
		    request.onerror = function(e) {
		        console.log("erroerror!!!!!!!!!!!!!!!!!"+e);
		        console.log(e);
	    		$d.resolve();
		    };
		    var promise = $d.promise();
		    promise.done(function(){callback(list);})
		    return promise;
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//Select In-line-Keyで返す。
	Object.defineProperty(IndexeddbHelper, 'selectByKey', {
		value:function(dbName,tableName,key,callback){
		    // console.log("IndexeddbHelper.selectByKey 1　"+key+"/"+"");
		    var $d = $.Deferred();
		    var request = indexedDB.open(dbName);
			request.onsuccess = function(event) {
				var db = request.result;
				var transaction = db.transaction([tableName], "readonly");
				transaction.oncomplete = function(event) {
			    		db.close();
					$d.resolve();
				};
				transaction.onerror = function(event) {
			    		db.close();
					$d.resolve();
				};
				var objectStore = transaction.objectStore(tableName);
				var objectStoreRequest = objectStore.get(key);//keyはsonomama
				objectStoreRequest.onsuccess = function(event) {
				    var result = objectStoreRequest.result;
				    // console.log("IndexeddbHelper.selectByKey 2 "+result+" / "+key+"/"+tableName);
				    db.close();
				    if(callback){callback(result);}
				    $d.resolve();
				};
				objectStoreRequest.onerror = function(event) {
			    		db.close();
			    		$d.resolve();
				};
		    }
		    return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//Select FirstOnek
	Object.defineProperty(IndexeddbHelper, 'selectFirstOne', {
		value:function(dbName,tableName,callback,range,direction){
		    var list = [];
		    var firstOne = undefined;
		    // console.log("IndexeddbHelper.selectAll 1");
		    var $d = $.Deferred();
		    var request = indexedDB.open(dbName);
		    request.onsuccess = function(event) {
			var db = event.target.result;
			var objectStore =  db.transaction(tableName).objectStore(tableName);
			var req = range === undefined ? objectStore.openCursor() : objectStore.openCursor(range);
			req.onsuccess = function(event) {
			    var cursor = event.target.result;
			    if (cursor) {
				if(firstOne===undfined){
				    firstOne = cursor.value;
				    callback(firstOne);
				}
				cursor.continue();
			    } else {
        			db.close();
        			$d.resolve();
			    }
			};
        		req.onerror = function(e) {
    				console.log("erroerror!!!!!!!!!!!!!!!!!"+e);
		    		db.close();
    				$d.resolve();
    		    	};
		    };
		    request.onabort = function(e) {
		        console.log("erroerror!!!!!!!!!!!!!!!!!"+e);
	    		$d.resolve();
		    };
		    request.onerror = function(e) {
		        console.log("erroerror!!!!!!!!!!!!!!!!!"+e);
		        console.log(e);
	    		$d.resolve();
		    };
		    var promise = $d.promise();
		    promise.done(function(){callback(list);})
		    return promise;
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//InsertUpdate
	Object.defineProperty(IndexeddbHelper, 'insertUpdate', {
		value:function(dbName,tableName,keyPath,data,callback){
		    var $d = $.Deferred();
		    var key = data[keyPath];

		    IndexeddbHelper.selectByKey(dbName,tableName,key,
			    function(value){
				if(value===undefined){
				    var request = indexedDB.open(dbName);
				    request.onsuccess = function(event) {
					var db = request.result;
					var transaction = db.transaction([tableName], "readwrite");
					transaction.oncomplete = function(event) {
				    		db.close();
				    		$d.resolve();
					};
					transaction.onerror = function(event) {
				    		db.close();
				    		$d.resolve();
					};
					var objectStore = transaction.objectStore(tableName);
					// console.log("add key:"+key);
					var objectStoreRequest = objectStore.add(data);//,keyPath
					objectStoreRequest.onsuccess = function(event) {
					    	if(callback){callback(data,key);}
				    		db.close();
				    		$d.resolve();
					};
					objectStoreRequest.onerror = function(event) {
						var promisUpdate = IndexeddbHelper.update(dbName,tableName,keyPath,data,callback);

				    		db.close();
				    		promisUpdate.done(function(){ $d.resolve()});
					};
				    }
				}else{
				    var promisUpdate = IndexeddbHelper.update(dbName,tableName,keyPath,data,callback)
				    promisUpdate.done(function(){ $d.resolve()});
				}
			    }
		    );
		    return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});

	//Select FirstOnek
	Object.defineProperty(IndexeddbHelper, 'update', {
		value:function(dbName,tableName,keyPath,data,callback){
		    var $d = $.Deferred();
		    var request = indexedDB.open(dbName);
		    request.onsuccess = function(event) {
			var db = request.result;
			var transaction = db.transaction([tableName], "readwrite");
			transaction.oncomplete = function(event) {
		    		db.close();
				$d.resolve();
			};
			transaction.onerror = function(event) {
		    		db.close();
				$d.resolve();
			};
			var objectStore = transaction.objectStore(tableName);
			var objectStoreRequest = objectStore.put(data);//,keyPath
			objectStoreRequest.onsuccess = function(event) {
			    	if(callback){callback(data,keyPath);}
		    		db.close();
				$d.resolve();
			};
			objectStoreRequest.onerror = function(event) {
		    		db.close();
		    		$d.resolve();
			};
		    }
		    return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	Object.defineProperty(IndexeddbHelper, 'isMutch', {
		value:function(value,condetions){
			if(condetions=== undefined || condetions === null){
				return false;
			}
			if(Array.isArray(condetions)){
				for(var index in condetions ){
					var condition = condetions[index];
					if(IndexeddbHelper.isMutch(value,condition)){
						return true;
					}
				}
				return false;
			}else {
				for(var key in condetions){
					var condition = condetions[key];
					if(typeof condition === 'object'){
						if(IndexeddbHelper.isMutch(value,condition)){
							return true;
						}
					}else{
						var target = value[key];
						if(value[key] !== condetions[key]){
							return false;
						}
					}
				}
				return true;
			}
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//Delete
	Object.defineProperty(IndexeddbHelper, 'deleteWithRange', {
			value:function(dbName,tableName,range,condetions,callback){
				var list = [];
				var $d = $.Deferred();
				IndexeddbHelper.getKeyPath(dbName,tableName);
				var request = indexedDB.open(dbName);
				request.onsuccess = function(event) {
					var db = event.target.result;
					var objectStore =  db.transaction(tableName).objectStore(tableName);
					var req = range === undefined ? objectStore.openCursor() : objectStore.openCursor(range);
					req.onsuccess = function(event) {
					var cursor = event.target.result;
						if (cursor) {
							var value = cursor.value;
							if(IndexeddbHelper.isMutch(value,condetions)){
								var objectStoreRequest = objectStore.delete(cursor.key);
								objectStoreRequest.onsuccess = function (event) {
									if(callback){callback(data,keyPath);}
									db.close();
									$d.resolve();
								}
								objectStoreRequest.onerror = function(event) {
									db.close();
									$d.resolve();
								};
							}
							cursor.continue();
						} else {
							db.close();
							$d.resolve();
						}
					};
					req.onerror = function(e) {
						console.log("erroerror!!!!!!!!!!!!!!!!!"+e);
						db.close();
						$d.resolve();
					};
				};
				request.onabort = function(e) {
					console.log("erroeobjrror!!!!!!!!!!!!!!!!!"+e);
					$d.resolve();
				};
				request.onerror = function(e) {
					console.log("erroerror!!!!!!!!!!!!!!!!!"+e);
					console.log(e);
					$d.resolve();
				};
				var promise = $d.promise();
				promise.done(function(){callback(list);})
				return promise;
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//Delete
	Object.defineProperty(IndexeddbHelper, 'delete', {
		value:function(dbName,tableName,keyPath,callback){
			var $d = $.Deferred();
			var request = indexedDB.open(dbName);
			request.onsuccess = function(event) {
			    	var db = request.result;
				var transaction = db.transaction([tableName], "readwrite");
				transaction.oncomplete = function(event) {
			    		db.close();
					$d.resolve();
				};
				transaction.onerror = function(event) {
			    		db.close();
					$d.resolve();
				};
				var objectStore = transaction.objectStore(tableName);
				// console.log("delete keyPath:"+keyPath);
				var objectStoreRequest = objectStore.delete(keyPath+"");
				objectStoreRequest.onsuccess = function (event) {
				    	if(callback){callback(data,keyPath);}
			    		db.close();
					$d.resolve();
				}
				objectStoreRequest.onerror = function(event) {
			    		db.close();
			    		$d.resolve();
				};
			}
			return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//truncate
	Object.defineProperty(IndexeddbHelper, 'truncate', {
		value:function(dbName,tableName){
		    var request = indexedDB.open(dbName);
		    var $d = $.Deferred();
		    request.onsuccess = function(event) {
			var db = request.result;
			var transaction = db.transaction([tableName], "readwrite");
			transaction.oncomplete = function(event) {
			    db.close();
			    $d.resolve();
			};
			transaction.onerror = function(event) {
		    		db.close();
		    		$d.resolve();
			};
			var objectStore = transaction.objectStore(tableName);
			var objectStoreRequest = objectStore.clear();
			objectStoreRequest.onsuccess = function(event) {
		    		db.close();
			    $d.resolve();
			};
		    };
		    return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//createStore
	Object.defineProperty(IndexeddbHelper, 'createStore', {
		value:function(dbName,tableName,keyPath,isAutoIncrement){
		    var $d = $.Deferred();
		    // console.info("Object Store try create !"+tableName);
		    IndexeddbHelper.getCurrentVersion(dbName,function(version){
		    	var newVersion = (version*1)+1;//計算結果を変数に代入すると行ける。
			var request = indexedDB.open(dbName,newVersion);
			request.onerror = function(event) {//すでに有る場合
				var db = event.target.result;
				console.log("Why didn't you allow my web app to use IndexedDB?!");
				$d.resolve();
			};
			request.onsuccess = function(event) {
				var db = event.target.result;
				db.close();
				$d.resolve();
			};
			request.onupgradeneeded = function(event) {
				var db = event.target.result;
				// Create an objectStore for this database
				var objectStore = db.createObjectStore(tableName, { keyPath: keyPath});
				db.close();
				$d.resolve();
			};
		    });
		    return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//DropStore
	Object.defineProperty(IndexeddbHelper, 'dropStore', {
		value:function(dbName,tableName){
			var $d = $.Deferred();
	    	// console.info("Object Store try delete !"+tableName);
			IndexeddbHelper.getCurrentVersion(dbName,function(version){
			    	var newVersion = (version*1)+1;//計算結果を変数に代入すると行ける。
				var request = indexedDB.open(dbName,newVersion);
				request.onsuccess = function(event) {
					var db = event.target.result;
					db.close();
			    		$d.resolve();
				};
				request.onupgradeneeded = function(event) {
					var db = event.target.result;
					db.deleteObjectStore(tableName);
			    		db.close();
			    		$d.resolve();
				};
				request.onerror = function(e) {
			    		$d.resolve();
				};
			});
			return $d.promise();
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	//IDを生成
	Object.defineProperty(IndexeddbHelper, 'buildKeyPath', {
		value:function(key1,key2,key3,key4,key5){
			var array = [];
			if(key1!==undefined){
				array.push((key1+"").split("&").join("&amp;").split(".").join("&#046;"));
			}
			if(key2!==undefined){
				array.push((key2+"").split("&").join("&amp;").split(".").join("&#046;"));
			}
			if(key3!==undefined){
				array.push((key3+"").split("&").join("&amp;").split(".").join("&#046;"));
			}
			if(key4!==undefined){
				array.push((key4+"").split("&").join("&amp;").split(".").join("&#046;"));
			}
			if(key5!==undefined){
				array.push((key5+"").split("&").join("&amp;").split(".").join("&#046;"));
			}
			return array.join("");
		},
		enumerable:false,
		writable:false,
		configurable:true
	});
	return IndexeddbHelper;
}
