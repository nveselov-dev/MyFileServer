const bcrypt = require('bcrypt');

async function createUser(username, password) {
    try {
        const hash = await bcrypt.hash(password, 10);

    }
}