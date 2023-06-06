const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("qs");
const handlers = require("./src/controllers/main.controller");
const PORT = 8080

const router = {
    "/": handlers.displayDefault,
    "/info": handlers.displayInfo,
    "/add": handlers.add,
    "/update":handlers.update,
    "/delete":handlers.delete,
};
const server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true).pathname;
    let chosenHandlers;
    if (typeof router[parsedUrl] !== "undefined") {
        chosenHandlers = router[parsedUrl];
    } else {
        chosenHandlers = handlers.notFound;
    }
    chosenHandlers(req, res);
});
server.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:8080/`)
})