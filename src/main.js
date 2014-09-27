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

client.init(capabilities, function (err, res) {
    console.log('Browser started');

    // Note: watch for URL changes
    urlTimer = setInterval(function () {
        client.url(function (err, res) {
            console.log('Url: ' + res.value);
        });
    }, 1000);

});


var listPageHandler = function (productNumber) {
    var product = $('li.products').eq(productNumber);
    var link = product.find('a.view-details');
    link[0].click();
};

client
.url('http://demos.telerik.com/kendo-ui/websushi/')
.title(function(err, res) {
    console.log('Page title: ' + res.value);
})
.pause(3000)
.execute(listPageHandler, 7)
.pause(3000, function () {
    clearInterval(urlTimer)
})
.end(function (err, res) {
    console.log('Browser closed');
    process.exit(0);
});
