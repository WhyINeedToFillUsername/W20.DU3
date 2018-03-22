const http = require("http");
const storage = require("./storage").storage;

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
            res.writeHead(processRequest(req));
            res.end();
        } else {
            res.writeHead(405);
            console.log("bad request");
            res.end('bad request');
        }
    });

    function confirmDeletion(id) {
        console.log("Waiting for confirmation...\n");
        setTimeout(function () {
            console.log("confirmed, deleting customer with id: " + id);
            if (storage.deleteCustomerById(id)){
                console.log("successfully deleted " + id);
            } else {
                console.log(id + " already deleted");
            }
            console.log("remaining customers:");
            console.log(storage.customers);
            console.log();
        }, 10000)
    }

    function processRequest(req) {
        let subQuery = req.url.match("^/customer/(\\d+)?$");
        let id = parseInt(subQuery[1]);

        if (!isNaN(id)) {
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
        console.log("bad request");
        return 400;
    }
}).listen(8080);
