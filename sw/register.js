/*
    Service Worker Registration
*/

var docTitle = "snos";


function registerSW(){
    if (navigator.serviceWorker){
        navigator.serviceWorker.register('sw.js').then(function() {
            console.log("Registration worked.");
        }).catch(function(){
            console.log("Registration failed");
        });
        
        
    } else {
        console.log("Service Worker unavailable.");
    }
}

registerSW();
