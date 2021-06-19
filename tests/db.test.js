const db = require('../db');
db.pool;

// global fakeData to use for now
const realId = '192829641461858306';
const fakeID = '192829671461358303';
const realTable = 'game';
const fakeTable = 'games';

// #checkUserExists
describe('#checkUserExists', () => {
	test('Valid table and user ID is in DB', () => {
		return db.checkUserExists(realId, realTable).then((data) => {
			expect(data.rowCount).toBe(1);
		});
	});
	test('Valid table and user ID is NOT in DB', () => {
		return db.checkUserExists(fakeID, realTable).then((data) => {
			expect(data.rowCount).toBe(0);
		});
	});
	test('Invalid table passed', () => {
		// expect.assertions(1);
		// return fetchData().catch(e => expect(e).toMatch('error'));
		return db.checkUserExists(fakeID, fakeTable).then((res) => {
			expect(res).toBe('No table with that name!');
		});
	});
});
// #addUser
describe('#addUser', () => {
	test('Valid table and user ID is in DB', () => {
		return db.checkUserExists(realId, realTable).then((data) => {
			expect(data.rowCount).toBe(1);
		});
	});
	test('Valid table and user ID is NOT in DB', () => {
		return db.checkUserExists(fakeID, realTable).then((data) => {
			expect(data.rowCount).toBe(0);
		});
	});
	test('Invalid table passed', () => {
		// expect.assertions(1);
		// return fetchData().catch(e => expect(e).toMatch('error'));
		return db.checkUserExists(fakeID, fakeTable).then((res) => {
			expect(res).toBe('No table with that name!');
		});
	});
});
// #getUser
// #updateUser
