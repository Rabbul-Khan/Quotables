import { useState } from 'react';
import postService from '../services/postService';

const AddPostForm = ({
  content,
  setContent,
  posts,
  setPosts,
  open,
  setOpen,
}) => {
  const handleCreatePost = async (event) => {
    event.preventDefault();
    const response = await postService.addPost({ content: content });
    setContent('');
    setOpen(false);
    console.log(response);
    setPosts(posts.concat(response));
  };

  return (
    <dialog open={open} className="modal backdrop-blur">
      <form
        method="dialog"
        onSubmit={handleCreatePost}
        className="modal-box max-w-xs bg-primary"
      >
        <textarea
          rows={4}
          placeholder="content"
          type="text"
          value={content}
          onChange={({ target }) => setContent(target.value)}
          className="textarea min-w-full text-xs" //input-bordered input w-full max-w-xs
        >
          {' '}
        </textarea>
        <div className="modal-action">
          <button
            type="button"
            className="btn-secondary btn-sm btn"
            onClick={() => {
              setOpen(false);
              setContent('');
            }}
          >
            Cancel
          </button>
          <button type="submit" className=" btn-accent btn-sm btn">
            Submit
          </button>
        </div>
      </form>
    </dialog>
  );
  //}
};

export default AddPostForm;
