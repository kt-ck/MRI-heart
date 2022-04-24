var express = require('express');
var router = express.Router();
var fs = require("fs");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const spawn = require("child_process").spawn;
var path = require("path");


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/uploadDicom',upload.array('files'),function(req,res,next){
    const file = req.files[0]
    const filename = file.filename
    console.log(0)
    const pythonProcess = spawn('python',["./pythonFile/getInfo.py", filename]);
    pythonProcess.stdout.on('data', (data) => {
      // console.log(data.toString())   
      // console.log(path.resolve(__dirname+`/../public/images/dicom_img/${filename}.png`))   
      // res.sendFile(path.resolve(__dirname+`/../dicom_img/${filename}.png`));
      let file = path.resolve(__dirname+`/../json/${filename}.json`)
      fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
        }
      });
      
    })
});

module.exports = router;
