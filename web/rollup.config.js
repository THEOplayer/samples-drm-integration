import commonJs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import copy from 'rollup-plugin-copy';
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/bundle.js",
        format: "iife",
        exports: "auto",
        name: "ContentProtectionIntegrations",
        globals: { THEOplayer: 'THEOplayer' }
    },
    external: ['THEOplayer'],
    plugins: [
        resolve(),
        commonJs({ extensions: [".js", ".ts"] }),
        copy({
            targets: [
                { src: './node_modules/theoplayer/*.(js|css|html|ts|wasm)' , dest: './THEOplayer' }
            ]
        }),
        typescript()
    ],
};
