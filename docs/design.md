# 設計書

## 概要

### プロジェクト概要
本プロジェクトは、Next.jsアプリケーション開発で使用する共通コンポーネント、サービス、ユーティリティを提供するライブラリです。
様々なプロジェクトで再利用可能なUIコンポーネント、API連携サービス、認証機能などを集約し、開発効率を向上させることを目的としています。

**主な機能：**
- Material-UIベースのUIコンポーネント群
- 認証・認可機能（NextAuth.js使用）
- APIルート（REST API）
- ユーティリティ関数群
- レスポンシブデザイン対応

### 対象読者
- 本プロジェクトを利用する開発者
- 本プロジェクトに新しいコンポーネントやサービスを追加する開発者
- プロジェクトアーキテクチャを理解したい技術リーダー

---

## システム構成

### アーキテクチャ概要
本プロジェクトは、Next.js 15のApp Routerアーキテクチャを採用しています。

**主要な設計パターン：**
- **コンポーネント駆動開発**: 再利用可能なUIコンポーネントの構築
- **サービス層の分離**: ビジネスロジックとAPIロジックを別レイヤーに分離
- **宣言型プログラミング**: Reactの宣言的アプローチを採用
- **クライアント/サーバー分離**: Server ComponentsとClient Componentsの適切な使い分け

**レイヤー構成：**
```
┌─────────────────────────────────┐
│   Pages/Components (UI層)       │
├─────────────────────────────────┤
│   Services (ビジネスロジック層)   │
├─────────────────────────────────┤
│   Routes (API層)                 │
├─────────────────────────────────┤
│   Utils/Hooks (共通機能層)       │
└─────────────────────────────────┘
```

### 技術スタック
**フレームワーク・ライブラリ：**
- Next.js 15.4.3
- React 19.1.1
- Material-UI (MUI) 7.2.0
- TypeScript

**認証：**
- NextAuth.js 4.24.11

**データ可視化：**
- ECharts (echarts-for-react 3.0.2)

**日付処理：**
- Day.js 1.11.13

**プッシュ通知：**
- web-push 3.6.7

**クラウドサービス：**
- AWS (Secrets Manager, その他)

---

## ディレクトリ構成

