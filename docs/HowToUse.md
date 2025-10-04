# 使い方

## プロジェクトの作成

```bash
npx create-next-app@latest
```

各種オプションは下記の通り。

- TypeScript: Yes
- Linter: ESLint
- Tailwind CSS: No
- `src/` directory: No
- App Router: Yes
- Turbopack: No
- Customize the import alias: No

## プロジェクトの設定

### tsconfig.json

```json
{
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": [
        "./*"
      ],
      "@common/*": [
        "../typescript-common/*"
      ],
      "@client-common/*": [
        "../nextjs-common/common/*"
      ]
    }
  },
  // ...
}
```

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

## VSCode の設定

### ワークスペース

```json
{
  "folders": [
    {
      "path": ".",
      "name": "xxx"
    },
    {
      "path": "../nextjs-common/common",
      "name": "client-common"
    },
    {
      "path": "../typescript-common",
      "name": "common"
    },
    {
      "path": "../docs",
      "name": "docs"
    }
  ],
  "settings": {
    "editor.renderWhitespace": "boundary",
    "[shellscript]": {
      "editor.tabSize": 2
    },
    "[typescript]": {
      "editor.tabSize": 2
    },
    "[jsonc]": {
      "editor.tabSize": 2
    },
    "[javascript]": {
      "editor.tabSize": 2
    },
    "[html]": {
      "editor.tabSize": 2
    },
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "always"
    },
    "editor.formatOnSave": true,
    "[markdown]": {
      "editor.tabSize": 2
    }
  }
}
```

### DevContainer

```json
{
  "name": "xxx",
  "image": "node:20",
  "remoteUser": "node",
  "containerEnv": {
    "PROCESS_ENV": "local",
    "PROJECT_SECRET": "DevXxx",
    "PROJECT_AWS_ACCESS_KEY": "",
    "PROJECT_AWS_SECRET_ACCESS_KEY": "",
    "PROJECT_AWS_REGION": "",
    "NEXTAUTH_URL": "http://localhost:3000"
  },
  "workspaceFolder": "/workspaces/xxx/xxx/xxx.code-workspace",
  "customizations": {
    "vscode": {
      "extensions": [
        "donjayamanne.githistory",
        "eamodio.gitlens",
        "github.vscode-pull-request-github",
        "github.copilot",
        "GitHub.copilot-chat",
        "saoudrizwan.claude-dev",
        "oderwat.indent-rainbow",
        "wmaurer.change-case",
        "humao.rest-client",
        "bierner.markdown-mermaid",
        "wayou.vscode-todo-highlight",
        "dbaeumer.vscode-eslint"
      ]
    }
  }
}
```
