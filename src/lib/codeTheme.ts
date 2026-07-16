/**
 * Custom Shiki (TextMate) theme matching the README "Code syntax-highlight
 * palette (dark panels)". Passed to Astro's <Code theme={...}> so highlighting
 * is real + build-time, no client JS. Background is transparent — the panel
 * supplies --ink-2.
 */
export const codeTheme = {
  name: "findthisbin-dark",
  type: "dark",
  colors: {
    "editor.background": "#0c0c16",
    "editor.foreground": "#e6e6f0",
  },
  settings: [
    { settings: { foreground: "#e6e6f0" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#5c5c6e", fontStyle: "italic" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "markup.inserted",
        "meta.preprocessor.string",
        "constant.other.symbol",
      ],
      settings: { foreground: "#9ee493" },
    },
    {
      scope: ["string.other.link", "markup.underline.link"],
      settings: { foreground: "#9ee493" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language.boolean",
        "constant.language",
      ],
      settings: { foreground: "#c4a5ff" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "storage.type",
        "storage.modifier",
        "keyword.control.import",
        "keyword.control.from",
      ],
      settings: { foreground: "#ff7b9c" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "variable.function",
      ],
      settings: { foreground: "#b89cff" },
    },
    {
      scope: [
        "support.type.property-name",
        "meta.object-literal.key",
        "string.json support.type.property-name",
        "entity.name.tag.json",
      ],
      settings: { foreground: "#7dd3fc" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.definition.block",
      ],
      settings: { foreground: "#717184" },
    },
    {
      scope: ["variable", "variable.other", "meta.definition.variable"],
      settings: { foreground: "#e6e6f0" },
    },
  ],
} as const;
