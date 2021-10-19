import { Router } from 'express';
const router = Router();

// import main from './main.js';
//router.use('/main', main);

import login from './login.js';
router.use('/login', login);

export default router;