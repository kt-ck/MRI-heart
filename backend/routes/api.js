var express = require("express");
var router = express.Router();
var fs = require("fs");
const multer = require("multer");
const spawn = require("child_process").spawn;
var path = require("path");
const { send } = require("process");
var projectIndex = 4;
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

router.get("/getExistProject", function (req, res, next) {
  const dirname = path.resolve(__dirname + "/../uploads");
  fs.readdir(dirname, function (err, dirs) {
    if (err) {
      res.sendStatus(500);
    }
    // console.log(files);
    const project = {};
    let cnt = 0;
    dirs.forEach((item) => {
      fs.readdir(path.resolve(dirname + `/${item}`), function (err, files) {
        if (err) {
          return;
        }
        project[item] = files;
        cnt += 1;
        if (cnt === dirs.length) {
          res.send(project);
        }
      });
    });
  });
});

router.post("/openProject", function (req, res, next) {
  let projectName = req.body.name;
  fs.readdir(
    path.resolve(__dirname + `/../uploads/${projectName}`),
    function (err, filelist) {
      if (err) {
        return;
      }
      fs.readdir(
        path.resolve(__dirname + `/../json/${projectName}`),
        function (err, files) {
          if (err) {
            res.send("文件打开失败");
          }
          let file = path.resolve(
            __dirname + `/../json/${projectName}/${files[0]}`
          );
          fs.readFile(file, "utf-8", (err, data) => {
            if (err) {
              res.send("文件读取失败");
            }

            res.send({
              dirname: projectName,
              filelist: filelist.map((item) => {
                return { filename: item };
              }),
              firstData: data,
            });
          });
        }
      );
    }
  );
});

router.post("/getDicomJson", (req, res, next) => {
  const projectName = req.body.projectName;
  const dicomName = req.body.dicomName["filename"];

  let filePath = path.resolve(
    __dirname + `/../json/${projectName}/${dicomName.split(".")[0]}.json`
  );

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.send("文件打开失败");
    }
    res.send({
      data,
    });
  });
});

module.exports = router;
