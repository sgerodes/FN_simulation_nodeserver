var fs = require("fs");

const http = require('http');
const url = require('url');

const possible_server_names = ["CRM", "BW", "RETAIL"]

let server_name = process.argv[2].toUpperCase()
if (!server_name || ! possible_server_names.includes(server_name) ) {
    console.log("Specify the server to start. Possible arguments = " + possible_server_names)
    return;
}

var newsletter_response = fs.readFileSync("./resources/newsletter/NewsletterSAPCRMResponse.json");
var order_BW_response = fs.readFileSync("./resources/orderHistory/BWresponse.json");
var order_RETAIL_response = fs.readFileSync("./resources/orderHistory/RetailResponse.json");
var order_list_response = fs.readFileSync("./resources/orderHistory/listResponse.json");


let body;
let created_newsletter_datas = {};
const id_regex = /(?<=identificationnumer=')\d+(?=')/gm;
let crm_server = (req, res) => {
    switch (req.method) {
            case 'PUT':
            case 'POST':
                if (body.length > 0){
                    let obj = JSON.parse(body);
                    let id = obj['identificationnumber'];
                    if (id.length = 0){
                        console.log("NO identificationnumber received!");
                    }
                    created_newsletter_datas[id] = obj;
                } else {
                    console.log("No body provided with the POST")
                }
                //res.statusCode = 404;
            case 'GET':
//                let id = find_id(req.url);
//                console.log("Id is id  " + id);
//                if (id.length > 0){
//                    let obj = JSON.stringify(created_newsletter_datas[id])
//                    if (obj.length > 0){
//                        res.end(obj);
//                    } else {
//                        res.statusCode = 404;
//                        res.end("{}");
//                    }
//                } else {
//                    console.log("Id not found in url");
//                }
                res.end(newsletter_response);
                //res.statusCode = 404;
                //res.end("{}");
                //res.end(body.substring(0 ,body.length-1) + ", bpid=0000152423}");
                break;
            case 'DELETE':
                res.statusCode = 200;
                //res.statusCode = 404;
                //res.end("{}");
                res.end();
                break;
            default: console.log("received request method not known: ", req.method);
    }
 }

let bw_server = (req, res) => {
     switch (req.method) {
             case 'GET':
                    res.end(order_BW_response);
                     break;
             default: console.log("received request method not known: ", req.method);
      }
 }

let retail_server = (req, res) => {
     switch (req.method) {
             case 'GET':
                    res.end(order_RETAIL_response);
                    break;
             default: console.log("received request method not known: ", req.method);
      }
 }




const server = http.createServer((req, res) => {
    body = '';
    console.log("\n" + server_name + " received request: ", req.method, req.url, '\n')
    console.log("Headers :\n" + JSON.stringify(req.headers) + "\n");
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        console.log("Body :\n" + body);
        console.log('--------------------------------END OF REQUEST--------------------------------');
        switch (server_name) {
            case possible_server_names[0]:
                crm_server(req, res);
                break;
            case possible_server_names[1]:
                bw_server(req, res);
                break;
            case possible_server_names[2]:
                retail_server(req, res);
                break;
        }
        body = '';
    });

});

let port;
switch (server_name){
    case possible_server_names[0]:
        port = 9999;
        break;
    case possible_server_names[1]:
        port = 9998;
        break;
    case possible_server_names[2]:
        port = 9997;
        break;
    default:
        console.log("Unknown name of the server");
        return;
}
console.log("Started " + server_name + " : " + port + ".");
server.listen(port);


let find_id = (url) => {
    while ((m = id_regex.exec(url)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === id_regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            console.log(`Id found: ${match}`);
            let id = `${match}`;
            console.log("id is :" + id);
            return `${match}`;
        });
    }
}