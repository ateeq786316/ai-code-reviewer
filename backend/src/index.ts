import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import healthRoute from './routes/healthRoute';
import githubWebhookRoute from './routes/githubWebhookRoute';
import codeReviewRoutes from './routes/codeReviewRoutes';

// console.log('🧪 Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));


app.use('/api', healthRoute);
app.use('/api', githubWebhookRoute);
app.use("/api/review", codeReviewRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
