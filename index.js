const {login, grade, gradeDetail} = require('./utils');
const {axios: {createClient}} = require('./lib');

module.exports = class Jwxt {
  constructor (netid, password) {
    this.netid = netid;
    this.password = password;
    this.jSessionId = null;
    this.axios = null;
  }

  async login () {
    this.axios = createClient();
    this.jSessionId = await login(this.netid, this.password, this.axios);
  }

  async getGrades (year, sem) {
    return grade(year, sem, this.axios);
  }

  async getGradeDetail (courseId) {
    return gradeDetail(courseId, this.axios);
  }
};
