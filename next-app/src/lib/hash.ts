import crypto from 'node:crypto';

// 해시적용해서 비밀번호 바꾸는 함수
export function hashUserPassword(password : string) {
  const salt = crypto.randomBytes(16).toString('hex');

  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return hashedPassword.toString('hex') + ':' + salt;
}

// 입력된 비밀번호가 해시된 비밀번호랑 일치하는지 확인하는 함수
export function verifyPassword(storedPassword : string, suppliedPassword : string) {
  const [hashedPassword, salt] = storedPassword.split(':');
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}