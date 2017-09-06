'use strict';

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

/*
    Rules and Formatting for Unit Testing
    Describe First before Expect or Assert
    Do not Describe unrelated functionality outside Parent Describe
    Should take this rule also on executing Assert and Expect

    If you choose to handle vars globally and not to reinitialize redundant scopes and vars remove use strict
    Note: NOT recommended
*/


/*
    Example
*/
describe('Scenario NO.1', function() {
    var x = [1];
    describe('Test x', function() {
        it('Test length', function() {
            expect(x.length, "Should not empty").to.not.equal(0);
        });
    });
    describe('Test index 0 == 1', function() {
        it('x[0] should be 1', function() {
            assert.equal(x[0], 2, "x[0] should be above 1");
        });
    });
});