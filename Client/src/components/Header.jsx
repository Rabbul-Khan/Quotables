import { useState } from 'react';
import {
  FaHeart,
  FaPlusCircle,
  FaBars,
  FaLongArrowAltRight,
} from 'react-icons/fa';
import AddPostForm from './AddPostForm';

const Header = ({ content, setContent, posts, setPosts, setUser }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="drawer">
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
        </div>
      </div>
      <div className="navbar-center">
        <a
          href=""
          className="btn-ghost btn text-2xl normal-case hover:text-primary"
        >
          Instagram
        </a>
      </div>
      <div className="navbar-end">
        <button className=" btn-ghost btn hover:text-red-400">
          <FaHeart className="text-lg" />
        </button>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost btn hover:text-primary"
      >
        <FaPlusCircle className="text-lg" />
      </button>

      <AddPostForm
        content={content}
        setContent={setContent}
        posts={posts}
        setPosts={setPosts}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default Header;
