# 📘 GTD-PARA-Todo 백엔드 API 명세서

> **Base URL**: `http://localhost:8080`
> **인증**: 모든 API 요청에 `X-User-Id` 헤더로 사용자 ID를 전달합니다.
> **Swagger UI**: `http://localhost:8080/swagger-ui.html`

---

## 📌 공통 사항

### 요청 헤더
| 헤더 | 필수 | 설명 |
|------|------|------|
| `X-User-Id` | ✅ | 사용자 UUID (GET/POST 등 대부분의 요청에 필요) |
| `Content-Type` | ✅ | `application/json` (POST/PATCH 요청 시) |

### 에러 응답 형식
에러 발생 시 Spring Boot 기본 에러 응답이 리턴됩니다.
```json
{
  "timestamp": "2026-06-01T00:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "User not found",
  "path": "/api/v1/inbox"
}
```

### Enum 값 정리

**TaskStatus** (할 일 상태)
| 값 | 설명 |
|----|------|
| `INBOX` | 인박스 (미분류) |
| `SOMEDAY` | 언젠가/어쩌면 |
| `TODO` | 진행 전 |
| `SCHEDULE` | 예정됨 |
| `DONE` | 완료 |

**ParaType** (PARA 카테고리 대분류)
| 값 | 설명 |
|----|------|
| `PROJECT` | 프로젝트 |
| `AREA` | 영역 (책임 영역) |
| `RESOURCE` | 자원 (관심사/참고자료) |
| `ARCHIVE` | 보관 (완료/비활성) |

**ProjectStatus** (프로젝트 상태)
| 값 | 설명 |
|----|------|
| `ACTIVE` | 활성 |
| `ARCHIVED` | 보관됨 |

---

## 1️⃣ Inbox API — 할 일 수집

### `POST /api/v1/inbox` — 인박스 태스크 생성

새로운 할 일을 인박스에 추가합니다.

**Request**
```
POST /api/v1/inbox
X-User-Id: {userId}
Content-Type: application/json
```
```json
{
  "title": "스쿼트 50개 하기"
}
```

**Response** `200 OK`
```json
{
  "id": "a1b2c3d4-...",
  "title": "스쿼트 50개 하기",
  "description": null,
  "status": "INBOX",
  "dueDate": null,
  "categories": []
}
```

---

### `GET /api/v1/inbox` — 인박스 태스크 목록 조회

사용자의 인박스(status=INBOX) 태스크 전체 목록을 조회합니다.

**Request**
```
GET /api/v1/inbox
X-User-Id: {userId}
```

**Response** `200 OK`
```json
[
  {
    "id": "a1b2c3d4-...",
    "title": "스쿼트 50개 하기",
    "description": null,
    "status": "INBOX",
    "dueDate": null,
    "categories": []
  },
  {
    "id": "e5f6g7h8-...",
    "title": "영어 단어 50개 외우기",
    "description": null,
    "status": "INBOX",
    "dueDate": null,
    "categories": []
  }
]
```

---

### `PATCH /api/v1/inbox/tasks/{taskId}/complete` — 태스크 완료 토글

태스크의 완료(DONE) / 미완료 상태를 전환합니다.
- DONE이 아닌 상태 → DONE으로 변경
- DONE → INBOX로 복귀

**Request**
```
PATCH /api/v1/inbox/tasks/a1b2c3d4-.../complete
```

**Response** `200 OK`
```json
{
  "id": "a1b2c3d4-...",
  "title": "스쿼트 50개 하기",
  "description": null,
  "status": "DONE",
  "dueDate": null,
  "categories": []
}
```

---

## 2️⃣ Category API — 카테고리 관리

### `POST /api/v1/categories` — 카테고리 생성

사용자 정의 카테고리를 생성합니다. (예: "운동" → RESOURCE)

**Request**
```
POST /api/v1/categories
X-User-Id: {userId}
Content-Type: application/json
```
```json
{
  "name": "운동",
  "paraType": "RESOURCE"
}
```

