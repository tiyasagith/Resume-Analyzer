"use client";
import DashboardComponent from "@/components/dashboard";
import { useDashboard } from "./Hooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const DashboardContainer = () => {
  const { userId, getByUserApiCall, loading } = useDashboard();
  const dashboardLoading = useSelector((state: any) => state.dashboard.loading);

  useEffect(() => {
    if (userId) {
      getByUserApiCall(userId);
    }
  }, [userId]);

  return <DashboardComponent loading={loading || dashboardLoading} />;
};

export default DashboardContainer;
