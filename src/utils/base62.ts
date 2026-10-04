import crypto from 'crypto';

// Base62 Alphabet (0-9, a-z, A-Z) = 62 characters
const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CODE_LENGTH = 7; // 7 chars se hume 62^7 (3.5 Trillion) unique combinations milte hain

export function generateShortCode(): string {
  let code = '';
  // crypto.randomBytes bohot secure random numbers generate karta hai
  const randomBytes = crypto.randomBytes(CODE_LENGTH);
  
  for (let i = 0; i < CODE_LENGTH; i++) {
    // Modulo (%) operator se hum random byte ko 0-61 ki range me le aate hain
    const randomIndex = randomBytes[i] % BASE62_ALPHABET.length;
    code += BASE62_ALPHABET[randomIndex];
  }
  
  return code;
}