let path = require('path');
let walk = require('walk');
const fs = require('fs');

let cheerio = require('cheerio');
let Git = require("nodegit");
let rimraf = require("rimraf");

// print process.argv
// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });

if (process.argv[2] == null ) {
  console.log("No git repo given");
  return;
}

let gitRepo = process.argv[2];
let gitRepoHTTP = gitRepo.replace("git@github.com:", "https://github.com/") + "/blob/develop";
gitRepoHTTP = gitRepoHTTP.replace(".git", "");

console.log(gitRepo);
console.log(gitRepoHTTP);

_fetchRepo(gitRepo).then(function(result) {

  walkIt()
    .then(function(result) {
      // console.log(result);
      buildHTML(result);
      _cleanUp();
    });


});

function walkIt() {
  return new Promise(function(resolve, reject) {

    var localPath = require("path").join(__dirname, "tmp");

    // Walker options
    let walker = walk.walk(localPath, {
    	followLinks: false
    });

    var filesWTF = [];

    // collect all the files for scraping
    walker.on('file', function (root, stat, next) {
    	// Add this file to the list of files
    	// console.log(path.extname(stat.name));
    	if (path.extname(stat.name) == '.html') {
    		filesWTF.push(root + '/' + stat.name);
        // console.log(root + '/' + stat.name);
    	}
    	next();
    });

    walker.on("end", function () {
      // console.log("all done");
      // console.log("We should have files");
      // console.log(filesWTF);
      resolve(filesWTF);

    });


  });
}


function buildHTML(files) {
  let htmlData = [];
  // console.log(files);
  // scrape

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

    let toBeRemoved = require("path").join(__dirname, "tmp");
    let url = element.filename.replace(toBeRemoved, "");
    url = gitRepoHTTP + url;
		let html = "<a href='" + url + "'><h2>" + element.filename + "</h2></a>";
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

}





function _fetchRepo(gitRepo) {
  return new Promise(function(resolve, reject) {

    var cloneOptions = {};
    cloneOptions.fetchOpts = {
      callbacks: {
        certificateCheck: function() { return 1; },

        // Credentials are passed two arguments, url and username. We forward the
        // `userName` argument to the `sshKeyFromAgent` function to validate
        // authentication.
        credentials: function(url, userName) {
          return Git.Cred.sshKeyFromAgent(userName);
        }
      }
    };

    console.log("Downloading repo, please wait");

    Git.Clone(gitRepo, "./tmp", cloneOptions)
      .then(function(repo) {
        console.log("jou");
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        reject();
      });

  });
}



function _cleanUp() {
  rimraf('./tmp', function() {
    console.log("All cleaned up");
  });
}


/*

// buildHTML('#content').text('Hello there!');
// console.log(buildHTML.html());

// fs.writeFile("./output.html", buildHTML.html(), function (err) {
// 	if (err) {
// 		return console.log(err);
// 	}
// 	console.log("The file output.html was saved!");
// });



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

*/


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
