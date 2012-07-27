require('js-yaml');

var kittens = require(__dirname + '/../data/kittens.yml');

function getIdFromKitten(kitten) {
    var url   = kitten.url,
        parts = url.split('/');

    // Returns the last path segment which is not an empty string. This supports
    // URLs with trailing slashes.
    return parts[parts.length - 1] || parts[parts.length - 2];
}

module.exports = {
    getKittenById: function (id) {
        var kitten = null;

        kittens.some(function (k) {
            var kid = getIdFromKitten(k);

            if (kid === id) {
                kitten = k;
                return true;
            }
        });

        return kitten;
    },

    randomKitten: function () {
        var kitten = kittens[Math.floor(Math.random() * kittens.length)];

        kitten.id = getIdFromKitten(kitten);

        return kitten;
    }
};
