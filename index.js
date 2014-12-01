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
  return new PluginError('gulp-join-data', message);
}


module.exports = function processFiles(_opts) {
  var defaults = {
      fileName: "data.json",
      dest: "./",
      bases: ["en"]
    },
    opts = _.extend({}, defaults, _opts),
    data = {};



  function write (file) {

    if (file.isNull()) return;
    if (file.isStream()) return this.emit('error', pluginError('Streaming not supported'));
    var basename = path.basename(file.path, ".json");

    var dirs = _.compact(
      path.relative(opts.dest, file.path)
        .split(path.sep)
        .map(function(dir, i){
          return opts.bases.concat([".."]).indexOf(dir) > -1? false : dir;
        })
    );

    dirs.pop();
    dirs.push(basename);

    var level = data;
    //make sure directories have object depth
    dirs.forEach(function(dir){
      level[dir] = level[dir] || {};
      level = level[dir];
    });

    level = _.extend(level, JSON.parse(file.contents));

  }

  function end () {
    this.queue(new File({
      path: opts.fileName,
      contents: new Buffer(JSON.stringify(data))
    }));

    this.queue(null);
  }

  return through(write, end);
};