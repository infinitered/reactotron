import type {Context} from 'react';

export type InferContextValue<C> = C extends Context<infer Value> ? Value : never
