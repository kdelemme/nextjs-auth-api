import { useContext } from "react";

import { SessionContext } from "./session-provider";

export const useSession = () => useContext(SessionContext);
