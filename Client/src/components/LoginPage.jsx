import logo from '../assets/Instagram-Logo.svg';
import { LoginForm } from './LoginForm';

export const LoginPage = () => {
  return (
    <>
      <img src={logo} />
      <LoginForm />
      <p className="mb-5 flex items-center justify-center">OR</p>
      <a
        href="#"
        className="mb-4 flex items-center justify-center text-blue-900"
      >
        Login in with Facebook
      </a>
      <a className="mb-8 flex items-center justify-center text-blue-700">
        Forgot Password?
      </a>
      <p className="flex items-center justify-center">
        Don't have an account?
        <a className="flex items-center justify-center font-semibold text-blue-400">
          Sign up
        </a>
      </p>
    </>
  );
};
