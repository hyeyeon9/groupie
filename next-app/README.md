# Groupie
## 📌 프로젝트 개요
Groupie는 스터디 모집 플랫폼으로, 다양한 스터디를 손쉽게 등록하고 참여할 수 있는 서비스입니다. </br>
Next.js와 TypeScript 기초부터 Vercel 배포, 코드 구조화, 성능 개선까지 직접 경험해보기 위해 진행한 사이드 프로젝트입니다.

---
## 기술 스택
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS
- Backend: Prisma (ORM)
- 인증/스토리지: Lucia, AWS S3
- 상태관리: Zustand
- 기타: Vercel 배포

---
## 개발 목표
- Next.js App Router 구조에 대한 이해 및 적용
- TypeScript 기반의 안전한 코드 작성
- 성능 병목을 측정하고 개선 과정을 문서화
- Prisma, Supabase, S3 등 외부 연동 도구 사용 능력 향상 

---
## 주요 기능
- 스터디 모집글 등록/수정/삭제
- 스터디 글 검색 및 필터링
- 무한 스크롤 기반 목록 로딩
- 로그인 / 회원가입 / 스크랩 / 댓글 기능
- 인기 스터디 슬라이더
- 마이페이지 : 내가 작성한 글, 스크랩한 스터디, 프로필 사진 업로드

---
## 트러블슈팅 
### 1. `server actions` VS `route.ts` API 혼용 문제
- 문제 </br>
  댓글 등록 및 수정을 `server actions`로 처리했더니 반응 속도가 느리고 전체 페이지가 리렌더링됨
- 원인 </br>
  Server Actions는 폼 제출과 전체 페이지 서버 렌더링에 적합하지만, 실시간 피드백이 중요한 인터렉션(UI 반영이 빠른 기능)에는 부적합
- 해결 </br>
  - `app/api/comments/route.ts`에 API Route를 새로 만들고,
  - 클라이언트 컴포넌트에서 `fetch()`로 직접 호출 </br>
  → 즉시 응답 처리 + 댓글 리스트만 부분 렌더링 가능

### 2. Hydration 불일치 문제
- 문제  </br>
  코드상 오류는 없었지만 서버 활성화 시 "Text content did not match" 경고 발생
- 원인 </br>
  Next.js는 SSR 후 CSR 하이드레이션을 진행하는데, SSR 시점과 CSR 시점의 시간이 달라 `Date` 관련 렌더링 결과 불일치 발생
- 해결 </br>
  - 시간 처리 로직을 `useEffect` 내부에서 실행해서 CSR 시점에서만 렌더링되도록 수정
  - `date-fns` 를 사용해 `ko` 포맷 기분으로 SSR/CSR 시간 일치

### 3. Next.js 버전 업데이트로 인한 params 타입 에러
- 문제 </br>
  `params` 타입 에러
  ```pgsql
  Type "{ params: { id: string; }; }" is not a valid type for the function's second argument
  ```
- 원인 </br>
  Next.js 15부터 `App Router`의 `params`와 `searchParams`가 비동기(Promise) 처리되면서 `Promise<{ id: string }>` 타입으로 변경됨
- 해결 </br>
  ```ts
  // 변경전
  { params }: { params: { id: string } }
  // 변경후
  { params }: { params: Promise<{ id: string }> }
  ```
  이후 `params`를 `await`로 받아서 사용


### 4. 성능 최적화
- 문제 </br>
  초기 렌더링이 무거워서 진입 속도가 느림 </br>
  - LightHouse에서 "Minimize main-thread work"항목에서 TBT 6.7초 😓
- 원인 </br>
  LCP가 너무 큼
  - 한 번에 너무 많은 데이터 요청
  - DB 쿼리에서 필요 없는 필드까지 모두 select하고 있었음
- 해결 </br>
  - 지연 로딩을 통해 로그인 모달, 인기글 슬라이더 등 초기 렌더에 필요 없는 컴포넌트를 클라이언트 사이드 렌더링으로 분리
  - Skeleton UI 도입으로 CLS(레이아웃 시프트) 개선
  - select 옵션 사용 및 인덱스 추가로 DB 쿼리 최적화
- 성능 변화 요약
  | 항목                 | 변경 전   | 변경 후   | 감소량    | 개선율   |
  | ------------------ | ------ | ------ | ------ | ----- |
  | `/study` 페이지       | 2436ms | 2198ms | -238ms | 약 10% |
  | `/api/studies` API | 1366ms | 1040ms | -326ms | 약 24% |


---
## 리팩토링 진행 로그
### ✅ 1차 기능 구현 및 배포 완료
- 기간 : 2025.05.24 ~ 2025.05.30

### 🔁 1차 리팩토링 (2024.05.30 ~ 2024.06.06)
- 스크랩 버튼의 느린 응답 문제를 Optimisitc로 해결해 사용자 경험 개선
- 댓글 등록/삭제 `server actions` → `fetch`방식으로 전환하여 응답 속도 개선 및 부분 렌더링 적용
- Skeleton UI 도입, 컴포넌트 분리로 초기 로딩 및 UX 향상

### 🚀 성능 개선 (지속 진행 중)
- Lighthouse 측정 기준 개선 중
  - TBT, LCP, CLS 개선
- 주요 개선 내용
  - Main-thread blocking 시간: 6.7초 → 2.6초로 감소 🎉
  - SEO : metaData 설정 후 82점 -> 100점
  - Performance : 색상 대비 및 label 추가후 88점 -> 100점
    
