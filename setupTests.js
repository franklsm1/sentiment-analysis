const fetchMock = require('fetch-mock');
jest.setMock('node-fetch', fetchMock.sandbox());