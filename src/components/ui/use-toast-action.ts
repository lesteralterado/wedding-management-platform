"use client";

import * as React from "react";
import { toast } from "sonner";

export function useToastAction<T>(action: () => Promise<T>, messages: { loading: string; success: string; error: string }) {
  const [isPending, setIsPending] = React.useState(false);

  return React.useCallback(async () => {
    setIsPending(true);
    toast.loading(messages.loading);
    try {
      await action();
      toast.success(messages.success);
    } catch (error) {
      toast.error(messages.error);
    } finally {
      setIsPending(false);
    }
  }, [action, messages.error, messages.loading, messages.success]);
}
