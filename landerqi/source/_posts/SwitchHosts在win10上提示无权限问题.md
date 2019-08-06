title: SwitchHosts在win10上提示无权限问题
date: 2019-08-06 10:54:06
tags: 工具
---

在win10系统中，有时右键选择以**管理员身份**启动switchhosts，依然会提示没有权限：

<img src="https://fesystem.bs2dl.yy.com/1565060356811340" width="680" alt="">

**解决方法：**
1. 进入 C:\Windows\System32\drivers\etc，查看hosts文件属性:
<!-- more -->
<img src="https://fesystem.bs2dl.yy.com/1565060666416975" width="580" alt="">
2. 取消文件只读状态:
<img src="https://fesystem.bs2dl.yy.com/1565060810732220" width="380" alt="">
3. 修改用户权限:
<img src="https://fesystem.bs2dl.yy.com/156506073178426" width="680" alt="">

