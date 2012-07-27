var fs = require('fs');

// Parse the HTML data into an array of HTML strings.
var kittenHTML = fs.readFileSync(__dirname + '/../data/kittens.html', 'utf8');
var kittens    = kittenHTML.split(/^===\s*$/m);

module.exports = {
    randomKittenHTML: function () {
        return kittens[Math.floor(Math.random() * kittens.length)];
    }
};
