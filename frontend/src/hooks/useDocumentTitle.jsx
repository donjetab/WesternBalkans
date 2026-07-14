import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    const baseTitle = "Western Balkans Edu4Migration";
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
}
