import Cookies from "js-cookie";
import axios, { AxiosResponse, AxiosError } from "axios";
import { ApiResponse } from "@/container/ApiTypes";

// Define types for API call params
interface ApiRequestData {
  url: string;
  bodyData?: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const makeApiCall = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  data: ApiRequestData,
  content: "application/json" | "multipart/form-data" = "application/json",
  explicitToken?: string,
): Promise<ApiResponse> => {
  try {
    let token: string | null = explicitToken || null;
    if (!token && typeof window !== "undefined") {
      token = Cookies.get("accessToken") || null;
    }

    const headers: Record<string, string> = {
      "Content-Type": content,
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let body =
      content === "multipart/form-data"
        ? data.bodyData
        : JSON.stringify(data.bodyData);

    let response: AxiosResponse;

    switch (method) {
      case "GET":
        response = await axios.get(data?.url, {
          headers,
        });
        break;
      case "POST":
        response = await axios.post(data?.url, body, { headers });
        break;
      case "PUT":
        response = await axios.put(data?.url, body, { headers });
        break;
      case "DELETE":
        response = await axios.delete(data?.url, { headers });
        break;
      default:
        throw new Error("Invalid HTTP method");
    }

    // Handle token in response if present
    if (response.data?.accessToken) {
      Cookies.set("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      Cookies.set("refreshToken", response.data.refreshToken);
    }

    return { status: response.status, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle unauthorized access
      if (error.response?.status === 401) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// API Helper Functions
export const doGetApiCall = (data: ApiRequestData, token?: string) =>
  makeApiCall("GET", data, "application/json", token);

export const doPostApiCall = (
  data: ApiRequestData,
  content: "application/json" | "multipart/form-data" = "application/json",
  token?: string,
) => makeApiCall("POST", data, content, token);

export const doDeleteApiCall = (data: ApiRequestData, token?: string) =>
  makeApiCall("DELETE", data, "application/json", token);

export const doPutApiCall = (data: ApiRequestData, token?: string) =>
  makeApiCall("PUT", data, "application/json", token);

// Legacy API object for backward compatibility
export const api = {
  get: (endpoint: string, options?: any) =>
    doGetApiCall({ url: `${API_BASE_URL}${endpoint}` }),
  post: (endpoint: string, data: any, options?: any) =>
    doPostApiCall({ url: `${API_BASE_URL}${endpoint}`, bodyData: data }),
  put: (endpoint: string, data: any, options?: any) =>
    doPutApiCall({ url: `${API_BASE_URL}${endpoint}`, bodyData: data }),
  delete: (endpoint: string, options?: any) =>
    doDeleteApiCall({ url: `${API_BASE_URL}${endpoint}` }),
};
