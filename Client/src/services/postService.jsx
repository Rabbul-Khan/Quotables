import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/posts';

let token = null;
const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  console.log(response.data);
  return response.data;
};

const addPost = async (newPost) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newPost, config);
  return response.data;
};

const deletePost = async (id) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, addPost, setToken, deletePost };
