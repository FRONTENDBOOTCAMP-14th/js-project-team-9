# 🎹 Piano Learning Web App

**모두를 위한 피아노 우주, Pianiverse**  
9조 팀 프로젝트 | 바닐라 HTML/CSS/JS | 25.07.18 ~ 25.08.04 진행

[🌐 배포 사이트 바로가기](https://pianiverse.netlify.app/)

---

## 프로젝트 소개

Pianiverse는 키보드와 음성 안내를 기반으로 시각장애인, 피아노 입문자 누구나 함께 즐길 수 있는
**접근성 중심의 인터랙티브 피아노 학습 웹 애플리케이션**입니다.

**닌텐도 스위치 UI**에서 착안한 Index 페이지를 통해 메인 페이지로 이동할 수 있습니다.  
또한, **보면서/들으면서/함께 배우기** 3가지 모드 중 하나를 선택하여 **학습하기/게임하기** 2가지 타입을 즐기실 수 있습니다.
Web Audio API, Web Speech API 등을 적극 활용하여 접근성을 향상하고 실제 피아노처럼 연주 경험을 제공합니다.

---

## 팀원 소개

| 이름     | 역할 | MBTI |
| :------- | :--: | :--- |
| 신남일   | 팀원 | INTP |
| 김에스더 | 팀원 | INFJ |
| 이형민   | 팀원 | INTP |
| 정지은   | 팀원 | ISTP |

---

## 프로젝트 구조

```
📁 pages/
├── index.html        ← 진입 페이지
├── home.html         ← 모드/기능 선택
├── stage.html        ← 학습/게임 공용 단계 선택
├── step.html         ← 학습/게임 공용 단계 실행
├── play.html         ← 자유 연주

📁 step-data/
├── game/
│   ├── together/
│   │   ├── step-1.json
│   │   ...
│   ├── see/
│   │   ├── step-1.json
│   │   ...
│   └── listen/
│       ├── step-1.json
│       ...
└── learn/
    ├── together/
    │	├── step-1.json
    │   ...
    ├── see/
    │	├── step-1.json
    │   ...
    └── listen/
	├── step-1.json
	...
	(폴더에 맞게 단계 파일 생성)
```

---

## 레퍼런스

- UI 디자인: [Nintendo Switch 홈 화면](https://www.nintendo.com/)
- 피아노 기능: [MUSICCA](https://www.musicca.com/piano)

---
