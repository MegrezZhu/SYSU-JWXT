const {axios: {instance}} = require('../lib');
const config = require('../config/index');
const cheerio = require('cheerio');
const qs = require('querystring');
const assert = require('assert');

/**
 * 登录
 */
module.exports = async () => {
  // 访问NetID登录页面获取cookie
  let res = await instance().get('https://cas.sysu.edu.cn/cas/login', {
    params: {
      service: 'http://uems.sysu.edu.cn/jwxt/casLogin'
    }
  });
  // 获取post参数
  let {lt, execution} = getPostArgs(res.data);
  // 登录NetID
  let login = instance().post(`https://cas.sysu.edu.cn/cas/login`,
    qs.stringify({
      username: config.netid,
      password: config.password,
      lt,
      execution,
      _eventId: 'submit',
      submit: '登录'
    }), {
      params: {
        service: 'http://uems.sysu.edu.cn/elect/casLogin'
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  let location;
  // 登录后，获取ticket
  location = await redirect(login);
  // 带着ticket转跳到教务系统
  location = await redirect(location);
  // 跳转教务系统，获得学号密码
  location = await redirect(location);
  // 使用学号密码进行unieap认证
  location = await redirect(instance().get(location, {
    headers: {
      'Host': 'uems.sysu.edu.cn'
    }
  }));
  await instance().get(location);
};

function getPostArgs (html) {
  /**
   * 从NetID登录页面中提取post需要的参数
   * @param  {[type]} html 登录页面
   * @return {[type]}      参数lt和execution组成的对象
   */
  let $ = cheerio.load(html);
  let lt = $('input[name=lt]').attr('value');
  let execution = $('input[name=execution]').attr('value');
  return {
    lt,
    execution
  };
}

/**
 * 访问url并进行302重定向
 * @param  {[type]} url 需要访问的url
 * @return {[type]}     返回重定向后的url
 */
async function redirect (url) {
  try {
    if (url instanceof Promise) {
      await url;
    } else {
      await instance().get(url);
    }
    // 应该返回302 若返回2xx则代表转跳失败
    throw new Error('fail to redirect');
  } catch ({response}) {
    assert(response && response.status === 302, `res: ${response && response.status || 'undefined'}`);
    return response.headers.location;
  }
}
