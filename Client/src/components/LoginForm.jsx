import loginService from '../services/loginService';
import postService from '../services/postService';

import { useForm } from 'react-hook-form';
//import { DevTool } from '@hookform/devtools';

const LoginForm = ({ setUser }) => {
  const form = useForm();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const handleLogin = async (data) => {
    const username = data.username;
    const password = data.password;

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedAppUser', JSON.stringify(user.data));
      window.localStorage.setItem('timeLoggedIn', new Date());
      setUser(user.data);
      postService.setToken(user.data.token);
    } catch (exception) {
      alert(exception.response.data.message);
      return exception;
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="m-auto flex w-3/5 min-w-max max-w-xs flex-col items-center justify-center md:m-0 md:w-full"
        noValidate
      >
        <div className="w-full pb-4">
          <input
            type="text"
            placeholder="Email, or username"
            className="input mb-2 w-full bg-gray-100 tracking-wide drop-shadow required:outline-red-500 focus:bg-indigo-50 focus:outline-indigo-400"
            {...register('username', {
              required: { value: true, message: 'Username is required' },
            })}
          />
          <p className=" text-red-500">{errors.username?.message}</p>
        </div>

        <div className="w-full pb-4">
          <input
            placeholder="Password"
            type="password"
            className="input mb-3 w-full bg-gray-100 tracking-wide drop-shadow focus:bg-indigo-50 focus:outline-indigo-400"
            {...register('password', {
              required: { value: true, message: 'Password is required' },
            })}
          />
          <p className=" text-red-500">{errors.password?.message}</p>
        </div>

        <button className="btn-primary btn-block btn font-bold tracking-widest drop-shadow-md hover:drop-shadow-xl">
          Log in
        </button>
      </form>
      {/* <DevTool control={control} /> */}
    </>
  );
};

export default LoginForm;
