const express = require('express');
const routes = require('../../routes/')
const request = require('supertest');

const app = express();
app.use("/", routes);

describe('testing server routes', () => {
    test('GET /time - success', async () => {
        const response = await request(app).get("/time")

        expect(response.body).toEqual({
            epoch: 1
        })
    });
});