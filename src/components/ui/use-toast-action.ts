"use client";

import * as React from "react";
import { toast } from "sonner";

export function useToastAction<T>(action: () => Promise<T>, messages: { loading: string; success: string; error: string }) {
  return React.useCallback(async () => {
    toast.loading(messages.loading);
    try {
      await action();
      toast.success(messages.success);
    } catch {
      toast.error(messages.error);
    }
  }, [action, messages.error, messages.loading, messages.success]);
}
