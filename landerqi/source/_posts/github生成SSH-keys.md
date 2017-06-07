title: github生成SSH_keys
date: 2015-06-04 15:24:55
tags: git

---

该文章将向大家详细介绍如何生成github SSH keys

<!-- more -->
<!-- toc -->
### 第一步：检查电脑里面是否存在SSH keys
__打开 Git Bash 输入：__
``` bash
$ ls -al ~/.ssh
# Lists the files in your .ssh directory, if they exist
```
如果存在将看到如下文件：
- id_dsa.pub
- id_ecdsa.pub
- id_ed25519.pub
- id_rsa.pub

### 第二步：生成新的SSH key

1. 在终端输入以下指令(mac),如果是windows可以用Git bash. 引号中输入你的github账号邮箱地址.
	``` bash
	$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
	# Creates a new ssh key, using the provided email as a label
	# Generating public/private rsa key pair.
	```

2. 直接按__enter__继续.
	``` bash
	Enter file in which to save the key (/Users/you/.ssh/id_rsa): [Press enter]
	```

3. 你需要设置密码指令，后面会用到(输入密码，无需和github账号相同).
	``` bash
	Enter passphrase (empty for no passphrase): [Type a passphrase]
	# Enter same passphrase again: [Type passphrase again]
	```

4. 在你设置密码指令之后, 你将会得到你的SSH key的 fingerprint（指纹）, 或 id. 如下所示:
	``` bash
	Your identification has been saved in /Users/you/.ssh/id_rsa.
	# Your public key has been saved in /Users/you/.ssh/id_rsa.pub.
	# The key fingerprint is:
	# 01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db your_email@example.com
	```


### 第三步： 添加你的key至ssh-agent
配置 [ssh-agent](https://en.wikipedia.org/wiki/Ssh-agent) 程序来使用你生成的SSH key:

如果你安装了[GitHub for Windows](https://windows.github.com/), 你可以用它来克服仓库，这样不需要使用SSH keys。它还自带了Git Bash工具，在windows平台Git bash可以更好的运行git命令。

1. 确保ssh-agent是激活的:
	__如果你使用 Git Bash__,激活 ssh-agent:
	``` bash
	# start the ssh-agent in the background
	$ ssh-agent -s
	# Agent pid 59566
	```
	ps:(windows)我当时直接运行没有成功，加了__eval__才行,[原因](http://stackoverflow.com/questions/17846529/could-not-open-a-connection-to-your-authentication-agent/4086756#4086756)
	``` bash
	eval `ssh-agent -s`
	```
	或者(优先)
	``` bash
	eval "$(ssh-agent)"
	```

2. 把你生成的SSH key 添加至 ssh-agent:
	``` bash
	$ ssh-add ~/.ssh/id_rsa
	```


### 第四步： 把你的 SSH key 添加到你的 github 账号
用你的 SSH key 配置 github 账号:
把 SSH key 粘贴到剪切板. 如果你的 key 名字为 `id_dsa.pub`, `id_ecdsa.pub` 或者 `id_ed25519.pub`, 那么把下面指令的文件名`id_rsa.pub`改成和你的 key 相匹配的名字:
	``` bash
	$ clip < ~/.ssh/id_rsa.pub
	# Copies the contents of the id_rsa.pub file to your clipboard

	# macOs
	$ pbcopy < ~/.ssh/id_rsa.pub
	# Copies the contents of the id_rsa.pub file to your clipboard

	# GNU/Linux (requires the xclip package)
	xclip -sel clip < ~/.ssh/id_rsa.pub
	# Copies the contents of the id_rsa.pub file to your clipboard

	# Windows Command Line
	type %userprofile%\.ssh\id_rsa.pub | clip
	# Copies the contents of the id_rsa.pub file to your clipboard

	# Git Bash on Windows / Windows PowerShell
	cat ~/.ssh/id_rsa.pub | clip
	# Copies the contents of the id_rsa.pub file to your clipboard
	```

__如果手动复制，要注意复制的key是`ssh-rsa`开头,`你的email`结尾__


__在github账号设置里面找到add ssh key; title随意添写，key复制进去。__


### 第五步： 测试连接

确保所有的事情都正常进行, 你现在将试着 SSH 进 GitHub. 当你这么做的时候, 你将会被请求密码鉴定，密码就是你之前设置的密码指令（SSH key passphrase）。

1. 打开 Git Bash 并输入:
	``` bash
	$ ssh -T git@github.com
	# Attempts to ssh to GitHub
	```

2. 你可能看到如下警告:
	``` bash
	The authenticity of host 'github.com (207.97.227.239)' can't be established.
	# RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
	# Are you sure you want to continue connecting (yes/no)?
	```
	核实信息中你看到的 fingerprint(指纹) 是否和下面的信息匹配，然后输入`yes`:
	``` bash
	Hi username! You've successfully authenticated, but GitHub does not provide shell access.
	```

3. 如果信息中的 username 是你的, 你就已经成功的设置了SSH Key!

如果你收到了拒绝访问的信息 "access denied," [you can read these instructions for diagnosing the issue](https://help.github.com/articles/error-permission-denied-publickey/).

如果你想从HTTPS转换到SSH，你将需要更新你的远程仓库 URLs.
If you're switching from HTTPS to SSH, you'll now need to update your remote repository URLs.

__之前博客从github迁移到了gitcafe, gitcafe之后被coding收购, 所以想把博客迁移至coding. 可是在添加ssh key的时候, 执行`ssh -T git@coding.net`一直报错：__

```
ssh: connect to host coding.net port 22: Connection refused
```
__一直在搜索解决方案，没有找到好的解决办法，最后发现coding的page服务已经开始按天收费了，所以还是默默的把blog迁回了github，毕竟github是最稳定的。__

### 如果要配置多个ssh key
__需在.ssh/目录下增加一个config文件__
`.ssh/config` :

``` bash
Host myshortname realname.example.com
    HostName realname.example.com
    IdentityFile ~/.ssh/realname_rsa # private key for realname
    User remoteusername

Host myshortname git.yypm.com
    HostName git.yypm.com
    IdentityFile ~/.ssh/feb-gitlab_rsa
    User xieqi
```

更多信息
For more information, see [Changing a remote's URL](https://help.github.com/articles/changing-a-remote-s-url/).
