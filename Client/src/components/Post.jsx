import { IoPersonCircle } from 'react-icons/io5';
import { BsBasket, BsBookmark, BsHeart } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import postService from '../services/postService';
const Post = ({ username, content, createdAt, id, posts, setPosts }) => {
  const handleDeletePost = async () => {
    await postService.deletePost(id);
    setPosts(
      posts.filter((post) => {
        return post.id !== id;
      })
    );
  };
  return (
    <div className="my-2 rounded-md bg-primary p-5 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <IoPersonCircle />
          <div className="pl-2 font-semibold">{username}</div>
        </div>
        <div className="text-xs">{createdAt}</div>
      </div>
      <blockquote className="my-5 text-2xl font-bold">{content}</blockquote>
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center">
          <BsHeart className="cursor-pointer" />
          <div className=" cursor-pointer pl-2 ">39 likes</div>
        </div>
        {/* <BsBookmark className="cursor-pointer hover:text-gray-600" /> */}
        <MdDelete
          className=" cursor-pointer text-xl hover:text-gray-600"
          onClick={async () => {
            await handleDeletePost();
          }}
        />
      </div>
    </div>
  );
};

export default Post;
