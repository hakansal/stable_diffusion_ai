const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
     
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    

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