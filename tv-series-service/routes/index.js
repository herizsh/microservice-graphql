const router = require('express').Router()
const TVSeriesController = require('../controllers/TVSeriesController')

router.get('/tvseries', TVSeriesController.findAll)
router.get('/tvseries/:id', TVSeriesController.findOne)
router.post('/tvseries', TVSeriesController.create)
router.put('/tvseries/:id', TVSeriesController.update)
router.delete('/tvseries/:id', TVSeriesController.delete)

module.exports = router
