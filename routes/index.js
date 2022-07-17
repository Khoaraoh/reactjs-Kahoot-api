import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Connect with server API')
})

export default router;