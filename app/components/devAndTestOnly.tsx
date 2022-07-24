export type DevAndTestOnlyProps = {
  children: React.ReactNode;
};

export const DevAndTestOnly = ({ children }: DevAndTestOnlyProps) => {
  const NODE_ENV = process.env.NODE_ENV;
  const isTest = NODE_ENV === "test";
  const isDev = NODE_ENV === "development";

  return isTest || isDev ? <>{children}</> : null;
};
