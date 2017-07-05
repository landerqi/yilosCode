title: react遇到的坑
date: 2016-12-01 16:40:38
tags: [javascript, 前端]

---

### 加载sass-loader 报错
+ 错误信息: `no such file or dictionary node_modules/node-sass/vendor @.src/xxx.scss`
    解决方法，在项目根目录运行以下命令：
    ```
    node node_modules/node-sass/scripts/install.js
    node node_modules/node-sass/scripts/build.js
    ```