```
common/
├── auth/               # 認証関連設定
│   ├── authOptions.ts      # NextAuth設定
│   ├── authModule.ts       # 認証モジュール
│   └── AuthUtil.ts         # 認証ユーティリティ
├── components/         # 再利用可能なUIコンポーネント
│   ├── Layout/             # レイアウトコンポーネント
│   │   └── Stacks/         # スタックレイアウト
│   ├── admin/              # 管理画面コンポーネント
│   ├── content/            # コンテンツ表示コンポーネント
│   ├── data/               # データ表示コンポーネント
│   │   ├── avatar/         # アバター関連
│   │   ├── chat/           # チャット関連
│   │   ├── icon/           # アイコン関連
│   │   └── table/          # テーブル関連
│   ├── echarts/            # グラフ・チャートコンポーネント
│   ├── feedback/           # フィードバックコンポーネント
│   │   ├── alert/          # アラート
│   │   ├── dialog/         # ダイアログ
│   │   └── skeleton/       # スケルトンローディング
│   ├── inputs/             # 入力コンポーネント
│   │   ├── Buttons/        # ボタン
│   │   ├── Dates/          # 日付入力
│   │   ├── RadioGroups/    # ラジオボタングループ
│   │   ├── Selects/        # セレクトボックス
│   │   ├── TextFields/     # テキストフィールド
│   │   ├── autocomplete/   # オートコンプリート
│   │   ├── buttons/        # 各種ボタン
│   │   └── checkbox/       # チェックボックス
│   ├── layout/             # レイアウト関連
│   ├── navigations/        # ナビゲーション関連
│   │   └── Menus/          # メニュー
│   └── surfaces/           # サーフェス関連
│       └── AppBars/        # アプリケーションバー
├── hooks/              # カスタムReactフック
│   ├── notification-manager.ts     # 通知管理フック
│   └── useResponsiveGraphItems.ts  # レスポンシブグラフ用フック
├── interfaces/         # TypeScript型定義・インターフェース
│   └── SelectOptionType.ts         # セレクトオプション型
├── pages/              # ページコンポーネント
│   ├── HomePage.tsx            # ホームページ
│   └── LoadingPage.tsx         # ローディングページ
├── routes/             # APIルート
│   ├── auth/               # 認証関連API
│   ├── common/             # 共通API
│   └── terminal/           # ターミナルAPI
├── services/           # ビジネスロジック・外部サービス連携
│   ├── auth/               # 認証サービス
│   │   ├── AuthFetchService.client.ts
│   │   └── AccountFetchService.client.ts
│   ├── FetchServiceBase.ts         # Fetchサービス基底クラス
│   ├── FetchServiceBase.client.ts
│   └── CommonFetchService.client.ts
└── utils/              # ユーティリティ関数
    ├── SessionUtil.server.ts       # セッション管理（サーバー）
    ├── ResponsiveUtil.ts           # レスポンシブ対応
    ├── ResponseValidator.ts        # レスポンス検証
    ├── AdSenseUtil.server.ts       # AdSense統合（サーバー）
    ├── APIUtil.ts                  # API関連
    ├── TerminalUtil.client.ts      # ターミナル処理（クライアント）
    ├── IdentifierUtil.server.ts    # 識別子取得（サーバー）
    ├── IdentifierUtil.client.ts    # 識別子取得（クライアント）
    ├── NotificationUtil.server.ts  # 通知処理（サーバー）
    └── NotificationUtil.client.ts  # 通知処理（クライアント）
```

---

## コンポーネント設計

### コンポーネント一覧

#### Layout コンポーネント
**BasicStack** (`components/Layout/Stacks/BasicStack.tsx`)
- 縦方向に要素を配置するスタックレイアウト
- Material-UIのStackコンポーネントをラップ

**DirectionStack** (`components/Layout/Stacks/DirectionStack.tsx`)
- 横方向に要素を配置するスタックレイアウト
- spacing、justifyContent、alignItemsなどのプロパティをサポート

**CommonLayout** (`components/layout/CommonLayout.tsx`)
- アプリケーション全体の共通レイアウト
- 認証、通知、Google AdSenseの統合機能を提供
- BasicAppBar、メニュー、認証ボタンなどを含む
- 通知が有効な場合、LinkMenuに通知設定ダイアログを開く項目を自動追加
- ターミナルID自動初期化機能（TerminalIdInitializer使用）

#### Inputs コンポーネント
**Buttons:**
- `SquareButton`: 正方形ボタン（アイコン＋ラベル）
- `SignInButton`: サインインボタン
- `SignOutButton`: サインアウトボタン
- `SendButton`: 送信ボタン（チャット用）

**TextFields:**
- `BasicTextField`: 基本的なテキストフィールド
- `BasicNumberField`: 数値入力フィールド
- `CurrencyNumberField`: 通貨入力フィールド（USD⇔円の変換機能付き）
- `ChatInputField`: チャット用マルチライン入力フィールド

**Selects:**
- `BasicSelect`: 基本的なセレクトボックス

**Dates:**
- 日付入力コンポーネント（Material-UI DatePickerを使用）

**その他:**
- `RadioGroups`: ラジオボタングループ
- `autocomplete`: オートコンプリート入力
- `checkbox`: チェックボックス

#### Feedback コンポーネント
**Dialog:**
- `BasicDialog`: 基本的なダイアログ
- `EditDialog`: 編集用ダイアログ（汎用的な編集フォーム）
- `DeleteDialog`: 削除確認ダイアログ
- `AccountSettingDialog`: アカウント設定ダイアログ
- `NotificationSettingDialog`: 通知設定ダイアログ

