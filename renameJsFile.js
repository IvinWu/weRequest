var fs = require('fs'),
    path = require('path'),
    dir = './src/util',
    match = RegExp('.js', 'g'),
    replace = '.ts',
    files;

files = fs.readdirSync(dir);

files.filter(function(file) {
  return file.match(match);
}).forEach(function(file) {
  var filePath = path.join(dir, file),
      newFilePath = path.join(dir, file.replace(match, replace));
    console.log({filePath, newFilePath})
  fs.renameSync(filePath, newFilePath);
});