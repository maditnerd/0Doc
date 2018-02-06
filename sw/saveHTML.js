// IDB: https://gist.github.com/BigstickCarpet/a0d6389a5d0e3a24814b
(function() {
if (navigator.serviceWorker){
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    dbConnection = indexedDB.open(docTitle, 1);
    console.log("Creating db");
    
    dbConnection.onupgradeneeded = function() {
        console.log("Generate db");
        var db = dbConnection.result;
        var store = db.createObjectStore("page");
    };

    dbConnection.onsuccess = function() {
        console.log("Generating page");
        // Start a new transaction
        var db = dbConnection.result;
        var tx = db.transaction("page", "readwrite");
        var store = tx.objectStore("page");

        // Forge page
        console.log("Forging HTML");
        html_content = document.getElementById("content").innerHTML;
        html_left = document.getElementById("left").innerHTML;
        store.put(html_content,"content");
        store.put(html_left,"left");
        
        // Close the db when the transaction is done
        tx.oncomplete = function() {
            console.log("Transaction Complete");
            db.close();
        };
    };
}

})();