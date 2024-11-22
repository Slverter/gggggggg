import React, { useEffect, useRef, useState } from "react";
import Header from "../body_components/Header";
import Footer from "../body_components/Footer";
import Main from "../body_components/Main";
import Wrapper from "../body_components/Wrapper";
import Side from "./Side";
import logo from "../../assets/gggg_icon.svg";
import styled from "styled-components";
import BracketLeft from "./BracketLeft";
import BracketRight from "./BracketRight";
import BracketTop from "./BracketTop";
import BracketBottom from "./BracketBottom";
import Viewer from "./Leg_Main_Viewer";
import CoverList from "./Leg_Side_CoverList";
import ThumbnailList from "./Leg_Side_ThumbnailList";
// import BookPageThumbnails from "./BookPageThumbnails";
// import BookCoverThumbnails from "./BookCoverThumbnails";
// import BookPage from "./BookPage";


import { Link } from "react-router-dom";
import { legLogoOpening, legLogoStandby } from "../../animations/legSideAnimations";
import Indecator from "./Indecator";
import useIsArmAnimatingStore from "../../stores/is_arm_animating_store";
import useIsOpeningStore from "../../stores/is_opening_store";
import useBookViewerStore from "../../stores/book_viewer_store";
import usePageDirectionStore from "../../stores/page_direction_store";

const Logo = styled.img`
    width:84px; height:48px; 
    margin-top: 24px;
`;

const Leg = () => {
    const [mainHeight, setMainHeight] = useState<number | null>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef(null);
    const setIsArmAnimating = useIsArmAnimatingStore((state) => state.setIsArmAnimating);
    const setIsOpening = useIsOpeningStore((state) => state.setIsOpening);
    const setPageDirection = usePageDirectionStore((state) => state.setPageDirection);
    const currentPageNumber = useBookViewerStore((state) => state.currentPageNumber);

    useEffect(() => {
        setTimeout(() => {
            setIsOpening(false);
        }, 2600 + 400 + 1300)
        if(logoRef.current){
            legLogoStandby(logoRef.current);
            setTimeout(() => {
                legLogoOpening(logoRef.current);
                setIsArmAnimating(false);
                // set
            }, 2600+ 400)
        }
        setPageDirection(1);
        // 창 크기 변경 시 호출되는 함수 정의
        const handleResize = () => {
        if (mainRef.current) {
            setMainHeight(mainRef.current.offsetHeight);
        }
        };
        // 초기 높이 설정
        handleResize();
        // 'resize' 이벤트 리스너 추가
        window.addEventListener('resize', handleResize);
        // 컴포넌트 언마운트 시 리스너 제거
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setIsArmAnimating(true);
        setTimeout(() => {
            setIsArmAnimating(false);
        }, 400);
    }, [currentPageNumber])

    return(
        <Wrapper headerHeight="96px">
            <Header height="96px">
                <Link ref={logoRef} to="/">
                    <Logo src={logo} alt='꿈끼깡꾀' style={{top:"20px"}}/>
                </Link>
            </Header>
            <Side maxHeight="1920px" position={-1}>
                <BracketTop/>
                {/* <BookPageThumbnails/> */}
                <ThumbnailList/>
                <BracketBottom/>
            </Side>
            <Main ref={mainRef} maxHeight="1920px" spanNumber={1} router="leg">
                <Indecator pathData="M24 0 L24 48 L0 24 Z" position={-1}/>
                <BracketLeft height={mainHeight}/>
                {/* <BookPage/> */}
                <Viewer/>
                <BracketRight height={mainHeight}/>
                <Indecator pathData="M0 0 L0 48 L24 24 Z" position={1}/>
            </Main>
            <Side maxHeight="1920px" position={1}>
                <BracketTop/>
                {/* <BookCoverThumbnails/> */}
                <CoverList/>
                <BracketBottom/>
            </Side>
            <Footer height="96px">
                {/* <ArrowLeft/>
                <PageNumbers/>
                <ArrowRight/> */}
            </Footer>
        </Wrapper>
    );
}

export default Leg;