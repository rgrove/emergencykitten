var express = require('express'),
    kittens = require('./lib/kittens');

var app = express();

app.engine('handlebars', require('./lib/handlebars-engine'));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index', {
        kitten: kittens.randomKitten()
    });
});

app.get('/img/random', function (req, res) {
    res.redirect(302, kittens.randomKitten().imageUrl);
});

app.get('/img/:id', function (req, res, next) {
    var kitten = kittens.byId(req.params.id);

    if (!kitten) {
        return next();
    }

    res.redirect(302, kitten.imageUrl);
});

app.get('/kitten/:id', function (req, res, next) {
    var kitten = kittens.byId(req.params.id);

    if (!kitten) {
        return next();
    }

    res.render('index', {
        kitten: kitten
    });
});

// 404 handler (must come last)
app.get('*', function (req, res) {
    res.set('Status', 404);

    res.render('404', {
        kitten: kittens.randomKitten(),
        path  : decodeURIComponent(req.path),
        title : '404 Oh Noes!'
    });
});

var port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log('Listening on port ' + port);
});
