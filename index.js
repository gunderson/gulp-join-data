var gUtil = require('gulp-util');
var PluginError = gUtil.PluginError;
var File = gUtil.File;
var through = require('through');
var printf = require('util').format;
var path = require("path");
var fs = require("fs");
var _ = require("underscore");
var colors = require("colors");


/*
 * concatinates json data files and returns an object with all data
 *
 */


function pluginError (message) {
  return new PluginError('gulp-join-data', message)
}


module.exports = function processFiles(fileName, _opts) {
  if (!fileName) throw pluginError('Missing fileName')


  var defaults = {}
    , opts = _.extend({}, defaults, _opts)
    , data = {}

  function write (file) {
    if (file.isNull()) return
    if (file.isStream()) return this.emit('error', pluginError('Streaming not supported'))
    var basename = path.basename(file.path, ".json");
		data[basename] = JSON.parse(file.contents);
  }

  function end () {

  gUtil.log(data)
    this.queue(new File({
      path: fileName,
      contents: new Buffer(JSON.stringify(data))
    }))

    this.queue(null)
  }

  return through(write, end)
}