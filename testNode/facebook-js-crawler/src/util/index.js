const Util = {
  getTargetSearchUrl: ({
    gender,
    locationType,
    location
  }) => {
    if (locationType !== 'from' && locationType !== 'current' ) {
      return console.error('locationType只支持from与current')
    }
    const type = locationType === 'current' ? 'present' : 'past'
    const targetUrl = `https://www.facebook.com/search/${gender}/str/${location}/pages-named/residents/${type}/intersect/`
    // console.log(`爬取目标链接为${targetUrl}`)
    return targetUrl
  },

  getUserIndexPhotoPage (fbid) {
    return `https://www.facebook.com/photo.php?fbid=${fbid}`
  },

  log: data => {
    if (typeof data === 'string' || typeof data === 'number') {
      console.log(`user:${String(data)}`)
    } else if (typeof data === 'object') {
      console.log(`user:${JSON.stringify(data)}`)
    }
  },

  sleep: delay => new Promise(resolve => setTimeout(resolve, delay))
}

module.exports = Util
