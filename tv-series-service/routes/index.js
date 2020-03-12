const router = require('express').Router()
const TVSeriesController = require('../controllers/TVSeriesController')

router.get('/movies', TVSeriesController.findAll)
router.post('/movies', TVSeriesController.create)
router.put('/movies/:id', TVSeriesController.update)
router.delete('/movies/:id', TVSeriesController.delete)

module.exports = router
