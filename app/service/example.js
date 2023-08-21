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

	async updateExample({ name, id }) {
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

	async deleteExample(id) {
		const { ctx, app } = this
		try {
			let result = await app.mysql.delete('list', { id }) // 这里是物理删除。实际操作是加个字段（如status:boolean），通过该字段来做逻辑删除
			return result
		} catch (error) {
			console.log(error)
			return null
		}
	}
}
module.exports = ExampleService
