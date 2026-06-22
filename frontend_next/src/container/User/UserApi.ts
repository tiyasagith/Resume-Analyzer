import { endpoints } from "@/context/endPoint";
import { doGetApiCall, doPutApiCall, doDeleteApiCall } from "@/lib/api";

export const getUserProfileApi = async () => {
  try {
    const res = await doGetApiCall({ 
      url: endpoints.users.get 
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUserProfileApi = async (userId: string, data: any) => {
  try {
    const res = await doPutApiCall({ 
      url: endpoints.users.update(userId), 
      bodyData: data 
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUserAccountApi = async (userId: string) => {
  try {
    const res = await doDeleteApiCall({ 
      url: endpoints.users.delete(userId) 
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
