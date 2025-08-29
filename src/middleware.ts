import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isPublicPage = createRouteMatcher(["/"]);
// const isProtectedRoute = createRouteMatcher(["/"]);
 
export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // if (isSignInPage(request) && (await isAuthenticatedNextjs())) {
  //   return nextjsMiddlewareRedirect(request, "/auth");
  // }
  // if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
  //   return nextjsMiddlewareRedirect(request, "/auth");
  // }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};