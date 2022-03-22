const authMiddleware = require('../../middleware/auth')

process.env.API_TOKEN = 'testtoken'

describe('Test basic auth functionality', () => {
    const nextFunctionmock = jest.fn()
    const mockRequest = (authorization) => {
        return {
            headers: {
                authorization
            }
        }
    }
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    test('it should return 403 code when authorization header is missing', async () => {
        const req = mockRequest()
        const resp = mockResponse()
        await authMiddleware(req, resp, nextFunctionmock)
        expect(resp.status).toHaveBeenCalledWith(403)
    })
    test('it should return 403 code when authorization header is incorrect', async () => {
        const req = mockRequest('faketoken')
        const resp = mockResponse()
        await authMiddleware(req, resp, nextFunctionmock)
        expect(resp.status).toHaveBeenCalledWith(403)
    })
    test('it should call next when authorization header is correct', async () => {
        const req = mockRequest(process.env.API_TOKEN)
        const resp = mockResponse()
        await authMiddleware(req, resp, nextFunctionmock)
        expect(nextFunctionmock).toHaveBeenCalled()
    })
})