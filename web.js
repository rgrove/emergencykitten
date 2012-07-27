var express = require('express'),
    kittens = require('./lib/kittens');

var app = express();

app.engine('handlebars', require('./lib/handlebars-engine'));

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.redirect('/' + kittens.randomKitten().id);
});

app.get('/:kitten', function (req, res) {
    var kitten = kittens.getKittenById(req.params.kitten);

    if (kitten) {
        res.render('index', {kitten: kitten});
    } else {
        res.send(404);
    }
});

var port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log('Listening on port ' + port);
});
