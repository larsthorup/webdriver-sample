var selenium = require('selenium-standalone');

// spawnOptions defaults to `{ stdio: 'inherit' }`
var spawnOptions = { stdio: 'pipe' };

// options to pass to `java -jar selenium-server-standalone-X.XX.X.jar`
// seleniumArgs defaults to `[]`
var seleniumArgs = [
    '-debug'
];

var server = selenium(spawnOptions, seleniumArgs);
// or, var server = selenium();
// returns ChildProcess instance
// http://nodejs.org/api/child_process.html#child_process_class_childprocess

server.stdout.on('data', function(output) {
    console.log(output);
});

var webdriverio = require('webdriverio');

var webdriverOptions = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

webdriverio
.remote(webdriverOptions)
.init()
.url('http://www.google.com')
.title(function(err, res) {
    console.log('Title was: ' + res.value);
})
.end();