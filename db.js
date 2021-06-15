const Pool = require('pg').Pool;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

const getUser = async (bigID) => {
	try {
		const query = {
			text: 'select * from game where user_id = $1;',
			values: [bigID],
		};
		const res = await pool.query(query);
		return res;
	} catch (error) {
		console.error(error.stack);
	}
};

const addUser = async (bigID) => {
	try {
		const query = {
			text: 'INSERT INTO game(user_id,loss_count,last_loss,first_loss) VALUES($1,$2,NOW(),NOW())',
			values: [bigID, 1],
		};
		const res = await pool.query(query);
		return res;
	} catch (error) {
		console.error(error.stack);
	}
};

const checkUserExists = async (bigID) => {
	try {
		const query = {
			text: 'select user_id from game where user_id = $1;',
			values: [bigID],
		};
		const res = await pool.query(query);
		return res;
	} catch (error) {
		console.error(error.stack);
	}
};

const updateUser = async (bigID) => {
	try {
		const query = {
			text: 'update game set loss_count = loss_count + 1, last_loss = NOW() where user_id = $1;',
			values: [bigID],
		};
		const res = await pool.query(query);
		return res;
	} catch (error) {
		console.error(error.stack);
	}
};

module.exports = { pool, checkUserExists, addUser, getUser, updateUser };
