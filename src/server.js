import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import noteRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
// import { errors as celebrateErrorHandler } from 'celebrate';

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/', noteRoutes);
app.use('/auth', authRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
