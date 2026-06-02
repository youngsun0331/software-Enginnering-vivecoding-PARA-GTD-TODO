# 백엔드 API 인증 에러 (400 Bad Request) 리포트

본 문서는 프론트엔드와 백엔드 통합 E2E 테스트 중 발견된 **카테고리(Category) 및 PARA 뷰 API의 인증 관련 버그**를 문서화한 리포트입니다. 백엔드 코드 업데이트 시 참고해 주시기 바랍니다.

## 🚨 1. 버그 개요

- **발생 환경**: `localhost:3000` (React) -> `localhost:8080` (Spring Boot)
- **현상**: 프론트엔드에서 회원가입 및 로그인을 완료하고 세션을 발급받았음에도 불구하고, **Category 관리 및 PARA 뷰 조회 API를 호출하면 `400 Bad Request` 에러가 발생**하여 기능을 사용할 수 없습니다. (반면, Inbox 기능은 정상 작동합니다.)

## 🔍 2. 발생 지점 및 에러 로그

테스트 중 에러가 확인된 주요 엔드포인트는 다음과 같습니다.

| Method | Endpoint | HTTP Status |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | `400 Bad Request` |
| `POST`| `/api/v1/categories` | `400 Bad Request` |
| `GET` | `/api/v1/para/projects` | `400 Bad Request` (예상됨) |
| `PATCH`| `/api/v1/para/tasks/{taskId}/categories` | `400 Bad Request` (예상됨) |

**예상되는 Spring Boot 에러 로그 (백엔드 콘솔):**
```text
org.springframework.web.bind.MissingRequestHeaderException: Required request header 'X-User-Id' for method parameter type String is not present
```

## 🛠️ 3. 원인 분석 (Root Cause)

최근 인증 방식이 **하드코딩된 `X-User-Id` 헤더 방식**에서 **세션(Session/Cookie) 기반 인증**으로 변경되었습니다. (`frontend_api_guide.md` 참고)

이에 따라 프론트엔드는 더 이상 API 요청 시 `X-User-Id` 헤더를 보내지 않고, 브라우저가 자동으로 `JSESSIONID` 쿠키를 담아 보냅니다. `InboxController`의 경우 이 변경사항이 반영되어 정상 작동하고 있으나, **`CategoryController` 및 `ParaController`에는 여전히 과거의 `@RequestHeader("X-User-Id")` 어노테이션이 남아 있어 발생하는 문제**입니다.

프론트엔드가 헤더를 보내지 않으니 Spring Boot가 필수 헤더 누락(Missing Header)으로 간주하고 `400 Bad Request` 예외를 던지는 것입니다.

---

## ✅ 4. 백엔드 수정 가이드 (Action Item)

백엔드의 `CategoryController`와 `ParaController` 소스 코드를 열고, **파라미터로 유저 정보를 받는 방식을 InboxController와 동일한 방식(세션 기반)으로 통일**해 주셔야 합니다.

### 수정 전 (Legacy 방식 - 에러 유발)
```java
@GetMapping("/api/v1/categories")
public ResponseEntity<List<CategoryResponse>> getCategories(
    @RequestHeader("X-User-Id") String userId // ❌ 이 부분이 에러를 유발함
) {
    // ...
}
```

### 수정 후 (권장 방식 - 세션 기반)
만약 Spring Session이나 `@SessionAttribute`를 사용 중이시라면 아래와 같이 변경합니다. (또는 현재 백엔드 아키텍처에 맞게 InboxController와 똑같은 로직으로 수정해주세요.)

```java
@GetMapping("/api/v1/categories")
public ResponseEntity<List<CategoryResponse>> getCategories(
    @SessionAttribute(name = "USER_ID", required = false) String userId 
    // 또는 HttpServletRequest request 를 받아 세션에서 직접 꺼내는 방식 등
) {
    if (userId == null) {
        throw new UnauthorizedException("로그인이 필요합니다."); // 401 처리
    }
    // ...
}
```

> **참고:** 수정이 완료된 후 백엔드를 재시작하시면 프론트엔드의 E2E 테스트가 카테고리 기능까지 정상적으로 통과할 것입니다!