**Alert:**
- `ErrorAlert`: エラーアラート
- `WarningAlert`: 警告アラート

**Skeleton:**
- `TextSkeleton`: テキスト読み込み中のスケルトン表示

#### Data コンポーネント
**Table:**
- `BasicTable`: 基本的なテーブル（ページネーション、ソート対応）
- `EditableTable`: 編集可能なテーブル

**Avatar:**
- `UserIconAvatar`: ユーザーアイコンアバター

**Chat:**
- `ChatMessage`: チャットメッセージバブルコンポーネント
- `ChatContainer`: チャットメッセージのスクロール可能なコンテナ

**Icon:**
- `SportsEsports`: ゲームアイコン
- `Train`: 電車アイコン
- `Home`: ホームアイコン
- `Settings`: 設定アイコン
- `Search`: 検索アイコン
- `Star`: お気に入り/スターアイコン
- `Delete`: 削除アイコン
- `Edit`: 編集アイコン
- `Add`: 追加アイコン
- `Check`: チェックマークアイコン
- `Close`: 閉じる/クローズアイコン
- `Menu`: メニューアイコン
- `Refresh`: 更新/リフレッシュアイコン
- `Person`: 人物/ユーザーアイコン
- `SmartToy`: AI/ロボットアイコン

#### Navigation コンポーネント
**Menus:**
- `LinkMenu`: リンクメニュー（ドロワー形式のナビゲーションメニュー）
  - URL指定による画面遷移をサポート
  - ダイアログ指定によるダイアログ表示をサポート
  - 使用例:
    ```tsx
    import LinkMenu, { MenuItemData } from '@client-common/components/navigations/Menus/LinkMenu';
    import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';

    const menuItems: MenuItemData[] = [
      {
        title: 'Home',
        url: '/',  // URL指定で画面遷移
      },
      {
        title: 'Settings',
        dialog: (open, onClose) => (  // ダイアログ指定でダイアログ表示
          <BasicDialog
            open={open}
            title='Settings'
            onClose={onClose}
          >
            {() => <div>Settings content</div>}
          </BasicDialog>
        ),
      },
    ];

    <LinkMenu menuItems={menuItems} />
    ```

#### Surfaces コンポーネント
**AppBars:**
- `BasicAppBar`: 基本的なアプリケーションバー（ヘッダー）

#### Content コンポーネント
- `LoadingContent`: ローディング中のコンテンツ表示
- `AccountContent`: アカウント情報表示コンテンツ

#### Admin コンポーネント
- `AdminManagement`: 管理画面の汎用管理コンポーネント（CRUD操作対応）
  - Create、Edit、Delete、Refreshボタンを提供
  - Refreshボタンでキャッシュを使わずにデータを再取得
  - オプションで`onRefresh`プロパティによりRefreshボタンの動作をカスタマイズ可能
    - `onRefresh`を指定すると、デフォルトのリフレッシュ処理を完全に置き換える
    - カスタムハンドラ内でコンポーネントの状態更新が必要な場合は、親コンポーネントで管理すること
  - 使用例:
    ```tsx
    // デフォルトの動作（onRefreshを指定しない場合）
    <AdminManagement
      fetchData={fetchItems}
      onCreate={createItem}
      onUpdate={updateItem}
      onDelete={deleteItem}
      // ... other props
    />

    // カスタムリフレッシュ処理（例: ローディング表示やログ記録を追加）
    <AdminManagement
      fetchData={fetchItems}
      onCreate={createItem}
      onUpdate={updateItem}
      onDelete={deleteItem}
      onRefresh={async () => {
        console.log('Refreshing data...');
        setLoading(true);
        await refetchData(); // 親コンポーネントで管理する独自のリフレッシュ処理
        setLoading(false);
      }}
      // ... other props
    />
    ```

