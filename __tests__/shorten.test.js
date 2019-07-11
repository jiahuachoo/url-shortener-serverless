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

    await handler.shorten(event, context)
      .then(data => {
        expect(data.statusCode).toBe(400);
        expect(JSON.parse(data.body).message).toBe("fake url is invalid. Please contact hire.me.jiachoo@gmail.com")
      })
      .catch(e => {
        expect(e).toBe('');
      });
    
  });

  test('Should return short url in response', async () => {

    const event = {body : "{ \"url\": \"http://www.nintex.com\"}"};
    const context = {};
    AWS.mock("S3", "getObject", (params, callback) => {
        data = {}
        data.Body = Buffer.from('')
        callback(null, data)
    });
    
    AWS.mock("S3", "putObject", (params, callback) => {
        
        callback(null, data)
        expect(params.Key).toBe('aabbcc')
    });

    const mock = jest.spyOn(utils, 'computeShortHashString');
    mock.mockImplementation(() => 'aabbcc'); 
    await handler.shorten(event, context)
      .then(data => {
        expect(data.statusCode).toBe(200);
        expect(JSON.parse(data.body).url).toBe('http://jc.test/aabbcc');
      })
      .catch(e => {
        expect(e).toBe('');
      });
    
  });

  test('Should not store into bucket if url already present', async () => {

    const event = {body : "{ \"url\": \"http://www.nintex.com\"}"};
    const context = {};

    AWS.mock("S3", "getObject", (params, callback) => {
        data = {}
        data.Body = Buffer.from('present')
        callback(null, data)
      });
    
    AWS.mock("S3", "putObject", (params, callback) => {
        callback(null, data)
        expect(true).toBe(false); // should not have reached here.
      });

    const mock = jest.spyOn(utils, 'computeShortHashString');
    mock.mockImplementation(() => 'aabbcc'); 
    await handler.shorten(event, context)
      .then(data => {
        expect(data.statusCode).toBe(200);
        expect(JSON.parse(data.body).url).toBe('http://jc.test/aabbcc')
      })
      .catch(e => {
        expect(e).toBe('');
      });
    
  });
});