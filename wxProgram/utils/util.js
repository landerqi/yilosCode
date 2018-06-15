const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getUrlPram = onlyHash => {
  const str = (onlyHash ? location.hash : location.search).slice(1);
  console.log('str', str);
  console.log('str', location.search);
  const data = {};
  const ex = /([^&]+?)=([^#&]+)/g;
  while (ex.test(str)) {
    data[RegExp.$1] = RegExp.$2;
  }
  return data;
}

module.exports = {
  formatTime: formatTime,
  getUrlPram: getUrlPram
}