#### Chart/Graph コンポーネント
- EChartsを使用したグラフコンポーネント群

---

## API設計

### エンドポイント一覧

#### 認証関連API (`routes/auth/`)
- **アカウント管理API**
  - エンドポイント: `/api/auth/account`
  - 機能: ユーザーアカウントのCRUD操作
  - メソッド: GET, POST, PUT, DELETE

#### 共通API (`routes/common/`)
- 共通的な機能を提供するAPI群

#### ターミナルAPI (`routes/terminal/`)
- **ターミナルID生成API**
  - エンドポイント: `/api/terminal`
  - メソッド: GET
  - 機能: ユニークなターミナルIDを生成

#### 識別子API (`routes/identifier/`)
- **識別子取得API**
  - エンドポイント: `/api/identifier`
  - メソッド: GET
  - 機能: ユーザーIDまたはターミナルIDを取得
  - 動作: ログイン済みの場合はUserID、未ログインの場合はnullを返す

### リクエスト/レスポンス仕様

#### 標準レスポンス形式
**成功レスポンス:**
```json
{
  "success": true,
  "data": { ... }
}
```

**エラーレスポンス:**
```json
{
  "success": false,
  "error": {
    "message": "エラーメッセージ",
    "code": "ERROR_CODE"
  }
}
```

#### 認証
- NextAuth.jsを使用したセッションベース認証
- Google OAuth 2.0プロバイダーをサポート
- JWTトークンによるセッション管理

#### データバリデーション
- `ResponseValidator`を使用したレスポンス検証
- クライアント側でのバリデーション実装

---

## データモデル

### インターフェース定義

#### 基本型定義

**SelectOptionType** (`interfaces/SelectOptionType.ts`)
```typescript
export interface SelectOptionType {
  value: string;
  label: string;
}
```
- セレクトボックスのオプションを表す型
- Material-UIのSelectコンポーネントで使用

#### データ型の構造

**DataTypeBase**
- すべてのデータモデルの基底インターフェース
- 共通フィールド: `id`, `create`, `update`

**AuthDataType**
- 認証・アカウント情報を表すデータ型
- フィールド: `id`, `name`, `googleUserId`, `create`, `update`

### 型の命名規則
- インターフェース名: PascalCase（例: `SelectOptionType`）
- データ型: `***DataType`の形式（例: `AuthDataType`）
- プロパティ型: `***Props`の形式（例: `EditDialogProps`）

### ジェネリック型の活用
多くのコンポーネントとサービスはジェネリック型を活用して型安全性を確保：
```typescript
// 例: AdminManagementコンポーネント
interface AdminManagementProps<
  ItemType extends DataTypeBase,
  StateType extends Record<string, unknown> = Record<string, unknown>
> {
  // ...
}
```

---

## 状態管理

### 状態管理方針

#### React Hooksによる状態管理
本プロジェクトは、主にReactの標準Hooksを使用した状態管理を採用しています。

**使用しているHooks:**
- `useState`: コンポーネント内のローカル状態管理
- `useEffect`: 副作用の処理（データフェッチ、サブスクリプションなど）
- `useCallback`: 関数のメモ化
- `useMemo`: 値のメモ化

#### カスタムHooks
**notification-manager.ts**
- 通知機能の状態管理を担当
- プッシュ通知の購読・管理機能を提供

**useResponsiveGraphItems.ts**
- レスポンシブなグラフアイテムの状態管理
- 画面サイズに応じたグラフ表示の最適化

#### サーバー状態の管理
- `FetchServiceBase`クラスを使用したAPI通信
- 非同期データの取得と更新
- エラーハンドリングとローディング状態の管理

#### グローバル状態
- NextAuth.jsによるセッション状態の管理
- セッション情報は`SessionUtil`を通じてアクセス

---

## 認証・認可

### 認証フロー

#### NextAuth.jsによる認証
本プロジェクトは、NextAuth.js v4を使用した認証システムを実装しています。

