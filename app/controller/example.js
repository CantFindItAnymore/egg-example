const { Controller } = require('egg')

class ExampleController extends Controller {
	// GET/带参数的GET/POST
	async index() {
		const { ctx } = this
		ctx.body = 'hi, egg'
	}
	async getExample() {
		const { ctx } = this
		ctx.body = ctx.params.id
	}
	async postExample() {
		const { ctx } = this
		const { title = 'this is a post request' } = ctx.request.body
		// Egg 框架内置了 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到 ctx.request.body 上
		ctx.body = {
			title,
		}
	}

	// CURD
	async readExample() {
		const { ctx } = this
		const result = await ctx.service.example.readExample()
		ctx.body = result
	}
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

	async updateExample() {
		const { ctx } = this
		const { id, name } = ctx.request.body
		try {
			const result = await ctx.service.example.updateExample({ id, name })
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
	async deleteExample() {
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
}

module.exports = ExampleController
