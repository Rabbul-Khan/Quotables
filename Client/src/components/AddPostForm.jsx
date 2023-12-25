import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import postService from '../services/postService';

const AddPostForm = ({
  posts,
  setPosts,
  open,
  setOpen,
  setNotification,
  setNotificationText,
}) => {
  const form = useForm({
    defaultValues: {
      newPost: {
        title: '',
        author: '',
        content: '',
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  const { errors } = formState;

  const handleCreatePost = async (data) => {
    const response = await postService.addPost(data.newPost);
    setOpen(false);
    setPosts(posts.concat(response));
    setNotification(true);
    setNotificationText('Quote posted successfully');
    setTimeout(() => {
      setNotification(false);
      setNotificationText('');
    }, 2000);
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        newPost: {
          title: '',
          author: '',
          content: '',
        },
      });
    }
  }, [formState, reset]);

  return (
    <dialog
      open={open}
      className="modal backdrop-blur-md backdrop-brightness-50 backdrop-opacity-75"
    >
      <form
        method="dialog"
        onSubmit={handleSubmit(handleCreatePost)}
        className="m-auto flex w-4/5 min-w-max max-w-lg flex-col items-center justify-center rounded bg-indigo-300 p-10 pb-7"
      >
        <div className="w-full pb-4">
          <input
            type="text"
            placeholder="Add a title!"
            maxLength="25"
            className="input mb-3 w-full bg-gray-100 tracking-wide drop-shadow focus:bg-indigo-50 focus:outline-indigo-400"
            {...register('newPost.title', {
              required: { value: true, message: 'Title is required' },
            })}
          />
          <p className="text-red-600 ">{errors.newPost?.title?.message}</p>
        </div>

        <div className="w-full pb-4">
          <input
            type="text"
            placeholder="Who said it?"
            maxLength="30"
            className="input mb-3 w-full bg-gray-100 tracking-wide drop-shadow focus:bg-indigo-50 focus:outline-indigo-400"
            {...register('newPost.author', {
              required: { value: true, message: 'Author is required' },
            })}
          />
          <p className="text-red-600 ">{errors.newPost?.author?.message}</p>
        </div>

        <div className="w-full pb-4">
          <textarea
            type="text"
            placeholder="Words of wisdom..."
            maxLength="170"
            rows={4}
            className="textarea mb-3 w-full bg-gray-100 text-base tracking-wide drop-shadow focus:bg-indigo-50 focus:outline-indigo-400"
            {...register('newPost.content', {
              required: { value: true, message: 'Content is required' },
            })}
          ></textarea>
          <p className="text-red-600 ">{errors.newPost?.content?.message}</p>
        </div>

        <div className="modal-action mt-2 flex w-full justify-end gap-2">
          <button
            type="button"
            className="btn-neutral btn-sm btn tracking-widest drop-shadow-md md:btn-md hover:drop-shadow-xl"
            onClick={() => {
              setOpen(false);
              reset({
                newPost: {
                  title: '',
                  author: '',
                  content: '',
                },
              });
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary btn-sm btn font-bold tracking-widest drop-shadow-md md:btn-md hover:drop-shadow-xl"
          >
            Submit
          </button>
        </div>
      </form>
    </dialog>
  );
  //}
};

export default AddPostForm;
