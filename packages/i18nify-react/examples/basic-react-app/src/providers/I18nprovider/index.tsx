import * as React from "react";
import { createContext, useContext, useState } from "react";
import { setState, getState } from "@razorpay/i18nify";

interface ContextValueType {
  i18nState?: ReturnType<typeof getState>;
  setI18nState?: (data: Record<string, unknown>) => void;
}

const I18nContext = createContext({});

/**
 * A simple ReactContext Provider built for React apps that deals with i18nify state APIs.
 * Include this Provider at the topmost level in your component tree.
 *
 * ========= USAGE =========
 * <I18nProvider>
 *  <YourComponent />
 * </I18nProvider>
 */
export const I18nProvider = ({ children }: { children: JSX.Element }) => {
  const [i18nState, setI18nState] = useState(getState());

  /**
   * This function sets new data into i18nState.
   * After setting context state, it triggers i18nify setState API to update the global state
   * The logic here can be expanded to perform operations specific to i18n use case. For eg,
   * - finding locale and setting the initial state
   * - storing i18nState in localStorage to retain user preferences
   *
   * @param data: new i18nState to set in Context
   */
  const updateI18nState = (data: Record<string, unknown>) => {
    setI18nState((i18nState) => ({ ...i18nState, ...data }));
    setState({ ...i18nState, ...data });
  };

  const contextValue = {
    i18nState,
    setI18nState: updateI18nState,
  };

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};

/**
 *
 * React hook to get the value (i18nState, setI18nState) within I18nProvider Context
 *
 * ========= USAGE =========
 * const { i18nState, setI18nState } = useI18nContext()
 *
 */
export const useI18nContext = (): ContextValueType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within a I18nProvider");
  }
  return context;
};
