// import auth from "@/api/auth";

// const router = new Router({
//   routes: [
//     {
//       path: "/",
//       redirect: { name: "Dashboard" },
//     },
//     {
//       path: "/login",
//       component: Login,
//       beforeEnter(to, from, next) {
//         auth
//           .loggedIn()
//           .then(() => {
//             next({ path: constants.DEFAULT_HOME });
//           })
//           .catch(() => {
//             document.title = "Login";
//             next();
//           });
//       },
//     },
//     {
//       path: "/password",
//       component: Password,
//     },
//     {
//       path: "/admin",
//       redirect: { name: "Admin" },
//     },
//     {
//       path: "/",
//       component: Layout,
//       redirect: { name: "Dashboard" },
//       children: [
//         {
//           path: "admin/:id?/:secondId?/:thirdId",
//           name: "Admin",
//           component: AdminManager,
//           meta: {
//             requiresAuth: true,
//             requiresAdmin: true,
//             name: ":nm?",
//           },
//         },
//         {
//           path: "dashboard",
//           name: "Dashboard",
//           component: Dashboard,
//           meta: {
//             requiresAuth: true,
//             requiresAdmin: true,
//           },
//         },
//       ],
//     },
//   ],
// });

// window.validateHandle = null;
// router.beforeEach((to, from, next) => {
//   //어드민에서 넘어왔을 경우 로그인 처리
//   if (to.query.id != undefined && to.query.pw != undefined) {
//     auth
//       .xcsmlogin(to.query.id, to.query.pw)
//       .then((res) => {
//         Utils.setCookie("loginID", to.query.id);
//         router.push({
//           path: "/dashboard",
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   document.title = to.name;

//   if (
//     decodeURI(to.fullPath) === from.fullPath ||
//     to.fullPath === decodeURI(from.fullPath)
//   ) {
//     return false;
//   }

//   if (to.meta.requiredAuth === false) {
//     clearInterval(window.validateHandle);
//     next();
//     return false;
//   }

//   if (window.validateHandle == null) {
//     let interval = 600 * 1000;
//     //if (store.state.info && store.state.info.features && store.state.info.features.validationInterval) interval = store.state.info.features.validationInterval * 1000;

//     (async () => {
//       try {
//         await validate(to);
//         next();
//       } catch (error) {
//         console.log(to.path);
//         if (to.path != "/login" && to.path != "/dashboard") {
//           console.error(`logincheck fail :${error}`);
//         }
//       }
//     })();

//     window.validateHandle = setInterval(() => {
//       validate("");
//     }, interval);

//     // window.validateHandle = validateHandle
//   } else {
//     next();
//   }
// });

// async function validate(to) {
//   let promise = auth.loggedIn();

//   promise
//     .then(() => {
//       return;
//     })
//     .catch((e) => {
//       try {
//         Utils.deleteCookie(constants.TOKEN);
//       } catch (error) {
//         console.log(`cookie: ${error}`);
//       }
//       redirectLoginPage();
//     });

//   return promise;
// }

// function redirectLoginPage() {
//   let redirectQuery = "";

//   const queryStrings = getQueryString(window.location);

//   if (queryStrings.redirect) {
//     redirectQuery = decodeURIComponent(queryStrings.redirect);
//   } else {
//     redirectQuery = location.href
//       .replace(location.origin, "")
//       .replace(location.pathname, "")
//       .replace(/^\#/g, "");
//   }

//   if (redirectQuery === "/" || redirectQuery === "/login" || !redirectQuery) {
//     redirectQuery = null;
//   }

//   router.push({
//     path: "/login",
//     query: redirectQuery ? { redirect: redirectQuery } : {},
//   });

//   if (window.validateHandle) {
//     clearInterval(window.validateHandle);
//     window.validateHandle = null;
//   }
// }

// function getQueryString(location) {
//   let uri = location.href.split("?");
//   const getVars = {};
//   if (uri.length == 2) {
//     let vars = uri[1].split("&");
//     let tmp = "";
//     vars.forEach(function (v) {
//       tmp = v.split("=");
//       if (tmp.length == 2) getVars[tmp[0]] = tmp[1];
//     });
//   }

//   return getVars;
// }

// // export default router;
