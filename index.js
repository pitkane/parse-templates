let path = require('path');
let walk = require('walk');
const fs = require('fs');
let files = [];
let cheerio = require('cheerio');

// Walker options
let walker = walk.walk('/Users/Mikko/vilkas/temp_repos/FI_VILKAS', {
	followLinks: false
});

// collect all the files for scraping
walker.on('file', function (root, stat, next) {
	// Add this file to the list of files
	// console.log(path.extname(stat.name));
	if (path.extname(stat.name) == '.html') {
		files.push(root + '/' + stat.name);
	}
	next();
});

let htmlData = [];

// scrape
walker.on('end', function () {
	// console.log(files);
	files.forEach(file => {

		let readFile = fs.readFileSync(file);

		var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
		var match;
		while (match = re.exec(readFile)) {
			// full match is in match[0], whereas captured groups are in ...[1], ...[2], etc.
			// console.log(match[0]);
			let json = {
				filename: file,
				data: match[1]
			};
			json.data = json.data.replace("//<![CDATA[","");
			json.data = json.data.replace("//]]>","");
			// console.log(json.data)
			htmlData.push(json);
		
		}
		// let $ = cheerio.load(fs.readFileSync(file), {
		// 	// normalizeWhitespace: true,
		// 	// decodeEntities: true
		// });
		// $('script').each(function (i, elem) {
		// 	console.log(elem);
		// 	let json = {
		// 		filename: file,
		// 		data: $(this).html()
		// 	};
		// 	json.data = json.data.replace("//<![CDATA[","");
		// 	json.data = json.data.replace("//]]>","");
		// 	// console.log(json.data)
		// 	htmlData.push(json);
		// });
	});

	// console.log(htmlData);
	let startHTML = fs.readFileSync('./boilerplate_start.html');
	let endHTML = fs.readFileSync('./boilerplate_end.html');
	fs.writeFile("./output.html", startHTML, function (err) {
		if (err) {
			return console.log(err);
		}
	});

	htmlData.forEach(function(element) {
		let html = "<h2>" + element.filename + "</h2>";
		html += "<pre><code class='js'>";
		html += element.data;
		html += "</code></pre>";
		// buildHTML('#content').append(html);
		fs.appendFile('./output.html', html, function (err) {
			// return console.log(err);
	    });
	});

	fs.appendFile('./output.html', endHTML, function (err) {
			// return console.log(err);
	    });

	// buildHTML('#content').text('Hello there!');
	// console.log(buildHTML.html());

	// fs.writeFile("./output.html", buildHTML.html(), function (err) {
	// 	if (err) {
	// 		return console.log(err);
	// 	}
	// 	console.log("The file output.html was saved!");
	// });

});





			// console.log(elem)
			// $string = str_replace("//<![CDATA[","",$string);
			// $string = str_replace("//]]>","",$string);
			// console.log();
			// console.log(elem.html());







// console.log(file);
// let $ = cheerio.load('<h2 class="title">Hello world</h2>');
// fs.readFile(file, function () {
// // doStuff 
//   console.log("moro");
//   // next();
// });


// $.html();
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