import * as express from 'express';
import DatabaseService from '../services/DatabaseService';

const router = express.Router();

router.get('/', async (req, res) => {
  const keywords = req.query.status
    ? await DatabaseService.getKeywordsByStatus(req.query.status)
    : await DatabaseService.getAllKeywords();
  res.send(keywords);
});

module.exports = router;
