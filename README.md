# 📁 Backend 디렉토리 구조 설명 (NestJS + Mongoose 기반)

• nest generate module [모듈명]
• nest g co users → 컨트롤러 생성
• nest g s users → 서비스 생성

**기능 단위(Module 단위)로 나눠진 NestJS 구조**

- 인증, 사용자 관리, DB 연결 기능이 명확히 분리
- MongoDB + JWT 인증 기반 API 서버 설계

---

## 📁 `src` (핵심 애플리케이션 폴더)

---

### 📁 `auth` - 인증 기능

인증(JWT), 로그인, 회원가입 로직을 담당

| 파일명                        | 설명                                                             |
| ----------------------------- | ---------------------------------------------------------------- |
| `auth.controller.ts`          | `/auth/signup`, `/auth/login` 등 요청을 처리하는 라우팅 컨트롤러 |
| `auth.service.ts`             | 인증 로직 처리 (비밀번호 검증, 토큰 발급 등)                     |
| `auth.dto.ts`                 | 로그인, 회원가입 요청의 DTO 정의 (`LoginDto`, `SignupDto`)       |
| `auth.module.ts`              | 인증 관련 구성 요소를 Nest 모듈로 등록                           |
| 📁 `strategy/jwt.strategy.ts` | JWT 토큰 검증 및 payload 처리 전략 (`PassportStrategy` 기반)     |

---

### 📁 `users` - 사용자 관리 기능

유저 데이터베이스 모델과 유저 관련 CRUD 로직을 포함

| 파일명                | 설명                                                      |
| --------------------- | --------------------------------------------------------- |
| `user.schema.ts`      | Mongoose 기반 사용자 스키마 정의 (`User`, `UserDocument`) |
| `users.controller.ts` | `/users/me` 등의 사용자 정보 요청 처리 컨트롤러           |
| `users.service.ts`    | 유저 생성, 조회 등 DB 관련 비즈니스 로직                  |
| `users.module.ts`     | 유저 관련 구성 요소를 Nest 모듈로 등록                    |

---

### 📁 `database` - DB 연결 설정

| 파일명               | 설명                                         |
| -------------------- | -------------------------------------------- |
| `database.module.ts` | Mongoose 연결 설정 (MongoDB URI, DB 이름 등) |

---

### 📄 `app.module.ts`

Nest 애플리케이션의 루트 모듈  
→ `auth`, `users`, `database` 모듈을 통합 등록

---

### 📄 `app.controller.ts`

기본 라우트 (`/`) 또는 테스트용 라우트 정의

---

### 📄 `app.service.ts`

기본 서비스 로직. (현재는 단순하지만 확장 가능)

---

### 📄 `main.ts`

Nest 서버의 진입점

- 애플리케이션 부트스트랩
- CORS 허용 설정 포함
- `.env` 기반 환경 변수 로딩

---

## ✅ 루트 설정 파일들

| 파일명              | 설명                                                     |
| ------------------- | -------------------------------------------------------- |
| `.env`              | 환경 변수 정의 (`MONGO_URI`, `JWT_SECRET`, `PORT` 등)    |
| `package.json`      | NestJS 프로젝트의 의존성, 스크립트 관리                  |
| `nest-cli.json`     | Nest CLI 설정 (entry file, compilerOptions 등)           |
| `eslint.config.mjs` | ESLint 설정                                              |
| `tsconfig*.json`    | TypeScript 컴파일러 옵션 설정                            |
| `.gitignore`        | Git 추적 제외 항목 설정 (`node_modules`, `.env` 등 포함) |

---

## 🔐 인증 흐름 요약

1. 클라이언트에서 `/auth/login` 요청
2. `auth.service.ts`에서 사용자 정보 확인 후 JWT 토큰 발급
3. 보호된 라우트에서 `jwt.strategy.ts`가 토큰을 검증
4. 검증된 유저는 `req.user`로 요청에 전달됨

---
