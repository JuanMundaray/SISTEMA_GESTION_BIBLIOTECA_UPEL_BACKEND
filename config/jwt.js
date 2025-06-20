module.exports = {
    jwtConfig: {
      secret: process.env.JWT_SECRET || 'secret_key_here',
      expiresIn: '24h' // El token expira en 24 horas
    }
  };