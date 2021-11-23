const jwt = require('jsonwebtoken')

const authAdmin = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).send('Access denied. No token provided.')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    if (decoded.role === 'Admin') {
      req.user = decoded
      next()
    } 
    return res.status(401).send('You are not authorised to do this operation.')
  } catch (ex) {
    res.status(400).send('Invalid token')
  }
}

module.exports = authAdmin