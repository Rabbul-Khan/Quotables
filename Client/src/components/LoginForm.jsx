import loginService from '../services/loginService';
import postService from '../services/postService';

const LoginForm = ({
  setUsername,
  setPassword,
  setUser,
  username,
  password,
}) => {
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
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
    } catch (exception) {
      return exception;
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="m-auto flex w-3/5 min-w-max max-w-xs flex-col items-center justify-center md:m-0 md:w-full"
    >
      <input
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        placeholder="Email, or username"
        type="text"
        className="input mb-3 w-full bg-gray-100 tracking-wide focus:bg-indigo-50 focus:outline-indigo-400"
      />
      <input
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        placeholder="Password"
        type="password"
        className="input mb-3 w-full bg-gray-100 tracking-wide focus:bg-indigo-50 focus:outline-indigo-400"
      />
      <button className="btn-primary btn-block btn font-bold tracking-widest">
        Log in
      </button>
    </form>
  );
};

export default LoginForm;
