require('should');

const config = require('../../config');
const request = require('supertest');
const service = require('../../server/service')(config);

describe('The express service', () => {
    describe('PUT /foo', () => {
        it('should return HTTP 404', (done) => {
            request(service)
                .put('/foo')
                .expect(404, done);
        });
    });
});

describe('PUT /service/:intent/:port', () => {
    it('should return HTTP 200 with a valid result', (done) => {
        request(service)
            .put('/service/test/9999')
            .set('X-BOT-API-TOKEN', config.botApiToken)
            .set('X-BOT-SERVICE-TOKEN', 'something')
            .expect(200)
            .end((err, res) => {
                if(err)
                    return done(err);

                res.body.result.should.startWith('test at');
                return done();
            });
    });

    it('should return HTTP 403 with no API token provide', (done) => {
        request(service)
            .put('/service/test/9999')
            .expect(403)
            .end(done);
    });

    it('should return HTTP 400 with no service API token provide', (done) => {
        request(service)
            .put('/service/test/9999')
            .set('X-BOT-API-TOKEN', config.botApiToken)
            .expect(400)
            .end(done);
    });
});