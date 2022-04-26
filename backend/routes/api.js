var express = require("express");
var router = express.Router();
var fs = require("fs");
const multer = require("multer");
const spawn = require("child_process").spawn;
var path = require("path");
const { send } = require("process");
var projectIndex = 3;
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
    let file = path.resolve(
      __dirname +
        `/../json/project${projectIndex}/${
          req.files[0]["originalname"].split(".")[0]
        }.json`
    );
    console.log(file);
    fs.readFile(file, "utf-8", function (err, data) {
      if (err) {
        res.send("文件读取失败");
      } else {
        projectIndex += 1;
        res.send({
          dirname: `project${projectIndex - 1}`,
          filelist: req.files,
          firstData: data,
        });
      }
    });
  });
});

module.exports = router;
