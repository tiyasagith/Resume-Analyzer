"use client";
import { getByUserApi } from "./DashboardApi";
import { useDispatch, useSelector } from "react-redux";
import { setAllResumeData, setLoading } from "@/store/slices/Dashboard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { RootState } from "@/store";

export function useDashboard() {
  const dispatch = useDispatch();
  const [userId, setuserId] = useState<string | null>(null);
  const loading = useSelector((state: RootState) => state.dashboard.loading);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getUserId = Cookies.get("userId");
      setuserId(getUserId || null);
    }
  }, []);

  const getByUserApiCall = async (userId: string) => {
    // TODO: implement
    try {
      console.log("Fetching data for userId:", userId);
      dispatch(setLoading(true));
      const res = await getByUserApi(userId);
      console.log("API response:", res);
      if (res.status === 201 || res.status === 200) {
        // Ensure we always set an array
        // const data = Array.isArray(res.data) ? res.data : [];
        dispatch(setAllResumeData(res.data.data));
        dispatch(setLoading(false));
      } else {
        console.log("Unexpected status:", res.status);
        dispatch(setAllResumeData([]));
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error("Error fetching user resumes:", error);
      dispatch(setAllResumeData([]));
      dispatch(setLoading(false));
    }
  };

  return {
    userId,
    getByUserApiCall,
    loading,
  };
}
