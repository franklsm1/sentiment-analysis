import * as express from 'express';
import DatabaseService from '../services/DatabaseService';

const router = express.Router();
const databaseService = new DatabaseService();

router.get('/', async (req, res) => {
  const keywords = req.query.status
    ? await databaseService.getKeywordsByStatus(req.query.status)
    : await databaseService.getAllKeywords();
  res.send(keywords);
});

module.exports = router;
