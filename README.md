# 🎯 StayOn - 할 일 관리 앱

> 늘 곁에 있는, 모바일용 할 일 관리 애플리케이션

![Version](https://img.shields.io/badge/Version-1.0-brightgreen)
![Python](https://img.shields.io/badge/Python-3.12.8-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-1.55.0-red)

---

## 📱 소개

**StayOn**은 사용자의 할 일을 효과적으로 관리할 수 있도록 설계된 모바일 친화적 웹 애플리케이션입니다.

- ➕ 쉽게 할 일 추가
- 📝 상세한 정보 입력 (제목, 설명, 마감, 우선순위)
- ✅ 완료 표시
- 🔄 수정 & 삭제
- 📊 통계 보기
- 💾 CSV 내보내기

---

## 🎨 특징

### 🎯 핵심 기능
- **할 일 관리**: CRUD 완료 (Create, Read, Update, Delete)
- **우선순위**: 높음/중간/낮음 3단계
- **마감 기한**: 정확한 날짜/시간/분 설정
- **정렬 & 필터**: 마감순, 우선순위순
- **통계**: 진행률, 우선순위 분포, 마감 임박 경고

### 🎨 UI/UX
- **색상**: Sage Green (#557C55) 기반
- **모바일 최적화**: 반응형 디자인, 터치 친화적
- **풀스크린**: 상단 고정 네비게이션
- **직관적**: 진행중/완료 분리 표시
- **설정**: 데이터 내보내기, 전체 삭제

---

## 🚀 빠른 시작

### 1️⃣ 설치

```bash
# 가상환경 생성 및 활성화
python -m venv venv
.\venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt
```

### 2️⃣ 실행

```bash
streamlit run app.py
```

### 3️⃣ 브라우저 접속

```
http://localhost:8502
```

---

## 📋 사용 방법

### 🏠 홈 화면
- 전체/진행중/완료 통계 확인
- 3개 메뉴 선택 (목록, 추가, 통계)
- 설정 버튼 클릭

### 📋 목록 화면
- 모든 할 일 확인
- 마감순/우선순위순 정렬
- ✅ 완료 체크
- ✏️ 수정
- 🗑️ 삭제

### ➕ 추가 화면
1. 제목 입력
2. 설명 입력 (선택)
3. 날짜 선택
4. 시간/분 입력
5. 우선순위 선택
6. 추가 버튼 클릭

### ⚙️ 설정 화면
- 📥 CSV 내보내기
- 🗑️ 모든 할 일 삭제
- ℹ️ 앱 정보 확인

---

## 🏗️ 프로젝트 구조

```
c:\vibe_0318\
├── app.py                 # 메인 Streamlit 앱
├── requirements.txt       # 패키지 의존성
├── README.md             # 이 파일
├── SPEC.md               # 기능 명세서 (자세함)
├── UNIMPLEMENT.md        # 미구현 기능 목록
├── .gitignore            # Git 제외 파일
└── docs/
    ├── PROGRESS.md       # 프로젝트 진행 상황
    └── SESSION_NOTES.md  # 세션별 작업 기록 ⭐
```

---

## 📚 문서

- **[PROGRESS.md](docs/PROGRESS.md)** - 프로젝트 전체 진행 상황 및 기능 목록
- **[SESSION_NOTES.md](docs/SESSION_NOTES.md)** - 세션별 작업 기록 및 결정사항
- **[SPEC.md](SPEC.md)** - 자세한 기능 명세서
- **[UNIMPLEMENT.md](UNIMPLEMENT.md)** - 향후 구현 예정 기능

> **💡 Tip**: 다음 세션에서 작업을 이어가려면 `docs/SESSION_NOTES.md`를 읽어주세요!

---

## 🛠️ 기술 스택

| 항목 | 버전 |
|------|------|
| Python | 3.12.8 |
| Streamlit | 1.55.0 |
| Pandas | 2.2.0 |
| Plotly | 5.18.0 |

---

## 🎯 색상 팔레트

- **Primary**: `#557C55` (Sage Green)
- **Background**: `#F0F4F2` (Off-White Green)
- **Text**: `#2C3333` (Dark Charcoal)
- **Accent**: `#A7727D` (Muted Rose)

---

## 📈 향후 계획

### Phase 8: 데이터 지속성
- [ ] SQLite 데이터베이스
- [ ] 자동 저장/복원
- [ ] 클라우드 동기화

### Phase 9: 고급 기능
- [ ] 카테고리/태그
- [ ] 반복 과제
- [ ] 다크 모드
- [ ] 푸시 알림

---

## 💡 알려진 이슈

현재 알려진 이슈가 없습니다. 문제가 발견되면 GitHub Issues에 등록해주세요.

---

## 📧 연락

- Email: ryudh98@gmail.com
- GitHub: [@ryudh981116](https://github.com/ryudh981116)
- Repository: [StayOn](https://github.com/ryudh981116/StayOn)

---

## 📄 라이선스

이 프로젝트는 개인 학습용 프로젝트입니다.

---

**Last Updated**: March 18, 2026  
**Made with ❤️ using Streamlit**
