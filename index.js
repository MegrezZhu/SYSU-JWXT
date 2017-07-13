const {login, grade, gradeDetail} = require('./utils');
const {axios: {createClient}} = require('./lib');
const assert = require('assert');

const defaultConifg = {
  logger: null,
  maxLoginRetry: -1 // unlimited retry
};

module.exports = class Jwxt {
  constructor (netid, password, _config) {
    assert(typeof netid === 'string', 'netid must be a string');
    assert(typeof password === 'string', 'password must be a string');

    this.config = Object.assign({}, defaultConifg, _config);
    this.logger = this.config.logger;
    this.netid = netid;
    this.password = password;
    this.jSessionId = null;
    this.axios = null;
  }

  async login () {
    this.axios = createClient();
    this.jSessionId = await login.call(this, this.netid, this.password);
  }

  async getGrades (year, sem) {
    try {
      return grade.call(this, year, sem);
    } catch (err) {
      this.logger && this.logger.error(err.message);
      throw err;
    }
  }

  async getGradeDetail (courseId) {
    try {
      return gradeDetail.call(this, courseId);
    } catch (err) {
      this.logger && this.loggger.error(err.message);
      throw err;
    }
  }
};
