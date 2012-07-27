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

var port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log('Listening on port ' + port);
});
