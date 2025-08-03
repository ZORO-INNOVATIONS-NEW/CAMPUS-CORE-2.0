import express from 'express';
import { getAllRoles, createRole } from '../../controllers/admin/roleController';
const router = express.Router();

router.get('/', getAllRoles);
router.post('/',createRole);

export default router;