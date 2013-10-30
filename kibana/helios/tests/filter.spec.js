describe('Filter', function() {

    describe('index => [i]', function() {
        it("should return the second item", function(){
            var result = g.v().index(1).emit();
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
        });

        it("should return the second and third item", function(){
            var result = g.v().index(1,2).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
            expect(result).to.be.an('array').with.deep.property('[1]._id', 3);
        });
        it("should return the second item passing in array", function(){
            var result = g.v().index([1]).emit();
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
        });

        it("should return the second  and third item passing in array", function(){
            var result = g.v().index([1,2]).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
            expect(result).to.be.an('array').with.deep.property('[1]._id', 3);
        });
    });

    describe('range => [i..j]', function() {
        it("should return item at index 1 to 3 inclusive", function(){
            var result = g.v().range(1,3).emit();
            expect(result.length).to.be.equal(3);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
            expect(result).to.be.an('array').with.deep.property('[1]._id', 3);
            expect(result).to.be.an('array').with.deep.property('[2]._id', 4);
        });
    });

    describe('g.v(1).out.out.in.in.back(3)', function() {
        it("should return v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().out().in().in().back(3).emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
        });
    });

    describe('g.v(1).out.out.back(1)', function() {
        it("should return array len = 1 of arrays with v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().out().back(1).emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
        });
    });

    describe('g.v(1).out.out.back(1).path', function() {
        it("should return array len = 1 of arrays with v[1], v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().out().back(1).path().emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 4);
        });
    });

    describe('g.v(1).out.out.optional(1)', function() {
        it("should return array len = 3 of arrays with v[2], v[3], v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().out().optional(1).emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(3);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
            expect(result).to.be.an('array').with.deep.property('[1]._id', 4);
            expect(result).to.be.an('array').with.deep.property('[2]._id', 3);
        });
    });

    describe('g.v(1).out.out.optional(1).path', function() {
        it("should return array len = 3 of arrays with v[1] @ [0]", function(){
            g.startTrace(true);
            var result = g.v(1).out().out().optional(1).path().emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(3);
            expect(result[0].length).to.be.equal(2);
            expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 2);
            expect(result[1]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[1]).to.be.an('array').with.deep.property('[1]._id', 4);
            expect(result[2]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[2]).to.be.an('array').with.deep.property('[1]._id', 3);
        });
    });

    describe('g.v(1).out.as("x").out.in.in.back("x")', function() {
        it("should return v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().as('x').out().in().in().back('x').emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
        });
    });

    describe('g.v(1).out.as("x").out.back("x")', function() {
        it("should return array len = 1 of arrays with v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().as('x').out().back('x').emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
        });
    });

    describe('g.v(1).out.as("x").out.back("x").path', function() {
        it("should return array len = 1 of arrays with v[1], v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().as('x').out().back('x').path().emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 4);
        });
    });

    describe('g.v(1).out.as("x").out.optional("x")', function() {
        it("should return array len = 3 of arrays with v[2], v[3], v[4]", function(){
            g.startTrace(true);
            var result = g.v(1).out().as('x').out().optional('x').emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(3);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
            expect(result).to.be.an('array').with.deep.property('[1]._id', 4);
            expect(result).to.be.an('array').with.deep.property('[2]._id', 3);
        });
    });

    describe('g.v(1).out.as("x").out.optional("x").path', function() {
        it("should return array len = 3 of arrays with v[1] @ [0]", function(){
            g.startTrace(true);
            var result = g.v(1).out().as('x').out().optional('x').path().emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(3);
            expect(result[0].length).to.be.equal(2);
            expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 2);
            expect(result[1]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[1]).to.be.an('array').with.deep.property('[1]._id', 4);
            expect(result[2]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[2]).to.be.an('array').with.deep.property('[1]._id', 3);
        });
    });

    describe('g.V().out.has("name","vadas").out.back(1).path', function() {
        it("should return empty array", function(){
            g.startTrace(true);
            var result = g.v(1).out().where({'name':{$eq:'vadas'}}).out().back(1).path().emit();
            g.startTrace(false);
            expect(result).to.be.empty;
        });
    });

    describe('g.V().out.has("name","vadas").out.optional(1).path', function() {
        it("should return array len = 1 of arrays with v[1],v[4]", function(){
            g.startTrace(true);
            var result = g.v().out().where({'name':{$eq:'vadas'}}).out().optional(1).path().emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result[0]).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result[0]).to.be.an('array').with.deep.property('[1]._id', 2);
        });
    });

    describe("g.V().as('x').outE('knows').inV().where({'age':{$gt:30}}).back('x').property('age')", function() {
        it("should return array with 29", function(){
            g.startTrace(true);
            var result = g.v().as('x').outE('knows').inV().where({'age':{$gt:30}}).back('x').property('age').emit();
            g.startTrace(false);
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]', 29);
        });
    });
});