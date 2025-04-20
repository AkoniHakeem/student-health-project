export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'ultra-secret-key',
    expiresIn: '7d',
  };
  