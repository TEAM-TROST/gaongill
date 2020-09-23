[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/TEAM-TROST/gaongill">
    <img src="https://github.com/TEAM-TROST/gaongill/blob/master/_data/README.png?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">가온길</h3>

  <p align="center">
    본 서비스는 21대 국회 공약과 공개된 군 입찰 내역, 언론 보도자료 등을 바탕으로 국민의 세금이 얼마나 투명하게 집행되고 있는지 시각적으로 보여줍니다.    
    <br />
    <a href="https://github.com/TEAM-TROST/gaongill"><strong>Explore the Github »</strong></a>
    <br />
    <br />
    <a href="https://mnd.dataportal.kr/">View Demo</a>
    ·
    <a href="https://github.com/TEAM-TROST/gaongill/issues">Report Bug</a>
    ·
    <a href="https://github.com/TEAM-TROST/gaongill/issues">Request Feature</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about)
  * [Summary](#summary)
  * [Main Features](#main-features)
  * [Expected Effects](#expected-effects)
  * [Built With](#built-With)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->
## About
[![gaongill Screen Shot](https://github.com/TEAM-TROST/gaongill/blob/master/_data/001.png?raw=true)](https://jupiterflow.com/project/9)

공공 신뢰 저하는 오랫동안 반복되어 온 이슈로서 2008년 세계 금융 위기 이후 현재까지도 OECD 국가들 내에서 주요 논의
주제로 주목받고 있습니다.  

국방부 발표에 대한 시민 신뢰를 조사한 ‘2018 범국민 안보의식 조사’에 따르면 ‘신뢰한다’는 응답은 전체의 32.4%에
그쳤습니다. 신뢰하지 않는 이유로는 ‘투명하게 공개하지 않아서’가 50.2%로 가장 많았습니다.  

이에 정부가 민-관 협력을 통해 국민이 진정으로 원하는 정책을 수립하고 이 과정을 투명하게 공개하는 등 청렴 정책을 더욱
잘 활용할 수 있도록 본 서비스를 개발하게 되었습니다.  

가온길은 정직하고 바른 가운데 길로 살아가라는 의미의 옛말입니다. 저희는 단어의 뜻처럼 정직하고 바른 세상을 만들기 위해
노력하고 있습니다.

### Summary
* 국방부 예하 기관의 입찰 결과, 병사 보급품의 종류, 단가를 투명하게 보여줍니다.
* 국방 관련 공약 진행 상황을 실시간으로 확인할 수 있습니다.
* 언론의 군사, 병무, 국가보훈, 국방, 안보, 군복지 관련 보도의 진위여부를 제공합니다.

### Main Features
* 보급품 예산 정보 제공
* 국방 뉴스 목록 제공
* 제 21대 국회의 국방 관련 공약 목록 제공
* 공약 세부정보 및 평가 기능 제공
* 군수품 예산 정보 제공

### Expected Effects
* '차별 없는 정보 제공', '투명한 정부 구현' 공익 실현
* '신뢰를 얻는 군' 형성
* 더불어 사는 공동체 문화 조성
* 정보 격차 문제를 해소해 국민 스스로 올바른 판단을 할 수 있는 기반 조성

### Built With
* Node.js
* Express.js
* OpenAPI
* MariaDB

<!-- CONTRIBUTING -->
## Contributing
* 진태양(영남이공대학교 컴퓨터정보과)
    * 백엔드 API 서버 구축
        * 공약·예산 정보 Fetch
        * 국방공약 평가 저장, 수정 삭제
        * 회원정보 등록, 수정, 삭제
    * 서비스 전체 QA 수행
    * 국방공약 평가 수행
* 이현정(영남이공대학교 컴퓨터정보과)
    * 페이지 전체 레이아웃 아이디어 제공
    * 홍보 방법(캐시포인트 지급제) 아이디어 제공
    * 이용약관, 개인정보처리방침 자료 수집
    * 서비스 전체 QA 수행
    * 국방공약 평가 수행
* 전현수(영남이공대학교 컴퓨터정보과)
    * 국방공약 자세히 보기 페이지 마크업
    * 종합평가 페이지 원형 그래프 추가
    * 국방공약 평가 수행
* 김지섭(영남이공대학교 컴퓨터정보과)
    * 인덱스 페이지 상단 그라데이션 + 애니메이션 마크업
    * 인덱스 페이지 Zoom-in 효과 마크업
    * 인덱스 페이지 레이아웃 구성
    * 회원 정보 페이지 마크업
    * 국방공약 평가 수행

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact
JIN TAEYANG - sun@jupiterflow.com

Project Link: [https://github.com/TEAM-TROST/gaongill](https://github.com/TEAM-TROST/gaongill)


<!-- Acknowledgements -->
## Acknowledgements
* 중앙선거관리위원회 선거공약정보 공공데이터
* 국방부 병사 보급기준 정보 공공데이터
* 군수품조달정보 코드조회 공공데이터
* 군수품조달정보 입찰결과(국내 경쟁입찰결과 목록, 국내 경쟁입찰결과 상세)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/TEAM-TROST/gaongill?style=flat-square
[contributors-url]: https://github.com/TEAM-TROST/gaongill/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/TEAM-TROST/gaongill?style=flat-square
[forks-url]: https://github.com/TEAM-TROST/gaongill/network/members

[stars-shield]: https://img.shields.io/github/stars/TEAM-TROST/gaongill?style=flat-square
[stars-url]: https://github.com/TEAM-TROST/gaongill/stargazers

[issues-shield]: https://img.shields.io/github/issues/TEAM-TROST/gaongill?style=flat-square
[issues-url]: https://github.com/TEAM-TROST/gaongill/issues

[license-shield]: https://img.shields.io/github/license/TEAM-TROST/gaongill?style=flat-square
[license-url]: https://github.com/TEAM-TROST/gaongill/blob/master/LICENSE