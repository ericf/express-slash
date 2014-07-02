'use strict';

var parseURL = require('url').parse;

module.exports = expressSlash;

// -----------------------------------------------------------------------------

function expressSlash(statusCode) {
    // Force a permanent redirect, unless otherwise specified.
    statusCode || (statusCode = 301);

    return function (req, res, next) {
        var method = req.method.toLowerCase();

        // Skip when the request is neither a GET or HEAD.
        if (!(method === 'get' || method === 'head')) {
            next();
            return;
        }

        var url      = parseURL(req.url),
            pathname = url.pathname,
            search   = url.search || '',
            hasSlash = pathname.charAt(pathname.length - 1) === '/';

        // Adjust the URL's path by either adding or removing a trailing slash.
        pathname = hasSlash ? pathname.slice(0, -1) : (pathname + '/');

        // Look for matching route.
        var match = testStackForMatch(req.app._router.stack, method, pathname);

        if (match) {
            res.redirect(statusCode, pathname + search);
        } else {
            next();
        }
    };
}

function testStackForMatch(stack, method, path) {
    return stack.some(function (layer) {
        var route    = layer.route,
            subStack = layer.handle.stack;

        // It's only a match if the stack layer is a route.
        if (route) {
            return route.methods[method] && layer.match(path);
        }

        if (subStack) {
            // Recurse into nested apps/routers.
            return testStackForMatch(subStack, method, path);
        }

        return false;
    });
}
