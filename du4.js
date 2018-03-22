const http = require("http");
const storage = require("./storage").storage;

const DELETION_TIMEOUT = 5000;//TODO leave at 10000

http.createServer(function (req, res) {
    // log request object
    console.log("\nIncoming request: " + req.method + " " + req.url);

    console.log("customers in storage:");
    console.log(storage.customers);
    console.log();

    // initialize the body to get the data asynchronously
    req.body = "";

    // get the data of the body
    req.on('data', function (chunk) {
        req.body += chunk;
        console.log("adding data");
    });

    // all data have been received
    req.on('end', function () {
        if (req.method === "DELETE") {
            processDeleteRequest(req, res);
            res.end();
        } else if (req.method === "GET") {
            res.writeHead(processGetRequest(req));
            res.end();
        } else {
            res.writeHead(405);
            console.log("method not allowed");
            res.end('bad request');
        }
    });

    function confirmDeletion(id) {
        console.log("Waiting for confirmation...\n");
        setTimeout(afterDeletionConfirmed(id), DELETION_TIMEOUT)
    }

    function afterDeletionConfirmed(id) {
        return function () {
            console.log("confirmed, deleting customer with id: " + id);
            if (storage.deleteCustomerById(id)) {
                console.log("successfully deleted " + id);
                storage.closeRequestByCustomerId(id);
            } else {
                console.log(id + " already deleted");
            }
            console.log("remaining customers:");
            console.log(storage.customers);
            console.log();
            console.log("remaining requests:");
            console.log(storage.requests);
            console.log();
        }
    }

    function processDeleteRequest(req, res) {
        let subQuery = req.url.match("^/customer/(\\d+)?$");
        let id = parseInt(subQuery[1]);

        if (!isNaN(id)) {
            let i = storage.getCustomerIndex(id);
            if (i === null) {
                console.log("book with id " + id + " not found");
                res.writeHead(404);
            } else {
                console.log("Deleting customer with id " + id + "...");
                let reqId = storage.createDeleteRequest(id);
                confirmDeletion(id); // this will be done asynchronously
                res.writeHead(202, {'Location': '/request/' + reqId});
            }
        } else {
            console.log("bad request");
            res.writeHead(400);
        }
    }

    function processGetRequest(req) {
        let i = storage.getCustomerIndex(id);
        if (i === null) {
            console.log("book with id " + id + " not found");
            return 404;
        } else {
            console.log("Deleting customer with id " + id + "...");
            confirmDeletion(id); // this will be done asynchronously
            return 202;
        }
    }
}).listen(8080);
