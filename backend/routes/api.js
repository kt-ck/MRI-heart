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
    for (let j = 0; j < area[i].length - 1; ++j) {
      total += ((area[i][j] + area[i][j + 1]) * sliceHeight) / 2;
    }
    v.push((total / 1000).toFixed(2));
  }
  return v;
};
router.post("/getReport", (req, res, next) => {
  let report = {};
  let data = req.body;

  let dInnerSliceArea,
    dOuterSliceArea,
    sInnerSliceArea,
    sOuterSliceArea,
    edd,
    esd,
    sliceHeight,
    heartRate,
    edv,
    edev,
    esev,
    esv;
  if (data["sliceHeight"]) {
    sliceHeight = parseFloat(data["sliceHeight"]);
  }
  if (data["dInnerText"]) {
    dInnerSliceArea = parseText(data.dInnerText);
    let tedv = calV(dInnerSliceArea, sliceHeight);
    edv = Math.max(...tedv);
    report["End-Diastolic Volume"] = edv + " ml";
  }
  if (data["dOuterText"]) {
    dOuterSliceArea = parseText(data.dOuterText);
    let tedev = calV(dOuterSliceArea, sliceHeight);
    edev = Math.max(...tedev);
    report["End-Diastolic Epicardial Volume"] = edev + " ml";
  }
  if (data["sInnerText"]) {
    sInnerSliceArea = parseText(data.sInnerText);
    let tesv = calV(sInnerSliceArea, sliceHeight);
    esv = Math.min(...tesv);
    report["End-Systolic Volume"] = esv + " ml";
  }
  if (data["sOuterText"]) {
    sOuterSliceArea = parseText(data.sOuterText);
    let tesev = calV(sOuterSliceArea, sliceHeight);
    esev = Math.min(tesev);
    report["End-Systolic Epicardial Volume"] = esev + " ml";
  }

  if (data["eddText"]) {
    edd = data["eddText"].split(",").map(Number);
    report["End-Diastolic Dimension"] = edd + " cm";
  }
  if (data["esdText"]) {
    esd = data["esdText"].split(",").map(Number);
    report["End-Systolic Dimension"] = esd + " cm";
  }
  if (data["heartRate"]) {
    heartRate = parseFloat(data["heartRate"]);
    report["heartRate"] = heartRate + " bpm";
  }

  if (edv && esv) {
    report["Ejection Fraction"] = (((edv - esv) / edv) * 100).toFixed(2) + "%";
    report["strokeVolumn"] = (edv - esv).toFixed(2);
    if (heartRate) {
      report["Cardiac Output"] =
        ((report["strokeVolumn"] * heartRate) / 1000).toFixed(2) + " l/bpm";
    }
    report["strokeVolumn"] += " ml";
  }

  if (edd && esd) {
    report["Fraction Shortening"] =
      (((edd - esd) / edd) * 100).toFixed(2) + "%";
  }

  if (edev && edv) {
    report["Mass ED"] = ((edev - edv) * 1.05).toFixed(2) + " g";
  }

  if (esev && esv) {
    report["Mass ES"] = ((esev - edv) * 1.05).toFixed(2) + " g";
  }

  res.send(report);
});

module.exports = router;
