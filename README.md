# whattodo (나 뭐하지?)

아이를 키운 후 다시 시작하는 30~40대 엄마들을 위한 수익화 탐색 테스트 웹사이트 MVP입니다.

## 기능

- 24문항 수익화 탐색 테스트 (5점 척도)
- 5가지 결과 유형 산출
- 결과 공유 (이미지 저장, 링크 복사, 네이티브 공유)
- 이메일 및 추가 정보 수집
- Supabase 응답 데이터 저장

## 기술 스택

- Next.js 16 (App Router, Static Export)
- React 19 + TypeScript
- Tailwind CSS 4
- Supabase
- GitHub Pages

## 로컬 개발

```bash
npm install
cp .env.example .env.local
# .env.local에 Supabase 키 입력
npm run dev
```

http://localhost:3000

## Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Project Settings → API에서 URL과 publishable key 복사
4. `.env.local` 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

## GitHub Pages 배포

### 1. GitHub 저장소 생성 및 push

```bash
git add .
git commit -m "Initial commit"
gh repo create whattodo --public --source=. --push
```

또는 GitHub에서 저장소를 만든 뒤:

```bash
git remote add origin https://github.com/myoriginallife/whattodo.git
git push -u origin main
```

### 2. GitHub Secrets 등록

저장소 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | 값 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key |

### 3. GitHub Pages 활성화

저장소 → **Settings** → **Pages**

- **Source**: GitHub Actions

`main` 브랜치에 push하면 자동 배포됩니다.

배포 URL: `https://myoriginallife.github.io/whattodo/`

> 저장소 이름이 `whattodo`가 아니면 `next.config.ts`의 basePath가 자동으로 맞춰집니다.

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
| `/test` | 24문항 테스트 |
| `/result` | 결과 및 정보 수집 |

## 결과 유형

| 유형 | 이름 |
|------|------|
| A | 전문성 성장형 |
| B | 콘텐츠 창작형 |
| C | 창업 도전형 |
| D | 안정 커리어형 |
| E | 프로젝트 자유형 |

## 라이선스

Private - All rights reserved