**認証プロバイダー:**
- Google OAuth 2.0

**認証フロー:**
1. ユーザーがサインインボタンをクリック
2. Google OAuthの認証画面にリダイレクト
3. ユーザーがGoogleアカウントで認証
4. アクセストークンを取得しJWTに保存
5. セッション情報をクライアントに返却

#### 認証設定
**authOptions** (`auth/authOptions.ts`)
```typescript
- プロバイダー設定（Google OAuth）
- シークレットキーの管理（AWS Secrets Manager経由）
- JWT/セッションコールバックの実装
```

**主な機能:**
- アクセストークンの保存
- セッション情報の拡張
- 複数プロバイダーのトークン管理

### セッション管理

#### SessionUtil (サーバー側)
**SessionUtil.server.ts**
- サーバーサイドでのセッション確認
- `hasSession()`: セッションの有無を確認

#### IdentifierUtil (識別子管理)
**IdentifierUtil.server.ts** (サーバー側)
- ユーザーまたはターミナルを識別するためのユーティリティ
- `getIdentifier()`: ログイン済みの場合はUserID（AuthDataのid）、未ログインの場合はnullを返す
- セッション情報からGoogle UserIDを取得し、SimpleAuthServiceでAuthDataを検索してUserIDを取得

**IdentifierUtil.client.ts** (クライアント側)
- ユーザーまたはターミナルを識別するためのユーティリティ
- `getIdentifier()`: ログイン済みの場合はUserID、未ログインの場合はTerminalIDを返す
- `/api/identifier` APIを使用してサーバーからUserIDを取得
- UserIDが取得できない場合は自動的にTerminalIDにフォールバック
- `getTerminalId()`: ターミナルIDのみを取得（ログイン状態に関わらず）

#### TerminalIdInitializer (コンポーネント)
**TerminalIdInitializer.tsx**
- CommonLayout内で自動的にターミナルIDを初期化
- useEffectでコンポーネントマウント時に`TerminalUtil.getTerminalId()`を呼び出し
- UI要素を持たない（nullを返す）クライアントコンポーネント
- ターミナルIDはlocalStorageに永続化される

#### セッション情報の拡張
- デフォルトのセッション情報に加えて、プロバイダーのアクセストークンを保存
- `session.tokens`配列にプロバイダー別のトークンを格納

#### セキュリティ
- AWS Secrets Managerを使用した機密情報の管理
- シークレットキーはコードに直接記述せず、環境変数とSecrets Managerで管理
- JWTトークンによる安全なセッション管理

---

## スタイリング

### デザインシステム
**Material-UI (MUI) v7を採用**
- Googleのマテリアルデザイン原則に基づいたUIコンポーネント
- 一貫性のあるデザイン言語
- アクセシビリティ対応
- レスポンシブデザイン対応

**レスポンシブ対応:**
- `ResponsiveUtil`を使用したデバイス判定
- `useMobileDetection()`フックでモバイル/デスクトップを判別
- 画面サイズに応じたレイアウトの自動調整

**コンポーネント設計方針:**
- 小さく再利用可能なコンポーネント
- プロパティによる柔軟なカスタマイズ
- デフォルト値の提供で使いやすさを確保

### テーマ設定
**フォント:**
- Geist Sans（メインフォント）
- Geist Mono（等幅フォント）
- Next.jsのフォント最適化機能を活用

**カラースキーム:**
- Material-UIのデフォルトテーマを基本とする
- プロジェクト固有のカラーパレットは必要に応じてカスタマイズ可能

**スタイリング手法:**
- Material-UIのスタイリングシステム（`sx`プロップ）
- Emotion（CSS-in-JS）
- インラインスタイルとStyled Componentsの組み合わせ

### アイコン
- Material-UI Icons (`@mui/icons-material`)を使用
- カスタムアイコンコンポーネント（例: SportsEsports, Train）

