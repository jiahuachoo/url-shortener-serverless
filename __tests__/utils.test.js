const utils = require('../utils');

test('short form hash is generated', () => {
    expect(utils.computeShortHashString('abc').length).toBe(7);
});

test('short form hash is generated even if string is empty', () => {
    expect(utils.computeShortHashString('').length).toBe(7);
});

describe('should pass url validation', () => {
    const data = [
      ['http://www.google.com', true],
      ['https://www.google.com', true],
      ['https://www.seek.com.au/job/39448033?type=standout&searchrequesttoken=7b636baa-edc5-4aa6-9c7e-4137472d3cea', true],
    ];
    test.each(data)('should pass url validation for %s', (input, expected) => {
        expect(utils.validateUrl(input)).toBe(expected);
    });
});

describe('should fail url validation', () => {
    const data = [
      ['www.google.com', false],
      ['www', false],
      ['123', false],
      ['http://..www.google.com', false],
      ['http:,,,', false]
    ];
    test.each(data)('should fail url validation for %s', (input, expected) => {
        expect(utils.validateUrl(input)).toBe(expected);
    });
});