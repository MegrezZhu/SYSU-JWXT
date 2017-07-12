const {login, grade, gradeDetail} = require('./utils');

(async () => {
  await login();

  const grades = await grade('2016-2017', '2');
  console.log(grades);

  for (let grade of grades) {
    console.log(await gradeDetail(grade.id));
  }
})()
  .catch(console.error);
