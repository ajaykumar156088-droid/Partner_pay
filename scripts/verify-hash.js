const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = '$2a$10$xlGBKJMWf2fCBaeBrjQJ4OBfBgmH.k4mwWS17NanEoWuEyC2hA0lK';

bcrypt.compare(password, hash).then(res => {
    console.log(`Password match: ${res}`);
});
