import axios from 'axios';
import { Request, Response } from 'express';
import { reviewCodeWithAI } from '../services/codeReviewService';

export const handleGitHubWebhook = async (req: Request, res: Response) => {
  const event = req.headers['x-github-event'] as string || 'none';
  const action = req.body?.action || 'none';

  console.log(`📦 GitHub Webhook Received: ${event} - ${action}`);

  if (event === 'pull_request' && (action === 'opened' || action === 'synchronize')) {
    const pr = req.body.pull_request;
    console.log('🧠 PR Data:', {
      title: pr.title,
      url: pr.html_url,
      diff_url: pr.diff_url
    });

    try {
      const diffResponse = await axios.get(pr.diff_url);
      const diffContent = diffResponse.data;

      // Optional: limit to first 5000 chars if needed
      const trimmedDiff = diffContent.slice(0, 5000);

      const aiReview = await reviewCodeWithAI(trimmedDiff);

      return res.status(200).json({
        message: 'AI Review Complete',
        aiReview
      });
    } catch (err) {
      console.error('❌ Error fetching diff or reviewing code:', err);
      return res.status(500).json({ message: 'Error fetching diff or reviewing code' });
    }
  }

  return res.status(200).json({ message: 'Webhook received' });
};
