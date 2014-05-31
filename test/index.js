'use strict';

var express = require('express');
var slash = require(__dirname + '/../');
var request = require('supertest');
var app;

beforeEach(function () {

    var response = function (req, res) {
        res.send('done.')
    };

    app = express();

    app.set('strict routing');
    app.use(slash());

    app.get('/slash/', response);
    app.put('/slash/', response);
    app.post('/slash/', response);
    app.get('/noslash', response);
});

it('adds slashes when they are needed', function (done) {
    request(app)
        .get('/slash')
        .expect('location', '/slash/')
        .expect(301, done);
});

it('removes slashes when they are not needed', function (done) {
    request(app)
        .get('/noslash/')
        .expect('location', '/noslash')
        .expect(301, done);
});

it('only works with GET requests', function (done) {
    request(app).put('/slash').expect(404, function () {
        request(app).post('/slash').expect(404, done);
    });
});

it("doesn't do anything if the requested method doesn't have any routes", function (done) {
    request(app)
        .head('/slash')
        .expect(404, done);
});


it("doesn't do anything if the requested route is correct", function (done) {
    request(app)
        .get('/slash/')
        .expect(200, done);
});
