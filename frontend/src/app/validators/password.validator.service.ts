import { FormControl } from '@angular/forms';
import { passwordValidator } from './password.validator';

describe('passwordValidator', () => {
  // Helper function to create a new form control for each test
  const createControl = (value: string | null) => new FormControl(value, [passwordValidator]);

  it('should return null for a valid password', () => {
    const control = createControl('StrongPassword1!');
    expect(control.errors).toBeNull();
  });

  it('should return an error if the password is too short', () => {
    const control = createControl('Str1!');
    expect(control.errors).toEqual({ passwordStrength: true });
  });

  it('should return an error if the password is missing an uppercase letter', () => {
    const control = createControl('strongpassword1!');
    expect(control.errors).toEqual({ passwordStrength: true });
  });

  it('should return an error if the password is missing a lowercase letter', () => {
    const control = createControl('STRONGPASSWORD1!');
    expect(control.errors).toEqual({ passwordStrength: true });
  });

  it('should return an error if the password is missing a number', () => {
    const control = createControl('StrongPassword!');
    expect(control.errors).toEqual({ passwordStrength: true });
  });

  it('should return an error if the password is missing a special character', () => {
    const control = createControl('StrongPassword1');
    expect(control.errors).toEqual({ passwordStrength: true });
  });

  it('should return null for an empty or null value (to allow for optional fields)', () => {
    // The 'required' validator should handle empty fields, not this one.
    const emptyControl = createControl('');
    const nullControl = createControl(null);

    expect(emptyControl.errors).toBeNull();
    expect(nullControl.errors).toBeNull();
  });
});