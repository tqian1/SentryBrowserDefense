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
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/upload', function (req, res, next) {
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

       for (var i = 0; i < snapshot.nodes.length; i++) {
           var node = snapshot.nodes[i];
           console.log(node.toShortString());
       }
      path = req.file.path;
      return res.send("Upload Completed for "+path);
  });
});
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
