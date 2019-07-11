'use strict';
var AWS = require('aws-sdk');
var URL = require('url');

var utils = require('./utils')

function createShortUrl(hash) {
  return process.env.base_url + hash;
}

async function putUrlIntoBucket(urlHash, longUrl) {
  var url_in_bucket = await getFullUrlFromBucket(urlHash)
  if (url_in_bucket == '') {
    try {
      var s3 = new AWS.S3();
      const params = { Bucket: process.env.s3_bucket, Key: urlHash, Body: longUrl };
      console.log('Putting ' + urlHash + ' into bucket.')
      s3.putObject(params).promise();
    } catch (err) {
      console.log('Error putting ' + urlHash + ' into bucket.' + err)
      return false
    }
  } else {
    console.log(urlHash + ' object already exists in bucket.');
  }
  return true
}

async function getFullUrlFromBucket(shortUrl) {
  try {
    var s3 = new AWS.S3();
    const params = { Bucket: process.env.s3_bucket, Key: shortUrl };
    var data = await s3.getObject(params).promise();
    return data.Body.toString('utf-8');
  } catch(err) {
    console.log('Error retrieving ' + shortUrl +' from bucket.' + err)
  }
  return ''
}

function createResponseData(status, data) {
  return {
    statusCode: status,
    body: JSON.stringify( data, null, 2),
  };
}

function createSuccessResponse(url){
  return createResponseData(200, { url: url }) 
}

function createErrorResponse(err) {
  return createResponseData(400, { message: err + ' Please contact hire.me.jiachoo@gmail.com' })
}

module.exports.shorten = async (event) => {

  const { url } = JSON.parse(event.body)
  console.log("url received:" + url)

  if(utils.validateUrl(url)) {
    var shortHash = utils.computeShortHashString(url)
    if(putUrlIntoBucket(shortHash, url)) {
      return createSuccessResponse(createShortUrl(shortHash))
    }
    return createErrorResponse('An error has occurred while storing ' + url + '.')
  }
  return createErrorResponse(url + ' is invalid.')
};

module.exports.lengthen = async (event) => {

  const { url } = JSON.parse(event.body)
  console.log("short url received: " + url)

  if(utils.validateUrl(url) && url.startsWith(process.env.base_url)) {
    var shortUrl = URL.parse(url).pathname.substring(1)
    try {
      var fullUrl = await getFullUrlFromBucket(shortUrl)
      if(fullUrl != '') {
        return createSuccessResponse(fullUrl)
      }
      return createErrorResponse('Failed to find full url for ' + url +'.')
    } catch(e) {
      console.log(e)
      return createErrorResponse('An error has occurred while retrieving full url for ' + url +'.')
    }
  }
  return createErrorResponse(url + ' is invalid.')
};
