#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');

var busboy = require('connect-busboy');
var connect = require('connect');
var express = require('express');


main();

function main() {
    var uploadDir = path.join(__dirname, 'uploads');
    var app = express();

    var port = process.env.PORT || 3000;
    var halfDay = 43200000;

    app.use(busboy({immediate: true}));
    app.use(express['static'](path.join(__dirname, 'public')), {
        maxAge: halfDay
    });

    var env = process.env.NODE_ENV || 'development';
    if(env === 'development') {
        app.use(connect.errorHandler());
    }

    app.post('/upload', function(req, res) {
        if(!req.busboy) {
            return res.send(500);
        }

        req.busboy.on('file', function(fieldname, file) {
            var p = path.join(uploadDir, fieldname);

            file.pipe(fs.createWriteStream(p));

            console.log('saved file to', p);

            res.send(200);
        });
    });

    process.on('exit', terminator);

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
    'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
    ].forEach(function(element) {
        process.on(element, function() { terminator(element); });
    });

    app.listen(port, function() {
        console.log('%s: Node (version: %s) %s started on %d ...', Date(Date.now() ), process.version, process.argv[1], port);
    });
}

function terminator(sig) {
    if(typeof sig === 'string') {
        console.log('%s: Received %s - terminating Node server ...',
            Date(Date.now()), sig);

        process.exit(1);
    }

    console.log('%s: Node server stopped.', Date(Date.now()) );
}
