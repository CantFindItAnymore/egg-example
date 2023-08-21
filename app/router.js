/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app
	router.get('/', controller.example.index)
	router.get('/getExample/:id', controller.example.getExample)
	router.post('/postExample', controller.example.postExample)

	router.get('/readExample', controller.example.readExample)
	router.post('/createExample', controller.example.createExample)
	router.post('/updateExample', controller.example.updateExample)
	router.post('/deleteExample', controller.example.deleteExample)
}
