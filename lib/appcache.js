/*jslint node: true*/
"use strict";

module.exports = function (app) {

    //Cache all public files
    var files = require('wrench').readdirSyncRecursive('./public'),
        fs = require('fs'),
        remove = function (files) {
            var i, file, stat;
            for (i = 0; i < files.length; i += 1) {
                file = files[i];
                stat = fs.statSync("./public/" + file);
                //Don't add directories and generated files to appcache
                if (stat.isDirectory() || file.indexOf('.DS_Store') !== -1) {
                    files.splice(i, 1);
                    remove(files);
                    break;
                }
            }
        };
    
    remove(files);
    
    //Don't cache anything more
    files.push('NETWORK:\n*');
    
    require('appcache-node')({files: files}, app);
};