import { createContext } from "react";

export interface ClientStyleContextData {
  reset: () => void;
}

export const clientStyleContext = createContext<ClientStyleContextData>({
  reset: () => {},
});
