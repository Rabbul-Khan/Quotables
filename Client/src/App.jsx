import { useEffect, useState } from 'react';

import postService from './services/postService';

import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Post from './components/Post';
import SignupPage from './components/SignupPage';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [signup, setSignup] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    author: '',
    content: '',
  });

  useEffect(() => {
    postService.getAll().then((posts) => {
      setPosts(
        posts.map((post) => {
          return {
            title: post.title,
            author: post.author,
            content: post.content,
            createdAt: post.createdAt,
            id: post.id,
            username: post.user.username,
          };
        })
      );
    });
    // Adding posts.length dependency allows for the  createdAt date not rendering bug to be resolved. The bug - When a new post is made, the createdAt date does not render until the page is refreshed.
  }, [posts.length]);

  // This checks the local storage to see if any user is already logged in. If a token exists in local storage, we first check whether the token is expired or not.
  useEffect(() => {
    // The time in local storage is stored in string format. Convert to date format using Date.parse().
    const timeLoggedIn = Date.parse(
      window.localStorage.getItem('timeLoggedIn')
    );
    if (timeLoggedIn) {
      const timeNow = new Date();
      const diffTime = Math.abs(timeLoggedIn - timeNow);
      // If difference between stored time and current time exceeds one hour, remove the token.
      if (diffTime > 3600000) {
        window.localStorage.removeItem('loggedAppUser');
        window.localStorage.removeItem('timeLoggedIn');
      }
    }

    // If token exists and it is not expired, setUser to the stored user.
    const loggedAppUserJSON = window.localStorage.getItem('loggedAppUser');
    if (loggedAppUserJSON) {
      const user = JSON.parse(loggedAppUserJSON);
      setUser(user);
      postService.setToken(user.token);
    }
  }, []);

  if (user === null) {
    return signup ? (
      <SignupPage setUser={setUser} setSignup={setSignup} />
    ) : (
      <LoginPage setUser={setUser} setSignup={setSignup} />
    );
  }

  if (user !== null) {
    return (
      <div className="h-screen bg-indigo-50 bg-pattern bg-repeat">
        <Header
          posts={posts}
          setPosts={setPosts}
          newPost={newPost}
          setNewPost={setNewPost}
          setUser={setUser}
        />

        {posts.map((post) => {
          return (
            <Post
              title={post.title}
              author={post.author}
              content={post.content}
              createdAt={post.createdAt}
              key={post.id}
              id={post.id}
              username={post.username}
              posts={posts}
              setPosts={setPosts}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
