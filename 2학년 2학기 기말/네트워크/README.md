# 네트워크

<p align="center">
      <a href="https://github.com/tbvjaos510/DGSW-Exam#1%EC%9D%BC%EC%B0%A8">
            <img src="https://img.shields.io/badge/%EC%8B%9C%ED%97%98-1%EC%9D%BC%EC%B0%A8-brightgreen.svg?style=flat-square&longCache=true">
      </a>
</p>

### 시험범위

- 쌤이 준 종이.

### [수행평가 나오는 4가지](TEST.md)

### 학습지 무조건 보세요. 이건 참고용입니다.

## 1. INetAddress 클래스

#### INetAddress는 IP주소를 나타내는 클래스이다.

* `String getHostAddress()` : 호스트의 IP 주소를 String으로 반환한다.

* `String getHostNamae()` : 호스트의 이름을 가지고 온다. 만약 IP주소로 생성된 경우에는 `getCanonicalHostName()`를 호출해 도메인 서버에서 찾는데, 못찾으면 IP주소의 텍스트로 반환한다고 한다.

  > 다음 주소를 번역하였다.  - https://docs.oracle.com/javase/7/docs/api/java/net/InetAddress.html#getHostName()

* `String getCanonicalHostName()` : 도메인 서버(FQDN)에서 무조건 최상위 도메인을 찾는다. 실패시 IP주소 텍스트 반환

## 2. NIO

### 학습지 내용

* 채널 : 애플리케이션 간의 데이터 흐름을 나타냄.

  #### 주요 채널

  * `FileChannel` : 파일과 함께 동작 (이걸 제외한 다른 채널은 예제에 나온다.)

  * `DatagramChannel` : UDP 통신을 지원

  * `SocketChannel` : TCP 클라이언트와 함께 사용

  * `ServerSocketChannel` : TCP 서버와 함께 사용한다.

* 버퍼 : 데이터를 처리하기 위한 채널과 함께 동작.

* 셀렉터 : 다중 채널을 처리하기 위한 싱글 스레드를 허용하는 기술. (예제에선 사용하지 않으니 이것만 봐놓자.)

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

  * `warp()` : 입력된 배열을 사용하여 버퍼를 생성한다. 입력에 사용된 배열이 변경되면 wrap를 사용해서 생성한 `Buffer`도 변경된다.

  * `filp()` : `position`을 처음으로 옮긴다.

  * `hasRemaining()` : 아직 버퍼에 남은 데이터가 있는지 여부 (Boolean)

    >  `position` 과 `limit` 가 같으면 `false`, 아니면 `true` 반환  

* **채널** : `Buffer`에 있는 내용을 다른 어디론가 보내거나 다른 어딘가의 내용을 `Buffer`로 읽어들이기 위해 사용된다. 

  소켓 프로그래밍에서는 `ServerSocketChannel`, `SocketChannel`을 이용하여 소켓에 `ByteBuffer`를 전송시킨다.

## 클라이언트 / 서버

1. IP 주소와 함께 머신에 할당

2. 지정된 시간에 실행 가능

3. 클라이언트에서 요청을 수신할 때 포트 번호도 받음

4. **IP주소와 포트 번호의 조합에 의해 식별**

### 소켓

서버는 어플리케이션과 통신을 하기 위해 메시지를 송수신하는 데 있어서 특정한 소프트웨어를 사용하는데, 이를 소켓이라고 부름. 데이터그램 소켓, 스트림 소켓, 로우 소켓이 잇다.

* 스트림 소켓 : 두 개의 시스템이 연결된 다음 서로 데이터를 주고 받기 시작하여 주고 받기가 끝난 다음 연결을 끊게 되는 형식으로 **TCP**프로토콜에서 사용한다.

* 데이터그램 소켓 : 서로 연결되어 있지 않은 상태로 데이터를 주고 받는 형태로 서로 연결을 하거나 해제 과정이 없어 빠르기 때문에 **UDP**프로토콜에서 사용한다.

* 로우 소켓 : 사용자가 직접 패킷의 헤더등을 설정하여 조작하는 소켓이다. 신규 프로토콜을 설계할 때 유용하게 쓰임.

## TCP와 UDP의 차이점

