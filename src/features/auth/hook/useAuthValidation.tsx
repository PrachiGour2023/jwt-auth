export const checkField = (name: string, value: string) => {
  if (!value.trim()) return `${name} is required`;
  if (name === 'username' && !/^[a-zA-Z0-9_]{3,16}$/.test(value)) return 'Must be 3–16 characters';
  if (name === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return 'Invalid email';
  if (name === 'password' && value.length < 8) return 'Min 8 characters';
  return '';
};