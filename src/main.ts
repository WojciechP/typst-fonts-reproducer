
import { createTypstCompiler } from "@myriaddreamin/typst.ts/dist/esm/compiler.mjs";
import wasmURL from "@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url";
import { preloadRemoteFonts } from "@myriaddreamin/typst.ts/dist/esm/options.init.mjs";

const cc = createTypstCompiler();
await cc.init({
  getModule: () => {
    return { module_or_path: wasmURL };
  },
  beforeBuild: [
    preloadRemoteFonts([
      "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
      "https://fonts.gstatic.com/s/arimo/v29/P5sfzZCDf9_T_3cV7NCUECyoxNk37cxcABrHdwcoaaQw.woff",
    ]),
  ],
});
const lines = [
  "Some text using the default font \\",
  '#set text(font: "Roboto")',
  "Some text using Roboto font",
];
const source = lines.join("\n");

cc.addSource("/main.typ", source);

document.querySelector("#source")!.textContent = source;

const result = await cc.compile({
  format: "pdf",
  mainFilePath: "/main.typ",
  diagnostics: "full",
});
console.log(result.diagnostics);
if (result.result) {
  const blob = new Blob([result.result!], { type: "application/pdf" });
  const link = document.querySelector<HTMLAnchorElement>("#pdf")!;
  link.href = window.URL.createObjectURL(blob);
  link.textContent = "Download PDF";
  link.download = "main.pdf";
}
