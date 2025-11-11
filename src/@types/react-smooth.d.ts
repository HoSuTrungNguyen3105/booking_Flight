declare module "react-smooth" {
  import * as React from "react";

  interface AnimateProps {
    from: Record<string, any>;
    to: Record<string, any>;
    duration?: number;
    children: React.ReactNode;
  }

  const Animate: React.FC<AnimateProps>;

  export default Animate;
}
