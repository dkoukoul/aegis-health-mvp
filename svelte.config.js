import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $core: "src/core",
      "$core/*": "src/core/*",
      $infra: "src/infra",
      "$infra/*": "src/infra/*",
    },
  },
};

export default config;
