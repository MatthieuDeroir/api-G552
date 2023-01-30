const expect = require('chai').expect;
const MediaController = require('../.././Controllers/mediaController');
const sinon = require('sinon');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const media = new MediaController();

describe('MediaController', () => {
    describe('create', () => {
        it('should create a new media', (done) => {
            const req = {
                file: {
                    originalname: 'test.jpg',
                    buffer: new Buffer.from('abcdef')
                }
            };
            const res = {
                status: sinon.stub().returns({ json: sinon.spy() }),
                json: sinon.spy()
            };
            const mediaStub = sinon.stub(media.media, 'create').resolves({});
            media.create(req, res);
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({})).to.be.true;
            expect(mediaStub.calledWith(req.file)).to.be.true;
            mediaStub.restore();
            done();
        });
        it('should return error if fails to create a new media', (done) => {
            const req = {
                file: {
                    originalname: 'test.jpg',
                    buffer: new Buffer.from('abcdef')
                }
            };
            const res = {
                status: sinon.stub().returns({ json: sinon.spy() }),
                json: sinon.spy()
            };
            const mediaStub = sinon.stub(media.media, 'create').rejects({message: 'Error'});
            media.create(req, res);
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({message: 'Error'})).to.be.true;
            expect(mediaStub.calledWith(req.file)).to.be.true;
            mediaStub.restore();
            done();
        });
    });
});
