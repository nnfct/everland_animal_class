// public/js/quiz.js (최종 수정본 - quiz_images 기반)

document.addEventListener('DOMContentLoaded', () => {
    console.log("퀴즈 페이지 로드 완료 (quiz_images 기반)");

    // --- 1. 퀴즈 데이터 직접 정의 ---
    // 이미지 파일 이름과 정답을 여기에 모두 정의합니다.
    const quizData = [
        { image: 'quiz_images/m1.jpg', answer: '미어캣' },
        { image: 'quiz_images/m2.jpg', answer: '미어캣' },
        { image: 'quiz_images/m3.jpg', answer: '미어캣' },
        { image: 'quiz_images/m4.jpg', answer: '미어캣' },
        { image: 'quiz_images/m5.jpg', answer: '미어캣' },
        { image: 'quiz_images/m6.jpg', answer: '미어캣' },
        { image: 'quiz_images/m7.jpg', answer: '미어캣' },
        { image: 'quiz_images/m8.jpg', answer: '미어캣' },
        { image: 'quiz_images/m9.jpg', answer: '미어캣' },
        { image: 'quiz_images/m10.jpg', answer: '미어캣' },
        { image: 'quiz_images/m11.jpg', answer: '미어캣' },
        { image: 'quiz_images/m12.jpg', answer: '미어캣' },
        { image: 'quiz_images/m13.jpg', answer: '미어캣' },
        { image: 'quiz_images/m14.jpg', answer: '미어캣' },
        { image: 'quiz_images/m15.jpg', answer: '미어캣' },
        { image: 'quiz_images/m16.jpg', answer: '미어캣' },
        { image: 'quiz_images/m17.jpg', answer: '미어캣' },
        { image: 'quiz_images/m18.jpg', answer: '미어캣' },
        { image: 'quiz_images/m19.jpg', answer: '미어캣' },
        { image: 'quiz_images/m20.jpg', answer: '미어캣' },
        { image: 'quiz_images/m21.jpg', answer: '미어캣' },
        { image: 'quiz_images/m22.jpg', answer: '미어캣' },
        { image: 'quiz_images/m23.jpg', answer: '미어캣' },
        { image: 'quiz_images/m24.jpg', answer: '미어캣' },
        { image: 'quiz_images/m25.jpg', answer: '미어캣' },
        { image: 'quiz_images/m26.jpg', answer: '미어캣' },
        { image: 'quiz_images/m27.jpg', answer: '미어캣' },
        { image: 'quiz_images/m28.jpg', answer: '미어캣' },
        { image: 'quiz_images/m29.jpg', answer: '미어캣' },
        { image: 'quiz_images/m30.jpg', answer: '미어캣' },
        { image: 'quiz_images/m31.jpg', answer: '미어캣' },
        { image: 'quiz_images/m32.jpg', answer: '미어캣' },
        { image: 'quiz_images/m33.jpg', answer: '미어캣' },
        { image: 'quiz_images/m34.jpg', answer: '미어캣' },
        { image: 'quiz_images/m35.jpg', answer: '미어캣' },
        { image: 'quiz_images/m36.jpg', answer: '미어캣' },
        { image: 'quiz_images/m37.jpg', answer: '미어캣' },
        { image: 'quiz_images/m38.jpg', answer: '미어캣' },
        { image: 'quiz_images/m39.jpg', answer: '미어캣' },
        { image: 'quiz_images/m40.jpg', answer: '미어캣' },
        { image: 'quiz_images/m41.jpg', answer: '미어캣' },
        { image: 'quiz_images/m42.jpg', answer: '미어캣' },
        { image: 'quiz_images/m43.jpg', answer: '미어캣' },
        { image: 'quiz_images/m44.jpg', answer: '미어캣' },
        { image: 'quiz_images/m45.jpg', answer: '미어캣' },
        { image: 'quiz_images/m46.jpg', answer: '미어캣' },
        { image: 'quiz_images/m47.jpg', answer: '미어캣' },
        { image: 'quiz_images/m48.jpg', answer: '미어캣' },
        { image: 'quiz_images/m49.jpg', answer: '미어캣' },
        { image: 'quiz_images/m50.jpg', answer: '미어캣' },
        { image: 'quiz_images/m51.jpg', answer: '미어캣' },
        { image: 'quiz_images/m52.jpg', answer: '미어캣' },
        { image: 'quiz_images/m53.jpg', answer: '미어캣' },

        { image: 'quiz_images/mo1.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo2.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo3.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo4.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo5.jpg', answer: '줄무늬 몽구스' },          
        { image: 'quiz_images/mo6.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo7.jpg', answer: '줄무늬 몽구스' },                      
        { image: 'quiz_images/mo8.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo9.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo10.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo11.jpg', answer: '줄무늬 몽구스' },         
        { image: 'quiz_images/mo12.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo13.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo14.jpg', answer: '줄무늬 몽구스'    },  
        { image: 'quiz_images/mo15.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo16.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo17.jpg', answer: '줄무늬 몽구스'    },
        { image: 'quiz_images/mo18.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo19.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo20.jpg', answer: '줄무늬 몽구스'},
        { image: 'quiz_images/mo21.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo22.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo23.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo24.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo25.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo26.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo27.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo28.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo29.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo30.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo31.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo32.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo33.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo34.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo35.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo36.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo37.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo38.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo39.jpg', answer: '줄무늬 몽구스' },        
        { image: 'quiz_images/mo40.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo41.jpg', answer: '줄무늬 몽구스'},
        { image: 'quiz_images/mo42.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo43.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo44.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo45.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo46.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo47.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo48.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo49.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo50.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo51.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo52.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo53.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo54.jpg', answer: '줄무늬 몽구스'},
        { image: 'quiz_images/mo55.jpg', answer: '줄무늬 몽구스' },
        { image: 'quiz_images/mo56.jpg', answer: '줄무늬 몽구스' },

        { image: 'quiz_images/a1.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a2.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a3.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a4.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a5.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a6.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a7.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a8.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a9.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a10.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a11.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a12.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a13.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a14.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a15.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a16.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a17.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a18.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a19.jpg', answer: '아프리카갈기호저' },
        { image: 'quiz_images/a20.jpg', answer: '아프리카갈기호저' },

        { image: 'quiz_images/mon1.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon2.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon3.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon4.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon5.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon6.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon7.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon8.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon9.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon10.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon11.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon12.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon13.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon14.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon15.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon16.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon17.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon18.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon19.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon20.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon21.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon22.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon23.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon24.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon25.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon26.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon27.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon28.jpg', answer: '알락꼬리여우원숭이' },
        { image: 'quiz_images/mon29.jpg', answer: '알락꼬리여우원숭이' },
    
        { image: 'quiz_images/n1.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n2.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n3.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n4.jpg', answer: '벌거숭이두더지쥐'},
        { image: 'quiz_images/n5.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n6.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n7.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n8.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n9.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n10.jpg', answer: '벌거숭이두더지쥐' 
        },
        { image: 'quiz_images/n11.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n12.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n13.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n14.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n15.jpg', answer: '벌거숭이두더지쥐'
        },
        { image: 'quiz_images/n16.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n17.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n18.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n19.jpg', answer: '벌거숭이두더지쥐   ' },
        
        { image: 'quiz_images/n20.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n21.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n22.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n23.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n24.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n25.jpg', answer: '벌거숭이두더지쥐' }, 
        { image: 'quiz_images/n26.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n27.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n28.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n29.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n30.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n31.jpg', answer: '벌거숭이두더지쥐   ' },
        { image: 'quiz_images/n32.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n33.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n34.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n35.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n36.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n37.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n38.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n39.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n40.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n41.jpg', answer: '벌거숭이두더지쥐' },
        
        { image: 'quiz_images/n42.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n43.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n44.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n45.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n46.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n47.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n48.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n49.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n50.jpg', answer: '벌거숭이두더지쥐'  },
        
        { image: 'quiz_images/n51.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n52.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n53.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n54.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n55.jpg', answer: '벌거숭이두더지쥐'},
        { image: 'quiz_images/n56.jpg', answer: '벌거숭이두더지쥐'},
         
        { image: 'quiz_images/n57.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n58.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n59.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n60.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n61.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n62.jpg', answer: '벌거숭이두더지쥐' },
        { image: 'quiz_images/n63.jpg', answer: '벌거숭이두더지쥐' },

        
        { image: 'quiz_images/o1.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o2.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o3.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o4.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o5.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o6.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o7.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o8.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o9.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o10.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o11.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o12.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o13.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o14.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o15.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o16.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o17.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o18.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o19.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o20.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o21.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o22.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o23.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o24.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o25.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o26.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o27.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o28.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o29.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o30.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o31.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o32.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o33.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o34.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o35.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o36.jpg', answer: '수리부엉이' },
        { image: 'quiz_images/o37.jpg', answer: '수리부엉이' },

        
        { image: 'quiz_images/r1.jpg', answer: '토끼' },
        { image: 'quiz_images/r2.jpg', answer: '토끼' },
        { image: 'quiz_images/r3.jpg', answer: '토끼' },
        { image: 'quiz_images/r4.jpg', answer: '토끼' },
        { image: 'quiz_images/r5.jpg', answer: '토끼' },
        { image: 'quiz_images/r6.jpg', answer: '토끼' },
        { image: 'quiz_images/r7.jpg', answer: '토끼' },
        { image: 'quiz_images/r8.jpg', answer: '토끼' },
        { image: 'quiz_images/r9.jpg', answer: '토끼' },
        { image: 'quiz_images/r10.jpg', answer: '토끼' },
        { image: 'quiz_images/r11.jpg', answer: '토끼' },
        { image: 'quiz_images/r12.jpg', answer: '토끼' },
        { image: 'quiz_images/r13.jpg', answer: '토끼' },
        { image: 'quiz_images/r14.jpg', answer: '토끼' },
        { image: 'quiz_images/r15.jpg', answer: '토끼' },
        { image: 'quiz_images/r16.jpg', answer: '토끼' },
        { image: 'quiz_images/r17.jpg', answer: '토끼' },
        { image: 'quiz_images/r18.jpg', answer: '토끼' },
        { image: 'quiz_images/r19.jpg', answer: '토끼' },
        { image: 'quiz_images/r20.jpg', answer: '토끼' },
        { image: 'quiz_images/r21.jpg', answer: '토끼' },
        { image: 'quiz_images/r22.jpg', answer: '토끼' },
        { image: 'quiz_images/r23.jpg', answer: '토끼' },
        { image: 'quiz_images/r24.jpg', answer: '토끼' },
        { image: 'quiz_images/r25.jpg', answer: '토끼' },
        { image: 'quiz_images/r26.jpg', answer: '토끼' },
        { image: 'quiz_images/r27.jpg', answer: '토끼' },
        { image: 'quiz_images/r28.jpg', answer: '토끼' },
        { image: 'quiz_images/r29.jpg', answer: '토끼' },
        { image: 'quiz_images/r30.jpg', answer: '토끼' },
        { image: 'quiz_images/r31.jpg', answer: '토끼' },
        { image: 'quiz_images/r32.jpg', answer: '토끼' },
        { image: 'quiz_images/r33.jpg', answer: '토끼' },
        { image: 'quiz_images/r34.jpg', answer: '토끼' },
        { image: 'quiz_images/r35.jpg', answer: '토끼' },
        { image: 'quiz_images/r36.jpg', answer: '토끼' },
        { image: 'quiz_images/r37.jpg', answer: '토끼' },
        { image: 'quiz_images/r38.jpg', answer: '토끼' },
        { image: 'quiz_images/r39.jpg', answer: '토끼' },
        { image: 'quiz_images/r40.jpg', answer: '토끼' },
        { image: 'quiz_images/r41.jpg', answer: '토끼' },
        { image: 'quiz_images/r42.jpg', answer: '토끼' },
        { image: 'quiz_images/r43.jpg', answer: '토끼' },
        { image: 'quiz_images/r44.jpg', answer: '토끼' },
        { image: 'quiz_images/r45.jpg', answer: '토끼' },
        { image: 'quiz_images/r46.jpg', answer: '토끼' },
        { image: 'quiz_images/r47.jpg', answer: '토끼' },
        { image: 'quiz_images/r48.jpg', answer: '토끼' },
        { image: 'quiz_images/r49.jpg', answer: '토끼' },
        { image: 'quiz_images/r50.jpg', answer: '토끼' },
        { image: 'quiz_images/r51.jpg', answer: '토끼' },
        { image: 'quiz_images/r52.jpg', answer: '토끼' },
        { image: 'quiz_images/r53.jpg', answer: '토끼' },
        { image: 'quiz_images/r54.jpg', answer: '토끼' },
        { image: 'quiz_images/r55.jpg', answer: '토끼' },
        { image: 'quiz_images/r56.jpg', answer: '토끼' },

        
        { image: 'quiz_images/ro1.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro2.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro3.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro4.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro5.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro6.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro7.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro8.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro9.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro10.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro11.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro12.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro13.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro14.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro15.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro16.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro17.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro18.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro19.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro20.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro21.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro22.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro23.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro24.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro25.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro26.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro27.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro28.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro29.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro30.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro31.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro32.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro33.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro34.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro35.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro36.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro37.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro38.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro39.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro40.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro41.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro42.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro43.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro44.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro45.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro46.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro47.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro48.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro49.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro50.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro51.jpg', answer: '바위너구리' },
        { image: 'quiz_images/ro52.jpg', answer: '바위너구리' },


         { image: 'quiz_images/s1.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s2.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s3.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s4.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s5.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s6.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s7.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s8.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s9.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s10.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s11.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s12.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s13.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s14.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s15.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s16.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s17.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s18.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s19.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s20.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s21.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s22.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s23.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s24.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s25.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s26.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s27.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s28.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s29.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s30.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s31.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s32.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s33.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s34.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s35.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s36.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s37.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s38.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s39.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s40.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s41.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s42.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s43.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s44.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s45.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s46.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s47.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s48.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s49.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s50.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s51.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s52.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s53.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s54.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s55.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s56.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s57.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s58.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s59.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s60.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s61.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s62.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s63.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s64.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s65.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s66.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s67.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s68.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s69.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s70.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s71.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s72.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s73.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s74.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s75.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s76.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s77.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s78.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s79.jpg', answer: '다람쥐' },
         { image: 'quiz_images/s80.jpg', answer: '다람쥐' },

            

        { image: 'quiz_images/t1.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t2.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t3.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t4.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t5.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t6.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t7.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t8.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t9.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t10.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t11.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t12.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t13.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t14.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t15.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t16.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t17.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t18.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t19.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t20.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t21.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t22.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t23.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t24.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t25.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t26.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t27.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t28.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t29.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t30.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t31.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t32.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t33.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t34.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t35.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t36.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t37.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t38.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t39.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t40.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t41.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t42.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t43.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t44.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t45.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t46.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t47.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t48.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t49.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t50.jpg', answer: '설카타 육지거북이' },
        { image: 'quiz_images/t51.jpg', answer: '설카타 육지거북이' }



        // ✨ 여기에 다른 동물 이미지와 정답을 추가할 수 있습니다.
        // 예: { image: 'quiz_images/lemur1.jpg', answer: '알락꼬리여우원숭이' },
    ];

    // 오답 선택지를 만들기 위해 모든 정답의 종류를 미리 준비합니다.
    const allAnswers = [...new Set(quizData.map(q => q.answer))];


    // --- 2. DOM 요소 및 상태 변수 ---
    const quizImage = document.getElementById('quizImage');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextQuizBtn = document.getElementById('nextQuizBtn');
    const quizResultDiv = document.getElementById('quizResult');
    const quizSection = document.getElementById('quizSection');

    const TOTAL_QUESTIONS = 5;
    let quizPool = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let answerChecked = false;

    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'scoreDisplay';
    scoreDisplay.style.fontSize = '1.2em';
    scoreDisplay.style.fontWeight = 'bold';
    scoreDisplay.style.margin = '1rem 0';
    quizSection.insertBefore(scoreDisplay, nextQuizBtn);


    // --- 3. 퀴즈 로직 함수 ---

    // 배열 셔플 함수
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 퀴즈 시작
    function startQuiz() {
        if (allAnswers.length < 3) {
            quizResultDiv.textContent = "퀴즈를 만들기에 정답 종류가 부족해요! (최소 3종류 필요)";
            nextQuizBtn.style.display = 'none';
            return;
        }
        currentQuestionIndex = 0;
        score = 0;
        quizPool = shuffleArray([...quizData]).slice(0, TOTAL_QUESTIONS);
        nextQuizBtn.textContent = "다음 문제";
        nextQuizBtn.disabled = true;
        displayQuestion();
    }

    // 문제 표시
    function displayQuestion() {
        answerChecked = false;
        optionsContainer.innerHTML = '';
        quizResultDiv.textContent = '';
        scoreDisplay.textContent = `문제 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS} | 점수: ${score}`;

        const currentQuestion = quizPool[currentQuestionIndex];
        const correctAnswer = currentQuestion.answer;

        quizImage.src = currentQuestion.image;
        quizImage.alt = "퀴즈 이미지";
        quizImage.style.display = 'block';

        // 오답 선택지 2개 만들기
        const wrongAnswers = shuffleArray(allAnswers.filter(ans => ans !== correctAnswer)).slice(0, 2);
        
        // 정답 1개 + 오답 2개를 합쳐서 랜덤으로 섞기
        const options = shuffleArray([correctAnswer, ...wrongAnswers]);

        options.forEach(optionText => {
            const button = document.createElement('button');
            button.className = 'button quiz-option';
            button.textContent = optionText;
            button.onclick = () => checkAnswer(optionText, correctAnswer);
            optionsContainer.appendChild(button);
        });

        nextQuizBtn.disabled = true;
    }

    // 정답 확인
    function checkAnswer(selectedAnswer, correctAnswer) {
        if (answerChecked) return;
        answerChecked = true;
        nextQuizBtn.disabled = false;

        if (selectedAnswer === correctAnswer) {
            score++;
            quizResultDiv.textContent = "🎉 정답입니다! 🎉";
            quizResultDiv.style.color = 'green';
        } else {
            quizResultDiv.textContent = `😢 아쉬워요! 정답은 ${correctAnswer} 입니다.`;
            quizResultDiv.style.color = 'red';
        }
        
        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.textContent === selectedAnswer) {
                btn.classList.add('wrong');
            }
        });
        
        scoreDisplay.textContent = `문제 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS} | 점수: ${score}`;

        if (currentQuestionIndex === TOTAL_QUESTIONS - 1) {
            nextQuizBtn.textContent = "결과 보기";
        }
    }

    // 최종 결과 표시
    function showFinalResult() {
        quizImage.style.display = 'none';
        optionsContainer.innerHTML = '';
        nextQuizBtn.style.display = 'none';
        scoreDisplay.style.display = 'none';
        quizResultDiv.innerHTML = `퀴즈 종료!<br>최종 점수는 <strong>${score} / ${TOTAL_QUESTIONS}</strong> 입니다!`;

        const restartBtn = document.createElement('button');
        restartBtn.className = 'button quiz';
        restartBtn.textContent = '퀴즈 다시하기';
        restartBtn.onclick = () => startQuiz(); // 새로고침 대신 퀴즈 재시작
        quizResultDiv.parentNode.insertBefore(restartBtn, quizResultDiv.nextSibling);
    }

    // 다음 문제 버튼 이벤트
    nextQuizBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < TOTAL_QUESTIONS) {
            displayQuestion();
        } else {
            showFinalResult();
        }
    });

    // --- 4. 퀴즈 시작! ---
    startQuiz();
});