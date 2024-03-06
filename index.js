const express = require('express')
const app = express()
const port = 3001
const { exec, spawn } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.json({ limit: "15mb" }));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/remove', async (req, res) => {
  if (!req.body.base64) {
    return res.status(400).send({ error: 'Data not provided in the request body.' });
  }

  const dataToWrite = req.body.base64.split(",")[1];

  const filePath = uuidv4() + ".txt"

  fs.writeFile(filePath, dataToWrite, 'utf-8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send({ error: err/* 'Internal Server Error' */ });
    }

    const pythonProcess = spawn('python', ['remove.py', filePath]);

    let stdoutData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        //console.log('Python command output:', stdoutData);
        res.status(200).send(stdoutData);
      } else {
        console.error(`Python script exited with code ${code}`);
        res.status(500).send({ error: 'Internal Server Error' });
      }

      // Optionally, you may want to delete the temporary file after processing
      fs.unlink(filePath, (unlinkError) => {
        if (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log("sever running at http://localhost:" + port)
})