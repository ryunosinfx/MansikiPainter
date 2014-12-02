
define([
        'js/Util/DBUtil',
        'js/libs/indexdbWrapper',
        ]
	, function (DBUtil,indexdbWrapper) {
    	const STATUS ={NON_EDIT:0,NEW:1,UPDATE:2,SYNCED:4,DELETE:-1};
      //Util
    	//LinkedListにすることに寄って、何が実現するか。
    	//速度アップ？
    	//DBインターフェイスではないのか
    	//DB上にオブジェクトを保管、
    	//map上に保管するオブジェクトの形式
        // 本というフォーマットに展開する以上、フローが展開される。
        // 版図言う概念、しかしGiｔの実装はないわけで
        // Levelの指定が必要
    	/*
    	 * ｛
    	 * 	ID:ID,
    	 * 	onj:obj,
    	 * 	STATUS:STATUS 0:non_edeit,1:new,2:update,3:delete,9:error
    	 * 	version:version
    	 * }
    	 */
        var LinkedList = function(type){
            //type＝ObjectStoreName
            this.type = Object.prototype.toString.call(type).slice(8, -1);
            this.map = new Map();
            this.mapNext = new Map();
            this.isClear = false;
        };
        LinkedList.prototype={
        	newID:function(){//getNewID for DB
        	    if(this.idGenerator === undefined){
        		return DBUtil.getNewIdAs64();
        	    }
        	    return this.idGenerator();
        	},
        	setIdGenerator:function(idGenerator){//getNewID for DB
        	    this.idGenerator=idGenerator;//
        	},
        	set:function(index,obj){
        	    if(index === 0){
        		this.unshift(obj);
        	    }else if(index > this.mapNext.size){
        		this.push(obj);
        	    }else {
            	    	var pre = this.get(index-1);
            	    	var id = newID();
            	    	var nextId = this.mapNext.get(pre.id);
            	    	this.mapNext.set(pre.id,id);
            	    	this.mapNext.set(id,nextId);
            	    	this.map.set(id,{id:id,obj:obj,STATUS:STATUS.NEW});
        	    }
        	},
        	is:function (type, obj) {
        	    var clas = Object.prototype.toString.call(obj).slice(8, -1);
        	    return obj !== undefined && obj !== null && clas === type;
        	},
        	get:function(index){
        	    var first	= this.getFirst();
        	    if(index===0 ){
        		return first;
        	    }
        	    var id = first.id;
        	    var count = this.mapNext.size;
        	    for(var i = 0 ;i < count ; i++){
        		id = this.mapNext.get(id);
        		if(index === i){
        		    return this.map(id);
        		}
        	    }
        	    return undefined;
        	},
        	getFirst:function(){//OK
        	    var keySet = new Set();
        	    for(var [key ,value] of this.mapNext){
        		if(value !== undefined ){
        		    keySet.add(key);
        		}
        	    }
        	    for(var [key ,value] of this.mapNext){
        		if(keySet.has(key) == false){
        		    return this.map(key);
        		}
        	    }
        	    return undefined;
        	},
        	getLast:function(){//OK
        	    for(var [key ,value] of this.mapNext){
        		if(value === undefined){
        		    return this.map.get(key);
        		}
        	    }
        	},
        	pop:function(index){//OK
        	    var id = newID();
        	    var last = this.getLast();
        	    this.map.delete(last.id);////要書き換え
        	    this.mapNext.delete(last.id);
        	    var lastSecond = this.getLast();
        	    this.mapNext.set(lastSecond.id,undefined);
        	    last.STATUS = STATUS.DELETE;
        	    lastSecond.STATUS = STATUS.UPDATE;
        	    return last.obj;
        	},
        	shift:function(){//OK
        	    var id = newID();
        	    var first = this.getFirst();
        	    this.map.delete(first.id);////要書き換え
        	    this.mapNext.delete(first.id);
        	    first.STATUS = STATUS.DELETE;
        	    return first.obj;

        	},
        	unshift:function(obj){//OK
        	    var id = newID();
        	    this.map.set(id,{id:id,obj:obj,STATUS:STATUS.NEW});
        	    var first = this.getFirst();
        	    this.mapNext.set(id,first.id);
        	},
        	push:function(obj){//OK
        	    var id = newID();
        	    var last = this.getLast();
        	    this.mapNext.set(last.id,id);
        	    last.STATUS = STATUS.UPDATE;
        	    this.map.set(id,{id:id,obj:obj,STATUS:STATUS.NEW});
        	},
        	remove:function(index){//OK
        	    var size = this.size();
        	    if(index >= size){
        		this.pop();
        	    } else if (index <= 0){
        		this.shift();
        	    }else{
        		var pre = this.get(index -1);
        		var current = this.get(index);
            	    	var nextId = this.mapNext.get(current.id);
            	    	this.mapNext.delete(current.id);
            	    	this.mapNext.set(pre.id,nextId);
            	    	this.map.delete(current.id);//ここを修正
            	    	//////////
            	    	pre.STATUS = STATUS.UPDATE;
            	    	current.STATUS = STATUS.DELETE;
            	    	//////////
        	    }
        	},
        	clear:function(){//OK
            	    this.mapNext.clear();
            	    this.map.clear();
            	    this.isClear = true;
        	},
        	getSortedList:function(){//OK
        	    var list = [];
        	    var first = this.getLast();
        	    var keySet = new Set();
        	    var size = this.mapNext.size;
        	    var id = first.id ;
        	    for(var i = 0;i< size ;i++){
        		var current = this.map.get(id);
        		list.push(current.obj);
        		id = this.mapNext.get(id);
        	    }
        	    return list;
        	},
        	setDBAccesser:function(idbw){
        	    this.idbw = idbw;//DBは既に設定済み
        	},
        	//以下DBバインディング、ここでDBのバージョンを知りたいが無理そう。
        	//他のマシーンからの同期要求があるので、使用するバージョンはIndexedDBのバージョンとは異なったほうがいい。
        	//多分に、UNIXタイム、マシン名、ユーザID、最大のIDとかでバージョン切るのが正しい？（どっちが新しいか知る必要がある。）
        	flashDB:function(){//DB同期
        	    this.isClear = false;
        	    //何がしたい？
        	    //DBと認識を合わせたい。
        	    //洗い替えが正しいのか
        	    //→一度削除して全部やる？いやちがうよね必要なやつだけ出せばいいんだよね。

        	},
        	loadDB:function(){//初回起動以外で呼ぶことはない
        	    this.idbw.selectAll(this.type);

        	    return obj;
        	},
        	insertDB:function(){//dousuruno
        	    //IDは変わらないはず。

        	},
        	deleteDB:function(){//dousuruno
        	    //IDは変わらないはず。

        	},
        	updateDB:function(){//dousuruno
        	    //IDは変わらないはず。

        	}
        }


        return LinkedList;
});
