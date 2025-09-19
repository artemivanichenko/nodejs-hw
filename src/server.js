import 'dotenv/config';
import express from 'express';

const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('<h1>Main page</h1>');
  res.json({
    message: 'Server is running!',
    port: PORT,
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
