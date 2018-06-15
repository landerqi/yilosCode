const mongoose = require('mongoose')
const puppeteer = require('puppeteer')
const { connect } = require('../database')
const FacebookUser = mongoose.model('FacebookUser')

const Util = require('../util')
const Config = require('../config')

// 最大并发数
const MAX_CONCURRENT_NUM = 13
let currentConcurrent = 0
let collectLen = 1
// 没有开放个人首页的用户
let noOpenUserNum = 0

let mainPage
let originData

async function fetchPicture (browser) {
  if (originData.length === 0) {
    return
  }
  if (currentConcurrent >= MAX_CONCURRENT_NUM) return
  currentConcurrent++
  fetchPicture(browser)

  const target = originData.pop()

  if (target.bigPicture || target.notOpen === 1) {
    console.log(`[info] ${target.notOpen === 1 ? "用户个人首页没开放" : "已经获取过"}`)
    return finishFetch(browser)
  }

  console.log(`[info] 获取到fbid: ${target.fbid}`)
  const targetUrl = Util.getUserIndexPhotoPage(target.fbid)

  const page = await browser.newPage().catch(_ => {})
  bindEvent(page)
  // 跳转目标页面
  await page.goto(targetUrl).catch(_ => {})

  let error = false
  await page.waitForFunction(_ => {
    const light = document.querySelector('.spotlight')
    return light && light.src && (light.src.indexOf('scontent') > -1)
  }, {
    timeout: 20000
  }).catch(async function (e) {
    error = true
    noOpenUserNum++
    console.log(`[info] 失败总数：${noOpenUserNum}`)
    await FacebookUser.update({
      fbid: target.fbid
    }, {
      notOpen: 1
    })
    return finishFetch(browser, page)
  })
  if (error) return
  // 解析目标页面
  await page.evaluate(target => {
    function log (data) {
      if (typeof data === 'string' || typeof data === 'number') {
        console.log(`user:${String(data)}`)
      } else if (typeof data === 'object') {
        console.log(`user:${JSON.stringify(data)}`)
      }
    }
    const spotlight = document.querySelector('.spotlight')
    const qp = document.querySelector('._2_qp')
    if (spotlight && qp) {
      // 大图，中图
      target.bigPicture = spotlight.src
      target.middlePicture = qp.src
      log(target)
    }

  }, target).catch(function () {})
  await Util.sleep(500)
  finishFetch(browser, page)
}

function finishFetch (browser, page) {
  currentConcurrent--
  if (page) {
    page.close()
  }
  fetchPicture(browser)
  collectLen++
}
async function fetchData () {
  const browser = await puppeteer.launch({
    headless: Config.headless
  })
  mainPage = await browser.newPage()
  bindEvent(mainPage)

  // 登录逻辑
  await mainPage.goto(Config.loginPage)
  await mainPage.type('#email', Config.userInfo.name)
  await mainPage.type('#pass', Config.userInfo.password)
  await mainPage.click('#loginbutton')

  await Util.sleep(3000)
  await mainPage.close()

  await fetchPicture(browser)
}

// 链接数据后，再爬取
connect().then(async _ => {
  originData = await FacebookUser.find({
    // 可以写一些条件
  })
  // 找到数据库所有数据
  console.log(`[info] 当前满足条件的用户总数: ${originData.length}`)
  fetchData()
})


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
      info(`准备插入第${collectLen}条数据`)
      if (!hasOutputCome && originData.length === 0) {
        hasOutputCome = true
        info(`爬取结束, 总耗时:${(new Date().getTime() - now) / 1000}秒`)
      } else {
        data = JSON.parse(data)
        // 更新数据
        await FacebookUser.update({
          fbid: data.fbid
        }, {
          bigPicture: data.bigPicture,
          middlePicture: data.middlePicture
        })
      }
    }
    page.removeListener('console', arguments.callee)
  })
}


