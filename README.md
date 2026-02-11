# WEB電卓

GitHub Pages で公開している WEB 電卓アプリ。

**公開URL:** https://hide10.github.io/web-calculator/

---

## Claude への指示と作業記録

このリポジトリは Claude Code (CLI) を使って、指示一発でリポジトリ作成からページ公開まで行った記録。

### 前提条件

- GitHub CLI (`gh`) がインストール済みで `gh auth login` 済み
- `git` がインストール済み

### Claude に出した指示

> あたらしいリポジトリを作ることは出来る？github.io で公開、動作する WEB 電卓を作りたい。gh はインストール済み

これだけ。以下は Claude が自動で実行した内容。

---

## 再現手順（手動で同じことをやる場合）

### 1. プロジェクトディレクトリを作成

```bash
mkdir ~/web-calculator
cd ~/web-calculator
```

### 2. ファイルを作成

以下の 3 ファイルを作成する。

- `index.html` — HTML 本体
- `style.css` — スタイル（ダークテーマ、レスポンシブ対応）
- `script.js` — 電卓のロジック（四則演算、キーボード対応）

内容はこのリポジトリのファイルを参照。

### 3. Git リポジトリを初期化してコミット

```bash
git init
git branch -m main
git config user.name "あなたのGitHubユーザー名"
git config user.email "あなたのメール or ユーザー名@users.noreply.github.com"
git add -A
git commit -m "Initial commit: web calculator"
```

### 4. GitHub にリポジトリを作成してプッシュ

```bash
gh repo create web-calculator --public --source=. --push --description "WEB電卓 - GitHub Pages"
```

このコマンドで以下が一括で行われる：

- GitHub 上に `web-calculator` リポジトリを作成（public）
- ローカルリポジトリに `origin` リモートを設定
- `main` ブランチをプッシュ

### 5. GitHub Pages を有効にする

```bash
gh api repos/あなたのユーザー名/web-calculator/pages \
  -X POST \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

もし `build_type` が `workflow` になった場合は、以下で `legacy`（ブランチ直接デプロイ）に変更：

```bash
gh api repos/あなたのユーザー名/web-calculator/pages \
  -X PUT \
  -f "build_type=legacy" \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

### 6. 確認

```bash
gh api repos/あなたのユーザー名/web-calculator/pages
```

レスポンスの `html_url` に公開 URL が表示される。デプロイ完了まで 1〜2 分かかる場合がある。

---

## 電卓の機能

| 機能 | 説明 |
|------|------|
| 四則演算 | +, -, ×, ÷ |
| AC | 全クリア |
| ⌫ | 1文字削除 |
| % | パーセント計算 |
| . | 小数点入力 |
| キーボード | 0-9, +, -, *, /, Enter, Escape, Backspace に対応 |
| レスポンシブ | スマホでも使える |
| エラー処理 | ゼロ除算時に「Error」表示 |

## ファイル構成

```
web-calculator/
├── index.html   # HTML本体
├── style.css    # スタイルシート
├── script.js    # 電卓ロジック
└── README.md    # このファイル
```
