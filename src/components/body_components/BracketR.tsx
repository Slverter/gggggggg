import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { bracketMouseDown, bracketMouseUp, bracketMouseEnter, bracketMouseLeave } from '../../animations/bracketClickAnimations';
import useKnobOnOffStore from '../../stores/knob_on_off_store';
import useBodyPageStore from '../../stores/body_page_store';
import usePageDirectionStore from '../../stores/page_direction_store';
import useIsArmAnimatingStore from '../../stores/is_arm_animating_store';
import { bracketLoading, bracketLoadingStandby } from '../../animations/headAnimations';
import { bracketTransition } from '../../animations/bodyToArmTransitionAnimations';
import useBodyToLegStore from '../../stores/body_to_leg_store';
import useIsOpeningStore from '../../stores/is_opening_store';

interface BracketRightProps {
    height: any;
    // linkRight: string;
}

interface bodyToLeg {
    bodyToLeg: boolean;
}
const Container = styled.div<bodyToLeg>`
    position: absolute;
    right: calc(50% - 480px);
        @media (max-width: 1640px){
            right: calc(50% - 444px);
        }
    z-index: 1;
    transition: right 0.4s ease-out; /* 애니메이션 추가 */
`;

const BracketRight: React.FC<BracketRightProps> = ({height}) => {
    const pathData = `M0 0 H42 V${height} H0 V${height - 18} H24 V18 H0 V0 Z`;
    const btnRef = useRef<SVGPathElement | null>(null);
    const bracketRef = useRef<HTMLDivElement>(null);

    const setKorKnob = useKnobOnOffStore((state) => state.setKorKnobOnOff);
    const setEngKnob = useKnobOnOffStore((state) => state.setEngKnobOnOff);

    const korKnob = useKnobOnOffStore((state) => state.korKnobOnOff);
    const engKnob = useKnobOnOffStore((state) => state.engKnobOnOff);

    const bodyToLeg = useBodyToLegStore((state) => state.bodyToLeg);
    const isOpening = useIsOpeningStore((state) => state.isOpening);

    const turningKnobsOff = () => {
        if (korKnob === true) {
            setKorKnob(false);
        }
        if (engKnob === true) {
            setEngKnob(false);
        }
    };

    const bodyPage = useBodyPageStore((state) => state.bodyPage);
    const setBodyPage = useBodyPageStore((state) => state.setBodyPage);

    const setPageDirection = usePageDirectionStore((state) => state.setPageDirection);

    const isArmAnimating = useIsArmAnimatingStore((state) => state.isArmAnimating);

    useEffect(() => {
        if(bodyToLeg){
            if(bracketRef.current){
                bracketRef.current.style.right = "300px";
            }
        }
      }, [bodyToLeg]);

    useEffect(()=> {
        if(bracketRef.current){
            bracketLoadingStandby(bracketRef.current, 1);
            setTimeout(() => {
                bracketLoading(bracketRef.current, 1);
            },2680)
        }
    },[]);

    return(
        <Container ref={bracketRef} bodyToLeg={bodyToLeg}>
        <svg width="42" height={height} viewBox={`0 0 42 ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
            <path d={pathData} fill="black" ref={btnRef}/>
            <path d={pathData} fill="transparent" 
            // onMouseEnter={!isOpening ? () => bracketMouseEnter(btnRef.current) : undefined}
            // onMouseLeave={!isOpening ? () => bracketMouseLeave(btnRef.current) : undefined}
            // onMouseDown={!isOpening ? () => bracketMouseDown(btnRef.current):undefined}
            // onMouseUp={!isOpening? () => {
            //     bracketMouseUp(btnRef.current); 
            //     turningKnobsOff(); 
            //     if (!isArmAnimating){
            //         if (bodyPage !== 2) {
            //             setBodyPage(bodyPage + 1);
            //         }
            //         setPageDirection(1);
            //     }
            // }:undefined}
            />
        </svg>
        </Container>
    );
}

export default BracketRight;