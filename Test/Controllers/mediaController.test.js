const expect = require('chai').expect;
const assert = require('chai').assert;
const describe = require('mocha').describe;
const it = require('mocha').it;
const MediaController = require('../.././Controllers/mediaController');
const mediaController = new MediaController();
const app = require('../.././server');
const request = require("express");
const chai = require('chai');
describe('mediaController', () => {
    it('should return a 200 status code', async () => {
        const res = await request().get('/medias');
        expect(res.status).to.equal(200);
    });
});

// Path: Test/Controllers/mediaController.test.js
// Compare this snippet from Routes/eventmediaRoutes.js:
// const express = require('express');
// const EventMediaController = require('../Controllers/eventmediaController');
//
