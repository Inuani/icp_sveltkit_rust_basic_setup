// vite.config.ts
import inject from "file:///app/node_modules/@rollup/plugin-inject/dist/es/index.js";
import { sveltekit } from "file:///app/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import compression from "file:///app/node_modules/vite-plugin-compression/dist/index.mjs";
import { readFileSync } from "fs";
import { join } from "path";
import { defineConfig, loadEnv } from "file:///app/node_modules/vite/dist/node/index.js";
var network = process.env.DFX_NETWORK ?? "local";
var host = network === "local" ? "http://localhost:8000" : "https://ic0.app";
var readCanisterIds = ({ prefix }) => {
  const canisterIdsJsonFile = network === "ic" ? join(process.cwd(), "canister_ids.json") : join(process.cwd(), ".dfx", "local", "canister_ids.json");
  try {
    const config2 = JSON.parse(readFileSync(canisterIdsJsonFile, "utf-8"));
    return Object.entries(config2).reduce((acc, current) => {
      const [canisterName, canisterDetails] = current;
      return {
        ...acc,
        [`${prefix ?? ""}${canisterName.toUpperCase()}_CANISTER_ID`]: canisterDetails[network]
      };
    }, {});
  } catch (e) {
    throw Error(`Could not get canister ID from ${canisterIdsJsonFile}: ${e}`);
  }
};
var config = {
  plugins: [
    sveltekit(),
    compression({
      // plugin options
    })
  ],
  build: {
    target: "es2020",
    rollupOptions: {
      // Polyfill Buffer for production build
      plugins: [
        inject({
          modules: { Buffer: ["buffer", "Buffer"] }
        })
      ]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis"
      }
    }
  }
};
var vite_config_default = defineConfig(({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode ?? "development", process.cwd()),
    ...readCanisterIds({ prefix: "VITE_" }),
    VITE_DFX_NETWORK: network,
    VITE_HOST: host
  };
  return {
    ...config,
    // Backwards compatibility for auto generated types of dfx that are meant for webpack and process.env
    define: {
      "process.env": {
        ...readCanisterIds({}),
        DFX_NETWORK: network
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgaW5qZWN0IGZyb20gJ0Byb2xsdXAvcGx1Z2luLWluamVjdCc7XG5pbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5cbi8vIG5wbSBydW4gZGV2ID0gbG9jYWxcbi8vIG5wbSBydW4gYnVpbGQgPSBsb2NhbFxuLy8gZGZ4IGRlcGxveSA9IGxvY2FsXG4vLyBkZnggZGVwbG95IC0tbmV0d29yayBpYyA9IGljXG5jb25zdCBuZXR3b3JrID0gcHJvY2Vzcy5lbnYuREZYX05FVFdPUksgPz8gJ2xvY2FsJztcbmNvbnN0IGhvc3QgPSBuZXR3b3JrID09PSAnbG9jYWwnID8gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMCcgOiAnaHR0cHM6Ly9pYzAuYXBwJztcblxuY29uc3QgcmVhZENhbmlzdGVySWRzID0gKHsgcHJlZml4IH06IHsgcHJlZml4Pzogc3RyaW5nIH0pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcblx0Y29uc3QgY2FuaXN0ZXJJZHNKc29uRmlsZSA9XG5cdFx0bmV0d29yayA9PT0gJ2ljJ1xuXHRcdFx0PyBqb2luKHByb2Nlc3MuY3dkKCksICdjYW5pc3Rlcl9pZHMuanNvbicpXG5cdFx0XHQ6IGpvaW4ocHJvY2Vzcy5jd2QoKSwgJy5kZngnLCAnbG9jYWwnLCAnY2FuaXN0ZXJfaWRzLmpzb24nKTtcblxuXHR0cnkge1xuXHRcdHR5cGUgRGV0YWlscyA9IHtcblx0XHRcdGljPzogc3RyaW5nO1xuXHRcdFx0bG9jYWw/OiBzdHJpbmc7XG5cdFx0fTtcblxuXHRcdGNvbnN0IGNvbmZpZzogUmVjb3JkPHN0cmluZywgRGV0YWlscz4gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhjYW5pc3Rlcklkc0pzb25GaWxlLCAndXRmLTgnKSk7XG5cblx0XHRyZXR1cm4gT2JqZWN0LmVudHJpZXMoY29uZmlnKS5yZWR1Y2UoKGFjYywgY3VycmVudDogW3N0cmluZywgRGV0YWlsc10pID0+IHtcblx0XHRcdGNvbnN0IFtjYW5pc3Rlck5hbWUsIGNhbmlzdGVyRGV0YWlsc10gPSBjdXJyZW50O1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHQuLi5hY2MsXG5cdFx0XHRcdFtgJHtwcmVmaXggPz8gJyd9JHtjYW5pc3Rlck5hbWUudG9VcHBlckNhc2UoKX1fQ0FOSVNURVJfSURgXTpcblx0XHRcdFx0XHRjYW5pc3RlckRldGFpbHNbbmV0d29yayBhcyBrZXlvZiBEZXRhaWxzXVxuXHRcdFx0fTtcblx0XHR9LCB7fSk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHR0aHJvdyBFcnJvcihgQ291bGQgbm90IGdldCBjYW5pc3RlciBJRCBmcm9tICR7Y2FuaXN0ZXJJZHNKc29uRmlsZX06ICR7ZX1gKTtcblx0fVxufTtcblxuY29uc3QgY29uZmlnOiBVc2VyQ29uZmlnID0ge1xuXHRwbHVnaW5zOiBbXG5cdFx0c3ZlbHRla2l0KCksXG5cdFx0Y29tcHJlc3Npb24oe1xuXHRcdFx0Ly8gcGx1Z2luIG9wdGlvbnNcblx0XHR9KVxuXHRdLFxuXHRidWlsZDoge1xuXHRcdHRhcmdldDogJ2VzMjAyMCcsXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0Ly8gUG9seWZpbGwgQnVmZmVyIGZvciBwcm9kdWN0aW9uIGJ1aWxkXG5cdFx0XHRwbHVnaW5zOiBbXG5cdFx0XHRcdGluamVjdCh7XG5cdFx0XHRcdFx0bW9kdWxlczogeyBCdWZmZXI6IFsnYnVmZmVyJywgJ0J1ZmZlciddIH1cblx0XHRcdFx0fSlcblx0XHRcdF1cblx0XHR9XG5cdH0sXG5cdG9wdGltaXplRGVwczoge1xuXHRcdGVzYnVpbGRPcHRpb25zOiB7XG5cdFx0XHQvLyBOb2RlLmpzIGdsb2JhbCB0byBicm93c2VyIGdsb2JhbFRoaXNcblx0XHRcdGRlZmluZToge1xuXHRcdFx0XHRnbG9iYWw6ICdnbG9iYWxUaGlzJ1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfTogVXNlckNvbmZpZyk6IFVzZXJDb25maWcgPT4ge1xuXHQvLyBFeHBhbmQgZW52aXJvbm1lbnQgLSAuZW52IGZpbGVzIC0gd2l0aCBjYW5pc3RlciBJRHNcblx0cHJvY2Vzcy5lbnYgPSB7XG5cdFx0Li4ucHJvY2Vzcy5lbnYsXG5cdFx0Li4ubG9hZEVudihtb2RlID8/ICdkZXZlbG9wbWVudCcsIHByb2Nlc3MuY3dkKCkpLFxuXHRcdC4uLnJlYWRDYW5pc3Rlcklkcyh7IHByZWZpeDogJ1ZJVEVfJyB9KSxcblx0XHRWSVRFX0RGWF9ORVRXT1JLOiBuZXR3b3JrLFxuXHRcdFZJVEVfSE9TVDogaG9zdFxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0Li4uY29uZmlnLFxuXHRcdC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciBhdXRvIGdlbmVyYXRlZCB0eXBlcyBvZiBkZnggdGhhdCBhcmUgbWVhbnQgZm9yIHdlYnBhY2sgYW5kIHByb2Nlc3MuZW52XG5cdFx0ZGVmaW5lOiB7XG5cdFx0XHQncHJvY2Vzcy5lbnYnOiB7XG5cdFx0XHRcdC4uLnJlYWRDYW5pc3Rlcklkcyh7fSksXG5cdFx0XHRcdERGWF9ORVRXT1JLOiBuZXR3b3JrXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThMLE9BQU8sWUFBWTtBQUNqTixTQUFTLGlCQUFpQjtBQUMxQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLFlBQVk7QUFFckIsU0FBUyxjQUFjLGVBQWU7QUFNdEMsSUFBTSxVQUFVLFFBQVEsSUFBSSxlQUFlO0FBQzNDLElBQU0sT0FBTyxZQUFZLFVBQVUsMEJBQTBCO0FBRTdELElBQU0sa0JBQWtCLENBQUMsRUFBRSxPQUFPLE1BQW1EO0FBQ3BGLFFBQU0sc0JBQ0wsWUFBWSxPQUNULEtBQUssUUFBUSxJQUFJLEdBQUcsbUJBQW1CLElBQ3ZDLEtBQUssUUFBUSxJQUFJLEdBQUcsUUFBUSxTQUFTLG1CQUFtQjtBQUU1RCxNQUFJO0FBTUgsVUFBTUEsVUFBa0MsS0FBSyxNQUFNLGFBQWEscUJBQXFCLE9BQU8sQ0FBQztBQUU3RixXQUFPLE9BQU8sUUFBUUEsT0FBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLFlBQStCO0FBQ3pFLFlBQU0sQ0FBQyxjQUFjLGVBQWUsSUFBSTtBQUV4QyxhQUFPO0FBQUEsUUFDTixHQUFHO0FBQUEsUUFDSCxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsYUFBYSxZQUFZLENBQUMsY0FBYyxHQUMxRCxnQkFBZ0IsT0FBd0I7QUFBQSxNQUMxQztBQUFBLElBQ0QsR0FBRyxDQUFDLENBQUM7QUFBQSxFQUNOLFNBQVMsR0FBRztBQUNYLFVBQU0sTUFBTSxrQ0FBa0MsbUJBQW1CLEtBQUssQ0FBQyxFQUFFO0FBQUEsRUFDMUU7QUFDRDtBQUVBLElBQU0sU0FBcUI7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUE7QUFBQSxJQUVaLENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUE7QUFBQSxNQUVkLFNBQVM7QUFBQSxRQUNSLE9BQU87QUFBQSxVQUNOLFNBQVMsRUFBRSxRQUFRLENBQUMsVUFBVSxRQUFRLEVBQUU7QUFBQSxRQUN6QyxDQUFDO0FBQUEsTUFDRjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDYixnQkFBZ0I7QUFBQTtBQUFBLE1BRWYsUUFBUTtBQUFBLFFBQ1AsUUFBUTtBQUFBLE1BQ1Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNEO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQThCO0FBRWpFLFVBQVEsTUFBTTtBQUFBLElBQ2IsR0FBRyxRQUFRO0FBQUEsSUFDWCxHQUFHLFFBQVEsUUFBUSxlQUFlLFFBQVEsSUFBSSxDQUFDO0FBQUEsSUFDL0MsR0FBRyxnQkFBZ0IsRUFBRSxRQUFRLFFBQVEsQ0FBQztBQUFBLElBQ3RDLGtCQUFrQjtBQUFBLElBQ2xCLFdBQVc7QUFBQSxFQUNaO0FBRUEsU0FBTztBQUFBLElBQ04sR0FBRztBQUFBO0FBQUEsSUFFSCxRQUFRO0FBQUEsTUFDUCxlQUFlO0FBQUEsUUFDZCxHQUFHLGdCQUFnQixDQUFDLENBQUM7QUFBQSxRQUNyQixhQUFhO0FBQUEsTUFDZDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFsiY29uZmlnIl0KfQo=
