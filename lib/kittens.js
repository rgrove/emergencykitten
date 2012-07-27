require('js-yaml');

var crypto = require('crypto');

var kittens   = require(__dirname + '/../data/kittens.yml'),
    kittenMap = {};

// Generate a unique id for each kitten.
kittens.forEach(function (kitten) {
    var charCount = 8,
        sha       = crypto.createHash('sha1'),
        id, shortId;

    sha.update(kitten.url, 'utf8');

    id      = sha.digest('hex');
    shortId = id.substr(0, charCount);

    // Increase the length of the short id until it's unique.
    while (shortId in kittenMap) {
        shortId = id.substr(0, charCount += 1);
    }

    kitten.id = shortId;
    kittenMap[shortId] = kitten;
});

module.exports = {
    byId: function (id) {
        return kittenMap[id];
    },

    randomKitten: function () {
        return kittens[Math.floor(Math.random() * kittens.length)];
    }
};
