# Calander Project

## 프로젝트 개요
Calander 프로젝트는 할 일 관리 기능을 제공하는 API 기반 애플리케이션입니다. 

사용자는 시각적으로 달력으로 남은 일정들을 관리할수 있으며, 입력을 통해 일정 등록, 수정, 삭제 및 조회가 가능합니다.

시작일과 종료일을 선택할 경우 달성률을 통계로 확인할 수 있습니다.

### 개발 기능
- 게시글 CRUD
- 추가 기능: 일정 통계 확인 기능
- 공통 ApiResponse로 응답 통일화
- GlobalException으로 에러코드 통일
- Swagger을 활용한 API 명세

## 1. 소스 빌드 및 실행 방법
### 1.1 Backend (Spring Boot)
#### 1) 프로젝트 클론
```sh
$ git clone https://github.com/Nano2998/Calender.git
$ cd Calender/calender
```

#### 2) 환경 설정
`application.properties` 파일을 생성하고 아래 정보를 입력합니다.
```application.properties
spring.application.name=calander
spring.jpa.properties.hibernate.dialect= org.hibernate.dialect.MySQLDialect
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/calender
spring.datasource.username=사용자 이름
spring.datasource.password=사용자 비밀번호
spring.jpa.hibernate.ddl-auto=create
```

#### 3) MySQL 데이터베이스 및 테이블 생성
아래 SQL 스크립트를 실행하여 기본 데이터베이스와 테이블을 생성합니다.
```sql   
CREATE DATABASE calender;
USE calender;

CREATE TABLE todo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    date VARCHAR(20) NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL
);
```

#### 4) 예시 스키마 삽입
아래 SQL 스크립트를 실행하여 예시 데이터를 삽입합니다.
```sql
INSERT INTO todo (content, date, completed) VALUES
    ('아침 운동하기', '2025-02-16', false),
    ('회의 준비하기', '2025-02-17', true),
    ('책 읽기', '2025-02-18', false),
    ('친구 만나기', '2025-02-19', false),
    ('프로젝트 코드 정리', '2025-02-20', true),
    ('은행 업무 보기', '2025-02-21', false);
```

### 1.2 Frontend (React)
#### 1) 프로젝트 클론 및 실행
```sh
$ cd Calender/calender-fe
$ npm install
$ npm start
```

## 2. 사용 라이브러리 및 컴포넌트 이유
### Backend
Spring Boot 3 - 백엔드 애플리케이션 개발을 위한 프레임워크

Spring Data JPA - ORM 프레임워크로 MySQL과의 데이터 매핑을 간소화

Swagger - API 문서를 자동으로 생성하는 도구

JUnit5 & Mockito - 단위 테스트 및 통합 테스트를 위한 라이브러리

### Frontend
#### Claendar 
- 날짜별 할 일(To-Do) 개수를 표시하여 일정 관리 가능
- 날짜 선택 시 해당 날짜의 할 일을 불러오는 기능 제공

#### TodoInput
- 사용자가 새로운 할 일을 입력하고 추가할 수 있도록 함

#### TodoList
- 특정 날짜에 등록된 할 일 목록을 렌더링
- 각 할 일 항목에 대해 수정, 삭제, 완료 상태 변경 기능 제공

#### StatsContainer
- 사용자가 완료한 할 일 개수 및 전체 개수를 통계 및 시각적으로 보여줌

#### Todo API
- 할 일 데이터를 fetch하여 서버 또는 로컬 상태에 반영

---

## 3. API 명세
Swagger를 사용하여 API 명세를 제공합니다.
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`


## 4. 추가 기능
- **할일 통계 기능**
  - 사용자는 시작일과 종료일을 선택하여, 남은 할일의 퍼센테이지를 알 수 있음
  - API: `POST /todo/calendar/stats`

