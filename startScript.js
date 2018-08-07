var injectedScripts = [     
    'game.js'
];
var temp = document.head.getElementsByTagName("SCRIPT")[0];

injectedScripts.forEach(function (script) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(script);
    s.setAttribute("class", "ignoreScript")
    s.async = false;   
    document.head.insertBefore(s, temp);
});