import express from 'express';
import DatabaseService from '../services/DatabaseService';

const router = express.Router();
const databaseService = new DatabaseService();

router.get('/', async (req, res) => {
  if (!req.query.startDate) {
    return res.status(400).send('Required query param startDate is missing');
  }
  const startDate = req.query.startDate;
  const endDate = req.query.endDate || new Date();
  const posts = await databaseService.getPostsByDateRange(startDate, endDate);
  res.send(posts);
});

module.exports = router;
