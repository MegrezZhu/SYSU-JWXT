const instance = require('../lib').axios.instance;
const dirtyParse = require('./dirtyParse');
const lodash = require('lodash');
const mapper = require('./objMap');

/**
 * data to send, replace $$YEAR$$ and $$SEM$$
 */
const dataTemplate = `{header:{"code": -100, "message": {"title": "", "detail": ""}},body:{dataStores:{kccjStore:{rowSet:{"primary":[],"filter":[],"delete":[]},name:"kccjStore",pageNumber:1,pageSize:20,recordCount:0,rowSetName:"pojo_com.neusoft.education.sysu.xscj.xscjcx.model.KccjModel",order:"t.xn, t.xq, t.kch, t.bzw"}},parameters:{"kccjStore-params": [{"name": "Filter_t.pylbm_0.2114040891017291", "type": "String", "value": "'01'", "condition": " = ", "property": "t.pylbm"}, {"name": "Filter_t.xn_0.06936137591164815", "type": "String", "value": "'$$YEAR$$'", "condition": " = ", "property": "t.xn"}, {"name": "Filter_t.xq_0.8997990960174158", "type": "String", "value": "'$$SEM$$'", "condition": " = ", "property": "t.xq"}], "args": ["student"]}}}`;

/**
 * get grades
 * @param year year
 * @param sem semseter
 * @returns {Promise.<Array>}
 */
module.exports = async (year, sem, axios) => {
  let send = dataTemplate.replace('$$YEAR$$', year).replace('$$SEM$$', sem);
  const {data} = await axios.post(
    'http://uems.sysu.edu.cn/jwxt/xscjcxAction/xscjcxAction.action?method=getKccjList',
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
    });
  return lodash.get(dirtyParse(data), 'body.dataStores.kccjStore.rowSet.primary').map(
    mapper({
      // 课程名称
      'kcmc': 'course',
      // 教师姓名
      'jsxm': 'teacher',
      // 学分
      'xf': 'credit',
      // 总评成绩
      'zpcj': 'score',
      // 年级专业排名
      'njzypm': 'rank',
      // 绩点
      'jd': 'gpa',
      // 神秘-用来查详细成绩的id
      'cjlcId': 'id'
    })
  );
};
