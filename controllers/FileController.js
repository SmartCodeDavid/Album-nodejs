var fs = require('fs');

//option => file or dir 
exports.readFiles = function(directoryPath, options, callback){
    var fileArray = [];
    fs.readdir(directoryPath, function(err, files){
        if(err) {
            callback(err);
            return;
        }
        if(files.length == 0) {
            callback(null, fileArray);
            return ;
        }
        files.forEach(function(file, index){
            fs.stat(directoryPath + file, function(err, stats){
                if(err) {
                    throw err;
                    return;
                }
                if(options == '*') {   //store everything
                    fileArray.push(file);
                }else if(options == 'file' && stats.isFile()){ //file
                    fileArray.push(file);
                }else if(options == 'dir' && stats.isDirectory()){              //dir
                    fileArray.push(file);
                }

                if(index + 1 == files.length) {
                    callback(null, fileArray);
                    return;
                }
            });
        });
    });
};