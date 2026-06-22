const IR_MOBILE_PATTERN = /^09\d{9}$/;
const NATIONAL_CODE_PATTERN = /^\d{10}$/;

export type SignUpFieldErrors = {
  mobileNumber?: string;
  nationalCode?: string;
};

export function validateSignUpFields(input: {
  mobileNumber: string;
  nationalCode: string;
}): SignUpFieldErrors {
  const errors: SignUpFieldErrors = {};

  if (!IR_MOBILE_PATTERN.test(input.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a valid Iranian mobile number (09xxxxxxxxx).";
  }

  if (!NATIONAL_CODE_PATTERN.test(input.nationalCode.trim())) {
    errors.nationalCode = "National code must be exactly 10 digits.";
  }

  return errors;
}

export function hasSignUpFieldErrors(errors: SignUpFieldErrors) {
  return Boolean(errors.mobileNumber || errors.nationalCode);
}
