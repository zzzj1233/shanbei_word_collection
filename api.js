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
                // 直接返回成功的响应
                return response;
            },
            error => {
                // 处理错误响应
                // 你可以根据错误的状态码进行不同的处理
                if (error.response) {
                    // 请求已发出，但服务器响应了状态码
                    // 其他状态码的处理
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
                    // 请求已发出，但没有收到响应
                    console.error('No response received:', error.request);
                } else {
                    // 其他错误
                    console.error('Error:', error.message);
                }
                // 继续抛出错误，以便后续处理
                return Promise.reject(error);
            }
        );
    }

    async requestWordId(word) {

        const {data} = await this.instance.get('/wordsapp/words/vocab?word=' + word)

        const sign = data.data

        try {
            return decode(sign)
        } catch (e) {
            console.error("Decode failed , sign = ", sign)
            return null
        }
    }

    async collect(wordId) {
        if (!wordId)
            return
        const {data} = await this.instance.post('/wordscollection/words', {
            "vocab_id": wordId,
            "business_id": 6
        })
        console.log(data);
    }

}
