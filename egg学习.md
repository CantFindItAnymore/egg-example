# 一. Egg项目结构

使用以下命令行可快速初始化一个egg项目

```js
$ mkdir egg-example && cd egg-example
$ npm init egg --type=simple
$ npm i
```

## 1. app/router.js

用于配置 URL 路由规则。

## 2. app/controller/xx

用于解析用户的输入，处理后返回相应的结果。

## 3. app/service/xx

用于数据库的查询，我们尽量将`Service` 层粒度细化，这样以便多个 `Controller` 共同调用同一个 `Service`。

## 4. app/middleware/xx

在路由配置里设置了中间件的路由，每次请求命中后，都要过一层中间件。

## 5. app/public/xx

用于放置静态资源。当然更好的选择是OSS。

## 6. config/config.{env}.js

用于编写配置文件。默认有个`config/config.default.js`文件，可以在内部设置一些全局的配置常量。在任何地方都可以通过 `app.config` 获取到 `config.default.js` 文件内的配置项，如`app.config.jwt.secret`。

## 7. config/plugin.js

用于配置需要加载的插件。比如 `egg-mysql`、`egg-cors`、`egg-jwt` 等官方提供的插件。

在任何地方都可以通过 `app` 获取到 `config.plugin.js` 文件内的配置项，如 `app.mysql`、`app.jwt` 等。

# 二. 接口实践

通过几个简单的例子，能够更快地上手接口开发。

## 1. get请求

```js
// app/router.js
module.exports = app => {
	const { router, controller } = app
	router.get('/', controller.example.index)
}
```

```js
// app/controller/example.js
const { Controller } = require('egg')

class ExampleController extends Controller {
	async index() {
		const { ctx } = this
		ctx.body = 'hi, egg'
	}
}

module.exports = ExampleController
```

这就实现了一个最简单的接口，访问/路由，返回`hi，egg`。

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-24-14-58-24-image.png)

## 2. 动态路由的get请求

```js
// app/router.js
module.exports = app => {
    const { router, controller } = app
	router.get('/getExample/:id', controller.example.getExample)
}
```

```js
// app/controller/example.js
const { Controller } = require('egg')

class ExampleController extends Controller {
    async getExample() {
		const { ctx } = this
		ctx.body = ctx.params.id
	}
}

module.exports = ExampleController
```

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-13-26-45-image.png)

## 3. post请求

```js
// app/router.js
module.exports = app => {
    const { router, controller } = app
	router.post('/postExample', controller.example.postExample)
}
```

```js
// app/controller/example.js
const { Controller } = require('egg')

class ExampleController extends Controller {
    async postExample() {
		const { ctx } = this
		const { title = 'this is a post request' } = ctx.request.body
		// Egg 框架内置了 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到 ctx.request.body 上
		ctx.body = {
			title,
		}
	}
}

module.exports = ExampleController
```

这里需要配置一下cors和csrf（跨站请求伪造）

```js
//...
config.security = {
	csrf: {
		enable: false,
		ignoreJSON: true,
	},
	domainWhiteList: ['*'], // 配置跨域白名单
}
//...
```



![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-13-35-04-image.png)

# 三. 本地环境

只讲mac。

## 1. 数据库

数据库选择MySQL。后面再研究下MongoDB。

安装地址：`https://dev.mysql.com/downloads/mysql/`

下载完成之后，点击安装，按照步骤往下走，一定要记住自己设置的初始密码，因为后续链接数据库，需要这里设置的密码。

安装完成后，命令行输入

```js
mysql -u root -p
```

会提示「commod not found」，我们还需要将 `mysql` 加入系统环境变量。

进入``/usr/local/mysql/bin`，查看有无mysql

```js
cd /usr/local/mysql/bin
ls
```

有的话继续下一步

```js
vim ~/.bash_profile
```

打开之后，点击i键进入编辑模式，在 `.bash_profile` 中添加 `mysql/bin` 的目录↓

```js
PATH=${PATH}:/usr/local/mysql/bin
```

结束后点击键盘 「esc」退出编辑，输入 「:wq」回车保存。

最后输入以下命令使配置生效↓

```js
source ~/.bash_profile
```

再次尝试登录数据库

```js
mysql -u root -p
```

完美~

此时就可以开启服务器了

```js
mysql.server start
```

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-24-15-14-25-image.png)

## 2. 数据库gui工具

图形化工具很多，推荐用NaviCat。咱用个免费的

 DBevaer https://dbeaver.io/download/

选择MySQL数据库，输入之前安装MySQL时设置的密码。成功连接后进入到主界面↓

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-24-15-26-30-image.png)



现在工具齐全了，我们新建一个数据库给我们的egg项目使用。

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-24-15-47-24-image.png)

然后新建一个表

再新建一个列，取名id。没错，这就是主键，所以非空和自建都勾选上，数据类型选`INT`。

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-24-16-39-01-image.png)

然后我们要新建一个约束↓`id`右键 -> 新建约束

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-24-15-55-43-image.png)

点击确定，保存list表。

同样的步骤，我们再新增一个列，属性名叫name，是longText数据类型。

最后切换到数据面板，手动新增2条数据。如下。记得保存。

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-24-17-51-31-image.png)

接下来，我们使用egg获取数据库中的数据。

```js
npm install egg-mysql
```

然后在`config/plugin.js`中添加相关配置

```js
/** @type Egg.EggPlugin */
module.exports = {
	mysql: {
		enable: true,
		package: 'egg-mysql',
	},
}
```

然后在`config/config.default.js`中添加连接数据库的配置项

```js
//...
config.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'localhost',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: '数据库密码', // 初始化密码，没设置的可以不写
    // 数据库名
    database: 'test', // 我们新建的数据库名称
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
//...
```

我在这里遇到个问题，修改上面配置后，服务报错`# ER_NOT_SUPPORTED_AUTH_MODE`。

