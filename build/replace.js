'use strict'
let fs = require('fs')
let path = require('path')

let manifest = fs.readFileSync(path.resolve(__dirname, '../dist/static/js/manifest.js'), 'utf8')
manifest = manifest.replace(/\.p="\/"/gm,'.p=window.staticurl+"act/wap/dist/"')
fs.writeFileSync(path.resolve(__dirname, '../dist/static/js/manifest.js'), manifest, 'utf8')
console.log('replace')