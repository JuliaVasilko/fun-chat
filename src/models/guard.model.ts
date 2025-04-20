export type GuardResult = boolean | string;
export type Guard = () => Promise<GuardResult>;
