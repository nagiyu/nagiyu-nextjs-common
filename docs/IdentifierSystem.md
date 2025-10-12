# 識別子システム

このドキュメントは、CommonLayoutに追加された識別子システムについて説明します。

## 概要

識別子システムは、ユーザーと端末を一意に識別する方法を提供します：
- **ログイン済みユーザー**: AuthDataのUser IDで識別
- **匿名ユーザー**: Terminal ID（localStorageに保存されたUUID）で識別

## コンポーネント

### TerminalIdInitializer

**場所**: `common/components/utils/TerminalIdInitializer.tsx`

CommonLayoutがマウントされたときに自動的に端末IDを初期化するクライアントコンポーネントです。このコンポーネントは：
- クライアントサイドで実行される（`'use client'`）
- コンポーネントマウント時に`TerminalUtil.getTerminalId()`を呼び出す
- UI要素を持たない（nullを返す）
- 端末IDが生成されlocalStorageに保存されることを保証する

### IdentifierUtil (サーバー側)

**場所**: `common/utils/IdentifierUtil.server.ts`

ユーザー識別子を取得するためのサーバーサイドユーティリティ：
- `getIdentifier()`: ログイン済みの場合はUser ID（AuthDataのid）、未ログインの場合はnullを返す
- セッションからGoogleUserIdを取得し、AuthDataを検索して実際のUserIDを取得する
- `SessionUtil`でセッションを確認し、`SimpleAuthService`でユーザーデータを取得する

### IdentifierUtil (クライアント側)

**場所**: `common/utils/IdentifierUtil.client.ts`

ユーザーまたは端末の識別子を取得するためのクライアントサイドユーティリティ：
- `getIdentifier()`: ログイン済みの場合はUser ID、未ログインの場合はTerminal IDを返す
  - まず`/api/identifier`エンドポイントからUser IDの取得を試みる
  - User IDが取得できない場合はTerminal IDにフォールバックする
- `getTerminalId()`: ログイン状態に関わらずTerminal IDを返す

## APIエンドポイント

### GET /api/identifier

**場所**: `common/routes/identifier/route.ts`

現在の識別子情報を返します：

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "identifier": "user-id-or-null",
    "type": "user" | "none"
  }
}
```

## 使用例

### クライアントサイド

ユーザーまたは端末を識別するIDを取得する場合、`IdentifierUtil`を使用します。

```typescript
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';

// ユーザーIDまたは端末IDを取得
const identifier = await IdentifierUtil.getIdentifier();
// ログイン済みの場合はUserID、未ログインの場合はTerminalIDを返す

// 端末IDのみを取得（ログイン状態に関わらず）
const terminalId = await IdentifierUtil.getTerminalId();
```

### サーバーサイド

サーバーサイドでユーザーIDを取得する場合、`IdentifierUtil.server.ts`を使用します。

```typescript
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';

// ユーザーID（AuthDataのid）を取得（ログインしていない場合はnull）
// セッションからGoogleUserIdを取得し、AuthDataを検索してUserIDを返す
const userId = await IdentifierUtil.getIdentifier();
```

## 統合

TerminalIdInitializerはCommonLayoutに自動的に統合されているため、CommonLayoutを使用するアプリケーションでは以下が自動的に提供されます：
1. 初回訪問時の自動的な端末ID生成
2. localStorageへの端末IDの永続化
3. IdentifierUtilを介したユーザー/端末識別子の取得機能

### 端末ID自動初期化

`CommonLayout`を使用している場合、端末IDは自動的に初期化されます。
初回アクセス時にUUIDが生成され、localStorageに保存されます。

## テスト

サンプルアプリケーションの`/sample/identifier`でテストページが利用可能です。このページでは以下を確認できます：
- 現在の識別子の値
- 端末IDの値
- 動作の説明

## 関連ドキュメント

詳細については以下を参照してください：
- `docs/design.md` - アーキテクチャと設計の詳細
