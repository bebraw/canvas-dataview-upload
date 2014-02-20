#!/usr/bin/env node

'use strict';

var path = require('path');

var express = require('express');


main();

function main() {
    var app = express();

    var port = process.env.PORT || 3000;
    var halfDay = 43200000;

    app.configure(function() {
        app.set('port', port);

        app.use(express.logger('dev'));

        app.use(express.urlencoded()); // needed for POST

        app.use(express['static'](path.join(__dirname, 'public'), {
            maxAge: halfDay
        }));

        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.post('/upload', function(req, res) {
        // TODO: catch data now and save it

        res.send(200);
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
