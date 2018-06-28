const mongoose = require('mongoose')

const db = 'mongodb://localhost/facebook-crawler'
mongoose.Promise = global.Promise

require('./schema/facebookUser')

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    mongoose.set('debug', false)
    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧');
      }
    })

    mongoose.connection.on('error', err => {
      console.log(err)
      reject(err)
    })

    mongoose.connection.once('open', err => {
      resolve()
      console.log('[info] MongoDB Connected Successfully')
    })
  })
}
