// ==UserScript==
// @name rpg.kr 편의기능 애드온
// @namespace Script Runner Pro
// @description 게임 플레이에 필요한 편의기능을 구현한 스크립트입니다.
// @match https://rpg.kr/
// @grant none
// @version 0.0.3.1
// ==/UserScript==
/*jshint esversion: 6 */

(_ => {
  const frame = window.frames.mainFrame;

  frame.onload = function() {
    const doc = frame.contentDocument;
    const main = doc.getElementById("main");

    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        contentChanged();
      });
    });

    observer.observe(main, {
      childList: true
    });

    // 게임 메뉴를 선택할 때마다 호출되는 함수입니다.
    const contentChanged = () => {

      // 전투 알리미 값을 읽어서 전투/탐사에 최대치를 자동으로 입력합니다.
      const alimi = doc.getElementById("alimiWkpDisp");

      const rept = doc.getElementById("rept");
      const rInp = doc.getElementById("rInp");

      const alimiChanged = () => {
        if(rept) {
          rept.value = alimi.textContent;
        }

        if(rInp) {
          rInp.value = parseInt(parseInt(alimi.textContent)/20);
        }
      }

      const alimiObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          alimiChanged();
        });
      });

      if(alimi) {
        alimiObserver.observe(alimi, {
          childList: true
        });
        alimiChanged();
      }
    };

    //키보드 입력에 따른 기능을 처리합니다.
    const clickElement = (text) => {
      const xpaths = [
        (code) => `//a[text() = '${code}']`,
        (code) => `//input[@value = '${code}']`,
        (code) => `//div[text() = '${code}' and @class='button']`,
      ];
      xpaths.some(xpath => {
        var element = doc.evaluate(xpath(text), doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(element) {
          element.click();
          return true;
        }
      });
      return false;
    }

    const onKeyUp = (event) => {
      switch(event.key) {
        case 'Enter':
          var buttons = ["전투", "탐사"];
          buttons.some(button => {
            if(clickElement(button)) return;
          });
          break;
        case 'Backspace':
          if(!doc.activeElement)
            clickElement("돌아가기");
          break;
      }
    }

    //엔터키 눌렀을 때 form의 submit(전투 실행)을 방지합니다.
    const onKeyDown = (event) => {
      switch(event.key) {
        case 'Enter':
          event.preventDefault();
          break;
      }
    };

    doc.addEventListener('keyup', onKeyUp);
    doc.addEventListener('keydown', onKeyDown);
  }
})();