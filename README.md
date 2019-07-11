# url-shortener-serverless
This url shorten/lengthen service runs on AWS lambda and uses S3 bucket to store the urls.

## Usage
To shorten a url:
```
shorten.bat <url>
```

To lengthen a short url:
```
lengthen.bat <short url>
```

## Setup
This solution uses serverless to deploy to AWS. To setup serverless:
```
npm install serverless -g
serverless config credentials --provider aws --key <your aws key> --secret <your aws secert>
```

## Deploy
To deploy code changes to AWS:
```
serverless deploy
```

## Test
This solution uses jest and aws-sdk-mock for testing. To setup:
```
npm install --save-dev jest
npm install aws-sdk-mock --save-dev
```

To run the tests:
```
npm test
```