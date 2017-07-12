const instance = require('../lib').axios.instance;
const dirtyParse = require('./dirtyParse');
const lodash = require('lodash');
const mapper = require('./objMap');

/**
 * data to send, replace $$YEAR$$ and $$SEM$$
 */
const dataTemplate = `{header:{"code": -100, "message": {"title": "", "detail": ""}},body:{dataStores:{fxcjStore:{rowSet:{"primary":[],"filter":[],"delete":[]},name:"fxcjStore",pageNumber:1,pageSize:2147483647,recordCount:0,rowSetName:"pojo_com.neusoft.education.sysu.xscj.cj.entity.FxcjEntity"}},parameters:{"args": ["$$ID$$"]}}}`;

/**
 *
 * @param id course id
 * @returns {Promise.<Object>}
 */
module.exports = async id => {
  const send = dataTemplate.replace('$$ID$$', id);
  const {data} = await instance().post('http://uems.sysu.edu.cn/jwxt/xscjcxAction/xscjcxAction.action?method=getFxcj',
    send,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        '__clientType': 'unieap',
        'Accept': '*/*',
        'ajaxRequest': 'true',
        'Host': 'uems.sysu.edu.cn',
        'Referer': 'http://uems.sysu.edu.cn/jwxt/forward.action?path=/sysu/xscjcx/xsgrcj_list',
        'render': 'unieap',
        'resourceid': 'null',
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)',
        'workitemid': 'null',
        'Content-Length': send.length,
        'Accept-Language': 'en-US, en; q=0.8, zh-Hans-CN; q=0.5, zh-Hand; q=0.3'
      }
    }
  );
  return lodash.get(dirtyParse(data), 'body.dataStores.fxcjStore.rowSet.primary').map(
    mapper({
      'cjpdlb': 'label',
      'mrqz': 'weight',
      'fxcj': 'score'
    })
  );
};
