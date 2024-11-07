import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.repeatPassword
    ? null
    : { PasswordNoMatch: true };
};

export const nameValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.name.length >= 3 && control.value.name.length <= 20
    ? null
    : { LengthError: true };
};
