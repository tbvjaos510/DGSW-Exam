# 네트워크

<p align="center">
      <a href="https://github.com/tbvjaos510/DGSW-Exam#1%EC%9D%BC%EC%B0%A8">
            <img src="https://img.shields.io/badge/%EC%8B%9C%ED%97%98-1%EC%9D%BC%EC%B0%A8-brightgreen.svg?style=flat-square&longCache=true">
      </a>
</p>

### 시험범위

- 학습자료 1 ~ 26?? 진도 더나가는중

- 59p ~ 218p??

## 1. 학습자료 1 - INetAddress 클래스

#### INetAddress는 IP주소를 나타내는 클래스이다.

| 반환자료형                  | 메소드                    | 설명                             | 예시 (상세설명)                                                                      |
| ---------------------- | ---------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `byte[]`               | `getAddress()`         | IP주소를 byte배열로 반환               | `[83, -90, -87, -25]` (signed로 반환)                                             |
| `static InetAddress[]` | `getAllByName()`       | 도메인명에 지정된 모든 호스트의 IP주소를 배열로 반환 | `www.naver.com, getHostAddress()`\[125.209.222.242, 210.89.164.90 \]           |
| `static InetAddress`   | `getByAddress(byte[])` | byte배열을 통해 IP주소를 얻음            | `getByAddress(new byte[] {83, -90, -87, -25})`                                 |
| `static InetAddress`   | `getByName(String)`    | 도메인 명을 통해 IP주소를 얻음             | getByName("www.naver.com")                                                     |
| `String`               | `getHostAddress()`     | 호스트의 IP주소를 반환                  | 83.166.169.231                                                                 |
| `String`               | `getHostName()`        | 호스트의 이름을 반환                    | 도메인을 알 수있으면 도메인, 모르면 IP주소를 반환 (getByName이나 getAllByName으로 생성해야지만 도메인을 알 수 있음.) |
| `static InetAddress`   | `getLocalHost()`       | LocalHost의 IP주소 반환             | DESKTOP-RSTHVDI/10.80.162.54                                                   |
| `boolean`              | `isLoopbackAddress()`  | loopback주소인지 확인                | loopback=127.0.0.1                                                             |
| `boolean`              | `isMulticastAddress()` | 멀티캐스트 주소인지 확인                  | 아래에서 확인                                                                        |

> 멀티캐스트 주소란?
> 
> 멀티캐스트 그룹에 참여하는 구성원을 확인하기 위한 주소. 주소범위는 224.0.0.5 ~ 239.255.255.255
> 
> 예약된 주소이다.

## 2. 학습자료 2 - NetworkInterface 클래스

#### NetworkInterface 클래스는 네트워크에서 노드로 작동하는 디바이스에 접속하는 수단을 제공한다.

무선 LAN 또는 블루투스 연결을 위한 무선 같은 것들을 가지고 있다.

| 반환자료형                                  | 메소드                     | 설명                                       | 예시                                                        |
| -------------------------------------- | ----------------------- | ---------------------------------------- | --------------------------------------------------------- |
| `static Enumeration<NetworkInterface>` | `getNeworkInterfaces()` | 시스템 내 존재하는 모든 네트워크 디바이스의 리스트를 얻음         | ip, 기기 이름 전부 나온다.                                         |
| `static NetworkInterface`              | `getByName(String)`     | 주어진 interfaceName으로 특정 네트워크 디바이스의 객체를 얻음 | `("lo").getDisplayName()` "Software Loopback Interface 1" |
| `string`                               | `getDisplayName()`      | 네트워크 디바이스의 이름을 얻음                        | 위 예시 참고                                                   |
| `string`                               | `getName()`             |                                          |                                                           |
