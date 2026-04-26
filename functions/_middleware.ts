// 🔒 資安 audit P2 #7（2026-04-27）：敏感路徑強制 404
// 補做：sub-agent B 漏建這個檔、/.env 線上回 200 漏洞

const SENSITIVE_PATHS = [
  /^\/\.env(\.|$)/,
  /^\/\.git(\/|$)/,
  /^\/\.dev\.vars$/,
  /^\/\.npmrc$/,
  /^\/\.prettierrc$/,
  /^\/wrangler\.toml$/,
  /^\/package(-lock)?\.json$/,
  /^\/pnpm-lock\.yaml$/,
  /^\/yarn\.lock$/,
  /^\/tsconfig(\..*)?\.json$/,
  /^\/vite\.config\.(ts|js)$/,
  /^\/Dockerfile$/i,
  /^\/docker-compose\..*$/i,
];

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  if (SENSITIVE_PATHS.some((re) => re.test(url.pathname))) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex' },
    });
  }
  return context.next();
};
