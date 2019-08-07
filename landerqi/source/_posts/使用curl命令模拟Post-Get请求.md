title: 使用curl命令模拟Post/Get请求
date: 2019-08-07 11:06:08
tags: [Linux]
---

有时需要测试接口，但是在服务器上又不方便使用postman, charles等工具，这时我们可以使用curl命令来模拟接口请求。

#### get 请求
``` shell
curl "http://www.baidu.com"        //  如果这里的URL指向的是一个文件或者一幅图都可以直接下载到本地

curl -i "http://www.baidu.com"     // 显示全部信息

curl -I "http://www.baidu.com"     // 只显示头部信息

curl -v "http://www.baidu.com"     // 显示get请求全过程解析
```

<!--more-->

#### post 请求

``` shell
curl -d "param1=value1&param2=value2" "http://www.baidu.com"
```

自定义头信息传递给服务器:
``` shell
curl -H "Content-Type:application/json" -X POST -d '{"user": "admin", "passwd":"12345678"}' http://127.0.0.1:8000/login  // json格式的post请求
```
还可以传递多个头信息：
``` shell
curl -H "Content-Type:application/json" -H "accept-language:zh-cn" -X POST -d '{"user": "admin", "passwd":"12345678"}' http://127.0.0.1:8000/login  // json格式的post请求
```

<br>
## More(curl --help):

#### 1.文件下载

curl命令可以用来执行下载、发送各种HTTP请求，指定HTTP头部等操作。如果系统没有curl可以使用`yum install curl`安装，也可以下载安装。curl是将下载文件输出到stdout，将进度信息输出到stderr，不显示进度信息使用`--silent`选项。

``` shell
curl URL --silent   // 这条命令是将下载文件输出到终端，所有下载的数据都被写入到stdout
```

使用选项`-O`将下载的数据写入到文件，必须使用文件的绝对地址：
``` shell
curl URL --silent -O
```

选项`-o`将下载数据写入到指定名称的文件中，并使用--progress显示进度条：
``` shell
curl http://xxx.iso -o xxx.iso --progress
######################################### 100.0%
```

#### 2.用curl设置cookies

使用`--cookie "COKKIES"`选项来指定cookie，多个cookie使用分号分隔：
``` shell
curl http://yy..com --cookie "user=root;pass=123456"
```

将cookie另存为一个文件，使用`--cookie-jar`选项：
``` shell
curl URL --cookie-jar cookie_file
```

#### 3.用curl设置用户代理字符串

有些网站访问会提示只能使用IE浏览器来访问，这是因为这些网站设置了检查用户代理，可以使用curl把用户代理设置为IE，这样就可以访问了。使用`--user-agent`或者`-A`选项：
``` shell
curl URL --user-agent "Mozilla/5.0"
curl URL -A "Mozilla/5.0"
```

#### 4.用curl进行认证

使用curl选项 -u 可以完成HTTP或者FTP的认证，可以指定密码，也可以不指定密码在后续操作中输入密码：
```shell
curl -u user:pwd URL
curl -u user URL
```

#### 5.curl的带宽控制和下载配额

使用`--limit-rate`限制curl的下载速度：
```shell
curl URL --limit-rate 50k      // 命令中用k（千字节）和m（兆字节）指定下载速度限制。
```

使用`--max-filesize`指定可下载的最大文件大小：
```shell
curl URL --max-filesize bytes  // 如果文件大小超出限制，命令则返回一个非0退出码，如果命令正常则返回0。
```