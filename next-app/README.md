# Groupie
## 📌 프로젝트 개요
Groupie는 스터디 모집 플랫폼으로, 다양한 스터디를 손쉽게 등록하고 참여할 수 있는 서비스입니다. </br>
Next.js와 TypeScript 기초부터 Vercel 배포, 코드 구조화, 성능 개선까지 직접 경험해보기 위해 진행한 사이드 프로젝트입니다.

---
## 🛠 기술 스택

**Frontend**  
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logoColor=white)

**Backend**  
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**인증 / 스토리지**  
![Lucia](https://img.shields.io/badge/Lucia-000000?style=for-the-badge&logoColor=white)
[![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/s3/)

**배포**  
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)


---
## 주요 기능
- 스터디 모집글 등록/수정/삭제
- 스터디 글 검색 및 필터링
- 무한 스크롤 + 가상화 기반 카드 리스트
- 로그인 / 회원가입 / 스크랩 / 댓글 기능
- 인기 스터디 슬라이더
- 마이페이지 : 내가 작성한 글, 스크랩한 스터디, 프로필 사진 업로드

---
## 화면 구성
### 🏠 홈 화면 - 인기 스터디와 필터, 검색창으로 스터디 탐색 가능
<div class="flex gap-6">
  <img width="250" alt="홈페이지" src="https://github.com/user-attachments/assets/8f3e1cb9-62ba-4eb7-8b31-d9b67b8f5ccb" />
  <img width="250" alt="홈 리스트" src="https://github.com/user-attachments/assets/c9b1dbdd-3430-4d64-807d-43f20b7be4cf" />
</div>

---

### 📄 스터디 상세 페이지 - 상세 정보 확인 및 지원/댓글 작성
<div class="flex gap-6">
  <img width="250" alt="상세 페이지" src="https://github.com/user-attachments/assets/b9f16631-6d60-4b37-9d92-ee4d2a68940f" />
  <img width="250" alt="댓글 작성" src="https://github.com/user-attachments/assets/5a508e17-87a9-43c0-93db-adfdff2832a3" />
  <img width="250" alt="댓글 작성 후" src="https://github.com/user-attachments/assets/7f9cef96-da5b-40d2-911c-94845817011f" />
</div>

---

### ✏️ 스터디 작성 폼 (마크다운 지원)
<div class="flex gap-6">
  <img width="250" alt="스터디 기본정보 작성" src="https://github.com/user-attachments/assets/a8380f12-a37b-4d22-ac84-3dc838ffd318" />
  <img width="250" alt="스터디 본문 작성" src="https://github.com/user-attachments/assets/abdc81af-994c-4776-ac33-62554e5f1e4a" />
</div>

---

### 🙋 마이페이지 – 내가 쓴 글 / 스크랩 달력
<div class="flex gap-6">
   <img width="250" alt="마이페이지 내가 쓴 글" src="https://github.com/user-attachments/assets/5fd4e6fa-d6c4-4251-b764-f6ac07565d3f" />
  <img width="250" alt="마이페이지 달력" src="https://github.com/user-attachments/assets/63588869-ccec-4036-a61e-f957bd036197" />
  <img width="250" alt="달력 상세보기" src="https://github.com/user-attachments/assets/9872e35c-ef61-4e42-a219-5edf1be186f7" />
</div>

---
## 성능 최적화 과정
### 결과
| 개선 항목             | 변경 전  | 변경 후  |  개선율   |
| ------------------ | ------ | ------ |  ----- |
| Main-thread work   | 6.7초 | 2.6초 | 61% 개선 |
| LCP (Largest Contentful Paint)| 2,560ms | 690ms | 73% 개선 |
| 카드 렌더링 속도| 4.1ms | 1.7ms | 50% 개선 |
| Lighthouse Performance| 71점 | 88점 | 17점 향상 |


### 주요 최적화 작업
#### 1. 초기 로딩 성능개선
문제 : 초기 렌더링 속도 저하(TBT 6.7초)
- 원인 분석 : 한 번에 과도한 데이터 요청, 불필요한 DB 필드 조회
- 해결책
  - 지연 로딩으로 컴포넌트 분리 (로그인 모달, 인기글 슬라이더)
  - Skeleton UI 도입으로 CLS 개선
  - DB 쿼리 최적화
    - `select` 옵션으로 필요한 필드만 조회 (전체 필드 → 필수 필드만)
    - 댓글 데이터: `comments.length` → `_count.comments`로 변경
    - 복합 인덱스 추가: `scrap`, `views`, `createdAt` 조합으로 정렬 성능 향상

#### 2. 이미지 최적화
문제 : 대용량 이미지로 인한 LCP 저하
- 해결책 : PNG → WebP 변환, fill → width/height 지정
- 결과
  - 이미지 용량 1.5MB → 28KB (95% 감소)
  - LCP: 2,560ms → 690ms (73% 개선)

#### 3. 가상화 도입 (react-window)
문제 : 카드 렌더링 시 성능 저하
- 해결책 :  react-window를 이용한 가상화 적용
- 결과
  - 카드당 렌더링 속도 50% 개선
  - TBT: 820ms → 220ms (75% 감소)

- 추가 최적화
  - 사용자 경험 개선 : Optimisic UI + fetch API로 빠른 응답 
  - SEO : metaData 설정 후 82점 -> 100점
  - Performance : 색상 대비 및 label 추가후 88점 -> 100점
---
### 🐛 트러블슈팅
#### 1. Server Actions vs API Routes 선택 문제
- 문제 </br>
  댓글 등록 및 수정/삭제를 `server actions`로 처리했더니 반응 속도가 느리고 전체 페이지가 리렌더링
- 원인 </br>
  Server Actions는 폼 제출과 전체 페이지 서버 렌더링에 적합하지만, 실시간 피드백이 중요한 인터렉션(UI 반영이 빠른 기능)에는 부적합
- 해결 </br>
  - `app/api/comments/route.ts`에 API Route를 새로 만들고,
  - 클라이언트 컴포넌트에서 `fetch()`로 직접 호출 </br>
  → 즉시 응답 처리 + 댓글 영역만 부분 렌더링 

#### 2. Hydration 불일치 해결
- 문제  </br>
  코드상 오류는 없었지만 서버 활성화 시 "Text content did not match" 경고 발생
- 원인 </br>
  Next.js는 SSR 후 CSR 하이드레이션을 진행하는데, SSR 시점과 CSR 시점의 시간이 달라 `Date` 관련 렌더링 결과 불일치 발생
- 해결 </br>
  - 시간 처리 로직을 `useEffect` 내부에서 실행해서 CSR 시점에서만 렌더링되도록 수정
  - `date-fns` 를 사용해 `ko` 포맷 기분으로 SSR/CSR 시간 일치

#### 3. Next.js 업데이트로 인한 params 타입 에러
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

---
## 개발 프로세스
#### ✅ 1차 기능 구현 및 배포 완료 (2025.05.24 ~ 2025.05.30)
- MVP 기능 전체 구현 후 Vercel 1차 배포

#### 🔁 1차 리팩토링 (2025.05.30 ~ 2025.06.06)
- UX 개선: Optimistic UI로 스크랩 버튼 응답성 향상
- 성능 개선: Server Actions → API Routes 전환으로 댓글 기능 최적화
- 로딩 경험: Skeleton UI 도입

#### 🔁 2차 리팩토링 (2025.06.09 ~ 2025.06.10)
- 상태 관리: Zustand 적용으로 필터링 응답 시간 개선 (730ms → 630ms)
- 렌더링 최적화: 가상화 도입으로 카드 렌더링 속도 50% 개선 (4.1ms -> 1.7ms)
- 이미지 최적화: WebP 포맷 + 적절한 사이징으로 LCP 73% 개선

### 🚀 성능 개선 
- Lighthouse 점수: Performance 71→88점, SEO 82→100점
- 핵심 지표: TBT 61% 감소, LCP 73% 개선

---
## 프로젝트 회고
Next.js 풀스택 개발 첫 경험으로, 하나의 앱에서 프론트엔드와 백엔드를 모두 다뤄볼 수 있었습니다. <br/>
처음 시도한 성능 측정이었지만, Lighthouse와 Profiler로 병목 지점을 파악하고 실제 지표 개선을 경험하며 데이터 기반 최적화의 중요성을 체감했습니다. <br/>

- 기술 선택의 장점 :
  - Next.js App Router의 SSR/CSR 분리 구조로 개발 효율성 증대
  - Prisma ORM의 직관적 문법과 통합 개발 환경의 생산성
  - Vercel 배포로 쉽고 빠른 배포 가능 
- UX의 핵심 : 로딩 속도와 Optimistic UI가 사용자 경험 향상에 중요

이번 프로젝트를 통해 성능 최적화 기초를 다지고, 기능 구현 이후의 최적화가 실제 서비스에서 얼마나 중요한지 체감할 수 있었습니다.
