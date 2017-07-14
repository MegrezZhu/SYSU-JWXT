const {basePostHeaders, courseType} = require('../config');
const dirtyParse = require('./dirtyParse');
const lodash = require('lodash');
const mapper = require('./objMap');

const dataTemplate = `{header:{"code": -100, "message": {"title": "", "detail": ""}},body:{dataStores:{xsxkjgStore:{rowSet:{"primary":[],"filter":[],"delete":[]},name:"xsxkjgStore",pageNumber:1,pageSize:20,recordCount:0,rowSetName:"pojo_com.neusoft.education.sysu.xk.xkjg.entity.XkjgxxEntity",order:"xkjg.xnd desc,xkjg.xq desc, xkjg.jxbh"}},parameters:{"xsxkjgStore-params": [{"name": "Filter_xkjg.xnd_0.03368354646285188", "type": "String", "value": "'$$YEAR$$'", "condition": " = ", "property": "xkjg.xnd"}, {"name": "Filter_xkjg.xq_0.42536393463063204", "type": "String", "value": "'$$SEMASTER$$'", "condition": " = ", "property": "xkjg.xq"}], "args": []}}}`;

module.exports = async function (year, semaster) {
  let axios = this.axios;

  const send = dataTemplate.replace('$$YEAR$$', year).replace('$$SEMASTER$$', semaster);
  const {data} = await axios.post(
    'http://uems.sysu.edu.cn/jwxt/xstk/xstk.action?method=getXsxkjgxxlistByxh',
    send,
    {
      headers: Object.assign({}, basePostHeaders, {
        'Referer': 'http://uems.sysu.edu.cn/jwxt/forward.action?path=/sysu/xk/zxxk/xsxk/search_xkjg_xs.jsp?pylbm=01',
        'Content-Length': send.length
      })
    }
  );

  let list = lodash.get(dirtyParse(data), 'body.dataStores.xsxkjgStore.rowSet.primary').map(
    mapper({
      'kcmc': 'course', // 课程名
      'xf': 'credit', // 学分
      'xm': 'teacher', // 老师
      'sksjdd': 'whenWhere', // 上课时间地点
      'kclbm': 'type' // 课程类别
    })
  );

  list.forEach(course => {
    course.type = courseType[course.type] || '未知'
  });

  return list;
};
