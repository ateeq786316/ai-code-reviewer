import { Router } from 'express';
import { handleGitHubWebhook } from '../controllers/githubWebhookController';
const router = Router();
router.post('/webhook/github', handleGitHubWebhook);
export default router;
