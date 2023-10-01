export function validatePassword(password: string): string[] {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least 1 letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
    errors.push('Password must contain at least 1 special character');
  }

  return errors;
}
