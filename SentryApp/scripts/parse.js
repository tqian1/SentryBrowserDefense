var fs = require('fs');
var parser = require('heapsnapshot-parser');

var snapshotFile = fs.readFileSync('./Heap-20190409T023751.heapsnapshot', {encoding: "utf-8"});
var snapshot = parser.parse(snapshotFile);

for (var i = 0; i < snapshot.nodes.length; i++) {
    var node = snapshot.nodes[i];
    console.log(node.toShortString());
}
