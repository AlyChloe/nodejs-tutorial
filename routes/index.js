const express = require('express');
const router = express.Router();

// Callback will run when someone visits this URL
// Function will give 3 things: 
// 1) request (object full of information coming in)
// 2) response (object full of methods sending back to the user)
// 3) next (
router.get('/', (req, res) => {
  const chloe = { name: 'Chloe', age: 27, cool: true};
  //res.send('Hey! It works!');
  //res.json(chloe);
  //res.send(req.query.name); // /?name=chloe&age=27
  res.json(req.query); // returns json query	
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});
module.exports = router;