**Response** `200 OK`
```json
{
  "id": "cat-001-...",
  "name": "운동",
  "paraType": "RESOURCE"
}
```

---

### `GET /api/v1/categories` — 전체 카테고리 목록 조회

사용자의 모든 카테고리를 조회합니다.

**Request**
```
GET /api/v1/categories
X-User-Id: {userId}
```

**Response** `200 OK`
```json
[
  { "id": "cat-001-...", "name": "운동", "paraType": "RESOURCE" },
  { "id": "cat-002-...", "name": "공부", "paraType": "AREA" },
  { "id": "cat-003-...", "name": "졸업 프로젝트", "paraType": "PROJECT" }
]
```

---

### `GET /api/v1/categories/type/{paraType}` — PARA 타입별 카테고리 조회

특정 PARA 타입의 카테고리만 필터링하여 조회합니다.

**Request**
```
GET /api/v1/categories/type/RESOURCE
X-User-Id: {userId}
```

**Response** `200 OK`
```json
[
  { "id": "cat-001-...", "name": "운동", "paraType": "RESOURCE" }
]
```

---

### `DELETE /api/v1/categories/{categoryId}` — 카테고리 삭제

카테고리를 삭제합니다. 연결된 Task/Note/Project의 조인 관계도 함께 해제됩니다.

**Request**
```
DELETE /api/v1/categories/cat-001-...
```

**Response** `204 No Content` (본문 없음)

---

## 3️⃣ PARA API — 카테고리 할당 및 PARA 뷰 조회

### `PATCH /api/v1/para/tasks/{taskId}/categories` — 태스크에 카테고리 할당

태스크에 여러 카테고리를 할당합니다. 기존 할당을 완전히 대체(PUT 시맨틱)합니다.

**Request**
```
PATCH /api/v1/para/tasks/a1b2c3d4-.../categories
Content-Type: application/json
```
```json
{
  "categoryIds": ["cat-001-...", "cat-002-..."]
}
```

**Response** `200 OK`
```json
{
  "id": "a1b2c3d4-...",
  "title": "스쿼트 50개 하기",
  "description": null,
  "status": "INBOX",
  "dueDate": null,
  "categories": [
    { "id": "cat-001-...", "name": "운동", "paraType": "RESOURCE" },
    { "id": "cat-002-...", "name": "공부", "paraType": "AREA" }
  ]
}
```

---

### `PATCH /api/v1/para/notes/{noteId}/categories` — 노트에 카테고리 할당

노트에 여러 카테고리를 할당합니다.

**Request**
```
PATCH /api/v1/para/notes/n1n2n3-.../categories
Content-Type: application/json
```
```json
{
  "categoryIds": ["cat-001-..."]
}
```

**Response** `200 OK`
```json
{
  "id": "n1n2n3-...",
  "title": "운동 루틴 정리",
  "content": "매일 스쿼트 50개...",
  "categories": [
    { "id": "cat-001-...", "name": "운동", "paraType": "RESOURCE" }
  ],
  "tasks": []
}
```

---

### `PATCH /api/v1/para/projects/{projectId}/categories` — 프로젝트에 카테고리 할당

프로젝트에 여러 카테고리를 할당합니다.

**Request**
```
PATCH /api/v1/para/projects/p1p2p3-.../categories
Content-Type: application/json
```
```json
{
  "categoryIds": ["cat-003-..."]
}
```

**Response** `200 OK`
```json
{
  "id": "p1p2p3-...",
  "title": "졸업 프로젝트",
  "description": "소프트웨어공학 프로젝트",
  "status": "ACTIVE",
  "categories": [
    { "id": "cat-003-...", "name": "졸업 프로젝트", "paraType": "PROJECT" }
  ],
  "tasks": []
}
```

---

### `GET /api/v1/para/projects` — Projects 뷰 조회

PROJECT 타입 카테고리 → 하위 항목(tasks, notes, projects) 계층형 조회

**Request**
```
GET /api/v1/para/projects
X-User-Id: {userId}
```

