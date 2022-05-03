import ffApi from '../api';

export const deleteUser = async (userId: string) => {
  try {
    await ffApi.delete(`/users/${userId}`);
    return true;
  } catch (error: any) {
      return false;
    console.error(error.response.data.error);
  }
};
