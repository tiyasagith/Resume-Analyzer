"use client";

import { useUpload } from "./Hooks";
import UploadComponent from "@/components/Upload";
import Navbar from "@/components/landing/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const UploadContainer = () => {
  const {
    form,
    file,
    dragActive,
    isUploading,
    inputRef,
    handleDrag,
    handleDrop,
    handleChange,
    onSubmit,
    removeFile,
  } = useUpload();

  return (
    <ProtectedRoute>
      <Navbar />
      <UploadComponent
        form={form}
        file={file}
        dragActive={dragActive}
        isUploading={isUploading}
        inputRef={inputRef}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        handleChange={handleChange}
        onSubmit={onSubmit}
        removeFile={removeFile}
      />
    </ProtectedRoute>
  );
};

export default UploadContainer;
