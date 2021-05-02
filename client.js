const crypto = require('crypto');
const https = require('https');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const privateKey = process.env.PRIVATE_KEY;
const baseUrl = "api.btcmarkets.net";

const postHttp = (path, dataObj) => {
    const data = JSON.stringify(dataObj);
    const now = Date.now();
    var message =  path + "\n" + now + "\n";

    if (data) {
        message += data;
    }

    const signature = signMessage(privateKey, message);

    let headers = {
        "Accept": "application/json",
        "Accept-Charset": "UTF-8",
        'Content-Length': Buffer.byteLength(data),
        "Content-Type": "application/json",
    };

    headers.apikey = apiKey;
    headers.timestamp = now;
    headers.signature = signature;

    var post_options = {
        host: baseUrl,
        path: path,
        method: 'POST',
        headers: headers
    };

    var post_req = https.request(post_options, function(res) {
        res.on('data', function (chunk) {
            console.log('Http Response Code: ' + res.statusCode);
            console.log('Response: ' + chunk);
        });
    });

    post_req.write(data);
    post_req.end();

};

const signMessage = (secret, message) => {
    var key = Buffer.from(secret, 'base64');
    var hmac = crypto.createHmac('sha512', key);
    var signature = hmac.update(message).digest('base64');
    return signature;
}

const getOpenOrdersByMarket = () => {
    const data = {
        currency: 'AUD',
        instrument: 'XRP',
        limit: 10
    }
    const path = '/order/open';
    postHttp(path, data);
}

getOpenOrdersByMarket();

