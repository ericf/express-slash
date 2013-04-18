var parseURL = require('url').parse;

module.exports = function (statusCode, forceNoSlash) {
    statusCode || (statusCode = 301);
    forceNoSlash || (forceNoSlash = false);

    return function (req, res, next) {
        var routes = req.app.routes[req.method.toLowerCase()],
            url, pathname, search, match, correctPath;

        // Skip when no routes for the request method.
        if (!routes) {
            next();
            return;
        }

        url         = parseURL(req.url);
        pathname    = url.pathname;
        search      = url.search || '';
        correctPath = (forceNoSlash) ? pathname.slice(0, -1) : pathname + '/'

        // Skip when the path already has the correct slash
        if (
            (!forceNoSlash && pathname.charAt(pathname.length - 1) === '/')
            || (forceNoSlash && pathname.charAt(pathname.length - 1) !== '/')
        ) {
            next();
            return;
        }

        // Look for matching route.
        match = routes.some(function (r) {
            return r.match(correctPath);
        });

        if (match) {
            res.redirect(statusCode, correctPath + search);
        } else {
            next();
        }
    };
};