- 原因：目前，最新的mysql模块并未完全支持MySQL 8的“caching_sha2_password”加密方式，而“caching_sha2_password”在MySQL 8中是默认的加密方式。因此，下面的方式命令是默认已经使用了“caching_sha2_password”加密方式，该账号、密码无法在mysql模块中使用。

- 解决方案：重新修改用户root的密码，并指定mysql模块能够支持的加密方式
  
  ```js
  mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '数据库密码'
  ```

终于配置好啦！然后就可以开始开始写业务代码了，我们先实现一套简单的增删查改。

# 四. 实现CURD

## 1. 查

```js
// app/router.js
module.exports = app => {
    const { router, controller } = app
    router.get('/readExample', controller.example.readExample)
}
```

```js
// app/controller/example.js
const { Controller } = require('egg')

class ExampleController extends Controller {
    async readExample() {
        const { ctx } = this
        // ctx.body = ctx.params.id
        const result = await ctx.service.example.readExample()
        ctx.body = result
    }
}

module.exports = ExampleController
```

```js
// app/service/example.js
const Service = require('egg').Service

class ExampleService extends Service {
    async readExample() {
		const { ctx, app } = this
		const QUERY_STR = 'id, name'
		let sql = `select ${QUERY_STR} from list` // sql 语句
		try {
			const result = await app.mysql.query(sql) // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
			return result
		} catch (error) {
			console.log(error)
			return null
		}
	}
}
module.exports = ExampleService
```

这个时候访问/readExample路由，可以拿到数据了。

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-13-37-53-image.png)

## 2. 增

```js
// app/router.js
module.exports = app => {
    const { router, controller } = app
    router.get('/createExample', controller.example.createExample)
}
```

```js
// app/controller/example.js
const { Controller } = require('egg')

class ExampleController extends Controller {
    async createExample() {
		const { ctx } = this
		const { name } = ctx.request.body
		try {
			const result = await ctx.service.example.createExample(name)
			ctx.body = {
				code: 200,
				msg: '添加成功',
				data: null,
			}
		} catch (error) {
			ctx.body = {
				code: 500,
				msg: '添加失败',
				data: null,
			}
		}
	}
}

module.exports = ExampleController
```

```js
// app/service/example.js
const Service = require('egg').Service

class ExampleService extends Service {
    async createExample(name) {
		const { ctx, app } = this
		try {
			const result = await app.mysql.insert('list', { name }) // 给 list 表，新增一条数据
			return result
		} catch (error) {
			console.log(error)
			return null
		}
	}
}
module.exports = ExampleService
```

用postman调用该接口

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-13-54-24-image.png)

然后用DBeaver查看数据库

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-13-55-21-image.png)

再看看/readExample接口返回

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-13-55-54-image.png)

## 3. 改

```js
// app/router.js
module.exports = app => {
    const { router, controller } = app
    router.get('/updateExample', controller.example.updateExample)
}
```

```js
// app/controller/example.js
const { Controller } = require('egg')

class ExampleController extends Controller {
    async updateExample() {
        const { ctx } = this
        const { name,id } = ctx.request.body
        try {
            const result = await ctx.service.example.updateExample({name,id})
            ctx.body = {
                code: 200,
                msg: '编辑成功',
                data: null,
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '编辑失败',
                data: null,
            }
        }
    }
}

module.exports = ExampleController
```

```js
// app/service/example.js
const Service = require('egg').Service

class ExampleService extends Service {
    async updateExample({name,id}) {
        const { ctx, app } = this
		try {
			let result = await app.mysql.update(
				'list',
				{ name },
				{
					where: {
						id,
					},
				}
			)
			return result
		} catch (error) {
			console.log(error)
			return null
		}
    }
}
module.exports = ExampleService
```

用postman调用该接口

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-14-06-31-image.png)

再看看/readExample接口返回

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-14-06-47-image.png)



## 4. 删

```js
// app/router.js
module.exports = app => {
    const { router, controller } = app
    router.get('/leteExample', controller.example.deleteExample)
}
```

```js
// app/controller/example.js
const { Controller } = require('egg')

class ExampleController extends Controller {
	const { ctx } = this
	const { id } = ctx.request.body
	try {
		const result = await ctx.service.example.deleteExample(id)
		ctx.body = {
			code: 200,
			msg: '删除成功',
			data: null,
		}
	} catch (error) {
		ctx.body = {
			code: 500,
			msg: '删除失败',
			data: null,
		}
	}
}

module.exports = ExampleController
```

```js
// app/service/example.js
const Service = require('egg').Service

class ExampleService extends Service {
	const { ctx, app } = this
	try {
		let result = await app.mysql.delete('list', { id }) // 这里是物理删除。实际操作是加个字段（如status:boolean），通过该字段来做逻辑删除
		return result
	} catch (error) {
		console.log(error)
		return null
	}
}
module.exports = ExampleService
```

用postman调用该接口

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-15-23-31-image.png)

再看看/readExample接口返回

![](/Users/rjx/Library/Application%20Support/marktext/images/2023-02-27-15-24-12-image.png)

# 五. 使用JWT实现鉴权


