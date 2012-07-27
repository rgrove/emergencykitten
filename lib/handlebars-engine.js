var fs         = require('fs'),
    fsPath     = require('path'),
    handlebars = require('handlebars'),

    cache = {};

function renderFile(path, options, callback) {
    var template = cache[path];

    if (options.cache && template) {
        return callback(null, template(options));
    }

    fs.readFile(path, 'utf8', function (err, contents) {
        if (err) {
            return callback(err);
        }

        var template;

        options.filename = path;

        try {
            template = handlebars.compile(contents, options);
        } catch (ex) {
            return callback(ex);
        }

        if (options.cache) {
            cache[path] = template;
        }

        callback(null, template(options));
    });
}

function renderWithLayout(layout, path, options, callback) {
    renderFile(path, options, function (err, result) {
        if (err) {
            return callback(err);
        }

        options.body = result;
        callback(null, layout(options));
    });
}

module.exports = function (path, options, callback) {
    if (options.layout === false) {
        // Don't use a layout.
        return renderFile(path, options, callback);
    }

    if (options.layout && !/\.handlebars$/.test(options.layout)) {
        options.layout += '.handlebars';
    }

    var layoutPath = fsPath.join(options.settings.views, 'layouts', options.layout || 'default.handlebars');
    var layout     = cache[layoutPath];

    if (layout) {
        return renderWithLayout(layout, path, options, callback);
    }

    fs.readFile(layoutPath, 'utf8', function (err, contents) {
        if (err) {
            return callback(err);
        }

        var layout;

        options.filename = layoutPath;

        try {
            layout = handlebars.compile(contents, options);
        } catch (ex) {
            return callback(ex);
        }

        if (options.cache) {
            cache[layoutPath] = layout;
        }

        renderWithLayout(layout, path, options, callback);
    });
};

exports.registerHelper = function () {
    handlebars.registerHelper.apply(handlebars, arguments);
};

exports.registerPartial = function () {
    handlebars.registerPartial.apply(handlebars, arguments);
};
