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

## デプロイの設定

### Dockerfile

```
FROM node:20 AS base

FROM base AS builder

ARG PROCESS_ENV
ARG PROJECT_SECRET
ARG PROJECT_AWS_ACCESS_KEY
ARG PROJECT_AWS_SECRET_ACCESS_KEY
ARG PROJECT_AWS_REGION
ARG NEXTAUTH_URL

WORKDIR /app

COPY typescript-common ./typescript-common
COPY nextjs-common/common ./nextjs-common/common
COPY xxx ./xxx

WORKDIR /app/typescript-common
RUN npm install

WORKDIR /app/nextjs-common/common
RUN npm install

WORKDIR /app/xxx
RUN npm install && \
    npm run build

FROM base AS runner

ARG PROCESS_ENV
ARG PROJECT_SECRET
ARG PROJECT_AWS_ACCESS_KEY
ARG PROJECT_AWS_SECRET_ACCESS_KEY
ARG PROJECT_AWS_REGION
ARG NEXTAUTH_URL

ENV PROCESS_ENV=${PROCESS_ENV}
ENV PROJECT_SECRET=${PROJECT_SECRET}
ENV PROJECT_AWS_ACCESS_KEY=${PROJECT_AWS_ACCESS_KEY}
ENV PROJECT_AWS_SECRET_ACCESS_KEY=${PROJECT_AWS_SECRET_ACCESS_KEY}
ENV PROJECT_AWS_REGION=${PROJECT_AWS_REGION}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

ENV AWS_LWA_PORT=3000

WORKDIR /app/typescript-common
COPY --from=builder /app/typescript-common .

WORKDIR /app/nextjs-common/common
COPY --from=builder /app/nextjs-common/common .

WORKDIR /app/xxx
COPY --from=builder /app/xxx/.next/standalone ./

COPY --from=builder /app/xxx/public ./public
COPY --from=builder /app/xxx/.next/static ./.next/static

USER node

CMD ["node", "server.js"]
```

### GitHub Actions
