export const LoginForm = () => {
  return (
    <form className="m-auto flex w-60 flex-col items-center justify-center">
      <input
        placeholder="Phone, email, or username"
        className="c mb-2 w-full rounded border-2 border-gray-300 bg-gray-100 p-2 text-sm focus:border-gray-400"
      />
      <input
        placeholder="Password"
        className="mb-2 w-full rounded border-2 border-gray-300 bg-gray-100 p-2 text-sm focus:border-gray-400 "
      />
      <button
        className="mb-3 w-full rounded-lg bg-blue-400 p-1 text-white"
        disabled
      >
        Login
      </button>
    </form>
  );
};
