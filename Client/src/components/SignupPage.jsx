import { useState } from 'react';
import SignupForm from './SignupForm';

import manShapes from '../assets/Man_shapes.svg';
import manShapesStairs from '../assets/Man_shapes_stairs.svg';

const SignupPage = ({ setUser, setSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <>
      <div className="py-22 flex h-screen w-full flex-col items-center justify-center bg-gray-200 md:flex-row md:gap-12">
        <div className=" invisible w-0 md:visible md:flex md:w-full md:justify-end">
          <img src={manShapesStairs} className=" w-11/12 max-w-md" />
        </div>

        <div className="w-full md:justify-self-start">
          <a href="#">
            {/* md:block to remove the flex centering  */}
            <h1 className="mb-14 flex justify-center text-6xl font-bold text-slate-700 transition-transform hover:text-indigo-600 active:scale-95 md:mb-8 md:block">
              Quotables
            </h1>
          </a>

          <SignupForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            setUser={setUser}
            setSignup={setSignup}
          />

          <p className="mb-14 mt-4 flex items-center justify-center md:mb-0 md:ml-5 md:justify-start">
            Already have an account?
            <a
              href="#"
              className="ml-1 flex items-center justify-center font-semibold text-indigo-600 hover:scale-105 hover:text-blue-700 hover:underline"
              onClick={() => {
                setSignup(false);
              }}
            >
              Sign in
            </a>
          </p>
          <img src={manShapes} className="m-auto w-4/5 max-w-sm md:hidden" />
        </div>
      </div>
    </>
  );
};

export default SignupPage;
