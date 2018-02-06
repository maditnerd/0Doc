// IDB: https://gist.github.com/BigstickCarpet/a0d6389a5d0e3a24814b
document.title = `${docTitle} - LOCAL`;
if (navigator.serviceWorker){
    console.log("Generate HTML from indexed DB");
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    dbConnection = indexedDB.open(docTitle, 1);

    dbConnection.onsuccess = function(){
        console.log("... connected to database");
        db = dbConnection.result;
        var tx = db.transaction("page");
        var store = tx.objectStore("page");
        var content = store.get("content");
        var left = store.get("left");
        
        content.onsuccess = function() {
            console.log("Generating Content");
            document.getElementById("content").innerHTML = content.result;
            $('#content').show();
            
        };

        left.onsuccess = function() {
            console.log("Generating Left");
            document.getElementById("left").innerHTML = left.result;
        };

        tx.oncomplete = function() {
            console.log("Transaction Complete");
            initSearch();
            db.close();
        };
    };
}



