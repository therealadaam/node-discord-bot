const Pool = require('pg').Pool;

const local = process.env.DATABASE_URL.includes('localhost');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	// basically this means don't use SSL if it's local. There are better ways
	// but this does the job for now
	ssl: local
		? false
		: {
				rejectUnauthorized: false,
		  },
});

// do some date/time translations and magic
// lastX = new Date("Tue Jun 15 2021 06:18:07 GMT+0000 (Coordinated Universal Time)")
// lastX = new Date(serverReturn.last_loss)
// prettyDate = lastX.toLocaleDateString()

const getUser = async (bigID, db) => {
	try {
		switch (db) {
			case 'game': {
				const query = {
					text: 'select * from game where user_id = $1;',
					values: [bigID],
				};
				const res = await pool.query(query);
				return res;
			}
			case 'fish_count': {
				const query = {
					text: 'select * from fish_count where user_id = $1;',
					values: [bigID],
				};
				const res = await pool.query(query);
				return res;
			}
		}
	} catch (error) {
		console.error(error.stack);
	}
};

const addUser = async (bigID, db) => {
	try {
		switch (db) {
			case 'game': {
				const query = {
					text: 'INSERT INTO game(user_id,loss_count,last_loss,first_loss) VALUES($1,$2,NOW(),NOW())',
					values: [bigID, 1],
				};
				const res = await pool.query(query);
				return res;
			}
			case 'fish_count': {
				const query = {
					text: 'INSERT INTO fish_count(user_id,slap_count,last_slap,first_slap) VALUES($1,$2,NOW(),NOW())',
					values: [bigID, 1],
				};
				const res = await pool.query(query);
				return res;
			}
		}
	} catch (error) {
		console.error(error.stack);
	}
};

const checkUserExists = async (bigID, db) => {
	try {
		switch (db) {
			case 'game': {
				const query = {
					text: 'select user_id from game where user_id = $1;',
					values: [bigID],
				};
				const res = await pool.query(query);
				return res;
			}
			case 'fish_count': {
				const query = {
					text: 'select user_id from fish_count where user_id = $1;',
					values: [bigID],
				};
				const res = await pool.query(query);
				return res;
			}
		}
	} catch (error) {
		console.error(error.stack);
	}
};

const updateUser = async (bigID, db) => {
	try {
		switch (db) {
			case 'game': {
				const query = {
					text: 'update game set loss_count = loss_count + 1, last_loss = NOW() where user_id = $1;',
					values: [bigID],
				};
				const res = await pool.query(query);
				return res;
			}
			case 'fish_count': {
				const query = {
					text: 'update fish_count set slap_count = slap_count + 1, last_slap = NOW() where user_id = $1;',
					values: [bigID],
				};
				const res = await pool.query(query);
				return res;
			}
		}
	} catch (error) {
		console.error(error.stack);
	}
};

module.exports = { pool, checkUserExists, addUser, getUser, updateUser };
