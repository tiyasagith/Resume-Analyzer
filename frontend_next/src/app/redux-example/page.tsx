"use client";

import { ReduxExample } from "@/components/ReduxExample";

export default function ReduxExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Redux State Management Example</h1>
        <p className="text-muted-foreground mb-8">
          This page demonstrates how Redux is used in the Resume Analyzer application for state management.
        </p>
        <ReduxExample />
      </div>
    </div>
  );
}
