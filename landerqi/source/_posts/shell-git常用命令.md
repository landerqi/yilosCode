title: shell-git常用命令
date: 2018-06-29 16:48:11
tags: [git, 工具]
---

### shell--常用命令
1. 查询npm 依赖： npm ls -g --depth=1 2>/dev/null | grep generator-
  + 'npm ls -g'列出依赖，通常是一个树状结构；
  + '--depth=1' 意思是只列出一层；
  +  '2>/dev/null'  >表示重定向，在bash里面单独的1表示标准输出，2表示标准错误，/dev/null代表空设备文件，这句就表示在执行npm ls -g的时候有错误消息就重定向到空设备文件上，其实就是在输出中过滤了错误消息；
  + ‘｜’ 表示通道，用来将上一个命令的输出内容作为下一个命令的输入内容;
  +  'grep generator-'表示在前面的输出结果中检索'generator'。

1. brew update && brew upgrade && brew cleanup
1.  复制某文件夹下全部内容到另一文件夹，注意'.'这个是必须的，cp -a fold1/. fold2/
1. windows关闭nginx:  taskkill /F /IM nginx.exe
1. 查到端口占用：NETSTAT.EXE -aon|findstr "3002"
1. 结束端口占用进程：taskkill.exe /f /t /im 10768
1. 如何使npm intall 不需要输入 sudo: 为当前账户添加node_modules目录读写权限即可。sudo chown -R $(whoami) ~/.npm

<!-- more -->

### git--常用命令
1. 新建本地分支，将远程分支提取出来： git checkout -t origin/2.0.0
1. To delete a local branch: git branch -d the_local_branch
1. To remove a remote branch: git push origin --delete the_remote_branch
1. 将你的git协议由https变为ssh: git remote set-url origin git@github.com:youraccount/yourproject.git
1. 关联到新的 git 仓库地址:
  如果有`.git`文件夹，先 `rm -rf .git`
  ```
  git init
  git remote add origin https://github.com/{your_project}.git
  git add .
  git commit -m "Initial commit"
  git push -u origin master
  ```
