import { ReactNode } from "react";

interface ShowProps {
  condition?: boolean;
  when?: boolean;
  children?: ReactNode;
  ifTrue?: ReactNode;
  ifFalse?: ReactNode;
}

export default function Show({
  when,
  children,
  condition,
  ifTrue,
  ifFalse,
}: ShowProps) {
  if (when) {
    return <>{children}</>;
  }

  if (condition) {
    if (condition) {
      return <>{ifTrue}</>;
    } else {
      return <>{ifFalse}</>;
    }
  }

  return undefined;
}
