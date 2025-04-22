const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
     
    let token = null;

    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token;  
    }

    if (!token) {
        return res.status(401).json({ message: 'Token gereklidir' });
    }

   
    const secretKey = process.env.SECRET_KEY;

     
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            
            return res.status(403).json({ message: 'Geçersiz token' });
        }

        
        req.user = decoded;

         
        next();
    });
};

module.exports = verifyJWT;