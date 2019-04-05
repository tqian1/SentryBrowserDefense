/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newHeap;

describe('Heap API:', function() {
  describe('GET /api/heaps', function() {
    var heaps;

    beforeEach(function(done) {
      request(app)
        .get('/api/heaps')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          heaps = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(heaps).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/heaps', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/heaps')
        .send({
          name: 'New Heap',
          info: 'This is the brand new heap!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newHeap = res.body;
          done();
        });
    });

    it('should respond with the newly created heap', function() {
      expect(newHeap.name).to.equal('New Heap');
      expect(newHeap.info).to.equal('This is the brand new heap!!!');
    });
  });

  describe('GET /api/heaps/:id', function() {
    var heap;

    beforeEach(function(done) {
      request(app)
        .get(`/api/heaps/${newHeap._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          heap = res.body;
          done();
        });
    });

    afterEach(function() {
      heap = {};
    });

    it('should respond with the requested heap', function() {
      expect(heap.name).to.equal('New Heap');
      expect(heap.info).to.equal('This is the brand new heap!!!');
    });
  });

  describe('PUT /api/heaps/:id', function() {
    var updatedHeap;

    beforeEach(function(done) {
      request(app)
        .put(`/api/heaps/${newHeap._id}`)
        .send({
          name: 'Updated Heap',
          info: 'This is the updated heap!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedHeap = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedHeap = {};
    });

    it('should respond with the updated heap', function() {
      expect(updatedHeap.name).to.equal('Updated Heap');
      expect(updatedHeap.info).to.equal('This is the updated heap!!!');
    });

    it('should respond with the updated heap on a subsequent GET', function(done) {
      request(app)
        .get(`/api/heaps/${newHeap._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let heap = res.body;

          expect(heap.name).to.equal('Updated Heap');
          expect(heap.info).to.equal('This is the updated heap!!!');

          done();
        });
    });
  });

  describe('PATCH /api/heaps/:id', function() {
    var patchedHeap;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/heaps/${newHeap._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Heap' },
          { op: 'replace', path: '/info', value: 'This is the patched heap!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedHeap = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedHeap = {};
    });

    it('should respond with the patched heap', function() {
      expect(patchedHeap.name).to.equal('Patched Heap');
      expect(patchedHeap.info).to.equal('This is the patched heap!!!');
    });
  });

  describe('DELETE /api/heaps/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/heaps/${newHeap._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when heap does not exist', function(done) {
      request(app)
        .delete(`/api/heaps/${newHeap._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
