import path from 'path'
import express from 'express'

const app = express()

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let port = process.env.PORT || 8080

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + port);
});
