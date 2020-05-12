![banner picture](./docs/image/banner.png)

<p align="center">
  <a href="https://raw.githubusercontent.com/mofishteam/mofish-plugin-proxy/master/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-333">
  </a>
  <a href="https://raw.githubusercontent.com/mofishteam/mofish-plugin-proxy/master/LICENSE">
      <img src="https://img.shields.io/badge/language-Javascript-orange">
  </a>
  <a href="https://raw.githubusercontent.com/mofishteam/mofish-plugin-proxy/master/LICENSE">
      <img src="https://img.shields.io/badge/platform-mac%20%7C%20win%20%7C%20linux-lightgrey">
  </a>
  <a href="https://codebeat.co/projects/github-com-mofishteam-mofish-plugin-proxy-master">
      <img alt="codebeat badge" src="https://codebeat.co/badges/fc41a013-d6b1-4d72-9353-166321a8f299" />
  </a>
  <a href="https://raw.githubusercontent.com/mofishteam/mofish-plugin-proxy/master/LICENSE">
      <img src="https://img.shields.io/badge/VUE-2.6-green">
  </a>
  <a href="https://raw.githubusercontent.com/mofishteam/mofish-plugin-proxy/master/LICENSE">
      <img src="https://img.shields.io/badge/KOA-2.7-blue">
  </a>
</p>

Mofish是基于[Mofish](https://github.com/mofishteam/mofish)开发框架的一款 代理插件。

Mofish-proxy有一部分`Nginx`的功能，比如`proxy_pass`、`server_name`、还有`listen`的配置和`location`检测。以及其他一些功能，比如`Interceptor`（拦截器，作为一个类似"中间人"的功能，来篡改请求），`Mock Server`（一个Mock server，基于`location`操作）。

你可以拥有多个`Server`，可以单独命名和关闭。

> [English Introduction](../../README.md)

## 概览

![overview picture](./docs/image/overview.png)

## 安装

在安装本插件前，请确保已安装 [Mofish](https://github.com/mofishteam/mofish) ，安装命令如下：

> npm install mofish -g

启动 `Mofish` 平台

> mofish

盯住上文运行的命令行, 从其中一行输出： `App is started at port 8xxx` 中记住端口号, 有时候8080端口被占用了, 本插件会在端口号上逐次+1直到端口没有被占用或超出叠加次数。

当然你也可以使用-p或--port参数指定端口号，详见`mofish -h`。

安装插件 `mofish-plugin-proxy`

> npm install mofish-plugin-proxy -g

向`Mofish`平台添加`mofish-plugin-proxy`插件：

首先，使用浏览器打开 https://localhost:8xxx (8xxx 为前文需要记住的端口号)

然后，

![banner picture](./docs/image/how_to_add_proxy.gif)

点击 `Add plugin` 按钮，然后点击 `NPM` 标签，在 `Installed Local` 中找到 **`mosifh-plugin-proxy`**，点击 `mofish-plugin-proxy`右侧的绿色`Add`按钮，然后会在页面顶部出现`Proxy`标签，证明添加成功。 

更多 `Mofish` 平台详情请参考 [https://github.com/mofishteam/mofish](https://github.com/mofishteam/mofish)

## 贡献点代码

欢迎提意见以及贡献代码，就算只提点文档的pull request也中，作者也老开心了。

## TODO

- [ ] 重构为Electron版本（已经在搞了）
- [ ] 添加透明代理功能
- [ ] 将Mock功能模块化

## 联系作者

Email: [x@anymelon.com](mailto:x@anymelon.com)

## 捐献

如果你老稀罕这个插件，或者单纯就是喜欢作者本人，可以给我买杯JAVA以示鼓励，二维码如下：

![alipay](../image/alipay.JPG)
![wxpay](../image/wxpay.JPG)

## License

<a href="https://github.com/mofishteam/mofish-plugin-proxy/blob/master/LICENSE">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/License_icon-mit-88x31-2.svg/128px-License_icon-mit-88x31-2.svg.png">
</a>

Mofish-Plugin-Proxy 这个插件使用了MIT协议，意味着你只要别玩的太过火，问题都不大。详细License信息请点击上图↑。
