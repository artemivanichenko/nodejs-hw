import express from 'express';

const router = express.Router();

router.get('/', [(req, res, next) => {}], (req, res) => {});

router.get(
  '/notes',
  [
    (req, res, next) => {
      const corID = req.headers['x-correlation-id'];
      if (!corID) {
        next();
      } else {
        console.log('No corID');
      }
    },
  ],
  (req, res) => {
    console.log('All notes');
    res.json({
      message: 'All notes',
    });
  },
);

export default router;