---

## パフォーマンス最適化

### 最適化方針

#### Next.js 15の機能活用
**App Router:**
- Server Componentsによるサーバーサイドレンダリング
- Client Componentsは必要な箇所のみに限定（`'use client'`ディレクティブ）
- ストリーミングSSRによる初期表示の高速化

**コード分割:**
- 動的インポートによるコンポーネントの遅延読み込み
- ページごとの自動コード分割

**画像最適化:**
- Next.jsの`Image`コンポーネント（使用している場合）
- 自動的なサイズ最適化とフォーマット変換

#### パフォーマンス最適化手法
**メモ化:**
- `useMemo`によるコストの高い計算結果のキャッシュ
- `useCallback`による関数の再生成防止
- React.memoによるコンポーネントの不要な再レンダリング防止

**ローディング状態の管理:**
- Skeletonコンポーネントによるローディング体験の向上
- LoadingPageによる非同期処理中の視覚的フィードバック

**リソース読み込みの最適化:**
- Google Fontsの最適化読み込み
- Next.jsの`Script`コンポーネントによるスクリプト読み込み戦略
  - `strategy="afterInteractive"` for Google AdSense

#### データフェッチ最適化
- ページネーション対応のテーブルコンポーネント
- 必要なデータのみをフェッチ
- レスポンスキャッシュの活用（必要に応じて）

---

## セキュリティ

### セキュリティ対策

#### 認証・認可
- NextAuth.jsによる安全な認証フロー
- OAuth 2.0を使用した外部プロバイダー認証
- セッションベースの認可

#### 機密情報の管理
**AWS Secrets Manager統合:**
- Google OAuth認証情報の安全な保存
- NextAuthシークレットキーの管理
- アプリケーションコードに機密情報を含めない

**環境変数:**
- `PROJECT_SECRET`: Secrets Manager参照用の環境変数
- 機密情報は環境変数を通じてアクセス

#### データバリデーション
**入力検証:**
- フォーム入力のクライアント側バリデーション
- 必須項目チェック（例: アカウント名）
- エラーメッセージの適切な表示

**API応答検証:**
- `ResponseValidator`による応答の妥当性チェック
- 不正なレスポンスの検出とエラーハンドリング

#### XSS/CSRF対策
- Reactの自動エスケープ機能
- NextAuth.jsによるCSRF保護
- HTTPヘッダーのセキュリティ設定

#### 通信セキュリティ
- HTTPS通信の使用
- セキュアなCookie設定
- トークンの安全な管理

#### エラーハンドリング
- エラー情報の適切な制御
- ユーザーに対する分かりやすいエラーメッセージ
- 詳細なエラー情報の不要な露出を防止

---

## テスト

### テスト方針
現在、本プロジェクトには専用のテストフレームワークは導入されていませんが、以下のテスト戦略を推奨します。

#### 推奨テストアプローチ
**単体テスト (Unit Tests):**
- ユーティリティ関数のテスト
- 個別のコンポーネントのテスト
- サービス層のロジックテスト

**統合テスト (Integration Tests):**
- コンポーネント間の連携テスト
- APIエンドポイントのテスト
- 認証フローのテスト

**E2Eテスト (End-to-End Tests):**
- ユーザーシナリオのテスト
- 主要な機能フローのテスト

#### 推奨ツール
- **テストフレームワーク**: Jest または Vitest
- **コンポーネントテスト**: React Testing Library
- **E2Eテスト**: Playwright または Cypress
- **型チェック**: TypeScriptの型システム

### テスト項目
以下は今後実装すべきテストの例です。

#### コンポーネントテスト
- BasicStack、DirectionStackのレンダリングテスト
- ボタンコンポーネントのクリックイベントテスト
- フォームコンポーネントの入力・バリデーションテスト
- ダイアログの開閉動作テスト
- テーブルのページネーション・ソート機能テスト

