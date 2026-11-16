import streamlit as st

st.title("Test")

# Test 1: st.markdown mit HTML
col1, col2 = st.columns(2)
with col1:
    st.markdown("<div style='background:red;padding:10px'>TEST HTML</div>", unsafe_allow_html=True)

# Test 2: Native Komponenten
with col2:
    st.metric("Wert", 42)
    st.success("Grün")
    st.warning("Gelb") 
    st.error("Rot")
    st.info("Blau")
