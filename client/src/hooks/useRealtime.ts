import { useContext } from "react";

import {
  RealtimeContext,
  type RealtimeContextType,
} from "../context/RealtimeContext";

export function useRealtime(): RealtimeContextType {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
}
