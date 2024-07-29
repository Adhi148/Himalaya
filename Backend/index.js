const express = require('express');
const AWS = require('aws-sdk');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

// Configure AWS SDK
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'AKIAVA2HPKPGSF2WQPID',
  secretAccessKey: '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'
});

const s3 = new AWS.S3();

app.get('/records/:filename', (req, res) => {
  const bucketName = 'oneclick-data';
  const filename = req.params.filename; // Get filename from URL parameter
  const key = `ETL_Data/${filename}`; // Use filename in the S3 key
  const results = [];

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const s3Stream = s3.getObject(params).createReadStream();

  s3Stream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json({ data: results });
    })
    .on('error', (err) => {
      console.error('Error parsing CSV:', err);
      res.status(500).send('Error parsing CSV');
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