| 특징     | TCP                  | UDP               |
| ------ | -------------------- | ----------------- |
| 연결형태   | 연결 지향형               | 비연결형              |
| 신뢰성    | 높음                   | 낮음                |
| 패킷의 순서 | 순서 보장                | 순서 잠재적 손실         |
| 데이터 경계 | 패킷 병합                | 패킷 분리             |
| 전송 시간  | UDP보다 느리다            | TCP보다 빠르다         |
| 오류 검사  | 예                    | 예. 복구는 못한다.       |
| 통지     | 예                    | 아니요               |
| 가중치    | 더 많은 지원이 요청되는 중량 가중치 | 지원이 덜 요청되는 경량 가중치 |
| 프로토콜   | HTTP, SMTP, FTP 등    | 스트리밍하는 DNS, VOIP  |

## 소켓 옵션 제어

### SocketChannel

* `SO_SNDBUF` : 소켓 전송 버퍼의 크기

* `SO_RCVBUF` : 소켓 수신 버퍼의 크기

* `SO_KEEPALIVE` : 접속을 계속 유지

* `SO_REUSEADDR` : 주소를 재사용

* `SO_LINGER` : 데이터가 존재하면 이 lingers를 close한다

* `TCP_NODELAY` : Nagle 알고리즘을 사용하지 않는다.

## HTTP 응답 상태 코드

* 1xx - 정보 메시지를 나타낸다.

* 2xx - 성공을 나타낸다.

* 3xx - 다른 URL로 클라이언트를 리디렉션한다.

* 4xx - 클라이언트 오류를 나타낸다.

* 5xx - 서버 오류를 나타낸다.

## URI, URL, URN

결론적으로 URL와 URN은 URI에 포함되어 있다.

* URI : 웹사이트나 인터넷 상의 파일과 같은 리소스의 이름을 식별한다. 리소스의 이름과 위치를 포함할 수도 있다.

* URL : 리소스가 위치한 장소와 검색하는 방법을 구별한다. (현재 마호돌 쌤의 위치)

* URN : 위치가 아닌 리소스를 식별한다. (마호돌 쌤)

  > URL은 현재 사용되고 있는 표준 체계인데, 마호돌 쌤의 정보를 얻고 싶으면 위치로부터 정보를 받아낸다.
  > 
  > 하지만 URN은 마호돌 쌤을 고유식별할 수 있는 정보를 추출하여 고유한 숫자로 정보를 받는다.
  > 
  > URL : `test.com?pos=320` - 마호돌 쌤의 정보은 320번째에 있다.
  > 
  > URN : `urn:isbn:41321234` - 마호돌 쌤의 고유 id 41321234로 접근

## IP 주소 범위

포함관계 - Global ( Site-local ( Link-local ) ) 

* Link-local : 인터넷에 연결되지 않은 싱글 로컬 서브넷 (localhost, 127.0.0.1 같은거?) 존재하는 라우터는 없다.

* Site-local : 주소가 글로벌 접두사를 요청하지 않을 때 사용 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 이다.)

  인터넷에 직접 도달할 수는 없다. (학교 내 IP로 보면 된다)

* Global : 인터넷에서 주소를 고유하게 사용한다. (모든 곳에서 연결이 되는 것)

## BufferedReader 클래스

`BufferedReader` 클래스는 문자 입력 스트림으로 부터 문자들을 읽어들이는데 사용하는 클래스이다.

* 생성자

  * `BufferedReader(Reader in)` : 입력 스트림에 대한 디폴트 크기의 내부 버퍼를 갖는 객체 생성

  그러면 콘솔에서 입력받는 예시를 보여주겠다.

  ```java
  BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
  // 콘솔에서 입력받음
  reader.readLine();
  ```

* 메소드

  Scanner에서 사용하던 메소드와 거의 비슷하다

  `readLine()` : 입력 스트림에서부터 한 줄을 읽어 온다.

## PrintWriter 클래스

`PrintWriter` 클래스는 기본 데이터 형이나 객체를 출력 스트림으로 전송합니다.

* 생성자 (이거 말고 다른 것도 많지만 생략)

  * `PrintWriter(OutputStream out, boolean autoFlush)` : 출력 스트림으로부터 PrintWriter을 생성합니다.

    `autoFlush`는 flush기능을 사용하는 유무인데, flush에 대해 간략히 설명하자면 데이터를 쓰면 모아뒀다가 한번에 같이 전송하는 기능이다.

* 메소드

  일반적으로 System.out과 똑같이 사용하면 된다.

  `println`, `printf`, `print` 등등..

## 코드 하나씩 해석해볼까?

