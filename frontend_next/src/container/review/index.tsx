"use client";

import { useReview } from "./Hooks";
import ResumeReviewComponent from "@/components/Review";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAuth } from "@/context/AuthContext";

const ReviewContainer = () => {
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();
  const { userId, getByIdApiCall, loading } = useReview();
  const analysis = useSelector((state: RootState) => state.review.analysis);

  useEffect(() => {
    if (id && userId) {
      getByIdApiCall(id as string, userId);
    }
  }, [id, userId, getByIdApiCall]);

  return (
    <ResumeReviewComponent
      currentAnalysis={analysis}
      loading={loading}
      error={null}
    />
  );
};

export default ReviewContainer;
