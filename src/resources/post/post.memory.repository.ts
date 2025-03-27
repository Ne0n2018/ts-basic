import { IPost, IPostDTO } from 'interfaces/post.interface';
import { Post } from './post.modal';

const posts: Post[] = [];

export const getAll = async (): Promise<IPost[]> => [...posts];

export const getById = async (id: string): Promise<IPost | undefined> =>
  posts.find((post) => post.id === id);

export const creat = async (postData: IPostDTO): Promise<IPost> => {
  const newPost = new Post(postData);
  posts.push(newPost);
  return newPost;
};

export const update = async (id: string, postData: IPostDTO): Promise<IPost | null> => {
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) return null;
  const updatedPost = { ...posts[postIndex], ...postData };
  posts[postIndex] = updatedPost;

  updatedPost.updatedAt = new Date();

  return updatedPost;
};

export const deleted = async (id: string): Promise<IPost | undefined> => {
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) return undefined;

  const deletedPost = posts[postIndex];
  posts.splice(postIndex, 1);

  return deletedPost;
};
