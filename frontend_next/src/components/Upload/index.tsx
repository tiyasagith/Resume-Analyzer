"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UploadFormData } from "@/container/Upload/Hooks";
import InngestTest from "@/components/InngestTest";

interface UploadComponentProps {
  form: UseFormReturn<UploadFormData>;
  file: File | null;
  dragActive: boolean;
  isUploading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: UploadFormData) => void;
  removeFile: () => void;
}

export default function UploadComponent({
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
}: UploadComponentProps) {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">
              <span className="text-gradient">Smart feedback</span>
              <br />
              <span className="text-foreground">
                for <em>your</em> dream job
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Drop your resume for an ATS score and improvement tips.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-sm">
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. JavaScript Mastery"
                          className="h-12 rounded-xl bg-card border-border/50 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-sm">
                        Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Frontend Developer"
                          className="h-12 rounded-xl bg-card border-border/50 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-sm">
                        Job Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a clear & concise job description with responsibilities & expectations..."
                          className="min-h-25 rounded-xl bg-card border-border/50 focus:border-primary resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel className="text-muted-foreground text-sm">
                    Upload Resume
                  </FormLabel>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : file
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      {file ? (
                        <FileText className="w-6 h-6 text-primary" />
                      ) : (
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    {file ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, PNG or JPG (max. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  variant="hero"
                  className="w-full h-12 text-base mt-2"
                  disabled={isUploading}
                  type="submit"
                >
                  {isUploading ? "Uploading..." : "Save & Analyze Resume"}
                </Button>
              </form>
            </Form>

            {/* Inngest Test Component - Remove after testing */}
            {/* <div className="mt-8">
              <InngestTest />
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
