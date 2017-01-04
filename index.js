let path = require('path');
let walk = require('walk');
const fs = require('fs');
let files   = [];

// Walker options
let walker  = walk.walk('/Users/Mikko/vilkas/temp_repos/FI_VILKAS', { followLinks: false });

walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    // console.log(path.extname(stat.name));
    if(path.extname(stat.name) == '.html') {
      files.push(root + '/' + stat.name);
    }
    next();
});

walker.on('end', function() {
    // console.log(files);
    files.forEach(file => {
      // console.log(file);
      // let $ = cheerio.load('<h2 class="title">Hello world</h2>');
      fs.readFile(file, function () {
      // doStuff 
        console.log("moro");
        next();
      });
    });
});

let cheerio = require('cheerio');
let $ = cheerio.load('<h2 class="title">Hello world</h2>');

$('h2.title').text('Hello there!');
$('h2').addClass('welcome');

$.html();
//=> <h2 class="title welcome">Hello there!</h2>


// const testFolder = '/Users/Mikko/vilkas/temp_repos/FI_VILKAS';
// const fs = require('fs');
// fs.readdir(testFolder, (err, files) => {
//   files.forEach(file => {
//     console.log(file);
//   });
// })


// fs.readFile(fileStats.name, function () {
//       // doStuff 
//       next();
//     });