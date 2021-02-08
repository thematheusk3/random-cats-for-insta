const instagram = require('instagram-web-api');
const fileCookieStore = require('tough-cookie-filestore2');
const auth = require('./auth');
const { username, password } = auth;

module.exports = async (photo, legenda) => {
    try {
        const cookieStore = new fileCookieStore('./cookies.json');
        const client = new instagram({ username, password, cookieStore });

        await client.login();

        const { media } = await client.uploadPhoto({
            photo: photo,
            caption: legenda,
            post: 'feed'
        });

        
        return {status: 'OK', message: `https://www.instagram.com/p/${media.code}/`};
    }catch(e){
        return {status: 'Error', message: e.error.message};
    }
}
 


