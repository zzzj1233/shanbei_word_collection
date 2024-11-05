const fs = require('fs')

const tree = require('./tree')

const Request = require('./api')

const config = fs.readFileSync('./config.json', 'utf-8')

const wordsTxt = fs.readFileSync('./words.txt', 'utf-8')

const authToken = JSON.parse(config)['auth_token']

const words = wordsTxt.split("\r\n")

const request = new Request(authToken)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function requestAndCollect(words) {
    for (let i = 0; i < words.length; i++) {

        console.log(words[i])

        const id = await request.requestWordId(words[i])

        await request.collect(id)

    }
}

requestAndCollect(words)

