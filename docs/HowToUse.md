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
        "../typescript-common/common/*"
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

### public/sw.js

```javascript
// サービスワーカーが「push」イベントを受け取ったときの処理
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/logo.png',
      badge: '/logo.png',
      vibrate: [100, 50, 100],
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 表示された通知がクリックされたときの処理
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http://localhost:3000')

    // TODO: これでいけるかも？
    // clients.openWindow(self.location.origin || "http://localhost:3000")
  );
});
```

### public/logo.png

- ロゴを設定する

### app/manifest.ts

```typescript
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'xxx',
    short_name: 'xxx',
    description: 'xxx',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo.png',
        sizes: '400x400',
        type: 'image/png'
      }
    ],
    share_target: {
      action: '/share',
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url'
      }
    }
  }
}
```

### app/next-auth.d.ts

```typescript
export type { Session } from '@client-common/auth/authModule';
export type { JWT } from '@client-common/auth/authModule';
```

### app/globals.css

- 必要に応じてダークモードは解除する。

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
      "path": "../typescript-common/common",
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

COPY typescript-common ./typescript-common/common
COPY nextjs-common/common ./nextjs-common/common
COPY xxx ./xxx

WORKDIR /app/typescript-common/common
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

WORKDIR /app/typescript-common/common
COPY --from=builder /app/typescript-common/common .

WORKDIR /app/nextjs-common/common
COPY --from=builder /app/nextjs-common/common .

WORKDIR /app/xxx
COPY --from=builder /app/xxx/.next/standalone ./

COPY --from=builder /app/xxx/public ./public
COPY --from=builder /app/xxx/.next/static ./.next/static

USER node

CMD ["node", "server.js"]
```

## 識別子の取得

### クライアント側での識別子取得

ユーザーまたはターミナルを識別するIDを取得する場合、`IdentifierUtil`を使用します。

```typescript
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';

// ユーザーIDまたはターミナルIDを取得
const identifier = await IdentifierUtil.getIdentifier();
// ログイン済みの場合はUserID、未ログインの場合はTerminalIDを返す

// ターミナルIDのみを取得（ログイン状態に関わらず）
const terminalId = await IdentifierUtil.getTerminalId();
```

### サーバー側での識別子取得

サーバーサイドでユーザーIDを取得する場合、`IdentifierUtil.server.ts`を使用します。

```typescript
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';

// ユーザーID（AuthDataのid）を取得（ログインしていない場合はnull）
// セッションからGoogleUserIdを取得し、AuthDataを検索してUserIDを返す
const userId = await IdentifierUtil.getIdentifier();
```

### ターミナルID自動初期化

`CommonLayout`を使用している場合、ターミナルIDは自動的に初期化されます。
初回アクセス時にUUIDが生成され、localStorageに保存されます。

### GitHub Actions
