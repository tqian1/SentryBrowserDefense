import Heap from './heap.model';

var express = require('express');
var controller = require('./heap.controller');
var router = express.Router();

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './snapshots/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split("-")[1].split(".")[0])
  }
})
var upload = multer({storage: storage}).single('file');

var fs = require('fs');
var parser = require('heapsnapshot-parser');

router.get('/', function (req, res, next) {
  fs.readdir('./snapshots', function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    return res.send(files);
  });
});
router.get('/:id', controller.show);
router.post('/', function (req, res, next) {
  // no error so lets parse it
  var snapshotFile = fs.readFileSync(req.body.id, {encoding: "utf-8"});
  var snapshot = parser.parse(snapshotFile);

  for (var i = 0; i < snapshot.nodes.length; i++) {
      var node = snapshot.nodes[i];
      console.log(node.toShortString());
  }
});
router.post('/upload', function (req, res, next) {
    var path = '';
    upload(req, res, function (err) {
      if (err) {
        // upload error return the error
        console.log(err);
        return res.status(422).send("an Error occured")
      }
    // return successful path to file uploaded
    path = req.file.path;
    return res.send("Upload Completed for "+path);
  });
});
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
