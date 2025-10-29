# ECS/Fargateアーキテクチャ設計書

## 概要

本ドキュメントは、現在Lambda関数ベースでデプロイされているNext.jsサンプルアプリケーションを、Amazon ECS (Elastic Container Service) と AWS Fargate を使用した構成に移行するためのアーキテクチャ設計を記載します。

---

## 目次

1. [背景と目的](#背景と目的)
2. [現在のアーキテクチャ](#現在のアーキテクチャ)
3. [新しいアーキテクチャ（ECS/Fargate）](#新しいアーキテクチャecsfargate)
4. [インフラストラクチャ構成](#インフラストラクチャ構成)
5. [デプロイメントフロー](#デプロイメントフロー)
6. [セキュリティ設計](#セキュリティ設計)
7. [スケーリング戦略](#スケーリング戦略)
8. [監視とロギング](#監視とロギング)
9. [コスト見積もり](#コスト見積もり)
10. [移行計画](#移行計画)
11. [リスクと対策](#リスクと対策)

---

## 背景と目的

### 現在の課題

現在のLambda関数ベースの構成には以下の制約があります：

- **実行時間制限**: Lambda関数の最大実行時間は15分
- **コールドスタート**: 初回リクエスト時のレイテンシが高い
- **メモリ制限**: 最大10GBまで
- **コンテナサイズ制限**: 10GBまで（圧縮後）
- **WebSocketサポート**: 限定的な対応

### 移行の目的

ECS/Fargateへの移行により以下の改善を目指します：

- **長時間実行プロセスのサポート**: WebSocketやストリーミング処理の実現
- **予測可能なパフォーマンス**: コールドスタートの排除
- **柔軟なリソース管理**: CPUとメモリの細かい調整
- **スケーラビリティ**: トラフィックに応じた自動スケーリング
- **運用性向上**: コンテナオーケストレーションによる管理の簡素化

---

## 現在のアーキテクチャ

### 構成図

```
┌──────────────────┐
│   GitHub Actions │
│  (CI/CD Pipeline)│
└────────┬─────────┘
         │
         ▼
┌────────────────────┐
│   Amazon ECR       │
│  (Container Registry)
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  AWS Lambda        │
│  + Lambda Adapter  │
│  (Next.js Runtime) │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  API Gateway or    │
│  Lambda Function   │
│  URL               │
└────────────────────┘
```

### 主要コンポーネント

1. **GitHub Actions**: CI/CDパイプライン
   - Dockerイメージのビルド
   - ECRへのプッシュ
   - Lambda関数の更新

2. **Amazon ECR**: コンテナレジストリ
   - Dockerイメージの保存

3. **AWS Lambda**: サーバーレス実行環境
   - Lambda Web Adapter使用
   - Next.jsアプリケーションの実行

### 現在のDockerfile構成

```dockerfile
# 2ステージビルド
FROM node:20 AS builder
# アプリケーションビルド

FROM node:20 AS runner
# Lambda Adapter統合
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV AWS_LWA_PORT=3000
CMD ["node", "server.js"]
```

---

## 新しいアーキテクチャ（ECS/Fargate）

### 全体構成図

```
                     ┌──────────────────┐
                     │  GitHub Actions  │
                     │ (CI/CD Pipeline) │
                     └────────┬─────────┘
                              │
                              ▼
                     ┌────────────────────┐
                     │   Amazon ECR       │
                     │ (Container Registry)
                     └────────┬───────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                       AWS Cloud                          │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              VPC (Virtual Private Cloud)         │   │
│  │                                                  │   │
│  │  ┌──────────────┐        ┌──────────────┐      │   │
│  │  │ Public Subnet│        │ Public Subnet│      │   │
│  │  │    (AZ-a)    │        │    (AZ-c)    │      │   │
│  │  │              │        │              │      │   │
│  │  │  ┌────────┐  │        │  ┌────────┐  │      │   │
│  │  │  │  ALB   │◄─┼────────┼──┤  ALB   │  │      │   │
│  │  │  └───┬────┘  │        │  └───┬────┘  │      │   │
│  │  └──────┼───────┘        └──────┼───────┘      │   │
│  │         │                       │              │   │
│  │  ┌──────▼───────┐        ┌──────▼───────┐     │   │
│  │  │Private Subnet│        │Private Subnet│     │   │
│  │  │    (AZ-a)    │        │    (AZ-c)    │     │   │
│  │  │              │        │              │     │   │
│  │  │ ┌──────────┐ │        │ ┌──────────┐ │     │   │
│  │  │ │ECS Task  │ │        │ │ECS Task  │ │     │   │
│  │  │ │(Fargate) │ │        │ │(Fargate) │ │     │   │
│  │  │ │          │ │        │ │          │ │     │   │
│  │  │ │Next.js   │ │        │ │Next.js   │ │     │   │
│  │  │ │Container │ │        │ │Container │ │     │   │
│  │  │ └──────────┘ │        │ └──────────┘ │     │   │
│  │  └──────────────┘        └──────────────┘     │   │
│  │                                                │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │         Supporting Services                     │   │
│  │                                                 │   │
│  │  • CloudWatch (Logs & Metrics)                 │   │
│  │  • Secrets Manager (Credentials)               │   │
│  │  • Auto Scaling (ECS Service)                  │   │
│  │  • Route 53 (DNS - Optional)                   │   │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### アーキテクチャの特徴

1. **高可用性**: 複数のAvailability Zone（AZ）に分散配置
2. **負荷分散**: Application Load Balancer（ALB）による自動負荷分散
3. **自動スケーリング**: トラフィックに応じたタスク数の自動調整
4. **セキュアな構成**: プライベートサブネット内でのコンテナ実行
5. **マネージドインフラ**: Fargateによるサーバーレスなコンテナ実行

---

## インフラストラクチャ構成

### 1. ネットワーク構成（VPC）

#### VPC設計

```
VPC CIDR: 10.0.0.0/16

Public Subnets (インターネット接続可能):
  - Public Subnet A: 10.0.1.0/24 (AZ-a)
  - Public Subnet C: 10.0.2.0/24 (AZ-c)

Private Subnets (インターネット接続不可):
  - Private Subnet A: 10.0.11.0/24 (AZ-a)
  - Private Subnet C: 10.0.12.0/24 (AZ-c)
```

#### ネットワークコンポーネント

- **Internet Gateway**: パブリックサブネットのインターネット接続
- **NAT Gateway**: プライベートサブネットからの外部通信
  - 各AZに1つずつ配置（高可用性）
- **Route Tables**: サブネットごとのルーティング設定

### 2. Application Load Balancer（ALB）

#### 設定項目

- **スキーム**: Internet-facing
- **サブネット**: パブリックサブネット（複数AZ）
- **セキュリティグループ**: 
  - Inbound: HTTP (80), HTTPS (443) from 0.0.0.0/0
  - Outbound: All traffic to VPC CIDR
- **ターゲットグループ**: 
  - Protocol: HTTP
  - Port: 3000
  - Health Check: /api/health または /
  - Health Check Interval: 30秒
  - Healthy Threshold: 2
  - Unhealthy Threshold: 3

#### HTTPSリスナー設定

```
Listener: HTTPS (443)
  ├─ SSL/TLS Certificate (AWS Certificate Manager)
  ├─ Default Action: Forward to Target Group
  └─ Security Policy: ELBSecurityPolicy-TLS13-1-2-2021-06

Listener: HTTP (80)
  └─ Redirect to HTTPS
```

### 3. ECSクラスター

#### クラスター設定

```yaml
Cluster Name: nextjs-common-cluster
Capacity Providers:
  - FARGATE
  - FARGATE_SPOT (コスト削減用・オプション)
Container Insights: 有効化（監視用）
```

### 4. ECSタスク定義

#### タスク定義詳細

```yaml
Family: nextjs-common-task
Network Mode: awsvpc
Requires Compatibilities: FARGATE
CPU: 512 (0.5 vCPU) または 1024 (1 vCPU)
Memory: 1024 (1 GB) または 2048 (2 GB)

Container Definitions:
  - Name: nextjs-app
    Image: <ECR_REPOSITORY_URI>:latest
    Port Mappings:
      - Container Port: 3000
        Protocol: tcp
    Environment:
      - PROCESS_ENV: production/development
      - AWS_LWA_PORT: 3000
    Secrets (from Secrets Manager):
      - PROJECT_SECRET
      - NEXTAUTH_URL
      - PROJECT_AWS_ACCESS_KEY (オプション)
      - PROJECT_AWS_SECRET_ACCESS_KEY (オプション)
    Logging:
      Log Driver: awslogs
      Options:
        awslogs-group: /ecs/nextjs-common
        awslogs-region: ap-northeast-1
        awslogs-stream-prefix: nextjs
    Health Check:
      Command: ["CMD-SHELL", "curl -f http://localhost:3000/ || exit 1"]
      Interval: 30
      Timeout: 5
      Retries: 3
      StartPeriod: 60

Execution Role ARN: ecsTaskExecutionRole (with ECR & Secrets Manager access)
Task Role ARN: ecsTaskRole (with application-specific permissions)
```

### 5. ECSサービス

#### サービス設定

```yaml
Service Name: nextjs-common-service
Task Definition: nextjs-common-task:latest
Desired Count: 2 (最小タスク数)
Launch Type: FARGATE
Platform Version: LATEST

Network Configuration:
  VPC: nextjs-vpc
  Subnets: Private Subnet A, Private Subnet C
  Security Groups: ecs-tasks-sg
  Assign Public IP: DISABLED

Load Balancing:
  Type: Application Load Balancer
  Target Group: nextjs-tg
  Container Name: nextjs-app
  Container Port: 3000

Service Discovery: 有効化（オプション - AWS Cloud Map）

Deployment Configuration:
  Deployment Type: Rolling Update
  Minimum Healthy Percent: 100
  Maximum Percent: 200
  
Health Check Grace Period: 60秒
```

### 6. セキュリティグループ

#### ALBセキュリティグループ

```yaml
Name: alb-sg
Inbound Rules:
  - Type: HTTP, Port: 80, Source: 0.0.0.0/0
  - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
Outbound Rules:
  - Type: All Traffic, Destination: ecs-tasks-sg
```

#### ECSタスクセキュリティグループ

```yaml
Name: ecs-tasks-sg
Inbound Rules:
  - Type: Custom TCP, Port: 3000, Source: alb-sg
Outbound Rules:
  - Type: HTTPS, Port: 443, Destination: 0.0.0.0/0 (AWS APIs, ECR, Secrets Manager)
  - Type: Custom TCP, Port: 443, Destination: 0.0.0.0/0 (外部API通信)
```

### 7. IAMロール

#### ECSタスク実行ロール（ecsTaskExecutionRole）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/ecs/nextjs-common:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:*:*:secret:NextjsCommonSample*",
        "arn:aws:secretsmanager:*:*:secret:DevNextjsCommonSample*",
        "arn:aws:secretsmanager:*:*:secret:AWS*"
      ]
    }
  ]
}
```

#### ECSタスクロール（ecsTaskRole）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:*:*:secret:NextjsCommonSample*",
        "arn:aws:secretsmanager:*:*:secret:DevNextjsCommonSample*"
      ]
    }
  ]
}
```

---

## デプロイメントフロー

### 新しいCI/CDパイプライン

#### GitHub Actions ワークフロー構成

```yaml
name: Deploy to ECS/Fargate

on:
  push:
    branches:
      - master
      - develop
  workflow_dispatch:

jobs:
  deploy-to-ecs:
    runs-on: ubuntu-latest
    
    environment:
      name: ${{ github.ref == 'refs/heads/master' && 'production' || 'development' }}
    
    steps:
      # 1. リポジトリチェックアウト
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          submodules: true
      
      # 2. AWS認証設定
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      
      # 3. ECRログイン
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      # 4. Secrets Manager からシークレット取得
      - name: Get secrets from AWS Secrets Manager
        uses: aws-actions/aws-secretsmanager-get-secrets@v2
        with:
          secret-ids: |
            AWS_SECRETS, AWS
            PROJECT, ${{ github.ref == 'refs/heads/master' && 'NextjsCommonSample' || 'DevNextjsCommonSample' }}
          parse-json-secrets: true
      
      # 5. sw.js エンドポイント書き換え
      - name: Rewrite sw.js endpoint
        run: |
          sed -i 's|http://localhost:3000|${{ env.PROJECT_CLIENT_BASE_URL }}|g' sample/public/sw.js
      
      # 6. Dockerイメージビルド
      - name: Build Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: nextjs-common-sample
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build \
            --build-arg PROCESS_ENV=${{ github.ref == 'refs/heads/master' && 'production' || 'development' }} \
            --build-arg PROJECT_SECRET=${{ github.ref == 'refs/heads/master' && 'NextjsCommonSample' || 'DevNextjsCommonSample' }} \
            --build-arg PROJECT_AWS_ACCESS_KEY=${{ env.PROJECT_AWS_ACCESS_KEY }} \
            --build-arg PROJECT_AWS_SECRET_ACCESS_KEY=${{ env.PROJECT_AWS_SECRET_ACCESS_KEY }} \
            --build-arg PROJECT_AWS_REGION=${{ env.PROJECT_AWS_REGION }} \
            --build-arg NEXTAUTH_URL=${{ env.PROJECT_CLIENT_BASE_URL }} \
            -f sample/Dockerfile \
            -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            -t $ECR_REGISTRY/$ECR_REPOSITORY:latest \
            .
      
      # 7. ECRへプッシュ
      - name: Push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: nextjs-common-sample
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      # 8. ECSタスク定義の更新
      - name: Download task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition nextjs-common-task \
            --query taskDefinition > task-definition.json
      
      - name: Update task definition with new image
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: task-definition.json
          container-name: nextjs-app
          image: ${{ steps.login-ecr.outputs.registry }}/nextjs-common-sample:${{ github.sha }}
      
      # 9. ECSサービスへのデプロイ
      - name: Deploy to Amazon ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: nextjs-common-service
          cluster: nextjs-common-cluster
          wait-for-service-stability: true
      
      # 10. デプロイ完了通知（オプション）
      - name: Deployment notification
        if: always()
        run: |
          echo "Deployment to ECS completed"
          echo "Image: ${{ steps.login-ecr.outputs.registry }}/nextjs-common-sample:${{ github.sha }}"
```

### Dockerfile の変更点

Lambda Adapter関連の設定を削除し、標準的なNode.jsコンテナに変更：

```dockerfile
FROM node:20 AS base

FROM base AS builder

ARG PROCESS_ENV
ARG PROJECT_SECRET
ARG PROJECT_AWS_ACCESS_KEY
ARG PROJECT_AWS_SECRET_ACCESS_KEY
ARG PROJECT_AWS_REGION
ARG NEXTAUTH_URL

WORKDIR /app

COPY typescript-common/common ./typescript-common/common
COPY common ./common
COPY sample ./sample

WORKDIR /app/typescript-common/common
RUN npm install

WORKDIR /app/common
RUN npm install

WORKDIR /app/sample
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

# Lambda Adapter関連の行を削除
# COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
# ENV AWS_LWA_PORT=3000

# ヘルスチェック用のエンドポイント追加
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

WORKDIR /app/typescript-common/common
COPY --from=builder /app/typescript-common/common .

WORKDIR /app/common
COPY --from=builder /app/common .

WORKDIR /app/sample
COPY --from=builder /app/sample/.next/standalone ./

COPY --from=builder /app/sample/public ./public
COPY --from=builder /app/sample/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
```

### デプロイメント戦略

#### ブルー/グリーンデプロイメント

1. **新しいタスク定義のデプロイ**
   - 新しいイメージでタスク定義を更新
   - 新しいタスクを起動

2. **ローリングアップデート**
   - Minimum Healthy Percent: 100%
   - Maximum Percent: 200%
   - 古いタスクを段階的に新しいタスクに置き換え

3. **ヘルスチェック**
   - ALBがヘルスチェックを実行
   - 正常なタスクのみトラフィックを受信

4. **ロールバック**
   - 問題発生時は前のタスク定義に戻す
   - `aws ecs update-service`コマンドで実施

---

## セキュリティ設計

### 1. ネットワークセキュリティ

#### VPCセキュリティ

- **プライベートサブネット**: ECSタスクはプライベートサブネットで実行
- **セキュリティグループ**: 最小権限の原則に基づく設定
- **NACLs**: サブネットレベルのファイアウォール（オプション）

#### 通信の暗号化

- **ALB → クライアント**: HTTPS (TLS 1.3)
- **ALB → ECSタスク**: HTTP (VPC内部通信)
- **ECSタスク → AWS APIs**: HTTPS

### 2. 認証・認可

#### IAM権限の最小化

- **タスク実行ロール**: ECR、CloudWatch Logs、Secrets Managerへの最小権限
- **タスクロール**: アプリケーション固有の権限のみ

#### Secrets Manager統合

```
環境変数ではなくSecrets Managerからシークレットを取得:
  - Google OAuth認証情報
  - NextAuth秘密鍵
  - データベース接続情報（将来）
```

### 3. コンテナセキュリティ

#### イメージスキャン

- **ECR Image Scanning**: プッシュ時の自動脆弱性スキャン
- **Trivy/Snyk**: CI/CDパイプラインでの追加スキャン（オプション）

#### 実行時セキュリティ

- **非rootユーザー**: `USER node`でコンテナ実行
- **読み取り専用ルートファイルシステム**: 可能な限り有効化
- **Capabilities制限**: 不要な権限の削除

### 4. ネットワークトラフィックフィルタリング

#### WAF（Web Application Firewall）統合

```
AWS WAF on ALB:
  - SQLインジェクション対策
  - XSS攻撃対策
  - レート制限
  - Geo-blocking（オプション）
```

### 5. 監査とコンプライアンス

- **CloudTrail**: API呼び出しの記録
- **VPC Flow Logs**: ネットワークトラフィックの記録
- **Config Rules**: リソース設定の監視

---

## スケーリング戦略

### 1. Auto Scaling設定

#### ターゲットトラッキングスケーリング

```yaml
Auto Scaling Policy:
  Type: TargetTrackingScaling
  
  CPU Utilization Target:
    Metric: ECSServiceAverageCPUUtilization
    Target Value: 70%
    Scale-in Cooldown: 300秒
    Scale-out Cooldown: 60秒
  
  Memory Utilization Target (オプション):
    Metric: ECSServiceAverageMemoryUtilization
    Target Value: 80%
    Scale-in Cooldown: 300秒
    Scale-out Cooldown: 60秒
  
  ALB Request Count Target (推奨):
    Metric: ALBRequestCountPerTarget
    Target Value: 1000リクエスト/分
    Scale-in Cooldown: 300秒
    Scale-out Cooldown: 60秒

Task Count Limits:
  Minimum: 2 (高可用性のため)
  Maximum: 10 (コスト上限設定)
  Desired: 2 (初期値)
```

#### ステップスケーリング（詳細制御が必要な場合）

```yaml
Step Scaling Policy:
  - CPU > 80% : +2 タスク追加
  - CPU > 90% : +3 タスク追加
  - CPU < 30% : -1 タスク削減
  - CPU < 20% : -2 タスク削減
```

### 2. スケーリングシナリオ

#### 通常時

```
Task Count: 2
CPU Utilization: 30-40%
Memory Utilization: 40-50%
Response Time: < 100ms
```

#### 高負荷時（ピークトラフィック）

```
Task Count: 自動的に6-8に増加
CPU Utilization: 60-70% (ターゲット維持)
Memory Utilization: 70-80%
Response Time: < 200ms
```

#### 深夜・低トラフィック時

```
Task Count: 2 (最小値を維持)
CPU Utilization: 10-20%
Memory Utilization: 30-40%
```

### 3. スケーリング最適化

- **ウォームアップ期間**: 新しいタスクが完全に起動するまでトラフィックを段階的に増加
- **クールダウン期間**: 急激なスケーリングを防ぐ
- **アラーム設定**: スケーリングイベントの監視と通知

---

## 監視とロギング

### 1. CloudWatch Logs

#### ログ構成

```yaml
Log Groups:
  - /ecs/nextjs-common/application
    - アプリケーションログ（stdout/stderr）
    - 保持期間: 30日
    
  - /ecs/nextjs-common/access
    - アクセスログ（オプション）
    - 保持期間: 7日

Log Insights Queries:
  - エラー率の監視
  - レスポンスタイム分析
  - リクエストパターン分析
```

### 2. CloudWatch Metrics

#### カスタムメトリクス

```yaml
ECS Metrics:
  - CPUUtilization
  - MemoryUtilization
  - RunningTaskCount
  
ALB Metrics:
  - RequestCount
  - TargetResponseTime
  - HTTPCode_Target_4XX_Count
  - HTTPCode_Target_5XX_Count
  - HealthyHostCount
  - UnHealthyHostCount

Custom Application Metrics:
  - API Response Time (by endpoint)
  - Authentication Success/Failure Rate
  - Database Query Time (if applicable)
```

### 3. CloudWatch Alarms

#### 重要アラーム設定

```yaml
High Priority Alarms:
  - HealthyHostCount < 1
    - 全タスクが不健全
    - 即座に通知
  
  - HTTPCode_Target_5XX_Count > 10 (5分間)
    - サーバーエラーの急増
    - 即座に通知
  
  - CPUUtilization > 90% (5分間)
    - リソース不足
    - 通知 + 自動スケーリング

Medium Priority Alarms:
  - TargetResponseTime > 2秒 (10分間)
    - パフォーマンス低下
    - 通知
  
  - MemoryUtilization > 85% (10分間)
    - メモリ不足の兆候
    - 通知

Low Priority Alarms:
  - RunningTaskCount変更
    - スケーリングイベント
    - 情報通知
```

### 4. X-Ray統合（オプション）

```yaml
AWS X-Ray:
  - リクエストトレーシング
  - パフォーマンスボトルネック特定
  - サービスマップ可視化
  - エラー分析

実装:
  - X-Ray SDKをNext.jsアプリに統合
  - ECSタスク定義でX-Rayサイドカーコンテナ追加
```

### 5. ダッシュボード

#### CloudWatch Dashboard

```
Main Dashboard:
  - ECSサービス概要
    - Running Task Count
    - CPU/Memory Utilization
  
  - ALB概要
    - Request Count
    - Response Time
    - Error Rate
  
  - アプリケーション指標
    - API Endpoint Performance
    - Authentication Metrics
    - User Activity
```

---

## コスト見積もり

### 月額コスト試算（東京リージョン）

#### 前提条件

- リージョン: ap-northeast-1 (東京)
- 稼働時間: 24時間365日
- タスク数: 平均3タスク（最小2、最大10）

#### コスト内訳

```
1. Fargate コンピューティング
   CPU: 1 vCPU × 3タスク × 730時間 = $47.88/月
   Memory: 2 GB × 3タスク × 730時間 = $15.80/月
   小計: $63.68/月

2. Application Load Balancer
   ALB時間: 730時間 = $21.90/月
   LCU使用料（推定）: 10 LCU = $24.04/月
   小計: $45.94/月

3. NAT Gateway
   2 NAT Gateway × 730時間 = $73.00/月
   データ転送（推定10GB）: $4.50/月
   小計: $77.50/月

4. CloudWatch Logs
   ログ取り込み（5GB/月推定）: $2.50/月
   ログ保存（30日保持）: $1.50/月
   小計: $4.00/月

5. ECR ストレージ
   イメージサイズ（2GB推定）: $0.20/月
   小計: $0.20/月

6. データ転送
   インターネットへの転送（50GB/月推定）: $4.50/月
   小計: $4.50/月

---
合計月額コスト: 約 $195.82/月 (約 ¥29,373/月)
※ 1ドル = 150円で計算
```

#### Lambda構成との比較

```
現在のLambda構成（推定）:
  - Lambda実行時間: $10-30/月
  - データ転送: $5/月
  - 合計: $15-35/月

ECS/Fargate構成:
  - 合計: $195.82/月

差額: +$160-180/月

ただし、以下のメリットがあります：
  - コールドスタートなし
  - 実行時間制限なし
  - 予測可能なパフォーマンス
  - WebSocket対応
  - より細かいリソース制御
```

### コスト最適化施策

1. **Fargate Spotの活用**
   - 最大70%のコスト削減
   - 非本番環境での使用推奨

2. **リザーブドキャパシティ（Savings Plans）**
   - 1年または3年契約で最大52%割引
   - 本番環境で安定したワークロードに適用

3. **Auto Scalingの最適化**
   - 最小タスク数を必要最低限に設定
   - 深夜の低トラフィック時にスケールイン

4. **NAT Gatewayの最適化**
   - VPC Endpointsの活用（ECR、Secrets Manager、CloudWatch）
   - NAT Gateway経由のトラフィック削減

5. **ログ保持期間の最適化**
   - 必要な期間のみログを保持
   - S3へのアーカイブ設定

---

## 移行計画

### フェーズ1: 準備（1-2週間）

#### Week 1: インフラストラクチャ設計

- [ ] VPC、サブネット設計の確定
- [ ] セキュリティグループ設計
- [ ] IAMロール・ポリシーの作成
- [ ] ALBターゲットグループ設定の確定

#### Week 2: IaC準備

- [ ] Terraformまたは CloudFormation テンプレート作成
- [ ] 開発環境でのインフラ構築テスト
- [ ] ドキュメント作成

### フェーズ2: 開発環境構築（1週間）

#### Week 3: Dev環境デプロイ

- [ ] VPC、サブネット作成
- [ ] セキュリティグループ作成
- [ ] ALB作成・設定
- [ ] ECSクラスター作成
- [ ] タスク定義作成
- [ ] ECSサービス作成
- [ ] GitHub Actions ワークフロー更新（develop ブランチ）
- [ ] 開発環境デプロイテスト

### フェーズ3: テスト・検証（2週間）

#### Week 4-5: 動作確認

- [ ] 機能テスト
  - [ ] 基本的なページ表示
  - [ ] 認証フロー（NextAuth）
  - [ ] API エンドポイント
  - [ ] WebSocket接続（該当する場合）

- [ ] パフォーマンステスト
  - [ ] 負荷テスト（Apache Bench / k6）
  - [ ] レスポンスタイム測定
  - [ ] Auto Scaling動作確認

- [ ] セキュリティテスト
  - [ ] ペネトレーションテスト
  - [ ] 脆弱性スキャン
  - [ ] HTTPS接続確認

- [ ] 監視・ロギング確認
  - [ ] CloudWatch Logs動作確認
  - [ ] メトリクス収集確認
  - [ ] アラーム動作確認

### フェーズ4: 本番環境構築（1週間）

#### Week 6: Production環境デプロイ

- [ ] 本番環境インフラ構築
- [ ] DNS設定（Route 53）
- [ ] SSL証明書設定（ACM）
- [ ] GitHub Actions ワークフロー更新（master ブランチ）
- [ ] 本番デプロイ

### フェーズ5: 移行・カットオーバー（1週間）

#### Week 7: カットオーバー

- [ ] Lambda関数とECSの並行稼働
- [ ] トラフィックの段階的移行（Route 53 Weighted Routing）
  - [ ] 10% トラフィックをECSに
  - [ ] 50% トラフィックをECSに
  - [ ] 100% トラフィックをECSに
- [ ] 監視強化期間
- [ ] Lambda関数の停止・削除

### フェーズ6: 最適化（継続的）

- [ ] パフォーマンスチューニング
- [ ] コスト最適化
- [ ] Auto Scaling設定の調整
- [ ] ドキュメント更新

---

## リスクと対策

### リスク1: コスト増加

**リスク内容**:
- Lambda構成と比較して月額コストが大幅に増加

**対策**:
- Fargate Spotの活用
- Auto Scalingの最適化
- リザーブドキャパシティの検討
- VPC Endpointsによるデータ転送コスト削減

**影響度**: 高  
**発生確率**: 高

---

### リスク2: 移行時のダウンタイム

**リスク内容**:
- カットオーバー時にサービスが停止

**対策**:
- ブルー/グリーンデプロイメント
- Route 53による段階的トラフィック移行
- ロールバック手順の事前準備
- 深夜・低トラフィック時の移行実施

**影響度**: 高  
**発生確率**: 低

---

### リスク3: パフォーマンス低下

**リスク内容**:
- 想定よりもレスポンスタイムが悪化

**対策**:
- 事前の負荷テスト実施
- タスクリソース（CPU/Memory）の適切な設定
- Auto Scalingの迅速な反応設定
- CloudWatch監視とアラート

**影響度**: 中  
**発生確率**: 低

---

### リスク4: セキュリティ設定ミス

**リスク内容**:
- セキュリティグループ設定ミスによる不正アクセス

**対策**:
- 最小権限の原則に基づく設定
- Security Hub / Config Rulesによる自動チェック
- IaCによる設定の標準化
- セキュリティレビューの実施

**影響度**: 高  
**発生確率**: 低

---

### リスク5: 運用負荷増加

**リスク内容**:
- サーバー管理の負荷増加

**対策**:
- Fargateによるサーバーレス管理
- 自動化（CI/CD、Auto Scaling）の徹底
- 充実した監視・アラート設定
- 運用ドキュメントの整備

**影響度**: 中  
**発生確率**: 中

---

### リスク6: スケーリング遅延

**リスク内容**:
- 急激なトラフィック増加時のスケーリングが間に合わない

**対策**:
- 最小タスク数を適切に設定（2以上推奨）
- Scale-out Cooldownを短く設定（60秒）
- スケジュールベースのスケーリング併用（予測可能なピーク時）
- CloudWatch Alarmsによる早期検知

**影響度**: 中  
**発生確率**: 低

---

## まとめ

### 移行の主なメリット

1. **パフォーマンスの向上**
   - コールドスタート排除
   - 予測可能なレスポンスタイム
   - WebSocketなどの長時間接続対応

2. **スケーラビリティ**
   - 柔軟な自動スケーリング
   - 高可用性（マルチAZ構成）
   - 負荷分散

3. **運用性**
   - コンテナオーケストレーション
   - ローリングアップデート
   - 簡単なロールバック

4. **拡張性**
   - マイクロサービスアーキテクチャへの移行が容易
   - 他のAWSサービスとの統合

### 移行の主なデメリット

1. **コスト増加**
   - 月額 約$160-180 の増加
   - ただし、Fargate Spotやリザーブドキャパシティで削減可能

2. **複雑性の増加**
   - より多くのコンポーネント管理
   - ネットワーク設計の必要性

3. **学習コスト**
   - ECS/Fargateの知識習得
   - IaCツールの習得

### 推奨事項

1. **段階的な移行**
   - 開発環境 → ステージング環境 → 本番環境の順に移行
   - トラフィックを段階的に切り替え

2. **IaCの採用**
   - Terraform または AWS CDK を使用
   - インフラの再現性確保

3. **監視の強化**
   - CloudWatch、X-Rayの活用
   - アラート設定の徹底

4. **コスト管理**
   - Cost ExplorerとBudgetsの活用
   - 定期的なコストレビュー

5. **ドキュメント整備**
   - 運用手順書の作成
   - トラブルシューティングガイド
   - アーキテクチャ図の維持

---

## 参考資料

### AWS公式ドキュメント

- [Amazon ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS Fargate Documentation](https://docs.aws.amazon.com/fargate/)
- [Application Load Balancer Documentation](https://docs.aws.amazon.com/elasticloadbalancing/)
- [Amazon ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [AWS Auto Scaling Documentation](https://docs.aws.amazon.com/autoscaling/)

### ベストプラクティス

- [ECS Best Practices Guide](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Fargate Security Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/security.html)

### サンプルコード・テンプレート

- [AWS ECS Terraform Examples](https://github.com/terraform-aws-modules/terraform-aws-ecs)
- [AWS CDK ECS Patterns](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html)

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 作成者 |
|------|-----------|---------|--------|
| 2025-10-29 | 1.0 | 初版作成 | GitHub Copilot |

