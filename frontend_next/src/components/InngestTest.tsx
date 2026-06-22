"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendTaskCreatedEvent } from "@/inngest/api";
import { toast } from "sonner";

export default function InngestTest() {
  const [isLoading, setIsLoading] = useState(false);

  const testInngest = async () => {
    setIsLoading(true);
    try {
      await sendTaskCreatedEvent({ id: `test_${Date.now()}` });
      toast.success("Inngest test event sent successfully!");
    } catch (error) {
      toast.error("Failed to send Inngest test event");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Inngest Test</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Test if Inngest is working by sending a test event
      </p>
      <Button onClick={testInngest} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Test Event"}
      </Button>
    </div>
  );
}
