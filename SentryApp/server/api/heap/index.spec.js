/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var heapCtrlStub = {
  index: 'heapCtrl.index',
  show: 'heapCtrl.show',
  create: 'heapCtrl.create',
  upsert: 'heapCtrl.upsert',
  patch: 'heapCtrl.patch',
  destroy: 'heapCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var heapIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './heap.controller': heapCtrlStub
});

describe('Heap API Router:', function() {
  it('should return an express router instance', function() {
    expect(heapIndex).to.equal(routerStub);
  });

  describe('GET /api/heaps', function() {
    it('should route to heap.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'heapCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/heaps/:id', function() {
    it('should route to heap.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'heapCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/heaps', function() {
    it('should route to heap.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'heapCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/heaps/:id', function() {
    it('should route to heap.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'heapCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/heaps/:id', function() {
    it('should route to heap.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'heapCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/heaps/:id', function() {
    it('should route to heap.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'heapCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