#### サービステスト
- FetchServiceBaseのCRUD操作テスト
- エラーハンドリングテスト
- レスポンスバリデーションテスト

#### ユーティリティテスト
- SessionUtilのセッション判定テスト
- ResponsiveUtilのデバイス判定テスト
- APIUtilのレスポンス生成テスト

#### 認証テスト
- ログインフローテスト
- セッション管理テスト
- 認可チェックテスト

---

## デプロイメント

### デプロイフロー

#### GitHub Actions CI/CD
**ワークフロー設定:**
- Settings -> Actions -> Workflow permissions
  - Read and write permissions: ON
  - Allow GitHub Actions to create and approve pull requests: ON

**GitHub Secrets設定:**
- `AWS_ACCESS_KEY`: AWSアクセスキー
- `AWS_SECRET_ACCESS_KEY`: AWSシークレットキー
- `AWS_REGION`: AWSリージョン
- `LLM_API_KEY`: LLM APIキー
- `PAT_TOKEN`: パーソナルアクセストークン
- `PAT_USERNAME`: GitHubユーザー名

**GitHub Variables設定:**
- `LLM_MODEL`: openai/gpt-4.1-mini
- `TARGET_BRANCH`: develop または master

#### デプロイ手順
1. **コードプッシュ**: 開発者がブランチにコードをプッシュ
2. **CI実行**: GitHub Actionsが自動的にビルド・テスト実行
3. **PR作成**: develop/masterブランチへのPR作成
4. **レビュー**: コードレビュー実施
5. **マージ**: 承認後にマージ
6. **自動デプロイ**: ターゲット環境へ自動デプロイ

### 環境構成

#### 開発環境
- ローカル開発環境
- Next.js開発サーバー（`npm run dev`）
- ホットリロード対応

#### ステージング環境（推奨）
- 本番環境に近い構成
- 統合テスト・E2Eテスト実施
- パフォーマンステスト実施

#### 本番環境
- AWSまたは他のクラウドプラットフォーム
- CDN経由での配信（推奨）
- ロードバランサー設定（必要に応じて）

#### 環境変数の管理
**必須環境変数:**
- `PROJECT_SECRET`: AWS Secrets Manager参照用
- `NEXTAUTH_URL`: アプリケーションURL
- `NEXTAUTH_SECRET`: NextAuth秘密鍵（Secrets Manager経由）

**Google OAuth設定:**
- `GOOGLE_CLIENT_ID`: Secrets Manager経由
- `GOOGLE_CLIENT_SECRET`: Secrets Manager経由

**オプション設定:**
- Google AdSense設定（AdSenseUtil経由）

---

## 運用・保守

### 監視・ログ

#### ログ管理
**クライアント側:**
- `console.log`, `console.error`による基本的なログ出力
- エラー情報のキャプチャとユーザーへのフィードバック

**サーバー側:**
- Next.jsのサーバーログ
- APIエンドポイントのリクエスト/レスポンスログ
- エラートラッキング（推奨: Sentry等のサービス導入）

#### 監視項目（推奨）
- **パフォーマンス監視**
  - ページ読み込み時間
  - APIレスポンス時間
  - Core Web Vitals

- **エラー監視**
  - JavaScriptエラー
  - APIエラー率
  - 認証エラー

- **利用状況監視**
  - アクティブユーザー数
  - ページビュー
  - 機能使用率

### バックアップ

#### データバックアップ
**AWS Secrets Manager:**
- 機密情報は自動的にAWSでバックアップされる
- バージョン管理により過去の値へのアクセスが可能

**セッションデータ:**
- JWTトークンベースのため、永続化は不要
- 必要に応じてセッションストアの導入を検討

**ユーザーデータ:**
- データベース（別システム）のバックアップポリシーに従う
- 定期的なバックアップとリストアテストの実施

