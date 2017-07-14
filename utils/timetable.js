const dirtyParse = require('./dirtyParse');
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
      headers: {
        'Content-Type': 'multipart/form-data',
        '__clientType': 'unieap',
        'Accept': '*/*',
        'ajaxRequest': 'true',
        'Host': 'uems.sysu.edu.cn',
        'Referer': `http://uems.sysu.edu.cn/jwxt/sysu/xk/xskbcx/xskbcx.jsp?xnd=${year}&xq=${semaster}`,
        'render': 'unieap',
        'resourceid': 'null',
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)',
        'workitemid': 'null',
        'Content-Length': send.length,
        'Accept-Language': 'en-US, en; q=0.8, zh-Hans-CN; q=0.5, zh-Hand; q=0.3'
      }
    }
  );

  return _.get(dirtyParse(data), 'body.parameters.rs');
};
