import { EffectCallback, useEffect } from "react";
/* eslint react-hooks/exhaustive-deps: 0 */
export const useMountEffect = (fun: EffectCallback) => useEffect(fun, []);
