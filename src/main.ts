import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appId, appSecret} from './private';

type ErrorMap = {
  [k: string]: string
}
const errorMap:ErrorMap = {
  52001: '请求超时',
  52002: '系统错误',
  52003: '用户认证失败',
  54000: '必填参数为空',
  54001: '签名错误',
  54003: '访问频率受限',
  54004: '账户余额不足',
  54005: '长query请求频繁',
  58000: '客户端IP非法',
  58001: '译文语言方向不支持',
  58002: '服务当前已关闭',
  90107: '认证未通过或未生效',
};

export const translate = (word: string) => {
  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);
  let from, to;
  if (/[a-zA-Z]/.test(word[0])) {
    // 英译中
    from = 'en';
    to = 'zh';
  } else {
    // 中译英
    from = 'zh';
    to = 'en';
  }

  const query: string = querystring.stringify({q: word, appid: appId, from, to, salt, sign});

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    let chunks:Buffer[] = [];
    response.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      type BaiduResult = {
        from: string;
        to: string;
        trans_result: {
          src: string;
          dst: string;
        }[];
        error_code?: string;
        error_msg?: string;
      }
      const obj: BaiduResult = JSON.parse(string);
      if (obj.error_code) {
        if (obj.error_code in errorMap) {
          console.error(errorMap[obj.error_code] || obj.error_msg);
        }
        process.exit(2);
      } else {
        obj.trans_result.map(obj => {
          console.log(obj.dst);
        })
        process.exit(0);
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};