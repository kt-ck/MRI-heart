var express = require("express");
var router = express.Router();
var fs = require("fs");
const multer = require("multer");
const spawn = require("child_process").spawn;
var path = require("path");
const { send } = require("process");
var projectIndex = 4;
let edvList = [];
let edvCal = {};
let edvCnt = 1;
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
const parseText = (areaText) => {
  return areaText
    .split(";")
    .map((item) => item.split(","))
    .map((item) => item.map(Number));
};

const calV = (area, sliceHeight) => {
  let v = [];
  for (let i = 0; i < area.length; ++i) {
    let total = 0;
    for (let j = 0; j < area[i].length; ++j) {
      total += area[i][j] * sliceHeight;
    }
    v.push((total / 1000).toFixed(2));
  }
  return v;
};
router.post("/getReport", (req, res, next) => {
  let report = {};
  let data = req.body;

  let edvSliceArea,
    esvSliceArea,
    edevSliceArea,
    esevSliceArea,
    edd,
    esd,
    sliceHeight,
    heartRate,
    edv,
    esv,
    edev,
    esev;
  if (data["sliceHeight"]) {
    sliceHeight = parseFloat(data["sliceHeight"]);
  }
  if (data["edvText"]) {
    edvSliceArea = parseText(data.edvText);
    edv = calV(edvSliceArea, sliceHeight);
    report["edv"] = edv;
  }
  if (data["esvText"]) {
    esvSliceArea = parseText(data.esvText);
    esv = calV(esvSliceArea, sliceHeight);
    report["esv"] = esv;
    console.log(data);
  }
  if (data["edevText"]) {
    edevSliceArea = parseText(data["edevText"]);
    edev = calV(edevSliceArea, sliceHeight);
    report["edev"] = edev;
  }
  if (data["esevText"]) {
    esevSliceArea = parseText(data["esevText"]);
    esev = calV(esevSliceArea, sliceHeight);
    report["esev"] = esev;
  }
  if (data["eddText"]) {
    edd = data["eddText"].split(",").map(Number);
  }
  if (data["esdText"]) {
    esd = data["esdText"].split(",").map(Number);
  }
  if (data["heartRate"]) {
    heartRate = parseFloat(data["heartRate"]);
  }

  let EF = [];
  let strokeVolumn = [];
  let CO = [];
  if (edv && esv && edv.length === esv.length) {
    for (let i = 0; i < edv.length; ++i) {
      EF.push((((edv[i] - esv[i]) / edv[i]) * 100).toFixed(2));
      strokeVolumn.push((edv[i] - esv[i]).toFixed(2));
      if (heartRate) {
        CO.push(strokeVolumn[i] * heartRate);
      }
    }
    report["EF"] = EF;
    report["strokeVolumn"] = strokeVolumn;
    if (heartRate) {
      report["CO"] = CO;
    }
  }

  let FS = [];

  if (edd && esd && edd.length === esd.length) {
    for (let i = 0; i < edd.length; ++i) {
      FS.push((((edd[i] - esd[i]) / edd[i]) * 100).toFixed(2));
    }
    report["FS"] = FS;
  }

  let MED = [];
  let MES = [];

  if (edev && edv && edev.length === edv.length) {
    for (let i = 0; i < edev.length; ++i) {
      MED.push(((edev[i] - edv[i]) * 1.05).toFixed(2));
    }
    report["MED"] = MED;
  }

  if (esev && esv && esev.length === esv.length) {
    for (let i = 0; i < edev.length; ++i) {
      MES.push(((esev[i] - edv[i]) * 1.05).toFixed(2));
    }
    report["MES"] = MES;
  }

  res.send(report);
});

module.exports = router;
