import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import pino from 'pino-http';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(cors());
app.use(express.json());

app.get('/notes', (req, res) => {
  res.json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  res.json({ message: `Retrieved note with ID: ${req.params.noteId}` });
});

app.get('/test-error', (req, res, next) => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});
app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message || 'повідомлення про помилку',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
