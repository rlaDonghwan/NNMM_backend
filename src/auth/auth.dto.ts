export class SignupDto {
  _id: string
  email: string
  name: string
  position: string
  password: string
}

export class LoginDto {
  email: string
  password: string
}
