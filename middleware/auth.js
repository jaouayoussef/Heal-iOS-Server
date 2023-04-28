import jwt from 'jsonwebtoken';
import User from '../model/user.js';

const requireAuth = (req, res, next) => {
    //TODO: CHANGE FROM COOKIE TO HEADER WHEN MOVING TO ANDROID
    //const token = req.cookies.jwt;
    const token = req.headers['jwt']

    if (token) {
        jwt.verify(token, 'heal secret key', async (err, decodedToken) => {
            if (err) {
                res.status(400).send({"message": err.message});
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                req.user = user;
                next();
            }
        });
    } else {
        res.status(400).send({"message": "not authorized"});
    }
};

export const validateJWT = async (token = "") => {
    try {
        const {id: uid} = jwt.verify(token, 'heal secret key');
        return [true, uid];
    } catch (error) {
        return [false, null];
    }
};

export {requireAuth};