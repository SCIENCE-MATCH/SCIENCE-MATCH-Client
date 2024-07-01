import { createGlobalStyle, css } from "styled-components";

export const reset = css`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  menu,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 62.5%;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
    display: none;
  }
  body {
    line-height: 1;
  }
  menu,
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  button {
    cursor: pointer;
    background: transparent;
    border: none;
  }
`;

const GlobalStyle = createGlobalStyle`

${reset}

#root, body, html {
    margin: 0 auto;
    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */

}
#root::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */
}

* {
    box-sizing: border-box;
    // 버튼 음영 제거
    -webkit-tap-highlight-color:rgba(255,255,255,0);
    // 글자 선택 방지
    user-select: none;
    // 링크 터치 금지
    -webkit-touch-callout: none;

}

input:disabled, textarea:disabled, input:disabled::placeholder, textarea:disabled::placeholder {
    opacity: 1; 
}

// 사파리 웹 뷰 브라우저 상속 스타일 제거
input, textarea,button {
    border-radius: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;

}

// react-datepicker 커스텀 스타일
.react-datepicker {
    width: 33rem;
    height: 33rem;
    background-color: white!important;
    border: 1px solid ${({ theme }) => theme.colors.unselected || "#ccc"}!important;
    border-radius: 0.6rem!important;
    overflow: hidden;
  }

  .react-datepicker__header {
    width: 33rem;
    height: 5rem;
    background-color: ${({ theme }) => theme.colors.primary || "#f0f0f0"}!important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.unselected || "#ccc"}!important;
    font-size:2rem !important;
  }
  .react-datepicker__navigation{
    margin-top: 0.8rem;
  }
  .react-datepicker__day-name{
    font-size: 0rem !important;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-size: 2rem !important;
    color:black !important;
  }
  .react-datepicker__day {
    width: 4rem!important;
    height: 4rem!important;
    line-height: 4rem!important;
    margin: 0.25rem!important;
    font-size: 1.5rem !important;
  }

  .react-datepicker__day--selected {
    background-color: ${({ theme }) => theme.colors.mainColor}!important;
    color: white !important;
  }

  .react-datepicker__day--keyboard-selected {
    background-color:${({ theme }) => theme.colors.brightMain}!important;
    color: ${({ theme }) => theme.colors.mainColor}!important;
  }
`;

export default GlobalStyle;
