const {login, grade, gradeDetail, timetable, courseList} = require('./utils');
const {axios: {createClient}} = require('./lib');
const assert = require('assert');

const defaultConifg = {
  logger: null,
  maxLoginRetry: -1 // unlimited retry
};

class Jwxt {
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
}

Jwxt.prototype.getGradeDetail = decorate(gradeDetail);
Jwxt.prototype.getGrades = decorate(grade);
Jwxt.prototype.getTimetable = decorate(timetable);
Jwxt.prototype.getCourseList = decorate(courseList);

// decorator-like function that wraps the methods
function decorate (fn) {
  return async function (...args) {
    try {
      return fn.call(this, ...args);
    } catch (err) {
      this.logger && this.logger.error(err.message);
      throw err;
    }
  };
}

module.exports = Jwxt;
