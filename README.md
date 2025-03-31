# ✅ 프로젝트 구조 설명 (`src` 기준)

```
📦src
 ┣ 📂auth
 ┃ ┣ 📂jwt
 ┃ ┃ ┣ jwt.guard.ts
 ┃ ┃ ┗ jwt.strategy.ts
 ┃ ┣ auth.controller.ts
 ┃ ┣ auth.dto.ts
 ┃ ┣ auth.module.ts
 ┃ ┗ auth.service.ts
 ┣ 📂chart-config
 ┃ ┣ chart-config.controller.ts
 ┃ ┣ chart-config.dto.ts
 ┃ ┣ chart-config.module.ts
 ┃ ┣ chart-config.schema.ts
 ┃ ┗ chart-config.service.ts
 ┣ 📂database
 ┃ ┗ database.module.ts
 ┣ 📂esg-report
 ┃ ┣ esg-report.controller.ts
 ┃ ┣ esg-report.dto.ts
 ┃ ┣ esg-report.module.ts
 ┃ ┣ esg-report.schemas.ts
 ┃ ┗ esg-report.service.ts
 ┣ 📂indicator
 ┃ ┣ indicator.controller.ts
 ┃ ┣ indicator.module.ts
 ┃ ┣ indicator.schema.ts
 ┃ ┗ indicator.service.ts
 ┣ 📂users
 ┃ ┣ user.schema.ts
 ┃ ┣ users.controller.ts
 ┃ ┣ users.module.ts
 ┃ ┗ users.service.ts
 ┣ app.controller.ts
 ┣ app.module.ts
 ┣ app.service.ts
 ┗ main.ts
```

---

## 📁 auth

**JWT 기반 인증 전반을 담당**

- `auth.controller.ts`: 로그인, 회원가입 API 처리
- `auth.service.ts`: 비밀번호 확인, 토큰 발급 등 핵심 로직
- `auth.dto.ts`: 로그인/회원가입 요청 스펙
- `jwt.guard.ts`: 인증된 요청만 통과시키는 Guard
- `jwt.strategy.ts`: JWT 토큰 검증 및 사용자 파싱

---

## 📁 chart-config

**차트 구성 정보 저장/불러오기 담당 모듈**

- `chart-config.controller.ts`: `/chart` GET, POST
- `chart-config.service.ts`: DB 로직 (Mongoose)
- `chart-config.schema.ts`: `Chart` 모델 정의
- `chart-config.dto.ts`: 차트 생성 시 필요한 DTO 정의

📝 현재 클라이언트에서 대시보드에 보이는 차트 정보는 이 모듈을 통해 저장/불러오고 있음

---

## 📁 database

공통적으로 사용되는 **MongoDB 연결 세팅**만 따로 분리된 모듈

- `database.module.ts`: MongooseModule 초기화 및 DB 연결 관리

---

## 📁 esg-report

> **현재는 사용하지 않지만, 추후 CSV 업로드 기반 리포트를 위한 준비 모듈**

- 구조와 역할은 차트와 유사
- `esg-report.schemas.ts`: 리포트에 포함될 row 단위 데이터 구조 정의
- `esg-report.controller.ts`, `esg-report.service.ts`: CRUD 로직 정의
- ❗️향후 ESG 관련 CSV 파일 → DB 저장 시 확장 포인트

---

## 📁 indicator

**ESG 지표 관리** 모듈입니다.

- `indicator.schema.ts`: `Indicator` 모델 (label, 단위, 분류 등)
- `indicator.service.ts`: label 기준 저장/조회
- `indicator.controller.ts`: 클라이언트에서 지표 요청 시 사용

📌 ESG 입력 시 **지표가 존재하지 않으면 생성**하는 로직에서 사용

---

## 📁 users

**사용자 정보 관리 전담**

- `user.schema.ts`: 사용자 정보 (email, role 등) 정의
- `users.controller.ts`: `/users/me` 같은 유저 관련 API
- `users.service.ts`: DB 상 사용자 조회/생성 로직

---

## 📄 app.module.ts

- 각 기능 모듈(`auth`, `users`, `chart-config`, `database`, ...)을 등록하는 루트 모듈
- NestJS에서 실제로 동작하게 하는 핵심 부분

---

## 📄 main.ts

- Nest 애플리케이션의 엔트리포인트
- CORS 설정 및 앱 실행 코드

---
