import express from 'express';
import 'dotenv/config';
import path from 'node:path';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

// абсолютний шлях до робочої директорії
// const pathToWorkDir = path.join(process.cwd());

// додаємо нові частини до шляху
// const pathToFile = path.join(pathToWorkDir, 'some_folder', 'some_file.txt');

// macOS → /коренева_папка/some_folder/some_file.txt
// Windows → C:\\\\коренева_папка\\\\some_folder\\\\some_file.txt

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
