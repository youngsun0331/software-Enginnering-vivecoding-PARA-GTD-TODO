# 프론트엔드 API 연동 가이드 (Sprint 1)

이 문서는 백엔드 시스템(PARA-GTD-TODO)과 연동해야 하는 프론트엔드 개발자를 위한 API 명세서 및 가이드입니다. 

---

## 1. 인증 (Authentication) 아키텍처 가이드

본 프로젝트는 **세션(Session) 기반 인증**을 사용합니다.
- 사용자가 로그인을 하면 서버는 세션을 생성하고 `JSESSIONID` 라는 이름의 쿠키를 응답 헤더(`Set-Cookie`)에 담아 내려줍니다.
- 이후 브라우저는 자동으로 이 쿠키를 요청마다 포함시켜 전송하며, 서버는 이를 통해 사용자를 식별합니다.

> [!IMPORTANT]
> **CORS 및 쿠키 설정 주의사항**
> 프론트엔드에서 백엔드 API를 호출할 때 쿠키(세션)를 주고받으려면 HTTP 클라이언트(예: Axios, Fetch) 설정에서 **인증 정보 포함(Credentials) 옵션**을 반드시 켜야 합니다.
> - **Axios 예시:** `axios.defaults.withCredentials = true;`
> - **Fetch 예시:** `fetch(url, { credentials: 'include' })`

---

## 2. API 명세

모든 API의 기본 Base URL은 `/api/v1` 입니다. (예: `http://localhost:8080/api/v1/auth/login`)
상세한 Schema 구조 및 테스트는 백엔드 서버 실행 후 `http://localhost:8080/swagger-ui/index.html` 에서 확인하실 수 있습니다.

### 2.1. 인증 API (`/api/v1/auth`)

모든 서비스 이용 전 반드시 회원가입 및 로그인을 수행하여 세션을 발급받아야 합니다.

| Method | Endpoint | 설명 | Request Body | Response Body | Auth Required |
|--------|----------|------|--------------|---------------|---------------|
| `POST` | `/auth/signup` | 회원가입 | `email`, `password`, `name` | `AuthResponse` | No |
| `POST` | `/auth/login` | 로그인 (세션 발급) | `email`, `password` | `AuthResponse` | No |
| `POST` | `/auth/logout` | 로그아웃 (세션 파기) | - | - | Yes |
| `GET`  | `/auth/me` | 현재 내 정보 조회 | - | `AuthResponse` | Yes |

### 2.2. 인박스 API (`/api/v1/inbox`)

작업(Task)을 가장 먼저 등록하고 확인하는 Inbox 영역의 API입니다. (모두 로그인 필요)

| Method | Endpoint | 설명 | Request Body | Response |
|--------|----------|------|--------------|----------|
| `POST` | `/inbox` | 새로운 인박스 태스크 생성 | `title` (문자열) | `TaskResponse` |
| `GET`  | `/inbox` | 인박스 태스크 목록 전체 조회 | - | `TaskResponse[]` |
| `PATCH`| `/inbox/tasks/{taskId}/complete` | 태스크 완료(DONE) / 미완료 상태 토글 | - | `TaskResponse` |

### 2.3. PARA 뷰 및 카테고리 이동 API (`/api/v1/para`)

할 일이나 노트를 PARA (Project, Area, Resource, Archive) 구조로 분류하고 조회하는 API입니다. (모두 로그인 필요)

#### 뷰 조회 (View)
지정된 카테고리의 하위 항목(Task 포함)들을 계층형으로 묶어서 보여줍니다.

| Method | Endpoint | 설명 | Response |
|--------|----------|------|----------|
| `GET`  | `/para/projects` | Project 카테고리 계층형 데이터 조회 | `CategoryResponse[]` |
| `GET`  | `/para/areas` | Area 카테고리 계층형 데이터 조회 | `CategoryResponse[]` |
| `GET`  | `/para/resources` | Resource 카테고리 계층형 데이터 조회 | `CategoryResponse[]` |
| `GET`  | `/para/archives` | Archive 카테고리 계층형 데이터 조회 | `CategoryResponse[]` |

#### 카테고리 할당 (Assign)
특정 항목을 다른 카테고리로 맵핑(이동)합니다.

| Method | Endpoint | 설명 | Request Body | Response |
|--------|----------|------|--------------|----------|
| `PATCH`| `/para/tasks/{taskId}/categories` | 태스크에 카테고리 할당 | `categoryIds` (문자열 배열) | `TaskResponse` |
| `PATCH`| `/para/notes/{noteId}/categories` | 노트에 카테고리 할당 | `categoryIds` (문자열 배열) | `NoteResponse` |
| `PATCH`| `/para/projects/{projectId}/categories` | 프로젝트에 카테고리 할당 | `categoryIds` (문자열 배열) | `ProjectResponse` |

---

## 3. 주요 데이터 포맷 (Data Models)

### `AuthResponse` (인증 응답)
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "홍길동"
}
```

### `TaskResponse` (태스크 단일 응답)
```json
{
  "id": "task-uuid-string",
  "title": "장보기",
  "description": "우유, 계란 사기",
  "status": "TODO", // INBOX, SOMEDAY, TODO, SCHEDULE, DONE 중 하나
  "dueDate": "2026-06-03T12:00:00"
}
```

### `CategoryResponse` (PARA 계층형 응답)
이 객체는 `Project` 또는 `Note(Area/Resource)`의 정보를 담고 있으며, 내부에 하위 태스크 목록(`tasks`)을 포함합니다.
```json
{
  "id": "category-uuid-string",
  "title": "프로젝트 이름 또는 영역 이름",
  "description": "설명 텍스트",
  "status": "ACTIVE", 
  "tasks": [
    {
      "id": "task-uuid-1",
      "title": "관련 태스크 1",
      "status": "TODO"
    }
  ]
}
```

---

## 🚀 프론트엔드 개발 프로세스 추천

1. **Swagger UI 활용**: 백엔드 서버를 `http://localhost:8080` 포트로 띄운 뒤, `http://localhost:8080/swagger-ui/index.html`에 접속하면 이 문서의 API들을 화면 UI 버튼 클릭만으로 직접 테스트해 볼 수 있습니다.
2. **연동 순서**: 
   - 먼저 회원가입(`/auth/signup`) 및 로그인(`/auth/login`) API를 연동하여 쿠키가 정상적으로 브라우저에 저장되는지 확인합니다.
   - 이후 인박스 항목 추가 및 목록 조회를 통해 세션 유지가 되는지 확인합니다.
   - 마지막으로 PARA 분류 및 뷰 조회를 렌더링합니다.
