const {login, jwxt} = require('./utils');

(async () => {
  await login();

  const grades = await jwxt.grade('2016-2017', '1');
  console.log(grades);
})()
  .catch(console.error);
