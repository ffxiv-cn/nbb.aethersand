
const nictTimeDiff = 0
const timeAdjust	= 1278950400
const timeGame	= 144
const timeEarth	= 7

export const calcTime = function () {
  // 地球時間
  // 10/24 00:00:00 = 1445612400000 = ET10:17:10
  // ET = ET秒 /timeGame/timeEarth
  const testFixTime = 0// 1445612395000 + (12.3 * 60 * 60 / timeGame * timeEarth) * 1000;
  const testFixAndStart = false// true;
  const testDiffTime = 0// (23 + 4) * 4200 / 24 * 1000;
  const testHighSpeed = 0// 1;//10;
  let testFixStartDiffTime = 0
  let tmpBaseTime = 0
  let d = 0

  let now = new Date(getCurrentEarthTime() + testDiffTime)
  if (testFixTime !== 0) {
    now = new Date(testFixTime + testDiffTime)
  }
  if (testFixAndStart) {
    if (testFixStartDiffTime === 0) {
      testFixStartDiffTime = new Date().getTime() - testFixTime
    }
    now = new Date(getCurrentEarthTime() - testFixStartDiffTime)
  }

  // 加速
  if (testHighSpeed > 0) {
    if (testFixTime === 0) {
      if (tmpBaseTime === 0) {
        tmpBaseTime = now.getTime()
      } else {
        d = now.getTime() - tmpBaseTime
        now = new Date(now.getTime() + d * testHighSpeed)
      }
    } else {
      if (tmpBaseTime === 0) {
        tmpBaseTime = new Date().getTime()
      } else {
        d = new Date().getTime() - tmpBaseTime
        now = new Date(testFixTime + d * testHighSpeed)
      }
    }
  }

  const dtEarth = {}
  dtEarth.year = now.getYear() + 1900
  dtEarth.month = now.getMonth() + 1
  dtEarth.day = now.getDate()
  dtEarth.hour = now.getHours()
  dtEarth.min = now.getMinutes()
  dtEarth.sec = now.getSeconds()
  dtEarth.epoch = now.getTime() / 1000

  const dtEorzea = getETFromRTEpoch(now)
  return dtEorzea
}

function getETFromRTEpoch (timeJST) {
  // console.log('timeJST', timeJST)
  const rtEpoch = timeJST / 1000
  const etEpoch = (rtEpoch - timeAdjust) * timeGame / timeEarth
  // etEpoch = Math.round(etEpoch / 10) * 10;
  const ret = {}
  // ret.year = Math.floor(etEpoch / 33177600)
  // ret.month = Math.floor(etEpoch % 33177600 / 2764800) + 1
  // ret.day = Math.floor(etEpoch % 2764800 / 86400) + 1
  ret.hour = Math.floor(etEpoch % 86400 / 3600)
  ret.min = Math.floor(etEpoch % 3600 / 60)
  ret.sec = Math.floor(etEpoch % 60)
  ret.time = timeJST.getTime()
  ret.Rhour = timeJST.getHours()
  ret.Rmin = timeJST.getMinutes()
  ret.Rsec = timeJST.getSeconds()
  return ret
}

function getCurrentEarthTime () {
  let v = new Date().getTime()
  v += nictTimeDiff// NTP 修正
  return v
}

function paddingLeft (text, figure) {
  var ret = String(text)
  while (true) {
    if (ret.length >= figure) {
      break
    }
    ret = '0' + ret
  }
  return ret
}

function sprintf (text, values) {
  var ret = text
  for (var i = 0; i < values.length; i++) {
    ret = ret.replace(new RegExp('\\{' + i + '\\}', 'g'), values[i])
  }
  return ret
}

export function getNextTime (timeText, dtEorzea) {
  var rDate = getTimeByDate(timeText, dtEorzea)
  return rDate
}

export function outTime (rDate) {
  return sprintf('{0}:{1}', [paddingLeft(rDate.getHours(), 2), paddingLeft(rDate.getMinutes(), 2)])
}

export function LimitTime (rDate, dtEorzea) {
  const cur = dtEorzea.time
  const time = rDate.getTime()
  return time - cur
}

function getTimeByDate (timeText, dtEorzea, next) {
  var targetTime = timeText.split(':')
  var eTimeTarget = Number(targetTime[0]) * 3600 + Number(targetTime[1]) * 60
  var eTime = dtEorzea.hour * 3600 + dtEorzea.min * 60 + dtEorzea.sec

  var eTimeDiff = eTimeTarget - eTime
  if (eTimeDiff < 0) {
    eTimeDiff += 86400
  }

  var rTimeDiff = Math.ceil(eTimeDiff / (1440 / 70))

  var rTime = Math.floor(getCurrentEarthTime() / 1000) * 1000
  var rDate = new Date(rTime + rTimeDiff * 1000)

  return rDate
}
