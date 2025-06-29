import { Outlet } from "react-router";

// when render_app_layout in ../config is false
const NoLayout = () => {
  return (
    <div className="flex flex-col h-dvh relative">
      <Outlet />
    </div>
  );
};

export default NoLayout;
