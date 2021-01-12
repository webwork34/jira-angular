export function getErrorMessageEmail(email: any) {
  if (email.hasError('required')) {
    return 'Email is required';
  }

  return email.hasError('email') ? 'Email is not valid' : '';
}

export function getErrorMessagePassword(password: any) {
  if (password.hasError('required')) {
    return 'Passowrd is required';
  }

  return password.hasError('minlength')
    ? `Password should be bigger then ${
        password.errors!['minlength']['requiredLength']
      } symbols. Now it is ${
        password.errors!['minlength']['actualLength']
      } symbols.`
    : '';
}
