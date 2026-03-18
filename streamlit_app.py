import streamlit as st

# 페이지 설정
st.set_page_config(page_title="StayOn - 편안한 할 일 관리", layout="centered")

# 눈이 편안한 색감 (CSS)
st.markdown("""
    <style>
    .stApp {
        background-color: #F0F4F2;
    }
    h1, h2, h3 {
        color: #557C55 !important;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("🌿 StayOn: 늘 곁에 있는 할 일")

# 할 일 입력 창
with st.container():
    new_todo = st.text_input("새로운 할 일을 입력하세요", placeholder="예: 비타민 먹기")
    col1, col2 = st.columns([1, 4])
    with col1:
        date = st.date_input("마감일")
    with col2:
        time = st.time_input("시간")
    
    if st.button("추가하기"):
        st.success(f"'{new_todo}' 등록 완료! (마감: {date} {time})")

st.divider()
st.subheader("📍 현재 할 일 목록")
st.info("아직 등록된 할 일이 없습니다. 첫 할 일을 추가해 보세요!")
