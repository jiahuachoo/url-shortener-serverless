const AWS = require('aws-sdk-mock')
const handler = require('../handler')
const utils = require('../utils')

describe('Mock S3 operations', () => {
  beforeEach(() => {
    process.env.s3_bucket = "test_bucket";
    process.env.base_url = "http://jc.test/";
  });

  afterEach(() => {
    delete process.env.s3_bucket;
    delete process.env.base_url;
    AWS.restore("S3");
  });

  test('Should return error response if url is invalid', async () => {
    const event = {body : "{ \"url\": \"fake url\"}"};
    const context = {};

    await handler.lengthen(event, context)
      .then(data => {
        expect(data.statusCode).toBe(400);
        expect(JSON.parse(data.body).message).toBe("fake url is invalid. Please contact hire.me.jiachoo@gmail.com")
      })
      .catch(e => {
        expect(e).toBe('');
      });
    
  });

  test('Should return long url in response', async () => {

    const expectedFullUrl = 'http://www.nintex.com';
    const event = {body : "{ \"url\": \"http://jc.test/abcdef\"}"};
    const context = {};
    AWS.mock("S3", "getObject", (params, callback) => {
        data = {}
        data.Body = Buffer.from(expectedFullUrl)
        callback(null, data)
    });
    
    await handler.lengthen(event, context)
      .then(data => {
        expect(data.statusCode).toBe(200);
        expect(JSON.parse(data.body).url).toBe(expectedFullUrl);
      })
      .catch(e => {
        expect(e).toBe('');
      });
    
  });

  test('Should return error message if short url is not found.', async () => {

    const event = {body : "{ \"url\": \"http://jc.test/abcdef\"}"};
    const context = {};

    AWS.mock("S3", "getObject", (params, callback) => {
        data = {}
        data.Body = ''
        callback(null, data)
        
      });
     
    await handler.lengthen(event, context)
      .then(data => {
        expect(data.statusCode).toBe(400);
        expect(JSON.parse(data.body).message).toBe('Failed to find full url for http://jc.test/abcdef. Please contact hire.me.jiachoo@gmail.com')
      })
      .catch(e => {
        expect(e).toBe('');
      });
    
  });
});