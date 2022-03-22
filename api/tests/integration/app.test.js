const request = require("supertest");

const app = require('../../app');

describe('authenticate requests', () => {
    test('should return a 403 code for all API requests that do not include header Authorization with value ‘mysecrettoken’.', async () => {
        const response = await request(app)
            .get("/time")
            .expect(403);
    });
    test('should return 200 if route exists and the token is valid', async () => {
        await request(app)
            .get('/time')
            .set('Authorization', process.env.API_TOKEN)
            .expect(200)
    })
    test('should return 404 if route does not exists but the token is valid', async () => {
        await request(app)
            .get('/fakeurl')
            .set('Authorization', process.env.API_TOKEN)
            .expect(404)
    })
    test('should return prometheus metrics', async () => {
        await request(app)
            .get('/metrics')
            .set('Authorization', process.env.API_TOKEN)
            .expect(200)
            .then(response => {
                //test resonse contains one of the default prometheus metrics
                expect(response.text).toContain('http_request_duration_seconds')
            })
    });
});