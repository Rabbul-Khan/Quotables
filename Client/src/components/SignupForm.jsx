import signupService from '../services/signupService';
import postService from '../services/postService';
import loginService from '../services/loginService';

import { useForm } from 'react-hook-form';

const SignupForm = ({ setUsername, setPassword, setUser, setSignup }) => {
  const form = useForm();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const handleSignup = async (data) => {
    const username = data.username;
    const password = data.password;

    try {
      await signupService.signup({
        username,
        password,
      });
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedAppUser', JSON.stringify(user.data));
      window.localStorage.setItem('timeLoggedIn', new Date());
      setUser(user.data);
      postService.setToken(user.data.token);
      setUsername('');
      setPassword('');
      setSignup(false);
    } catch (exception) {
      alert(exception.response.data.error);
      return exception;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSignup)}
      className="m-auto flex w-3/5 min-w-max max-w-xs flex-col items-center justify-center md:m-0 md:w-full"
      noValidate
    >
      <div className="w-full pb-4">
        <input
          type="text"
          placeholder="Email, or username"
          className="input mb-3 w-full bg-gray-100 tracking-wide drop-shadow focus:bg-indigo-50 focus:outline-indigo-400"
          {...register('username', {
            required: { value: true, message: 'Username is required' },
          })}
        />
        <p className=" text-red-500">{errors.username?.message}</p>
      </div>
      <div className="w-full pb-4">
        <input
          type="password"
          placeholder="Password"
          className="input mb-3 w-full bg-gray-100 tracking-wide drop-shadow focus:bg-indigo-50 focus:outline-indigo-400"
          {...register('password', {
            required: { value: true, message: 'Password is required' },
          })}
        />
        <p className=" text-red-500">{errors.password?.message}</p>
      </div>
      <button className="btn-primary btn-block btn font-bold tracking-widest drop-shadow-md hover:drop-shadow-xl">
        Signup
      </button>
    </form>
  );
};

export default SignupForm;
