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

> 멀티캐스트 주소란??
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

현재 작업안하는 중이다. 너무많아서 정리가 힘들다.

아래부터 보자.

## 중요 클래스 메소드들

### 채널과 버퍼

* **버퍼** (`Buffer`) : jdk1.3 부터 자바 IO의 한계를 보완한 자바 NIO (non-blocking IO)중 하나이다.

  >  버퍼에는 `ByteBuffer`, `CharBuffer`, `IntBuffer` 등등 여러 종류가 있다. 우리는 `ByteBuffer`만 사용한다.

  `Buffer`에는 위치를 나타내는 포인터가 네가지가 있다.

  * `position()` : 현재 읽을 위치나 쓸 위치를 가리킨다. `get()` 함수로 읽기를 시도할 경우 `position` 위치부터 읽기 시작하며 `put()` 함수로 쓰기를 시도할 경우 `position` 위치부터 쓰기 시작한다.

  * `limit()` : 현재 `Buffer`의 유효한 쓰기 위치나 유효한 읽기 위치를 나타낸다.

    "이 버퍼는 여기까지 읽을 수 있다." 혹은 "이 버퍼는 여기까지 쓸 수 있다"를 나타낸다.

  * `capacity()` : `Buffer`의 용량을 나타낸다. 항상 `Buffer`의 맨 마지막을 가리키고 있다.

    > `limit`와 `capacity`의 차이는?
    > 
    > 쓰기모드에서 `limit`와 `capacity`의 값은 같다.
    > 
    > 하지만 읽기 모드에서는 `limit`는 읽을 수 있는 데이터의 양을 의미하고
    > 
    > `capacity`는  버퍼 자체의 크기를 의미한다. (배열을 생각해보자)
    > 
    > ```java
    > String str[] = new String[5];
    > str[0] = "aaa";
    > str[1] = "bbb";
    > ```
    > 
    > 이 때, 배열의 총 크기는 5 (capacity)이지만 실제 데이터의 양은 2 (limit)이다.
    > 
    > 물론 배열와 버퍼의 의미는 많이 다르지만 `limit`와 `capacity`의 의미는 이렇게 생각해놓으면 될 것 같다.
    > 
    > [참고한 사이트](https://stackoverflow.com/questions/23148729/what-is-the-difference-between-limit-and-capacity-in-bytebuffer) (여기서 그림만 대충 보자)

  * `mark()` : 사용자가 따로 저장하는 위치이다. (mark 그대로 해석) 미리 저장해 뒀다가 `reset()` 호출 시 `mark()` 해뒀던 포인터로 돌아간다. (뒤에 UDP 채널 멀티캐스트 서버에서 나온다.)

  위의 포인터들은 다음과 같은 규칙을 가진다

  `0 <= mark <= position <= limit <= capacity`

  다음은 `Buffer`의 메소드를 보자.

  * `get()` : 데이터만 가지고 온다. `position`을 감소시킨다.

    `ByteBuffer`일 경우 `byte`하나만 반환, `IntBuffer`일 경우 `int` 하나만 반환. 

    `get()`은 오버로딩 되어서 여러개 들고올 수도 있고 특정 인덱스만 들고올 수 있다.

  * `put()` : 데이터를 추가한다. `array`도 되고 `byte` 하나도 된다. `position`을 추가된 값 뒤로 변경한다.

  * `filp()` : `position`을 처음으로 옮긴다.

  * `hasRemaining()` : 아직 버퍼에 남은 데이터가 있는지 여부 (Boolean)

    >  `position` 과 `limit` 가 같으면 `false`, 아니면 `true` 반환  

* **채널** : `Buffer`에 있는 내용을 다른 어디론가 보내거나 다른 어딘가의 내용을 `Buffer`로 읽어들이기 위해 사용된다. 

  소켓 프로그래밍에서는 `ServerSocketChannel`, `SocketChannel`을 이용하여 소켓에 `ByteBuffer`를 전송시킨다.

### 소켓 사용

* 소켓의 단계

  ![socket](./img/socketlevel.jpg)

* 소켓의 사용

  서버에서는 `ServerSocketChannel`로 서버를 열고 클라이언트에서는 `SocketChannel`로 서버에 연결한다.

  대신 서버에서도 클라이언트와 통신하기 위해서는 `SocketChannel`을 사용한다.

  ##### 서버

  ```java
  public static void main(String[] args) {
      try {
          // 서버 소켓 생성
          ServerSocketChannel serverSocketChannel = 
                              ServerSocketChannel.open();
          // 5000번 포트를 사용 (bind)
          serverSocketChannel.socket().bind(new InetSocketAddress(5000)); 
          // 클라이언트 요청을 받아서 클라이언트 연결 정보를 담은 SocketChannel 반환
          SocketChannel socketChannel = serverSocketChannel.accept(); // 받을 때 까지 대기한다.
          System.out.println("클라이언트 연결됨!");
          // 보낼 데이터 생성
          String message = "Hello World!";        
          // 보낼 데이터를 담는 ByteBuffer 생성 및 할당
          ByteBuffer buffer = ByteBuffer.allocate(64); // 이 64가 capacity이다.
          // buffer에 데이터를 넣는다.
          buffer.put(message.getBytes());
          // buffer의 position을 초기화한다.
          buffer.flip();
          // 클라이언트로 전송함
          while (buffer.hasRemaining()) {
              socketChannel.write(buffer);
          }
      } catch (IOException ex) {
          ex.printStackTrace();
      }
  }
  ```

  ##### 클라이언트 (몇몇 주석은 생략)

  ```java
  public static void main(String[] args) {
      // 주소를 127.0.0.1(LoopBack, 로컬), 포트 5000으로 설정
      SocketAddress address = new InetSocketAddress("127.0.0.1", 5000);
      // 서버에 연결을 한다. 약 1초간 시도 후 연결이 안되면 exception 발생. 아래 1번 참고
      try(SocketChannel socketChannel = SocketChannel.open(address)) {
          System.out.println("서버에 연결하였습니다.");
          ByteBuffer byteBuffer = ByteBuffer.allocate(64);
          String message = "";
          // 소켓 채널에서부터 값을 받아 byteBuffer에 저장한다. 
          socketChannel.read(byteBuffer);
          // 현재 byteBuffer의 position은 값이 들어가서 limit까지 찼을 것이다. 처음으로 옮긴다. 
          byteBuffer.flip();
          while (byteBuffer.hasRemaining()) {
              // message에 byteBuffer로부터 받은 byte하나를 char형으로 변환해서 추가함 
              message += (char) byteBuffer.get();
          } // 이를 byteBuffer에 값이 없을 때 까지 하나씩 전부 옮김
          System.out.println("서버로부터 받은 값 : " + message);
      } catch (IOException ex) {
          ex.printStackTrace();
      }
  }
  ```

  1. 여기서 `try` 괄호 안에 코드를 넣었는데,  이는 `try{}` 중괄호 밖으로 벗어나면 자동으로 `socketChannel.close()`가 실행된다. 이를 **[try-with-resource](http://multifrontgarden.tistory.com/192)** 구문이라고 부르는데, 참고하자. 

  저 위의 예제들이 서버와 클라이언트의 기본 코드이다. 저것만 이해하면 나머지들도 쉽게 찾을 수 있다.
