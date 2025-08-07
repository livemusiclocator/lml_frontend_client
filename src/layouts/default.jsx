import { Outlet } from "react-router";

// when render_app_layout in ../config is false
const NoLayout = () => {
  return <Outlet />;
};

export default NoLayout;
