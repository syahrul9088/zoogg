const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
var randomize = require('randomatic')
var random = require('random-name')
const { URLSearchParams } = require('url');
const cheerio = require('cheerio');
const rp = require('request-promise');

const getCookie = (reff) => new Promise((resolve, reject) => {
    fetch(`https://zoogg.com/register?referrer=${reff}`, {
        method: 'GET'
    }).then(async res => {
        const $ = cheerio.load(await res.text());
        const result = {
            cookie: res.headers.raw()['set-cookie'],
            csrf: $('input[name=_csrf]').attr('value')
        }

        resolve(result)
    })
    .catch(err => reject(err))
});

const functionRegist = (csrf, realCookie, email, reff) => new Promise((resolve, reject) => {
    const params = new URLSearchParams;
    params.append('_csrf', csrf);
    params.append('email', email);
    params.append('password', 'Berak321#');
    params.append('referrer', 'cIk0lvfTv')

       fetch('https://zoogg.com/register', {
        method: 'POST', 
        body: params,
        headers: {
            'Host': 'zoogg.com',
            'Upgrade-Insecure-Requests': 1,
            'Origin': 'https://zoogg.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Referer': `https://zoogg.com/register?referrer=${reff}`,
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': realCookie
           }
       })
       .then(res => res.text())
       .then(result => {
           resolve(result);
       })
       .catch(err => reject(err))
   });

const functionGetLink = (nickname) =>
   new Promise((resolve, reject) => {
       fetch(`https://generator.email/`, {
           method: "get",
           headers: {
               'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
               'accept-encoding': 'gzip, deflate, br',
               'accept-language': 'en-US,en;q=0.9',
               'cookie': `_ga=GA1.2.1434039633.1579610017; _gid=GA1.2.374838364.1579610017; _gat=1; surl=qbyyb.com%2F${nickname}`,
               'sec-fetch-mode': 'navigate',
               'sec-fetch-site': 'same-origin',
               'upgrade-insecure-requests': 1,
               'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'
           }
       })
       .then(res => res.text())
           .then(text => {
               const $ = cheerio.load(text);
               const src = $("div[align=center] a").attr("href");
               resolve(src);
           })
           .catch(err => reject(err));
   });

const functionVeryf = (url) => new Promise((resolve, rejected) => {
    const options = {
        method: 'GET',
        uri: url
    };
    rp(options)
        .then(function (body) {
            const $ = cheerio.load(body);
            const src = $("strong").text();
            resolve(src)
        })
        .catch(function (err) {
            rejected(err)
        });
});


(async () => {
    const reff = readlineSync.question('[?] Reff Code: ')
    const jumlah = readlineSync.question('[?] Jumlah reff: ')
    console.log("")
    for (var i = 0; i < jumlah; i++){
    try {
        console.log('[!] Wait...')
        const cookie = await getCookie(reff)
        const headCsrf = cookie.cookie[0].split(';')[0]
        const sid = cookie.cookie[1].split(';')[0]
        const csrf = cookie.csrf
        console.log('[!] Ready for register..')
        const realCookie = `${headCsrf}; ${sid}; _fbp=fb.1.1588730439742.2117414532`
        const rand = randomize('0', 5)
        const nama = random.first()
        const email = `${nama}${rand}@qbyyb.com`
        const regist = await functionRegist(csrf, realCookie, email, reff)
        if(regist){
            console.log('[!] Success')
            console.log('[!] Trying get link...')
            const get = await functionGetLink(`${nama}${rand}`)
            if(get){
                console.log(`[!] Success => ${get}`)
                console.log('[!] Trying verify')
                const verif = await functionVeryf(get)
                console.log('[!] Verified\n')
            } else {
                console.log('[!] Failed getting link\n')
            }
        } else {
            console.log('[!] Failed\n')
        }
    } catch (e) {
        console.log(e)
    }
}
})()