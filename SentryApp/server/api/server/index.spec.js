'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var serverCtrlStub = {
  index: 'serverCtrl.index',
  show: 'serverCtrl.show',
  create: 'serverCtrl.create',
  update: 'serverCtrl.update',
  destroy: 'serverCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var serverIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './server.controller': serverCtrlStub
});

describe('Server API Router:', function() {

  it('should return an express router instance', function() {
    expect(serverIndex).to.equal(routerStub);
  });

  describe('GET /api/servers', function() {

    it('should route to server.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'serverCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/servers/:id', function() {

    it('should route to server.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'serverCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/servers', function() {

    it('should route to server.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'serverCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/servers/:id', function() {

    it('should route to server.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'serverCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/servers/:id', function() {

    it('should route to server.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'serverCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/servers/:id', function() {

    it('should route to server.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'serverCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
