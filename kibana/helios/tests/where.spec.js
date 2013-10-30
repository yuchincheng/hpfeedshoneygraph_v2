describe('where', function() {

    describe('$eq', function() {
        it("should return id 1 from v", function(){
            expect(g.v({name:{$eq:'marko'}}).emit()).to.be.an('array').with.deep.property('[0]._id', 1);
        });

        it("should return id 1", function(){
            var result = g.v().where({name:{$eq:'marko'}}).emit();
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 1);
        });
    });

    describe('$btw', function() {
        it("should return id 1 and id 2 from v", function(){
            var result = g.v({age:{$btw:['27','31']}}).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0].age', 29);
            expect(result).to.be.an('array').with.deep.property('[1].age', 27);

        });

        it("should return id 1 and id 2", function(){
            var result = g.v().where({age:{$btw:[27,31]}}).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0].age', 29);
            expect(result).to.be.an('array').with.deep.property('[1].age', 27);
        });
    });

//
    describe('$includes', function() {
        it("should return id 1 and 2 from v", function(){
            var result = g.v({age:{$in:[27,29]}}).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0].age', 29);
            expect(result).to.be.an('array').with.deep.property('[1].age', 27);
        });

        it("should return id 2", function(){
            var result = g.v().where({age:{$in:[27,29]}}).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0].age', 29);
            expect(result).to.be.an('array').with.deep.property('[1].age', 27);
        });

        it("check array for values", function(){
            var result = g.v().where({age:{$in:[27,29]}}).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0].age', 29);
            expect(result).to.be.an('array').with.deep.property('[1].age', 27);
        });
    });

    describe('$ex', function() {
        it("should return values that don't have any matching values in an array from v", function(){
            var result = g.v().where({dow:{$ex:['fri']}}).emit();
            expect(result.length).to.be.equal(2);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 1);
            expect(result).to.be.an('array').with.deep.property('[1]._id', 2);
        });

        it("should return values that don't have any matching values in an array", function(){
            var result = g.v().where({dow:{$ex:['mon','wed','thu']}}).emit();
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 4);
        });
    });
    //g.v().where({dow:{$every:['mon','fri']}})
    describe('$every', function() {
        it("should return id 2 from v", function(){
            var result = g.v({dow:{$all:['mon','wed']}}).emit();
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
        });

        it("should return id 2", function(){
            var result = g.v().where({dow:{$all:['mon','wed']}}).emit();
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
        });
    });

    describe('$match', function() {
        it("should return values exactly matching an array from v", function(){
            var result = g.v({dow:{$match:['mon','wed','thu']}}).emit();
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
        });

        it("should return values exactly matching an array", function(){
            var result = g.v().where({dow:{$match:['mon','wed','thu']}}).emit();
            expect(result.length).to.be.equal(1);
            expect(result).to.be.an('array').with.deep.property('[0]._id', 2);
        });
    });
});