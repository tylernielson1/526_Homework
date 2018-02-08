"use strict"

// Importing Libraries
const http = require('http');
const fs = require('fs');
const path = require('path');

// Port definition
const PORT = 8008;

function serveIndex(filePath, res) {
    console.log("is directory");

    fs.readdir(filePath, function(err, files) {
        
    });
}

function serveFile(filePath, res) {
    // This is a pretty general "catch-all" for any error that may occur when determining if a file exists. I believe this is sufficient enough for this assignment.
    fs.stat(filePath, function(err, stats) {
        
        if(stats.isDirectory()) {
            console.log("is directory");
        }

        if(stats.isFile()) {
            console.log("is file");
        }
        
        if (err) {
            console.error(err);
            res.statusCode = 404;
            res.end("404: file could not be found.");
        }
    });

    fs.readFile(filePath, function(err, data) {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.end("Server Error: Could not read file.");
            return;
        }
        console.log(`Requesting file at path ${filePath} with extension ${path.extname(filePath)}`);
        var headerType = setTheHeader(path.extname(filePath));
        res.setHeader('Content-Type', headerType);
        res.end(data);
    });
}

function setTheHeader(extension) {
    switch(extension) {
        case '.html':
            return 'text/html';
            break;
        case '.css':
            return 'text/css';
            break;
        case '.js':
            return 'text/js';
            break;
        case '.jpeg':
        case '.jpg':
            return 'image/jpeg';
            break;
        case '.png':
            return 'image/png';
            break;
        case '.gif':
            return 'image/gif';
            break;
        default:
            return '';
            break;
    }
}

function handleRequest(req, res) {
    serveFile(path.join('public', req.url), res);
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});
