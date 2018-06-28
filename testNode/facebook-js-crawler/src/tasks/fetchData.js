const mongoose = require('mongoose')
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const Util = require('../util')
const Config = require('../config')
const { connect } = require('../database')
const FacebookUser = mongoose.model('FacebookUser')
const MAX_CRAWLER_NUM = 2000
const SEX = 'females'

const targetUrl = Util.getTargetSearchUrl({
  gender: SEX,
  locationType: 'current',
  location: 'India'
})

console.log(`-----------------
  爬取信息：
  爬取目标链接：${targetUrl}，
  爬取总数：${MAX_CRAWLER_NUM}
-----------------`)


async function fetchData () {
  const browser = await puppeteer.launch({
    headless: Config.headless
  })
  const mainPage = await browser.newPage()
  bindEvent(mainPage)

  // 登录逻辑
  await mainPage.goto(Config.loginPage)
  await mainPage.type('#email', Config.userInfo.name)
  await mainPage.type('#pass', Config.userInfo.password)
  await mainPage.click('#loginbutton')

  await Util.sleep(3000)
  // 跳转目标页面
  await mainPage.goto(targetUrl)
  // 解析目标页面
  await mainPage.evaluate(_ => {
    const { MAX_CRAWLER_NUM, SEX } = _
    let currentCount = 0
    function log (data) {
      if (typeof data === 'string' || typeof data === 'number') {
        console.log(`user:${String(data)}`)
      } else if (typeof data === 'object') {
        console.log(`user:${JSON.stringify(data)}`)
      }
    }
    function parseImgItems (items) {
      items.forEach(item => {
        const smallImage = item.querySelector('._1glk')
        const smallPicture = smallImage.src
        const match = smallPicture.match(/x\d+\/\d+_(\d+)/) || []
        const fbid = match[1] || ''
        if (fbid) {
          // fbid，用户姓名，性别，小图
          log({
            fbid: fbid,
            name: item.querySelector('._32mo span').innerHTML.trim(),
            smallPicture,
            sex: SEX
          })
          currentCount++
        } else {
          log(`【警告】没有解析到数据，链接为：${smallPicture}`)
        }
      })
    }
    function lazyParse () {
      window.scroll(0, document.body.clientHeight + 100)
      setTimeout(_ => {
        parse()
      }, 1000)
    }
    function parse () {
      if (currentCount >= MAX_CRAWLER_NUM) return
      let infoWrap = Array.from(document.querySelectorAll('._1yt')) || []
      if (infoWrap.length) {
        infoWrap.forEach(wrap => {
          const items = Array.from(wrap.querySelectorAll('._4p2o'))
          parseImgItems(items)
          wrap.parentNode.removeChild(wrap)
        })
      }
      lazyParse()
    }
    parse()
  }, {
    MAX_CRAWLER_NUM,
    SEX
  })

}

// 初始化，连接数据库后开始爬数据
connect().then(_ => {
  fetchData()
})


let targetLength = 0
let hasOutputCome = false
let now = new Date().getTime()
function info (msg) {
  console.log(`【info】: ${msg}`)
}
function bindEvent (page) {
  page.on('console', async msg => {
    let data = msg.text()
    if (typeof data === 'string' && data.substring(0, 5) !== 'user:') return
    data = data.substring(5)
    if (data[0] !== '{') {
      return info(data)
    }
    if (data) {
      targetLength++

      if (targetLength > MAX_CRAWLER_NUM && !hasOutputCome) {
        hasOutputCome = true
        info(`爬取结束, 总耗时:${(new Date().getTime() - now) / 1000}秒`)
      } else {
        info(`准备处理第${targetLength}条数据`)
        data = JSON.parse(data)
        // 存数据逻辑
        const users = await FacebookUser.findOne({
          fbid: data.fbid
        })
        // 如果数据库有了，就不存了
        if (!users) {
          new FacebookUser(data).save()
        }
      }
    }
  })
}
