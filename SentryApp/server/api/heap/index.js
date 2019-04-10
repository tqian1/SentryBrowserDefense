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
    cb(null, file.originalname)
  }
})
var upload = multer({storage: storage}).single('file');

var fs = require('fs');
var parser = require('heapsnapshot-parser');

router.get('/', controller.index);
router.get('/:id', function (req, res, next) {
    // retrieve the snapshot object
    var snapshotFile = fs.readFileSync(req.file.path, {encoding: "utf-8"});
    var snapshot = parser.parse(snapshotFile);
    // lets make the object
    Heap.create({
      filename: req.file.filename,
      filepath: req.file.path,
      date: new Date().toString(),
      nodeCount: snapshot.nodes.length,
      edgeCount: snapshot.edges.length,
    });

    return res.send();
});
router.post('/', function (req, res, next) {
    var path = '';
    upload(req, res, function (err) {
      if (err) {
        // upload error return the error
        console.log(err);
        return res.status(422).send("an Error occured")
      }
      
      // no error so lets parse it
      var snapshotFile = fs.readFileSync(req.file.path, {encoding: "utf-8"});
      var snapshot = parser.parse(snapshotFile);
      // lets make the object
      Heap.create({
        filename: req.file.filename,
        filepath: req.file.path,
        date: new Date().toString(),
        nodeCount: snapshot.nodes.length,
        edgeCount: snapshot.edges.length,
      });

      // return successful path to file uploaded
      path = req.file.path;
      return res.send("Upload Completed for "+path);
    });
});
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
