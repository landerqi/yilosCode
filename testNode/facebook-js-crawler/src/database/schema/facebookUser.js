const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const FacebookUserSchema = new Schema({
  fbid: {
    type: Mixed,
    unique: true
  },
  sex: {
    type: String
  },
  smallPicture: {
    type: String
  },
  bigPicture: {
    type: String
  },
  middlePicture: {
    type: String
  },
  name: {
    type: String
  },
  // 有的用户不开放个人首页，也就没有高清大图，设置1代表没开放
  notOpen: {
    type: Number
  }
})
mongoose.model('FacebookUser', FacebookUserSchema)
