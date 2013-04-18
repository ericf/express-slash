var parseURL = require('url').parse;

module.exports = function (statusCode) {
    // Force a permanent redirect, unless otherwise specified.
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
        hasSlash = pathname.charAt(pathname.length - 1) === '/';

        // Adjust the URL's path by either adding or removing a trailing slash.
        pathname = hasSlash ? pathname.slice(0, -1) : (pathname + '/');

        // Look for matching route.
        match = routes.some(function (r) {
            return r.match(pathname);
        });

        if (match) {
            res.redirect(statusCode, pathname + search);
        } else {
            next();
        }
    };
};
