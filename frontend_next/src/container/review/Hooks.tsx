"use client";

import { useDispatch } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetCookie } from "@/hooks/useGetCookie";
import { getByIdApi } from "./reviewApi";
import { setAnalysis, setLoading } from "./ReviewReducer";

export const useReview = () => {
  const dispatch = useDispatch();
  const getUserId = useGetCookie("userId");
  const [userId, setuserId] = useState<string | null>(null);
  const loading = useSelector((state: RootState) => state.review.loading);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setuserId(getUserId || null);
    }
  }, [getUserId]);

  const getByIdApiCall = useCallback(
    async (resumeId: string, userId: string) => {
      // TODO: implement
      try {
        console.log("Fetching data for userId:", userId);
        dispatch(setLoading(true));
        const res = await getByIdApi(resumeId, userId);
        console.log("API response:", res);
        if (res.status === 201 || res.status === 200) {
          // Ensure we always set an array
          // const data = Array.isArray(res.data) ? res.data : [];
          dispatch(setAnalysis(res.data.data));
          dispatch(setLoading(false));
        } else {
          console.log("Unexpected status:", res.status);
          dispatch(setAnalysis(null));
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error("Error fetching user resumes:", error);
        dispatch(setAnalysis(null));
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  return {
    userId,
    getByIdApiCall,
    loading,
  };
};
