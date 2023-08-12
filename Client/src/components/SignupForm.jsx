import signupService from '../services/signupService';
import postService from '../services/postService';
import loginService from '../services/loginService';

const SignupForm = ({
  setUsername,
  setPassword,
  setUser,
  username,
  password,
  setSignup,
}) => {
  const handleSignup = async (event) => {
    event.preventDefault();
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
      return exception;
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="m-auto flex w-60 flex-col items-center justify-center"
    >
      <input
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        placeholder="Phone, email, or username"
        type="text"
        className="input mb-2 w-full max-w-xs bg-gray-100 "
      />
      <input
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        placeholder="Password"
        type="password"
        className="input mb-2 w-full max-w-xs bg-gray-100 "
      />
      <button className="btn-primary btn-block btn mb-3">Signup</button>
    </form>
  );
};

export default SignupForm;
