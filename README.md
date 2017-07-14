# Sysu - Jwxt
A  tool that aims to simplify the complicated and confusing APIs in *Sun Yat-sen University - JWXT*.



## Feature

### Jwxt 

> since [jwxt](uems.sysu.edu.cn/jwxt) only supports old version of IE so it's the very first task to work out APIs of jwxt

* (only) support netid login
* course grade
* course grade detail, such as final mark and usual-time mark

### Elect

> to be implemented

## How

1. `npm i sysu-jwxt`

## Example

``` javascript
const Jwxt = require('sysu-jwxt');
const me = new Jwxt(netid, password, {
  // optional config
  logger: console,  // for detailed infomation logging, default to null.
  maxLoginRetry: 3, // max retry time, default to -1 (unlimited retry).
});

(async () => {
  await me.login();
  // get overall course grades
  let grades = await me.getGrades('2016-2017', '2'); // give year and semaster
  for (const grade of grades) {
    let detail = await me.getGradeDetail(grade.id);  // course id given by jwxt
    /* other procedures */
  }
})();
```

## Comming Feature

* supports for [elect](http://uems.sysu.edu.cn/elect)

## Changelog
* `0.2.0`
  * add timetbable support
* `0.1.2` 
  * add course grade and detail support

