# facebook爬虫项目

### 技术
- puppeteer无头浏览器，模拟真实浏览器行为
- mongodb，存取数据，版本 > 2.6.0
- node，版本 > 8.x

### 使用
> 注意：使用前请先启动mongo数据库

puppeteer很大，安装的时候请耐心
```
npm i
npm run dev
```
### 目录
```
bak/                备份
src/
  config/
    index.js        配置文件，在这里修改facebook登录账号密码
  util/
  database/         数据库相关
  tasks/            任务逻辑都放在这里
  app.js            程序主入口
```

### 代码细节
分两步走
#### 爬取用户基本数据，头像，昵称
``` javascript
// app.js
require('./src/tasks/fetchData')
```
`src/tasks/fetchData`第9-16行
``` javascript
const MAX_CRAWLER_NUM = 2000                  // 设置爬取的总条数
const SEX = 'females'                         // 设置目标性别

const targetUrl = Util.getTargetSearchUrl({
  gender: SEX,
  locationType: 'current',                    // 设置用户来自哪里
  location: 'India'                           // 设置用户的国籍
})
```
#### 爬取高清大图
``` javascript
// app.js
require('./src/tasks/fetchBigPicture')
```
`src/tasks/fetchBigPicture.js`第10行
``` javascript
const MAX_CONCURRENT_NUM = 13    // 设置最大并发数，越多爬取数据越快，但cpu的压力也就越大
```
`src/tasks/fetchBigPicture.js`第110-114行，根据某些条件读取数据库的数据
``` javascript
connect().then(async _ => {
  originData = await FacebookUser.find({
    // 可以写一些条件
  })
```

### 数据导出
导出两份数据给上官进行后续处理，一份`female.json`，另一份`male.json`，命令如下：(需去到mongo的安装目录下的bin目录)
```
./mongoexport -d facebook-crawler -c facebookusers -o female.json --type json -q '{bigPicture: {$exists:true},sex:"females"}'
./mongoexport -d facebook-crawler -c facebookusers -o male.json --type json -q '{bigPicture: {$exists:true},sex:"males"}'
```

