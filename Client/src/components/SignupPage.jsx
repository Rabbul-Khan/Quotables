import { useState } from 'react';
import SignupForm from './SignupForm';

const SignupPage = ({ setUser, setSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <>
      <img src={logo} />
      <SignupForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        setUser={setUser}
        setSignup={setSignup}
      />
    </>
  );
};

export default SignupPage;
