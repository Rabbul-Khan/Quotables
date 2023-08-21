import { FaUser, FaHeart, FaTrash, FaRegHeart, FaPenNib } from 'react-icons/fa';
import postService from '../services/postService';

const Post = ({
  username,
  content,
  createdAt,
  id,
  posts,
  setPosts,
  title,
  author,
}) => {
  const handleDeletePost = async () => {
    try {
      await postService.deletePost(id);
      setPosts(
        posts.filter((post) => {
          return post.id !== id;
        })
      );
    } catch (exception) {
      alert(exception.response.data.message);
    }

    // const response = await postService.deletePost(id);
    // console.log(response);
    // setPosts(
    //   posts.filter((post) => {
    //     return post.id !== id;
    //   })
    // );
  };

  return (
    <div className="m-auto my-4 max-w-3xl rounded bg-indigo-200 bg-opacity-60 px-10 py-3">
      <div className="mb-1 flex justify-between">
        <div className="font-sans text-2xl font-semibold text-slate-700 md:text-3xl">
          {title}
        </div>
        {/* <div className="flex items-center justify-center gap-2 text-primary">
          <div>21</div>
          <FaRegHeart className="cursor-pointer" />
        </div> */}
      </div>

      <div className="mb-2 flex items-center justify-between text-gray-600">
        <div className="flex items-center gap-1">
          <FaPenNib className=" text-xs" />
          <div className="font-sans italic tracking-wide">{author}</div>
        </div>
        <FaTrash
          className=" cursor-pointer text-xs text-gray-400 hover:text-gray-600"
          onClick={async () => {
            await handleDeletePost();
          }}
        />
      </div>

      <blockquote className="mb-4 text-xl tracking-wider md:text-2xl">
        `` {content} ``
      </blockquote>

      <div className=" mb-1 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <FaUser className="text-xs" />
          <div className=" text-sm">{username}</div>
        </div>
        <div className="flex gap-1">
          <div className="text-gray-500">{createdAt}</div>
        </div>
      </div>

      {/* <div className="flex items-center justify-between">
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
        <BsBookmark className="cursor-pointer hover:text-gray-600" />
        <MdDelete
          className=" cursor-pointer text-xl hover:text-gray-600"
          onClick={async () => {
            await handleDeletePost();
          }}
        />
      </div> */}
      {/* <hr className="h-0.5 bg-secondary"></hr> */}
    </div>
  );
};

export default Post;
