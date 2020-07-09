const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');

router.get('/kookbangIlbo', (req, res, next) => {
    request('https://www.mnd.go.kr/cop/kookbang/kookbangIlboList.do?handle=dema0003&siteId=mnd&id=mnd_020101000000', (error, response, body) => {
        const htmlDoc = iconv.decode(Buffer.from(body), 'utf-8').toString();
        const $ = cheerio.load(htmlDoc);
        const postItems = $(".board_normal > .list_post > li");

        const resultArr = [];
        for (let i = 0; i < postItems.length; i++) {
            const img = 'https://www.mnd.go.kr' + $(postItems[i]).children('.thumb').children('a').children('img')[0].attribs.src.replace('/thumb2/', '/thumb1/');
            const href = $(postItems[i]).children('.post').children('.wrap_title').children('.title').children('a')[0].attribs.href.match(/javascript:jf_view\('(.*)','(.*)'\);/);
            const url = `https://mnd.go.kr/cop/kookbang/kookbangIlboView.do?categoryCode=${href[1]}&boardSeq=${href[2]}&id=mnd_020101000000`;
            const title = $(postItems[i]).children('.post').children('.wrap_title').children('.title').children('a').text();
            const info = $(postItems[i]).children('.post').children('.post_info').children('.first').children('dd').text();
            resultArr.push({
                'img': img,
                'url': url,
                'title': title,
                'info': info
            })
        }
        res.json(resultArr);
    });
});

router.get('/kookbangIlbo/:date/:fileName', (req, res, next) => {
    const date = req.params.date;
    const fileName = req.params.fileName;

    request(`https://www.mnd.go.kr/media/newspaper/tmplat/upload/${date}/thumb1/${fileName}`, (error, response, body) => {
        res.writeHead(200, {
            'Content-Type': response.headers['content-type'],
            'Content-Length': response.headers['content-length']
        });
        res.end(Buffer.from(body).toString('base64'));
    });
});

module.exports = router;
