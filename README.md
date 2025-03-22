# 📁 Backend 디렉토리 구조 설명

NestJS 기반의 서버 구조이며, 기능 단위(`auth`, `users`, `database`)로 모듈화되어 있다.

---

## 📁 src

### 📁 auth

인증 및 회원가입 관련 기능을 처리합니다.

| 파일명               | 역할                                                |
| -------------------- | --------------------------------------------------- |
| `auth.controller.ts` | `/auth/signup`, `/auth/login` 등 요청 처리 컨트롤러 |
| `auth.service.ts`    | 인증 로직 처리 (비밀번호 해싱, 유저 생성 등)        |
| `auth.dto.ts`        | 회원가입 및 로그인에 사용되는 데이터 전송 객체 정의 |
| `auth.module.ts`     | `AuthService`, `AuthController`를 모듈로 구성       |

---

### 📁 users

유저 정보 관리 기능 (DB 연결 포함)

| 파일명             | 역할                                    |
| ------------------ | --------------------------------------- |
| `user.schema.ts`   | MongoDB 사용자 스키마 정의 (`Mongoose`) |
| `users.service.ts` | 유저 조회, 생성 등의 DB 로직 처리       |
| `users.module.ts`  | `UserService`, `UserSchema`를 모듈화    |

---

### 📁 database

| 파일명               | 역할                                        |
| -------------------- | ------------------------------------------- |
| `database.module.ts` | Mongoose 및 환경변수 기반 DB 연결 설정 모듈 |

---

### 📄 app.module.ts

루트 모듈로, `auth`, `users`, `database` 모듈을 통합 등록하는 역할

### 📄 app.controller.ts

기본 라우팅이나 테스트용 엔드포인트 정의 (ex. `/`)

### 📄 app.service.ts

기본 서비스 (현재는 필요 시 로직 확장 가능)

### 📄 main.ts

Nest 애플리케이션의 진입점. 서버 실행 및 CORS 설정 포함

---

## ✅ 참고

- MongoDB 연결은 `.env`의 `MONGO_URI`와 `CORS_ORIGIN`, `PORT`로 설정
- 모든 요청/응답은 `DTO`를 통해 유효성 검사 및 타입 안정성을 확보
- 비밀번호 암호화는 `bcrypt`로 처리

---
