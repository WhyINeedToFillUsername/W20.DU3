# W20.DU4
Homework 4 of the W20 class at FIT CTU.

## How to run
This is a node.js server. Simply run by command ``node du4.js``.

## Assignment - RESTfull - Asynchronous operation

Design and implement simple service - remove customer from your database.

``DELETE /customer/{id}``

Assume that this operation requires confirmation by human. It should not be implemented as synchronous operation. Design and implement this operation in an asynchronous manner. You can simulate the confirmation as delay 10s or implement another service to confirm deletion.

Use http://nodejs.org and [http module](http://nodejs.org/api/http.html).
