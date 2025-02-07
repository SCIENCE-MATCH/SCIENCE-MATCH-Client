import { useState } from "react";
import styled from "styled-components";
import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
const WrongByDate = () => {
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const RangeCalendar = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [firstMonth, setFirstMonth] = useState(lastMonth);
    const [secondMonth, setSecondMonth] = useState(today);

    const handleFirstMonthChange = (month) => {
      setFirstMonth(month);
      if (secondMonth <= month) {
        const minSecondMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        setSecondMonth(minSecondMonth);
      } // 두 번째 캘린더의 현재 월이 첫 번째 캘린더보다 작으면 최소 1개월 이후로 변경
    };

    const handleSecondMonthChange = (month) => month > firstMonth && setSecondMonth(month); // 두 번째 캘린더가 첫 번째보다 1개월 이상 크다면 변경 허용

    const RC = {
      CalendarWrapper: styled.div`
        display: flex;
        gap: 20px; /* 두 캘린더 사이 간격 */
      `,
      StyledWrapper: styled.div`
        //font-size:3rem;
        .future-day {
          color: gray;
          background-color: ${({ theme }) => theme.colors.gray10};
          &:hover {
            background-color: ${({ theme }) => theme.colors.gray10};
          }
        }
        .rdp-root {
          --rdp-accent-color: ${({ theme }) => theme.colors.mainColor}; /* Use blue as the accent color. */
          --rdp-accent-background-color: ${({ theme }) => theme.colors.middleMain};
          --rdp-today-color: ${({ theme }) => theme.colors.warning};
        }
      `,
    };
    return (
      <RC.CalendarWrapper>
        <RC.StyledWrapper>
          <DayPicker
            locale={ko}
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            defaultMonth={today}
            month={firstMonth} // 현재 월 설정
            onMonthChange={handleFirstMonthChange}
            startMonth={new Date(2024, 6)}
            endMonth={lastMonth}
          />
        </RC.StyledWrapper>
        <RC.StyledWrapper>
          <DayPicker
            locale={ko}
            mode="range"
            selected={selectedRange}
            onSelect={(range) => {
              if ((!range?.from || range.from < today) && (!range?.to || range.to < today)) {
                setSelectedRange(range);
              }
            }}
            month={secondMonth}
            onMonthChange={handleSecondMonthChange}
            defaultMonth={today}
            endMonth={today}
            modifiers={{
              future: (date) => date > today, // 내일 이후 날짜를 future 클래스로 지정
            }}
            modifiersClassNames={{
              future: "future-day", // future 클래스에 스타일 적용
              selected: "selected-range", // 선택된 범위에 스타일 적용
            }}
          />
        </RC.StyledWrapper>
      </RC.CalendarWrapper>
    );
  };
  return (
    <BD.Wrapper>
      <BD.LeftSection>
        <RangeCalendar />
      </BD.LeftSection>
    </BD.Wrapper>
  );
};

export default WrongByDate;

const BD = {
  Wrapper: styled.div`
    background-color: white;
    overflow-y: auto;
    width: 133rem;
    height: 75rem;
    margin: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 0.01rem solid ${({ theme }) => theme.colors.gray20};
    display: flex;
    flex-direction: row;
    overflow: hidden;
  `,
  LeftSection: styled.section`
    height: 75rem;
    width: 80rem;
    border-right: 0.1rem solid ${({ theme }) => theme.colors.gray20};
  `,
};
