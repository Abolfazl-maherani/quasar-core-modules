export default [
  // Wildcard route for 404
  {
    name: "404",
    path: ":catchAll(.*)",
    component: () => import("src/modules/core/pages/site/404Error.vue"),
  },
];
