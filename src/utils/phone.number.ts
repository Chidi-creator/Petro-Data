export const nationalisePhoneNumber = (num: string): string => {
const digits = num.replace(/\D/g, ''); // Remove non-digits

  if (digits.startsWith('234')) {
    return `+${digits}`;
  } else if (digits.startsWith('0')) {
    return `+234${digits.slice(1)}`;
  } else if (digits.length === 10) {
    return `+234${digits}`;
  }

  return `+${digits}`; 
}