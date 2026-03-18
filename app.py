"""
🎯 StayOn - 늘 곁에 있는 할 일 관리 앱

사용자가 할 일을 잊지 않도록 접근성을 극대화하고,
시각적으로 편안함을 주는 할 일 관리 애플리케이션입니다.

필요한 패키지: streamlit, pandas, plotly
"""

import streamlit as st
from datetime import datetime, timedelta
from datetime import date as date_type
import pandas as pd

# ============================================================================
# 📱 페이지 설정 (브라우저 탭 설정)
# ============================================================================
st.set_page_config(
    page_title="StayOn - 할 일 관리",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ============================================================================
# 🎨 CSS 커스텀 스타일 (디자인 가이드 색상 적용)
# ============================================================================
st.markdown("""
<style>
    /* 배경색: Off-White Green */
    body {
        background-color: #F0F4F2;
    }
    
    /* 메인 컨텐츠 배경 */
    .main {
        background-color: #F0F4F2;
    }
    
    /* 사이드바 배경 */
    [data-testid="stSidebar"] {
        background-color: #F0F4F2;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# 🗂️ 색상 팔레트 정의 (색상 코드)
# ============================================================================
COLORS = {
    "background": "#F0F4F2",      # Off-White Green (배경)
    "primary": "#557C55",         # Sage Green (포인트)
    "text": "#2C3333",            # Dark Charcoal (텍스트)
    "accent": "#A7727D"           # Muted Rose (경고/마감)
}

# ============================================================================
# 💾 세션 상태 초기화 (앱이 실행될 때마다 사라지지 않는 데이터 저장)
# ============================================================================
# 세션 상태란? 
# Streamlit은 사용자가 상호작용할 때마다 전체 스크립트를 다시 실행합니다.
# 데이터를 잃지 않기 위해 st.session_state에 저장합니다.

if "todos" not in st.session_state:
    # 예제 데이터 (앱을 처음 열 때만 실행)
    st.session_state.todos = [
        {
            "id": 1,
            "title": "프로젝트 계획서 작성",
            "description": "StayOn 기능 명세서 완성",
            "deadline": datetime(2026, 3, 25, 18, 0),
            "priority": "High",
            "completed": False
        },
        {
            "id": 2,
            "title": "UI 디자인 검토",
            "description": "색상 팔레트 및 레이아웃 검토",
            "deadline": datetime(2026, 3, 20, 14, 0),
            "priority": "Medium",
            "completed": False
        }
    ]

if "next_id" not in st.session_state:
    st.session_state.next_id = 3

# ============================================================================
# 🛠️ 유틸리티 함수 (도움이 되는 기능들)
# ============================================================================

def get_time_until_deadline(deadline):
    """마감까지 남은 시간 계산"""
    now = datetime.now()
    delta = deadline - now
    
    if delta.total_seconds() < 0:
        return "⏰ 마감 완료"
    elif delta.days > 0:
        return f"📅 {delta.days}일 {delta.seconds // 3600}시간 남음"
    elif delta.seconds >= 3600:
        hours = delta.seconds // 3600
        return f"⏱️ {hours}시간 남음"
    else:
        minutes = delta.seconds // 60
        return f"🔴 {minutes}분 남음"

def get_priority_color(priority):
    """우선순위별 색상 반환"""
    colors = {
        "High": "🔴",
        "Medium": "🟡",
        "Low": "🟢"
    }
    return colors.get(priority, "⚪")

def add_todo(title, description, deadline, priority):
    """새 할 일 추가 (유효성 검증 포함)"""
    # 입력값 검증
    if not title.strip():
        st.error("❌ 제목을 입력해주세요!")
        return False
    
    if len(title) > 100:
        st.error("❌ 제목은 100자 이내로 입력해주세요!")
        return False
    
    if deadline <= datetime.now():
        st.error("❌ 마감 기한은 현재 시간보다 나중으로 설정해주세요!")
        return False
    
    # 새 할 일 객체 생성
    new_todo = {
        "id": st.session_state.next_id,
        "title": title,
        "description": description,
        "deadline": deadline,
        "priority": priority,
        "completed": False
    }
    
    # 목록에 추가
    st.session_state.todos.append(new_todo)
    st.session_state.next_id += 1
    
    st.success("✅ 할 일이 추가되었습니다!")
    return True

def delete_todo(todo_id):
    """할 일 삭제"""
    st.session_state.todos = [
        todo for todo in st.session_state.todos 
        if todo["id"] != todo_id
    ]
    st.success("🗑️ 할 일이 삭제되었습니다!")

def toggle_todo(todo_id):
    """할 일 완료 상태 토글"""
    for todo in st.session_state.todos:
        if todo["id"] == todo_id:
            todo["completed"] = not todo["completed"]
            break

# ============================================================================
# 📊 메인 UI 시작
# ============================================================================

# 헤더
st.markdown("""
    <h1 style='text-align: center; font-size: 48px; margin-bottom: 10px;'>
        🎯 StayOn
    </h1>
    <p style='text-align: center; font-size: 16px; color: #557C55;'>
        늘 곁에 있는 할 일 관리 앱
    </p>
""", unsafe_allow_html=True)

st.markdown("---")

# ============================================================================
# 🎛️ 사이드바: 필터 및 추가 옵션
# ============================================================================

with st.sidebar:
    st.markdown("### ⚙️ 설정 및 필터")
    
    # 필터 옵션
    filter_option = st.radio(
        "보기 옵션",
        ["📋 모든 항목", "⏳ 진행 중", "✅ 완료됨"]
    )
    
    # 정렬 옵션
    sort_option = st.selectbox(
        "정렬 순서",
        ["⏱️ 마감 기한 순", "🔴 우선순위 순"]
    )
    
    st.markdown("---")
    
    # 통계
    st.markdown("### 📊 통계")
    total = len(st.session_state.todos)
    completed = len([t for t in st.session_state.todos if t["completed"]])
    pending = total - completed
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("전체", total)
    with col2:
        st.metric("진행 중", pending)
    with col3:
        st.metric("완료", completed)

# ============================================================================
# 📄 탭 구성 (여러 화면을 탭으로 전환)
# ============================================================================

tab1, tab2, tab3 = st.tabs(["📋 할 일 목록", "➕ 할 일 추가", "📊 통계"])

# ============================================================================
# 📋 탭 1: 할 일 목록 표시
# ============================================================================

with tab1:
    st.markdown("### 📋 당신의 할 일 목록")
    
    # 필터 적용
    if filter_option == "📋 모든 항목":
        filtered_todos = st.session_state.todos
    elif filter_option == "⏳ 진행 중":
        filtered_todos = [t for t in st.session_state.todos if not t["completed"]]
    else:  # ✅ 완료됨
        filtered_todos = [t for t in st.session_state.todos if t["completed"]]
    
    # 정렬 적용
    if sort_option == "⏱️ 마감 기한 순":
        filtered_todos = sorted(filtered_todos, key=lambda x: x["deadline"])
    else:  # 🔴 우선순위 순
        priority_order = {"High": 0, "Medium": 1, "Low": 2}
        filtered_todos = sorted(
            filtered_todos, 
            key=lambda x: priority_order.get(x["priority"], 3)
        )
    
    # 할 일이 없는 경우
    if len(filtered_todos) == 0:
        st.info("✨ 현재 할 일이 없습니다! 새로운 목표를 추가해보세요.")
    else:
        # 각 할 일을 카드 형태로 표시
        for todo in filtered_todos:
            # 마감 시간 계산
            time_until = get_time_until_deadline(todo["deadline"])
            days_until = (todo["deadline"] - datetime.now()).days
            
            # 미만 조건: 하루 이내면 배경색 변경
            if days_until < 1 and not todo["completed"]:
                col_style = """
                    background-color: #FFE5E5;
                    padding: 15px;
                    border-radius: 10px;
                    border-left: 4px solid #A7727D;
                """
            else:
                col_style = """
                    background-color: #FFFFFF;
                    padding: 15px;
                    border-radius: 10px;
                    border-left: 4px solid #557C55;
                """
            
            # 할 일 카드
            st.markdown(f"""
                <div style='{col_style}'>
                    <h4>{get_priority_color(todo['priority'])} {todo['title']}</h4>
                    <p>{todo['description']}</p>
                    <small>📅 마감: {todo['deadline'].strftime('%Y년 %m월 %d일 %H:%M')}</small><br>
                    <small>{time_until}</small>
                </div>
            """, unsafe_allow_html=True)
            
            # 액션 버튼 (완료, 삭제)
            col1, col2, col3 = st.columns([2, 1, 1])
            
            with col1:
                # 완료 상태 토글
                if st.checkbox(
                    f"✅ 완료",
                    value=todo["completed"],
                    key=f"complete_{todo['id']}"
                ):
                    toggle_todo(todo["id"])
                    st.rerun()
            
            with col2:
                if st.button("🗑️ 삭제", key=f"delete_{todo['id']}"):
                    delete_todo(todo["id"])
                    st.rerun()
            
            with col3:
                priority_badge = get_priority_color(todo['priority'])
                st.write(f"우선순위: {priority_badge} {todo['priority']}")
            
            st.markdown("---")

# ============================================================================
# ➕ 탭 2: 새 할 일 추가 폼
# ============================================================================

with tab2:
    st.markdown("### ➕ 새로운 할 일 추가")
    
    with st.form("add_todo_form"):
        # 제목 입력
        title = st.text_input(
            "📝 제목",
            placeholder="예: 프로젝트 완료하기",
            max_chars=100
        )
        
        # 설명 입력
        description = st.text_area(
            "📄 설명 (선택사항)",
            placeholder="자세한 설명을 입력하세요...",
            height=100
        )
        
        st.markdown("---")
        
        # 마감 기한 입력 (날짜 + 시간)
        col1, col2 = st.columns(2)
        
        with col1:
            deadline_date = st.date_input(
                "📅 마감 날짜",
                value=date_type.today() + timedelta(days=1)
            )
        
        with col2:
            deadline_time = st.time_input(
                "⏰ 마감 시간",
                value=datetime.now().time()
            )
        
        # 날짜와 시간을 datetime 객체로 변환
        deadline = datetime.combine(deadline_date, deadline_time)
        
        # 우선순위 선택
        priority = st.select_slider(
            "🔴 우선순위",
            options=["Low", "Medium", "High"],
            value="Medium"
        )
        
        # 제출 버튼
        submitted = st.form_submit_button("✅ 할 일 추가", use_container_width=True)
        
        if submitted:
            if add_todo(title, description, deadline, priority):
                st.rerun()

# ============================================================================
# 📊 탭 3: 통계 및 분석
# ============================================================================

with tab3:
    st.markdown("### 📊 할 일 통계")
    
    # 기본 통계
    total = len(st.session_state.todos)
    completed = len([t for t in st.session_state.todos if t["completed"]])
    pending = total - completed
    
    if total == 0:
        st.info("📭 아직 할 일이 없습니다.")
    else:
        completion_rate = (completed / total) * 100
        
        # 메트릭 표시
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("전체 할 일", total)
        
        with col2:
            st.metric("완료된 항목", completed)
        
        with col3:
            st.metric("진행 중", pending)
        
        with col4:
            st.metric("완료율", f"{completion_rate:.0f}%")
        
        # 진행률 바
        st.progress(completion_rate / 100)
        
        st.markdown("---")
        
        # 우선순위별 분포
        st.markdown("### 우선순위 분포")
        priority_counts = {}
        for todo in st.session_state.todos:
            priority = todo["priority"]
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
        
        if priority_counts:
            priority_df = pd.DataFrame({
                "우선순위": list(priority_counts.keys()),
                "개수": list(priority_counts.values())
            })
            st.bar_chart(priority_df.set_index("우선순위"))
        
        st.markdown("---")
        
        # 마감 기한 경고
        st.markdown("### ⚠️ 마감 임박")
        urgent_todos = [
            t for t in st.session_state.todos
            if not t["completed"] and (t["deadline"] - datetime.now()).days < 1
        ]
        
        if urgent_todos:
            for todo in urgent_todos:
                st.warning(f"🚨 [{todo['title']}] - {get_time_until_deadline(todo['deadline'])}")
        else:
            st.success("✅ 긴급한 마감이 없습니다!")

# ============================================================================
# 📌 페이지 하단 정보
# ============================================================================

st.markdown("---")
st.markdown("""
    <div style='text-align: center; color: #557C55; font-size: 12px;'>
        <p>🎯 StayOn - 늘 곁에 있는 할 일 관리 앱</p>
        <p>Made with ❤️ using Streamlit</p>
    </div>
""", unsafe_allow_html=True)
