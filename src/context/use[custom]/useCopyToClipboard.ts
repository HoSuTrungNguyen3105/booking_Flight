import { useCallback, useState } from "react";
import { useToast } from "../ToastContext";

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const toast = useToast();

  const copy: CopyFn = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        toast("Clipboard not supported");
        return false;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        return true;
      } catch (error) {
        toast(error as string, "error");
        setCopiedText(null);
        return false;
      }
    },
    [toast]
  );

  return [copiedText, copy];
}
