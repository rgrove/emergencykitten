require('js-yaml');

var kittens = require(__dirname + '/../data/kittens.yml');

module.exports = {
    randomKitten: function () {
        return kittens[Math.floor(Math.random() * kittens.length)];
    }
};
