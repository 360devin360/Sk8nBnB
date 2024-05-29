const router = require('express').Router()
const {requireAuth} = require('../../utils/auth');


router
    .delete('/:imageId',requireAuth, async())

module.exports = router