import { endpoints } from "@/context/endPoint";
import { doPostApiCall } from "@/lib/api";

export const loginApi = async (data: any) => {
  try {
    const res = await doPostApiCall({
      url: endpoints.auth.login,
      bodyData: data,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw to let the hook handle the error
  }
};
