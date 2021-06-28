import cors from 'cors';
import express from 'express';
 
const app = express();
 
app.use(cors());

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);