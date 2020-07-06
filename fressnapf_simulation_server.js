var fs = require("fs");

const http = require('http');
const url = require('url');

const possible_server_names = ["CRM", "BW", "RETAIL"]

let server_name = process.argv[2].toUpperCase()
if (!server_name || ! possible_server_names.includes(server_name) ) {
    LOG("Specify the server to start. Possible arguments = " + possible_server_names)
    return;
}

//var newsletter_response = fs.readFileSync("./resources/newsletter/NewsletterSAPCRMResponse.json", "utf8");
var newsletter_response = fs.readFileSync("./resources/newsletter/response_v2_0/response.json", "utf8");

var order_BW_response = fs.readFileSync("./resources/orderHistory/backendservices_response_v2/bw5.json", "utf8");
var order_RETAIL_response = fs.readFileSync("./resources/orderHistory/backendservices_response_v2/retail5_with_minus.json", "utf8");
var order_list_response = fs.readFileSync("./resources/orderHistory/listResponse.json", "utf8");


let created_newsletter_datas = {};
//default data with id 22031794
created_newsletter_datas['22031794'] = JSON.parse(newsletter_response);

let body;
const id_regex = /(?<=identificationnumber=')\d+(?=')/gm;
let crm_server = (req, res) => {
    switch (req.method) {
            case 'PUT':
            case 'POST':
//                if (body.length > 0){
//                    let obj = JSON.parse(body);
//                    obj["bpid"] = "0000152423"
//                    let id = obj['identificationnumber'];
//                    if (id.length = 0){
//                        LOG("NO identificationnumber received!");
//                    }
//                    created_newsletter_datas[id] = obj;
//                    let str = JSON.stringify(obj)
//                    LOG("Returning object:\n" + str)
//                    res.end(str);
//                } else {
//                    LOG("No body provided with the POST")
//                    res.statusCode = 400;
//                    res.end()
//                }
            case 'GET':
//                if ("X-CSRF-Token".toLowerCase() in req.headers){
//                    let token = req.headers["X-CSRF-Token".toLowerCase()];
//                    if (token == "fetch"){
//                        res.setHeader("X-CSRF-Token".toLowerCase(), "DUMMY_TOKEN_asda342a");
//                        res.end();
//                        return;
//                    }
//                }
//                let id = find_id(req.url);
//                if (id.length > 0){
//                    if (id in created_newsletter_datas){
//                        let str = JSON.stringify(created_newsletter_datas[id])
//                            LOG("Returning object:\n" + str)
//                        res.end(str);
//                    } else {
//                        res.statusCode = 404;
//                        res.end("{}");
//                    }
//                } else {
//                    LOG("Id not found in url");
//                }
                res.end(newsletter_response);
                break;
            case 'DELETE':
                res.statusCode = 200;
                res.end();
                break;
            default: LOG("received request method not known: ", req.method);
    }
 }


let find_id = (url) => {
    return url.match(id_regex)[0];
}

let bw_server = (req, res) => {
     switch (req.method) {
             case 'GET':
                    res.end(order_BW_response);
                     break;
             default: LOG("received request method not known: ", req.method);
      }
 }

let retail_server = (req, res) => {
     switch (req.method) {
             case 'GET':
                    res.end(order_RETAIL_response);
                    break;
             default: LOG("received request method not known: ", req.method);
      }
 }




const server = http.createServer((req, res) => {
    body = '';
    LOG("\n" + server_name + " received request: ", req.method, req.url, '\n')
    LOG("Headers :\n" + JSON.stringify(req.headers) + "\n");
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        LOG("Body :\n" + body);
        LOG('--------------------------------END OF REQUEST--------------------------------');
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

let LOG = (msg) => {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
                                    + (currentdate.getMonth()+1)  + "/"
                                    + currentdate.getFullYear() + " "
                                    + currentdate.getHours() + ":"
                                    + currentdate.getMinutes() + ":"
                                    + currentdate.getSeconds();
    console.log("[" + datetime + "] "+ msg);
}

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
        LOG("Unknown name of the server");
        return;
}
LOG("Started " + server_name + " : " + port + ".");
server.listen(port);

