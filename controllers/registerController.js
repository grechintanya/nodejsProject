const usersDB = {
    users: require('../data/auth.json').users,
    setUsers: function (data) {
        this.users = { "users": data }
    }
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { login, pwd } = req.body;
    if (!login || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });
    const duplicate = usersDB.users.find(person => person.login === login);
    if (duplicate) return res.status(409).json({ 'message': 'The username already exists' });
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        usersDB.setUsers([...usersDB.users, { 'login': login, 'password': hashedPwd }]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'data', 'auth.json'), JSON.stringify(usersDB.users));
        console.log(usersDB.users);
        res.status(201).json({ 'success': `New user ${login} created!` })
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

}

module.exports = { handleNewUser };
