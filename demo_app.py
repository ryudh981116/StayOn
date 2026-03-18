import streamlit as st

st.set_page_config(page_title="Demo App", layout="centered")

st.title("🎉 Streamlit 데모 앱")
st.write("Streamlit 환경이 정상 작동합니다!")

# 사이드바
st.sidebar.header("설정")
name = st.sidebar.text_input("이름을 입력하세요:", "사용자")

# 메인 컨텐츠
st.subheader(f"안녕하세요, {name}님! 👋")

# 슬라이더
age = st.slider("나이를 선택하세요:", 0, 100, 25)
st.write(f"선택한 나이: {age}세")

# 버튼
if st.button("클릭해보세요!"):
    st.balloons()
    st.success("버튼이 작동합니다! ✨")

# 데이터 표시
st.subheader("간단한 데이터")
import pandas as pd
data = {
    "이름": ["Alice", "Bob", "Charlie"],
    "점수": [85, 90, 88]
}
df = pd.DataFrame(data)
st.dataframe(df)

st.info("💡 정상 작동 확인 완료!")
