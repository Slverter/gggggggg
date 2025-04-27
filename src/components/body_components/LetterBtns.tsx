import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import lettersDataJSON from '../../assets/data/letters.json';
import { useLetterLogoStore } from '../../stores/letter_logo_store';
import booksDataJSON from '../../assets/data/books.json';
import useHoveredBookStore from '../../stores/hovered_book_store';
import { btnMouseDown, btnMouseUp, btnMouseEnter, btnMouseLeave } from '../../animations/btnClickAnimations';
import { btnsOn, btnsOff, btnsOpening, btnsStandby } from '../../animations/toggleKnobAnimations';
import useKnobOnOffStore from '../../stores/knob_on_off_store';
import useIsOpeningStore from '../../stores/is_opening_store';

interface Letter {
  tag: string;
  language: string;
  letterNumber: number;
  letterBtn: string;
  letterLogo: string;
}
interface Book {
  id: string;
  tags: {
    kor: string;
    eng: string;
  };
  date: string;
  name: string;
  coverBW: string;
  coverColor: string;
}
interface LetterBtnsProps {
  position?: string;
}
interface CursorProps {
  enabled: boolean;
}

const lettersData: Letter[] = JSON.parse(JSON.stringify(lettersDataJSON));
const booksData: Book[] = JSON.parse(JSON.stringify(booksDataJSON));

const LetterBtns = styled.div<LetterBtnsProps>`
  display: flex;
  gap: ${(props) => (props.position === 'header' ? '24px' : '16px')};

    @media (max-width: 1640px) {
      justify-content: center;
      width: 712px;
      flex-wrap: wrap;
      gap: ${(props) => (props.position === 'header' ? '32px' : '16px')};
      row-gap: 16px;
      position: absolute;
      margin-top: ${(props) => (props.position === 'header' ? '56px' : null)};
      margin-bottom: ${(props) => (props.position === 'header' ? null : '56px')};
    }
`;
const LetterBtn = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
`;
const ClickRange = styled.div<CursorProps>`
  width: 40px;  height: 40px;
  // background-color: teal;
  border-radius: 50%;
  cursor: ${({ enabled }) => (enabled ? "pointer" : "default")};
  position: absolute;
`;
const Container = styled.div`
  width: 40px;
  height: 40px;
`;

export const LetterBtnsKor = () => {
  const setLetterNumber = useLetterLogoStore((state) => state.setLetterNumber);
  const setHoveredBookId = useHoveredBookStore((state) => state.setHoveredBook);
  const letterNumber = useLetterLogoStore((state) => state.letterNumber);
  
  const btnRefs = useRef<(HTMLDivElement | null)[]>(new Array(lettersData.slice(0, 19).length).fill(null));
  const btnsRef = useRef(null);

  const knobOnOff = useKnobOnOffStore((state) => state.korKnobOnOff);
  const isOpening = useIsOpeningStore((state) => state.isOpening);
  
  useEffect(() => {
    const tag: string = lettersData[letterNumber].tag;
    const filteredBooks = booksData.filter((book: Book) =>
      Object.values(book.tags).includes(tag)
    );

    if (filteredBooks.length > 0) {
      setHoveredBookId(filteredBooks[0].id);
    }else{
      setHoveredBookId("");
    }
  }, [letterNumber, setHoveredBookId]);


  const isFirstRender = useRef(true);
  // knobOnOff 상태에 따라 letterBtns에 animation
  useEffect(() => {
    if (btnsRef.current) {
      if(!isFirstRender.current) {
        if (knobOnOff) {
            btnsOn(btnsRef.current);
        } else {
            btnsOff(btnsRef.current, 1);
        }
      } else {
        isFirstRender.current = false;
      }
    } 
  }, [knobOnOff]);

  // 처음 로드 시 재생되는 애니메이션
  useEffect(() => {
    btnsStandby(btnsRef.current, 1);
    setTimeout(() => {
      if (btnsRef.current) {
        btnsOpening(btnsRef.current, 1);
      }
    },3280) // 오프닝 애니메이션 시간 + 로고 애니메이션 시간, 이거 토글이랑 같아야함 ㅇㅅㅇ
  }, []);

  const letterClick = (n: number) => {
    setLetterNumber(n);
  };

  return (
    <LetterBtns ref={btnsRef} position="header">
      {lettersData.slice(0, 19).map((letter, index) => (
        <Container>
        <LetterBtn
          key={index}
          ref={(el) => (btnRefs.current[index] = el)}
          style={{ backgroundImage: `url(${letter.letterBtn})` }}
        />
        <ClickRange enabled = {!isOpening}
          onMouseEnter={!isOpening ? () => btnMouseEnter(btnRefs.current[index]) : undefined}
          onMouseLeave={!isOpening ? () => btnMouseLeave(btnRefs.current[index]) : undefined}
          onMouseDown={!isOpening ? () => btnMouseDown(btnRefs.current[index]) : undefined}
          onMouseUp={!isOpening ? () => btnMouseUp(btnRefs.current[index]) : undefined}
          onClick={!isOpening ? () => letterClick(index) : undefined}
        />
        </Container>
      ))}
    </LetterBtns>
  );
};

export const LetterBtnsEng = () => {
  const setLetterNumber = useLetterLogoStore((state) => state.setLetterNumber);
  const letterNumber = useLetterLogoStore((state) => state.letterNumber);

  const btnRefs = useRef<(HTMLDivElement | null)[]>(new Array(lettersData.slice(0, 19).length).fill(null));
  const btnsRef = useRef(null);

  const knobOnOff = useKnobOnOffStore((state) => state.engKnobOnOff);
  const isOpening = useIsOpeningStore((state) => state.isOpening);
  
  // knobOnOff 상태에 따라 letterBtns에 animation
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (btnsRef.current) {
      if(!isFirstRender.current) {
        if (knobOnOff) {
          btnsOn(btnsRef.current);
          // console.log("On");
        }else{
          btnsOff(btnsRef.current, -1);
          // console.log("Off");
        }
      }else{
        isFirstRender.current = false;
      }
    }
  }, [knobOnOff]);

  // 처음 로드 시 재생되는 애니메이션
  useEffect(() => {
    btnsStandby(btnsRef.current, -1);
    setTimeout(() => {
      if(btnsRef.current) {
        btnsOpening(btnsRef.current, -1);
      }
    },3280) // 오프닝 애니메이션 시간 + 로고 애니메이션 시간, 이거 토글이랑 같아야함
  },[])

  const letterClick = (n: number) => {
    setLetterNumber(n);
  };

  return (
    <LetterBtns ref={btnsRef} position="footer">
      {lettersData.slice(19,45).map((letter, index) => (
        <Container>
        <LetterBtn
          key={index+19}
          ref={(el) => (btnRefs.current[index] = el)}
          style={{ backgroundImage: `url(${letter.letterBtn})` }}
        />
        <ClickRange enabled = {!isOpening}
            onMouseEnter={!isOpening ? () => btnMouseEnter(btnRefs.current[index]) : undefined}
            onMouseLeave={!isOpening ? () => btnMouseLeave(btnRefs.current[index]) : undefined}
            onMouseDown={!isOpening ? () => btnMouseDown(btnRefs.current[index]) : undefined}
            onMouseUp={!isOpening ? () => btnMouseUp(btnRefs.current[index]) : undefined}
            onClick={!isOpening ? () => letterClick(index + 19) : undefined}
        />
        </Container>
      ))}
    </LetterBtns>
  );
};
