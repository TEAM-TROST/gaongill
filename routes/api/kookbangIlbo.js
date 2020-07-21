const express = require('express');
const router = express.Router();

const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');

router.get('/kookbangIlbo', (req, res, next) => {
    request({
        url: 'https://www.mnd.go.kr/cop/kookbang/kookbangIlboList.do?handle=dema0003&siteId=mnd&id=mnd_020101000000',
        timeout: 3000
    }, (error, response, body) => {
        const resultArr = [];
        if (error && error.code === 'ETIMEDOUT') {
            for (let i = 0; i < 10; i++) {
                resultArr.push({
                    'img': '',
                    'url': 'http://mnd.go.kr/',
                    'title': '국방부 서버 점검으로 인해 읽어올 수 없습니다.',
                    'info': ''
                });
            }
            return res.json(resultArr);
        }
        const htmlDoc = iconv.decode(Buffer.from(body), 'utf-8').toString();
        let $;
        try {
            $ = cheerio.load(htmlDoc);
        } catch (error) {
            for (let i = 0; i < 10; i++) {
                resultArr.push({
                    'img': '',
                    'url': 'http://mnd.go.kr/',
                    'title': '국방부 서버 점검으로 인해 읽어올 수 없습니다.',
                    'info': ''
                });
            }
            return res.json(resultArr);
        }
        const postItems = $(".board_normal > .list_post > li");

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
            });
        }
        return res.json(resultArr);
    });
});

module.exports = router;
