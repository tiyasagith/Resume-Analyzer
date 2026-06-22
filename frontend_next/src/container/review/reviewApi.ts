import { doGetApiCall, doPostApiCall } from "@/lib/api";
import { endpoints } from "@/context/endPoint";

export const getByIdApi = async (id: string, userId: string) => {
  try {
    const res = await doGetApiCall({
      url: endpoints.resumeAnalysis.getById(id, userId),
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
