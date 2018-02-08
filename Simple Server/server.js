"use strict";

// Importing Libraries
const http = require('http');
const fs = require('fs');
const path = require('path');

// Port definition
const PORT = 8008;

function serveIndex(filePath, req, res) {
    console.log(`${filePath} is a directory.`);

    var indexExists = false;

    fs.readdir(filePath, function(err, files) {
        if(err) {
            console.error(err);
            res.statusCode = 500;
            res.end("Server Error: Could not read file.");
        } 
        for (let item of files) {
            console.log(item);
            if (item === 'index.html') {
                serveFile(path.join(filePath, 'index.html'), res);
                indexExists = true;
                return;
            }
        }
        if (!indexExists) {
            var html = "<p>Index of " + filePath + "</p>";
            html += "<ul>";
            html += files.map(function(item) {
                return "<li><a href='" + req.url + '/' + item + "'>" + item + "</a></li>";
            }).join("");
            html += "</ul>";
            res.end(html);
        }
    });
}

function serveFile(filePath, res) {
    console.log(`${filePath} is a file.`);
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
    // This is a pretty general "catch-all" for any error that may occur when determining if a file exists. I believe this is sufficient enough for this assignment.
    // The following checks if the path is a directory, then a file, then if the file even exists and handles each possibility as such.
    fs.stat(path.join('public', req.url), function(err, stats) {
        
        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
            console.log('favicon requested');
            return;
        }

        if(stats.isDirectory()) {
            serveIndex(path.join('public', req.url), req, res);
        }

        if(stats.isFile()) {
            serveFile(path.join('public', req.url), res);
        }
        
        if (err) {
            console.error(err);
            res.statusCode = 404;
            res.end("404: file could not be found.");
        }
    });
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});
