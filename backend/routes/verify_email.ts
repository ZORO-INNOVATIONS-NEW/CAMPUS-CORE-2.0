import express from 'express';
import * as controllers from '#controllers/verify_email.ts';

const router = express.Router();

router.get('/verify-email', controllers.verifyEmail);

export default router;
