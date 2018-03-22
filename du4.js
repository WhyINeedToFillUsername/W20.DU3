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

    function processRequest(req) {
        let subQuery = req.url.match("^/customer/(\\d+)?$");
        let id = parseInt(subQuery[1]);

        if (!isNaN(id)) {
            if (storage.deleteCustomerById(id)) {
                console.log("Deleted book with id " + id + ". Remaining customers:");
                console.log(storage.customers);
                return 204;
            } else {
                console.log("book with id " + id + " not found");
                return 404;
            }
        }
        console.log("bad request");
        return 400;
    }
}).listen(8080);
