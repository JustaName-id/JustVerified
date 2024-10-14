export class OTPException extends Error {
  constructor(message: string) {
    super(message);
  }

  static invalid() {
    return new OTPException('Invalid OTP.');
  }

  static notFound() {
    return new OTPException('OTP not found or expired.');
  }

  static expired() {
    return new OTPException('OTP expired.');
  }
}