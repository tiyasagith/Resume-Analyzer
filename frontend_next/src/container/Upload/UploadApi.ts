import { endpoints } from "@/context/endPoint";
import { doPostApiCall, doGetApiCall, doDeleteApiCall } from "@/lib/api";

export const uploadResumeApi = async (formData: FormData) => {
  try {
    // Note: Upload functionality would need to be implemented in backend
    // For now, we'll skip upload and go directly to analysis
    console.log("Upload functionality pending backend implementation");
    return { success: false, message: "Upload endpoint not implemented" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const analyzeResumeApi = async (data: any) => {
  try {
    const res = await doPostApiCall({
      url: endpoints.resumeAnalysis.create,
      bodyData: data,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// New API functions for resume analysis endpoints
export const getUserAnalysesApi = async (userId: string) => {
  try {
    const res = await doGetApiCall({
      url: `${endpoints.resumeAnalysis.getByUser}/${userId}`,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnalysisByIdApi = async (id: string, userId: string) => {
  try {
    const res = await doGetApiCall({
      url: `${endpoints.resumeAnalysis.getById}/${id}?userId=${userId}`,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteAnalysisApi = async (id: string, userId: string) => {
  try {
    const res = await doDeleteApiCall({
      url: `${endpoints.resumeAnalysis.delete}/${id}?userId=${userId}`,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserStatisticsApi = async (userId: string) => {
  try {
    const res = await doGetApiCall({
      url: `${endpoints.resumeAnalysis.getStatistics}/${userId}`,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
