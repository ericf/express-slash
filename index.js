var parseURL = require('url').parse;

module.exports = function (statusCode) {
    statusCode || (statusCode = 301);

    return function (req, res, next) {
        var routes = req.app.routes[req.method.toLowerCase()],
            url, pathname, search, match;

        // Skip when no routes for the request method.
        if (!routes) {
            next();
            return;
        }

        url      = parseURL(req.url);
        pathname = url.pathname;
        search   = url.search || '';

        // Skip when the path already has a trailing slash.
        if (pathname.charAt(pathname.length - 1) === '/') {
            next();
            return;
        }

        // Look for matching route.
        match = routes.some(function (r) {
            return r.match(pathname + '/');
        });

        if (match) {
            res.redirect(statusCode, pathname + '/' + search);
        } else {
            next();
        }
    };
};
