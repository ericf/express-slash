var parseURL = require('url').parse;

module.exports = function (statusCode) {
    statusCode || (statusCode = 301);

    return function (req, res, next) {
        var method = req.method.toLowerCase(),
            hasSlash, match, pathname, routes, slash, url;

        // Skip when the request is neither a GET or HEAD.
        if (!(method === 'get' || method === 'head')) {
            next();
            return;
        }

        routes = req.app.routes[method];

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
