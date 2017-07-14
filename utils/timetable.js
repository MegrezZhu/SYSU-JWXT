const dirtyParse = require('./dirtyParse');
const {basePostHeaders} = require('../config');
const _ = require('lodash');

// replace $$YEAR$$ and $$SEMASTER$$
const dataTemplate = `{header:{"code": -100, "message": {"title": "", "detail": ""}},body:{dataStores:{},parameters:{"args": ["$$SEMASTER$$", "$$YEAR$$"], "responseParam": "rs"}}}`;

module.exports = async function (year, semaster) {
  let axios = this.axios;
  let send = dataTemplate.replace('$$YEAR$$', year).replace('$$SEMASTER$$', semaster);

  const {data} = await axios.post(
    'http://uems.sysu.edu.cn/jwxt/KcbcxAction/KcbcxAction.action?method=getList',
    send,
    {
      headers: Object.assign({}, basePostHeaders, {
        'Referer': `http://uems.sysu.edu.cn/jwxt/sysu/xk/xskbcx/xskbcx.jsp?xnd=${year}&xq=${semaster}`,
        'Content-Length': send.length
      })
    }
  );

  return _.get(dirtyParse(data), 'body.parameters.rs');
};
