import mongoose from 'mongoose';
import {registerEvents} from './heap.events';

var HeapSchema = new mongoose.Schema({
  name: String,
  nodes: Array,
  nodesById: Array,
  edges: Array
});

registerEvents(HeapSchema);
export default mongoose.model('Heap', HeapSchema);
