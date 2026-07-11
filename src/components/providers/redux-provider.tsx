"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";

/**
 * Creates the store once per client instance via a lazy `useState` initializer,
 * following the official Next.js App Router + Redux pattern (avoids sharing
 * state across requests on the server).
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
