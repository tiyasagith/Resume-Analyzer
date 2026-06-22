import { doGetApiCall, doPostApiCall } from "@/lib/api";
import { endpoints } from "@/context/endPoint";

export const getByUserApi = async (userId: string) => {
  try {
    const res = await doGetApiCall({
      url: endpoints.resumeAnalysis.getByUser(userId),
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
