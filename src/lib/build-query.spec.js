import buildQuery from './build-query';
const input = 'events';

describe('buildQuery', () => {
    let query;

    beforeEach(() => {
        query = {
            where : sinon.spy(),
            select: sinon.spy(),
            limit : sinon.spy(),
            skip  : sinon.spy(),
        }
    });

    it('should work with empty req.query', () => {
        const req = {
            query: {}
        };

        buildQuery({req, query});

        expect(query.select).to.have.been.notCalled;
        expect(query.where).to.have.been.notCalled;
    });

    describe('?$select=', () => {
        it('should work with comma-separated values', () => {
            const $select = 'name,email';
            const req = {
                query: {
                    $select,
                }
            };

            buildQuery({req, query});

            expect(query.select).to.have.been.callCount(1);
            expect(query.where).to.have.been.notCalled;

            expect(query.select).to.have.been.calledWith({
                name : true,
                email: true,
            });
        });

        it('should work with object', () => {
            const $select = {name: true, email: true};
            const req = {
                query: {
                    $select,
                }
            };

            buildQuery({req, query});

            expect(query.select).to.have.been.callCount(1);
            expect(query.where).to.have.been.notCalled;

            expect(query.select).to.have.been.calledWith({
                name : true,
                email: true,
            });
        });
    });

    describe('?someField=x', () => {
        it('should be added to query.where', () => {
            const req = {
                query: {
                    name: 'KATT',
                }
            };

            buildQuery({req, query});

            expect(query.where).to.have.been.callCount(1);
            expect(query.select).to.have.been.notCalled;

            expect(query.where).to.have.been.calledWith({
                name: 'KATT',
            });
        });
    });

    describe('?$limit=x', () => {
        it('should limit query', () => {
            const req = {
                query: {
                    $limit: '2',
                }
            };

            buildQuery({req, query});

            expect(query.limit).to.have.been.callCount(1);
            expect(query.limit).to.have.been.calledWith(2);
        });
    });

    describe('?$skip=x', () => {
        it('should skip query', () => {
            const req = {
                query: {
                    $skip: '3',
                }
            };

            buildQuery({req, query});

            expect(query.skip).to.have.been.callCount(1);
            expect(query.skip).to.have.been.calledWith(3);
        });
    });
});
