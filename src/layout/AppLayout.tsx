import { createTheme } from "@mui/material";
import { DashboardLayout } from "@toolpad/core";
import { AppProvider } from "@toolpad/core/AppProvider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import TimelineIcon from "@mui/icons-material/Timeline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { Router, Navigation } from "@toolpad/core";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "",
    title: "Home",
    icon: <HomeIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "calendar",
    title: "Calendar",
    icon: <CalendarMonthIcon />,
  },
  {
    segment: "reports",
    title: "Reports", // segmentは指定しない
    icon: <TimelineIcon />,
  },
  {
    segment: "qanda",
    title: "Q&A", // segmentは指定しない
    icon: <QuestionMarkIcon />,
  },
];

// テーマ設定
const myTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#FF5733", // 主に使う色
        },
        secondary: {
          main: "#4CAF50", // 副色
        },
        //////////////////////////////
        text: {
          primary: "#333", // 主なテキストの色
          secondary: "#555", // 副テキストの色
        },
        background: {
          default: "#F9F9FE",
          paper: "#EEEEF9",
        },
      },
    },
    //////////////////////////
    dark: {
      palette: {
        primary: {
          main: "#E0C2FF",
        },
        text: {
          primary: "#000", // ダークテーマの主なテキストの色
          secondary: "#AAA", // ダークテーマの副テキストの色
        },
        background: {
          default: "#2A4364",
          paper: "#112E4D",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const router: Router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => navigate(path),
  };

  return (
    <div>
      AppLayout
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={myTheme}
        branding={{
          logo: "",
          title: "Cotumo",
        }}
      >
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </AppProvider>
    </div>
  );
}

export default AppLayout;
