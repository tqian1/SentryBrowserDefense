var fs = require('fs');
var parser = require('heapsnapshot-parser');

var snapshotFile = fs.readFileSync(filename, {encoding: "utf-8"});
var snapshot = parser.parse(snapshotFile);

for (var i = 0; i < snapshot.nodes.length; i++) {
    var node = snapshot.nodes[i];
    console.log(node.toShortString());
}
