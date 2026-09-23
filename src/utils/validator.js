function validateUsername(username) {
    if (typeof username !== 'string' || username.trim().length === 0) {
        const err = new Error('Username is required');
        err.status = 400;
        throw err;
    }

    if (username.trim().length < 3) {
        const err = new Error('Username must be at least 3 characters long');
        err.status = 400;
        throw err;
    }

    if (username.trim() !== username) {
        const err = new Error('Username cannot contain leading or trailing spaces');
        err.status = 400;
        throw err;
    }

    return username.trim();
}

function validatePassword(password) {
    if (typeof password !== 'string' || password.trim().length === 0) {
        const err = new Error('Password is required');
        err.status = 400;
        throw err;
    }

    if (password.length < 6) {
        const err = new Error('Password must be at least 6 characters long');
        err.status = 400;
        throw err;
    }

    return password;
}

function validatePasswordsMatch(password, confirmPassword) {
    if (typeof confirmPassword !== 'string' || confirmPassword.trim().length === 0) {
        const err = new Error('Password confirmation is required');
        err.status = 400;
        throw err;
    }

    if (password !== confirmPassword) {
        const err = new Error('Passwords do not match');
        err.status = 400;
        throw err;
    }
}

module.exports = {
    validateUsername,
    validatePassword,
    validatePasswordsMatch,
};