#### コードバージョン管理
- GitHubリポジトリによるバージョン管理
- ブランチ戦略: develop/masterブランチの使用
- 自動的なブランチ削除設定（Settings -> General -> Pull Requests）

### メンテナンス

#### 依存関係の更新
- 定期的な`npm audit`によるセキュリティ脆弱性チェック
- パッケージの定期的なアップデート
- Next.js、React、Material-UIのメジャーバージョンアップデート計画

#### ドキュメント更新
- コンポーネント追加時のドキュメント更新
- API変更時の設計書更新
- README.mdの保守

---

## 今後の課題・拡張性

### 既知の課題

#### テスト基盤の整備
- 現在、テストフレームワークが導入されていない
- ユニットテスト、統合テスト、E2Eテストの導入が必要
- CI/CDパイプラインへのテスト統合

#### 型定義の充実
- 現在、`interfaces`ディレクトリには限定的な型定義のみ
- より多くの共通型定義の追加が望ましい
- データ型の標準化とドキュメント化

#### コンポーネントカタログ
- Storybookなどのコンポーネントカタログツールの導入
- コンポーネントの使用例とプロパティの可視化
- デザイナーとの協業を容易にする

#### パフォーマンス測定
- 定量的なパフォーマンス指標の設定
- 継続的なパフォーマンス監視の仕組み
- ベンチマークテストの実装

### 今後の拡張計画

#### 機能拡張
**新しいコンポーネント追加:**
- より多様なフォームコンポーネント
- データビジュアライゼーションコンポーネントの拡充
- アニメーション・トランジション対応コンポーネント

**ユーティリティ関数の拡充:**
- 日付操作ユーティリティ
- バリデーションヘルパー
- フォーマッターユーティリティ

**認証機能の拡張:**
- 複数の認証プロバイダー対応
- ロールベースアクセス制御（RBAC）
- 2段階認証の導入

#### アーキテクチャ改善
**状態管理の強化:**
- グローバル状態管理ライブラリの導入検討（Zustand, Jotai等）
- サーバー状態管理の最適化（React Query等）

**国際化対応:**
- i18nの導入
- 多言語対応コンポーネント
- ロケールベースのフォーマット

**アクセシビリティ向上:**
- WCAG 2.1準拠
- キーボードナビゲーションの改善
- スクリーンリーダー対応の強化

#### 開発者体験の向上
- ESLint/Prettierの設定強化
- コミットフックの導入（Husky）
- 自動フォーマット・リントの強制
- コンポーネントジェネレーターの導入

#### ドキュメント整備
- コンポーネント使用ガイドの作成
- ベストプラクティス集の作成
- サンプルコード・デモアプリケーションの充実
- APIリファレンスの自動生成

---

## 参考資料

### 関連ドキュメント
- [基本設定内容](./settings/baseSetting.md) - GitHub設定、AWS設定などの基本設定

### 外部リンク

#### 公式ドキュメント
- [Next.js Documentation](https://nextjs.org/docs) - Next.jsの公式ドキュメント
- [React Documentation](https://react.dev/) - Reactの公式ドキュメント
- [Material-UI Documentation](https://mui.com/) - Material-UIの公式ドキュメント
- [NextAuth.js Documentation](https://next-auth.js.org/) - NextAuth.jsの公式ドキュメント
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScriptの公式ドキュメント

#### ツール・ライブラリ
- [ECharts Documentation](https://echarts.apache.org/en/index.html) - EChartsの公式ドキュメント
- [Day.js Documentation](https://day.js.org/) - Day.jsの公式ドキュメント
- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030) - Web Pushプロトコル仕様

#### AWS関連
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/) - Secrets Managerドキュメント
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/) - AWS SDK for JavaScript

#### ベストプラクティス
- [React Best Practices](https://react.dev/learn) - Reactのベストプラクティス
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application) - Next.jsのベストプラクティス
- [Material Design Guidelines](https://m3.material.io/) - マテリアルデザインガイドライン
