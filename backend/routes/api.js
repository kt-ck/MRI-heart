var express = require("express");
var router = express.Router();
var fs = require("fs");
const multer = require("multer");
const spawn = require("child_process").spawn;
var path = require("path");
const { send } = require("process");
var projectIndex = 2;
const storage = multer.diskStorage({
  destination(req, file, cb) {
    let dirname = `uploads/project${projectIndex}`;

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
    cb(null, dirname);
  },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });
// const upload = multer({ dest: "../uploads/" });

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/uploadDicom", upload.any("files[]"), function (req, res, next) {
  const pythonProcess = spawn("python", [
    "./pythonFile/getInfo.py",
    `project${projectIndex}`,
  ]);
  pythonProcess.stdout.on("data", (data) => {
    projectIndex += 1;
    res.send({ dirname: `project${projectIndex}`, filelist: req.files });
    // let file = path.resolve(__dirname + `/../json/project${projectIndex}/${filename}.json`);
    // fs.readFile(file, "utf-8", function (err, data) {
    //   if (err) {
    //     res.send("文件读取失败");
    //   } else {
    //     res.send(data);
    //   }
    // });
  });
});

module.exports = router;