* `URLConnection`

  ```java
  public static void main(String[] args) {
      try {
          // url을 google.com 으로 생성한다. 
          URL url = new URL("http://www.google.com");  
          // url에 접속하기 위해 URLConnection을 생성한다.
          URLConnection urlConnection = url.openConnection(); 
          // InputStreamReader을 이용하여 데이터를 받아온다.
          BufferedReader br = new BufferedReader(  
                  new InputStreamReader(urlConnection.getInputStream())); 
          String line; 
          // reader로 부터 한 라인씩 읽어서 출력한다.
          while ((line = br.readLine()) != null) {  
              System.out.println(line); 
          }
      } catch (IOException ex) {  
          ex.printStackTrace();  
      }  
  }
  ```

* 에코 서버

  ```java
  public static void main(String[] args) {
      System.out.println("Simple Echo Server");
      // ServerSocket으로 TCP 서버를 연다 (포트 6000번으로 염) 
      try (ServerSocket serverSocket = new ServerSocket(6000)) {  
          System.out.println("Waiting for Connection...");  
          // 클라이언트에 연결 요청이 들어올 때까지 대기하다가 수락한다
          Socket clientSocket = serverSocket.accept();  
          System.out.println("Connected to Client");
          // 1번 참고
        try (BufferedReader br = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));  
              PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {  
              String inputLine;  
              // 받은 데이터를 한줄식 받아서 출력한다.
              while ((inputLine = br.readLine()) != null) {  
                  System.out.println("Client request : " + inputLine);  
                  out.println(inputLine);
              }
          }                   
      } catch (IOException ex) {
          ex.printStackTrace();
      }
      System.out.println("Simple Echo Server Terminating"); 
  }
  ```

  1. 여기서 `try` 괄호 안에 코드를 넣었는데, 이는 `try{}` 중괄호 밖으로 벗어나면 자동으로 `*.close()`가 실행된다. 이를 **[try-with-resource](http://multifrontgarden.tistory.com/192)** 구문이라고 부르는데, 참고하자.

     또한 구문 안에 2개의 메소드를 넣었는데 하나씩 보자.
     * `BufferedReader br = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));`

       클라이언트로부터 오는 데이터 스트림을 `br`로 연결하는 것이다. (위에 BufferedReader설명 참고)

     * `PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);`

       클라이언트로 보내는 데이터 스트림을 `out`으로 설정하는 것이다. (위에 PrintWriter 설명 참고)

* 멀티캐스트 서버

  ```java
  public static void main(String[] args) {
      System.out.println("Multicast Time Client");
      // 멀티캐스트 소켓을 만드는데, 여기선 receive를 하므로 포트를 미리 적어줘야 한다.  
      try (MulticastSocket socket = new MulticastSocket(8888)) {
          // 서버 URL을 설정한다. 1번 참고
          InetAddress group = InetAddress.getByName("224.0.0.0");
          // 멀티캐스트 그룹에 가입한다.
          socket.joinGroup(group);  
          System.out.println("Multicast Group Joined");  
          byte[] buffer = new byte[256];  
          // receive할 데이터그램 패킷을 만드는데, UDP와 같다. (멀티캐스트도 UDP니깐 뭐)
          DatagramPacket packet = new DatagramPacket(buffer, buffer.length); 
          for (int i = 0; i < 5; i++) {  
              socket.receive(packet);  
              String received = new String(packet.getData());  
              // 공백 제거 출력
              System.out.println(received.trim()); 
          } 
      } catch (IOException ex) {
          ex.printStackTrace();
      }
  }
  ```

  1. 저기 있는 224.0.0.0은 IPv4의 D클래스 주소(`224.0.0.0~239.255.255.255`)이다. 이 값만 멀티캐스트가 된다

* IP주소 타입테스트

  ```java
  public static void testingForTheIPAddressType() {
      try {
          // InetAddress를 HostName을 통해 생성하였다. Inet4Address혹은 Inet6Address가 담긴다.
          InetAddress address = InetAddress.getByName("www.packtpub.com");
          // 주소를 byte배열로 리턴한다. 1번 참고
          byte buffer[] = address.getAddress();
  
          // IPv4와 IPv6를 확인하는 방법은 두 가지가 있다.
          // 첫 번째 방법
          // IPv4일 때는 buffer의 크기는 4일 것이다.
          if (buffer.length <= 4) {
              System.out.println("IPv4 Address");
          } else {
              System.out.println("IPv6 Address");
          }
  
          // 두 번째 방법
          // address가 Inet4Address의 인스턴스일 때. 2번 참고
          if (address instanceof Inet4Address) {
              System.out.println("IPv4 Address");
          } else {
              System.out.println("VPv6 Address");
          }
      } catch (UnknownHostException ex) {
          ex.printStackTrace();
      }
  }
  ```

  1. `getAddress()`는 `byte[]` 을 반환하는데 IPv4는 `*.*.*.*`형태니까 `byte[4]`를 리턴할 것이고 IPv6는 `*:*:*:*:*:*` 형태니까 `byte[6]`을 리턴할 것이다. 즉 아래서 `byte`배열의 length로 ip주소 형태를 알 수 있다.

  2. `A instanceof B`키워드는 A변수가 B타입으로 형변환이 가능한가를 묻는 것이다. (bool로 반환)

     참고로 `InetAddress`는 `Inet4Address`와 `Inet6Address` 의 부모 클래스이다. 즉 둘 다 담을 수 있다.

* 채널을 이용한 타임서버

  여기서는 `ServerSocket` 이 아닌 `ServerSocketChannel`을 이용한다. 채널을 이용하니 `Buffer`도 사용해야 한다.

  ```java
  public static void main(String[] args) {
      System.out.println("Time Server Started");
      try {
          // 서버 소켓 채널을 생성한다.
          ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
          // 서버 소켓을 5000번 포트로 연다.
          serverSocketChannel.socket().bind(new InetSocketAddress(5000));
          while (true) {
              System.out.println("Waiting for request...");
              // 연결을 수락한다.
              SocketChannel socketChannel = serverSocketChannel.accept();
              if (socketChannel != null) {
                  // 현재 시간을 얻는다.
                  String dateAndTimeMessage = "Date : " + new Date(System.currentTimeMillis());
                  // ByteBuffer를 64byte 할당
                  ByteBuffer buf = ByteBuffer.allocate(64);
                  // 데이터를 넣는다.
                  buf.put(dateAndTimeMessage.getBytes());
                  // position 초기화
                  buf.flip();
                  // 클라이언트로 전송을 한다.
                  while (buf.hasRemaining()) {
                      socketChannel.write(buf);
                  }
                  System.out.println("Sent : " + dateAndTimeMessage);
              }
          }
      } catch (IOException ex) {
          ex.printStackTrace();
      }
  }
  ```

* HelperMethod 클래스

  HelperMethod는 가변 길이의 데이터를 전송, 받는 메소드이다.

  ```java
  public class HelperMethods {
      // 가변 길이의 문자를 보내는 함수
      public static void sendMessage(SocketChannel socketChannel, String message) {
          try {
              // Buffer에 현재 문자열의 길이보다 1더 크게 할당한다. 
              ByteBuffer buffer = ByteBuffer.allocate(message.length() + 1);
              // 버퍼에 문자열을 넣는다.
              buffer.put(message.getBytes());
              // 문자열의 끝을 나타내는 0 (\0)을 넣는다.
              buffer.put((byte) 0x00);
              // 버퍼 Position 초기화
              buffer.flip();
              // socketChannel로 전송(send)함.
              while (buffer.hasRemaining()) {
                  socketChannel.write(buffer);
              }
              System.out.println("Sent: " + message);
          } catch (IOException ex) {
              ex.printStackTrace();
          }
      }
      // 가변 길이의 문자를 받는 함수
      public static String receiveMessage(SocketChannel socketChannel) {
          try {
              // byteBuffer을 16byte 할당한다.
              ByteBuffer byteBuffer = ByteBuffer.allocate(16);
              String message = "";
              // 16바이트씩 socketChannel로부터 읽는다
              while (socketChannel.read(byteBuffer) > 0) {
                  char byteRead = 0x00;
                  // Position 초기화
                  byteBuffer.flip();
                  // byteBuffer의 Position이 limit가 안될 때까지
                  while (byteBuffer.hasRemaining()) {
                      // 한 byte를 읽는다
                      byteRead = (char) byteBuffer.get();
                      // 그 바이트가 마지막 바이트 (\0)일 경우에
                      if (byteRead == 0x00) {
                          // 그만 읽음
                          break;
                      }
                  }
                  // while문이 2개로 감싸져 있기 때문에 여기서도 break 해줘야 한다.
                  if (byteRead == 0x00) {
                      break;
                  }
                  // 바이트 버퍼 초기화
                  byteBuffer.clear();
              }
              return message;
          } catch (IOException ex) {
              ex.printStackTrace();
          }
          return "";
      }
  }
  ```
