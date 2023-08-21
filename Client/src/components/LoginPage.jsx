import { useState } from 'react';
import girlLaptop from '../assets/Girl_laptop.svg';
import girlLaptopSky from '../assets/Girl_laptop_sky.svg';
import LoginForm from './LoginForm';

const LoginPage = ({ setUser, setSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="py-22 flex h-screen w-full flex-col items-center justify-center bg-gray-200 md:flex-row md:gap-12">
      <div className=" invisible w-0 md:visible md:flex md:w-full md:justify-end">
        <img src={girlLaptopSky} className=" w-4/5 max-w-sm" />
      </div>

      <div className="w-full md:justify-self-start">
        <a href="#">
          {/* md:block to remove the flex centering  */}
          <h1 className="mb-14 flex justify-center text-6xl font-bold text-slate-700 transition-transform hover:text-indigo-600 active:scale-95 md:mb-8 md:block">
            Quotables
          </h1>
        </a>

        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          setUser={setUser}
        />

        <p className="mb-4 mt-4 flex items-center justify-center md:ml-5 md:justify-start">
          Don't have an account?
          <a
            href="#"
            className="ml-1 flex items-center justify-center font-semibold text-indigo-600 hover:scale-105 hover:text-blue-700 hover:underline"
            onClick={() => {
              setSignup(true);
            }}
          >
            Sign up
          </a>
        </p>

        <p className="mx-auto mb-14 w-3/5 min-w-max max-w-xs rounded bg-slate-300 px-7 py-3 text-center md:m-0 md:mb-0 md:w-full">
          For guest login <br></br>
          Username: guest <br></br>
          Password: abc123@
        </p>
        <img src={girlLaptop} className="m-auto w-4/5 max-w-xs md:hidden" />
      </div>
    </div>
  );
};

export default LoginPage;
