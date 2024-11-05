const fs = require('fs')

const Request = require('./api')

const config = fs.readFileSync('./config.json', 'utf-8')

const wordsTxt = fs.readFileSync('./words.txt', 'utf-8')

const authToken = JSON.parse(config)['auth_token']

const words = wordsTxt.split("\r\n")

const request = new Request(authToken)

async function requestAndCollect(words) {

    for (let i = 0; i < words.length; i++) {

        const id = await request.requestWordId(words[i])

        await request.collect(id)

        console.log(` '${words[i]}'  collected`)
    }

    console.log("Finished...")

}

requestAndCollect(words)

