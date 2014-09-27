var selenium = require('selenium-standalone');

// spawnOptions defaults to `{ stdio: 'inherit' }`
var spawnOptions = { stdio: 'pipe' };

// options to pass to `java -jar selenium-server-standalone-X.XX.X.jar`
// seleniumArgs defaults to `[]`
var seleniumArgs = [
//    '-debug'
];

var server = selenium(spawnOptions, seleniumArgs);
// or, var server = selenium();
// returns ChildProcess instance
// http://nodejs.org/api/child_process.html#child_process_class_childprocess

server.stderr.on('data', function (output) {
    var line = output.toString();
    // console.log(line);
    if(line.indexOf('Started SocketListener on 0.0.0.0:4444') > -1) {
        console.log('Selenium started');
    }
});

var webdriverio = require('webdriverio');

var webdriverOptions = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

var capabilities = {}; // Note: use defaults

var client = webdriverio.remote(webdriverOptions);
var urlTimer;
var currentUrl = '';

var startUrl = 'http://demos.telerik.com/kendo-ui/websushi/';
var endUrl = 'http://demos.telerik.com/kendo-ui/websushi/#/menu/8';

var sessionConfig = {
    productNumber: 7
};

var listPageHandler = function (sessionConfig) {
    var product = $('li.products').eq(sessionConfig.productNumber);
    var link = product.find('a.view-details');
    link[0].click();
};

var pageHandlers = {
    'http://demos.telerik.com/kendo-ui/websushi/': listPageHandler
};

client.init(capabilities, onBrowserStarted);

function onBrowserStarted () {
    console.log('Browser started');

    // Note: watch for URL changes
    urlTimer = setInterval(watchUrlChanged, 1000);

    // Navigate to start page
    client.url(startUrl);
}

function watchUrlChanged () {
    client.url(function (err, res) {
        var newUrl = res.value;
        if(newUrl != currentUrl) {
            console.log('Navigated to: ' + newUrl);
            currentUrl = newUrl;
            if(currentUrl === endUrl) {
                onDone();
            } else {
                onUrlChanged();
            }
        }
    });
}

function onUrlChanged() {
    var pageHandler = pageHandlers[currentUrl];
    if (pageHandler) {
        client
        .pause(2000)// ToDo: wait until page is ready
        .execute(pageHandler, sessionConfig);
    }
}

function onDone () {
    clearInterval(urlTimer);
    client.end(function () {
        console.log('Browser closed');
        process.exit(0);
    });
}