**Response** `200 OK`
```json
[
  {
    "id": "cat-003-...",
    "name": "졸업 프로젝트",
    "paraType": "PROJECT",
    "tasks": [
      {
        "id": "t1-...",
        "title": "ERD 설계하기",
        "status": "TODO",
        "dueDate": "2026-06-05T00:00:00",
        "categories": [
          { "id": "cat-003-...", "name": "졸업 프로젝트", "paraType": "PROJECT" }
        ]
      }
    ],
    "notes": [],
    "projects": [
      {
        "id": "p1-...",
        "title": "졸업 프로젝트",
        "description": "소프트웨어공학",
        "status": "ACTIVE",
        "categories": [
          { "id": "cat-003-...", "name": "졸업 프로젝트", "paraType": "PROJECT" }
        ],
        "tasks": []
      }
    ]
  }
]
```

---

### `GET /api/v1/para/areas` — Areas 뷰 조회

AREA 타입 카테고리 → 하위 항목 계층형 조회

**Request**
```
GET /api/v1/para/areas
X-User-Id: {userId}
```

**Response** `200 OK` — 구조는 Projects 뷰와 동일

---

### `GET /api/v1/para/resources` — Resources 뷰 조회

RESOURCE 타입 카테고리 → 하위 항목 계층형 조회

**Request**
```
GET /api/v1/para/resources
X-User-Id: {userId}
```

**Response** `200 OK` — 구조는 Projects 뷰와 동일

---

### `GET /api/v1/para/archives` — Archives 뷰 조회

ARCHIVE 타입 카테고리 → 하위 항목 계층형 조회
(프로젝트는 `ARCHIVED` 상태인 것만 포함)

**Request**
```
GET /api/v1/para/archives
X-User-Id: {userId}
```

**Response** `200 OK` — 구조는 Projects 뷰와 동일

---

## 📐 응답 DTO 구조 참고

### TaskResponse
```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string | null",
  "status": "INBOX | SOMEDAY | TODO | SCHEDULE | DONE",
  "dueDate": "string (ISO 8601) | null",
  "categories": [ CategorySimpleResponse ]
}
```

### NoteResponse
```json
{
  "id": "string (UUID)",
  "title": "string",
  "content": "string | null",
  "categories": [ CategorySimpleResponse ],
  "tasks": [ TaskResponse ]
}
```

### ProjectResponse
```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string | null",
  "status": "ACTIVE | ARCHIVED",
  "categories": [ CategorySimpleResponse ],
  "tasks": [ TaskResponse ]
}
```

### CategorySimpleResponse
```json
{
  "id": "string (UUID)",
  "name": "string",
  "paraType": "PROJECT | AREA | RESOURCE | ARCHIVE"
}
```

### CategoryResponse (PARA 뷰 조회용)
```json
{
  "id": "string (UUID)",
  "name": "string",
  "paraType": "PROJECT | AREA | RESOURCE | ARCHIVE",
  "tasks": [ TaskResponse ],
  "notes": [ NoteResponse ],
  "projects": [ ProjectResponse ]
}
```

---

## 🔄 주요 사용 시나리오

### 시나리오 1: 할 일 등록 → 카테고리 분류
```
1. POST /api/v1/categories        → "운동" 카테고리 생성 (RESOURCE)
2. POST /api/v1/inbox             → "스쿼트 50개" 태스크 생성
3. PATCH /api/v1/para/tasks/{id}/categories → 태스크에 "운동" 카테고리 할당
4. GET /api/v1/para/resources     → Resources 뷰에서 "운동" 카테고리 하위로 조회
```

### 시나리오 2: 할 일 완료 처리
```
1. GET /api/v1/inbox              → 인박스 목록 조회
2. PATCH /api/v1/inbox/tasks/{id}/complete → 완료 토글 (DONE ↔ INBOX)
```

### 시나리오 3: 카테고리 관리
```
1. GET /api/v1/categories         → 전체 카테고리 목록
2. GET /api/v1/categories/type/AREA → AREA 타입만 필터
3. DELETE /api/v1/categories/{id} → 카테고리 삭제
```
