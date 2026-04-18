import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const rootRoute = createRootRoute();

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: EditorPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const routeTree = rootRoute.addChildren([editorRoute, loginRoute, signupRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
