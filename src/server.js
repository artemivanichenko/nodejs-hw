import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routers/router.js';

const app = express();
app.set('json spaces', 8); //Настройка по виду отображения json файла
app.use(cors());
app.use('/api/v1', router);

const PORT = process.env.PORT ?? 3030;

app.get('/', (req, res) => {
  res.send('<h1>Main page</h1>');
});

app.get('/contacts', (req, res) => {
  res.send('<h1>Сontacts</h1>');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found',
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Server is running on port: http://localhost:${PORT}`);
});
