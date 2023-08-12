import { useEffect, useState } from 'react';
import postService from './services/postService';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import AddPostForm from './components/AddPostForm';
import Post from './components/Post';
import SignupPage from './components/SignupPage';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [signup, setSignup] = useState(false);

  useEffect(() => {
    postService.getAll().then((posts) => {
      const initialPosts = posts.map((post) => {
        console.log(post);
        return {
          username: post.user.username,
          content: post.content,
          id: post.id,
          createdAt: post.createdAt,
        };
      });
      setPosts(initialPosts);
    });
  }, []);

  // This checks the local storage to see if any user is already logged in. If a token exists in local storage, we first check whether the token is expired or not.
  useEffect(() => {
    // The time in local storage is stored in string format. Convert to date format using Date.parse().
    const timeLoggedIn = Date.parse(
      window.localStorage.getItem('timeLoggedIn')
    );
    if (timeLoggedIn) {
      const timeNow = new Date();
      const diffTime = Math.abs(timeLoggedIn - timeNow);
      console.log(diffTime);
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
    if (signup) {
      return <SignupPage setUser={setUser} setSignup={setSignup} />;
    } else {
      return <LoginPage setUser={setUser} setSignup={setSignup} />;
    }
  }

  if (user !== null) {
    return (
      <div className="mx-auto max-w-xs bg-base-100">
        <Header
          content={content}
          setContent={setContent}
          posts={posts}
          setPosts={setPosts}
          setUser={setUser}
        />
        <AddPostForm
          content={content}
          setContent={setContent}
          posts={posts}
          setPosts={setPosts}
        />
        {posts.map((post) => {
          return (
            <Post
              username={post.username}
              content={post.content}
              posts={posts}
              setPosts={setPosts}
              key={post.id}
              id={post.id}
              createdAt={post.createdAt}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
