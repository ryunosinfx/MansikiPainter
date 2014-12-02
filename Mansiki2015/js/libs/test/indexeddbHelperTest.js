var dbName ="test";
var tableName ="testosB";
var keyPath ="time";
var insertData={
	"1000":{"time":1000,"name":"i am test1"},
	"1100":{"time":1100,"name":"i am test2"},
	"1200":{"time":1200,"name":"i am test3"},
	"1300":{"time":1300,"name":"i am test4"}
};
var updateData={
	"1505":{"time":1000,"name":"i am test11"},
	"1605":{"time":1100,"name":"i am test21"},
	"1200":{"time":1201,"name":"i am test31"},
	"1300":{"time":1303,"name":"i am test41"},
	"1305":{"time":1600,"name":"i am test61"},
	"1405":{"time":1500,"name":"i am test51"}
};
var indexedDbHelper = getIndexeddbHelper($);
$(document).ready(function(){
	//alert("yaha!");
	var promise = indexedDbHelper.dropStore(dbName,tableName);
	promise.done(function(){
		var promise = indexedDbHelper.createStore(dbName,tableName,keyPath,false);
		
		//indexedDbHelper.dropStore(dbName,tableName);
		promise.done(function(){indexedDbHelper.truncate(dbName,tableName).done(stepA);});
		//promise.done(stepA);
	});
	
});
var stepA = function(){
    var promises = [];
    //insert 
    for(var index in insertData ){
	promises.push(indexedDbHelper.insertUpdate(dbName,tableName,keyPath,insertData[index]));
    }
    $.when.apply(null, promises).then(
            function(){
        	    var promises = [];
        	    //update
        	    for(var index in updateData ){
        		promises.push(indexedDbHelper.insertUpdate(dbName,tableName,keyPath,updateData[index]));
        	    }
        	    $.when.apply(null, promises).then(function(){stepB(); });
        	   // stepB();
            }
        );
}

var stepB = function(){
	var $d = $.Deferred();
    //select
    indexedDbHelper.selectAll(dbName,tableName,
	function(list){
	    for(var index in list ){
		console.log("list:"+(list[index]?JSON.stringify(list[index]):""));
	    }
	    $d.resolve();
    	}
    );
    $d.promise().done(function(){
		var callback = function(value){
	        	console.log("selectByKey:"+(value?JSON.stringify(value):""));
	            	$d.resolve();
	    	}
	    indexedDbHelper.selectByKey(dbName,tableName,1100,callback);
	    indexedDbHelper.selectByKey(dbName,tableName,1600,callback);
	    indexedDbHelper.selectByKey(dbName,tableName,1200,callback);
    	}
    );
    //delete
    indexedDbHelper.delete(dbName,tableName,1200).done(function(){
	    var range = indexedDbHelper.makeKeyRange(1200,1500);
	    indexedDbHelper.selectAll(dbName,tableName,
		function(list){
		    for(var index in list ){
			console.log("range list:"+(list[index]?JSON.stringify(list[index]):""));
		    }
		    $d.resolve();
		},range
	    );
    });
    
    //select
    
    //delete
    
    //select
}