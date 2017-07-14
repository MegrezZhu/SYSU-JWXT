const {basePostHeaders} = require('../config');
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
module.exports = async function (id) {
  let axios = this.axios;
  const send = dataTemplate.replace('$$ID$$', id);
  const {data} = await axios.post(
    'http://uems.sysu.edu.cn/jwxt/xscjcxAction/xscjcxAction.action?method=getFxcj',
    send,
    {
      headers: Object.assign({}, basePostHeaders, {
        'Referer': 'http://uems.sysu.edu.cn/jwxt/forward.action?path=/sysu/xscjcx/xsgrcj_list',
        'Content-Length': send.length
      })
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
