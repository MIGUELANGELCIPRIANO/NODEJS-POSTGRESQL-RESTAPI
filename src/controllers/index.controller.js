require('dotenv').config()
const { Pool } = require('pg')

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env

const pool = new Pool({
	host: `${DB_HOST}`,
	user: `${DB_USER}`,
	password: `${DB_PASSWORD}`,
	database: `${DB_NAME}`,
})

const getUsers = async (req, res) => {
	try {
		const response = await pool.query('SELECT * FROM users')
		res.status(200).json(response.rows)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const getUserById = async (req, res) => {
	try {
		const id = req.params.id
		const response = await pool.query('SELECT * FROM users WHERE id = $1', [id])
		return response.rowCount === 0
			? res.status(404).json({ message: 'User does not exist' })
			: res.status(200).json(response.rows)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const createUser = async (req, res) => {
	try {
		const { name, email } = req.body
		await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [
			name,
			email,
		])
		res.status(200).json({
			message: 'User successfully created',
			body: { user: { name, email } },
		})
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const updateUser = async (req, res) => {
	try {
		const id = req.params.id
		const { name, email } = req.body
		const response = await pool.query(
			'UPDATE users SET name = $1, email = $2 WHERE id = $3',
			[name, email, id]
		)
		return response.rowCount === 0
			? res.status(404).json({ message: 'User does not exist' })
			: res.status(200).json({
					message: 'User successfully updated',
					body: { user: { name, email } },
				})
	} catch (error) {
		console.error('Error en updateUser:', error)
		return res.status(500).json({ message: error.message })
	}
}

const deleteUser = async (req, res) => {
	try {
		const id = req.params.id
		const response = await pool.query('DELETE FROM users WHERE id = $1', [id])
		return response.rowCount === 0
			? res.status(404).json({ message: 'User does not exist' })
			: res.status(200).json({ message: `User ${id} successfully deleted` })
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
}
