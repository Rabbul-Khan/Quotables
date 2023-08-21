import { useState } from 'react';
import { FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import AddPostForm from './AddPostForm';

const Header = ({ posts, setPosts, setUser, newPost, setNewPost }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="navbar m-auto max-w-3xl pt-7">
      <div className="navbar-start">
        <button
          onClick={() => setOpen(true)}
          className="btn-ghost btn ml-4 hover:text-primary sm:ml-8"
        >
          <FaPlusCircle className="text-lg md:text-xl" />
        </button>
      </div>
      <div className="navbar-center">
        <a
          href="#"
          className="text-4xl font-bold tracking-wider hover:text-primary md:text-4xl"
        >
          Quotables
        </a>
      </div>
      <div className="navbar-end">
        {/* <FaHeart className="text-lg" /> */}
        <button
          className="btn-ghost btn mr-4 hover:text-red-400 sm:mr-8"
          onClick={() => {
            window.localStorage.removeItem('loggedAppUser');
            window.localStorage.removeItem('timeLoggedIn');
            setUser(null);
          }}
        >
          <FaSignOutAlt className="text-lg md:text-xl" />
        </button>
      </div>

      <AddPostForm
        posts={posts}
        setPosts={setPosts}
        open={open}
        setOpen={setOpen}
        newPost={newPost}
        setNewPost={setNewPost}
      />
    </div>
  );
};

export default Header;

{
  /* <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer"
              className="btn-ghost drawer-button btn hover:text-primary"
            >
              <FaBars className="text-lg" />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
              <li>
                <button
                  className="btn-ghost btn"
                  onClick={() => {
                    window.localStorage.removeItem('loggedAppUser');
                    window.localStorage.removeItem('timeLoggedIn');
                    setUser(null);
                  }}
                >
                  Logout
                  <FaLongArrowAltRight />
                </button>
              </li>
            </ul>
          </div>
        </div> */
}
