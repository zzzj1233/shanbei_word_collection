const axios = require('axios')

const decode = require('./tree')

module.exports = class Request {

    constructor(authToken) {
        this.instance = axios.create({
            baseURL: 'https://apiv3.shanbay.com',
            withCredentials: true,
            headers: {
                'Cookie': `auth_token=` + authToken
            },
            timeout: 5000
        });

        this.instance.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                if (error.response) {
                    switch (error.response.status) {
                        case 400:
                            console.error('Bad Request:', error.response.data);
                            break;
                        case 401:
                            console.error('Unauthorized:', error.response.data);
                            break;
                        case 404:
                            console.error('Not Found:', error.response.data);
                            break;
                        default:
                            console.error('Error:', error.response.data);
                    }
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    async requestWordId(word) {

        const {data} = await this.instance.get('/wordsapp/words/vocab?word=' + word)

        const sign = data.data

        try {
            return decode(sign)
        } catch (ignore) {
            console.error("Decode failed , sign = ", sign)
            return null
        }

    }

    async collect(wordId) {
        if (!wordId)
            return
        await this.instance.post('/wordscollection/words', {
            "vocab_id": wordId,
            "business_id": 6
        })
    }

}
