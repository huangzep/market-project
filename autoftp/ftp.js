var fs = require('fs');
var path = require('path');
var Client = require('ftp');
var destPath = require('./config').staticf;
var project = '/act/wap/dist/static/'
var totalFiles = 0
var sendFiles = 0

var ftp = new Client();

ftp.on('ready', function () {
	console.log('------------------------------------------------------')
	console.log('publishing Static source directory...\n\n')
	read()
})

ftp.on('error', function (err) {
	console.log(err, 'error')
})

ftp.connect(destPath)


function read() {
	var dirs = fs.readdirSync(path.resolve('dist/static/'))
	while(dirs.length) {
		var dir = dirs.shift()
		var files = fs.readdirSync(path.resolve('dist/static/' + dir))
		send(dir, files)
	}
}

function send(dir, files) {
	totalFiles += files.length
	while(files.length) {
		var file = files.shift()
		console.log(file)
		ftp.put(path.resolve('dist/static/' + dir + '/' + file), project + dir + '/' + file, function(err) {
	    if (err) throw err;
	    end()
	  });
	}
}

function end() {
	sendFiles++;
	if (sendFiles === totalFiles) {
		console.log('------------------------------------------------------')
		console.log('publishing successfully\n\n')
		ftp.end()
	}
}