## TCP 소켓 사용

* TCP 소켓의 단계

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

  저 위의 예제들이 tcp에서 서버와 클라이언트의 기본이다. 저것만 이해하면 나머지들도 쉽게 이해할 수 있다.

## UDP 소켓 사용

UDP 는 비연결성 프로토콜이다. 연결하지 않고 패킷을 전달하는데, `DatagramSocket`이란 클래스를 사용한다.

* 서버

  서버의 단계는 전체적으로 3단계이다.

  1. `DatagramSocket`생성 : 생성 시, Listen할 포트를 지정해야한다. (여기까진 TCP와 같다.)

  2. `DatagramPacket`생성 : 받은 데이터를 저장해야 할 패킷을 생성해야 한다. (`ByteBuffer` 같은거)

  3. `datagramSocket.receive(datagramPacket)` 호출 : `receive`를 호출하면 받을 때 까지 대기한다.

     > 저기서 datagramSocket과 datagramPacket은 인스턴스이다. 즉 new로 할당된 값 

* 클라이언트

  클라이언트 단계도 3단계로 보면 된다.

  1. `DatagramSocket` 생성 : 생성 시, 패킷을 전송할 서버IP와 포트를 적어도 되고, 안적어도 된다.

     > 다만 학습지에 있는 예제에서는 적지 않았다.

  2. `DatagramPacket` 생성 : 생성자에서 인자값을 두 가지 방법으로 만들 수 있다.

     1. `DatagramSocket` 생성 시, 전송할 서버 IP와 포트를 적었을 때

        ```java
        new DatagramPacket(sendMessage, sendMessage.length);
        ```

     2. `DatagramSocket` 생성 시, 서버IP와 포트를 안 적었을 때 (더 깊게 봐놓자)

        ```java
        new DatagramPacket(sendMessage, sendMessage.length, serverInetAddr, serverPort);
        ```

  3. `datagramSocket.send(datagramPacket)` 호출 : 서버로 데이터를 전송한다.

     > 역시나 datagramSocket과 datagramPacket은 인스턴스이다.

  예제 코드를 보자.

* **서버**

  ```java
  public static void main(String[] args) {
      System.out.println("UDP Server Started");
      // UDP 서버 생성 (5000포트로 listen)
      try (DatagramSocket serverSocket = new DatagramSocket(5000)) {
          while (true) {
              // 받을 데이터를 저장할 byte 생성 
              byte[] receiveMessage = new byte[1024];
              // 받을 데이터를 저장할 패킷 생성
              DatagramPacket receivePacket = 
                             new DatagramPacket(receiveMessage, receiveMessage.length);
              // 클라이언트로 부터 수신대기. receivePacket에 클라이언트 데이터가 저장됨
              serverSocket.receive(receivePacket);
              // byte[]를 String형으로 변환
              String message = new String(receivePacket.getData());
              System.out.println("Receive from client: [" + message + "]");
              // 여기부터는 받은 곳으로 데이터를 다시 전송하는 것이다.
              // 받은 패킷의 주소를 저장한다.
              InetAddress inetAddress = receivePacket.getAddress();
              // 받은 패킷의 포트를 저장한다
              int port = receivePacket.getPort();
              // 보낼 메시지를 받은 메시지랑 같게 한다.
              byte[] sendMessage;
              sendMessage = message.getBytes();
              // 여기서는 serverSocket에 보낼 곳의 정보가 존재하지 않기 때문에 DatagramPacket에 적음.
              DatagramPacket sendPacket =
                             new DatagramPacket(sendMessage, sendMessage.length, inetAddress, port);
              // 패킷을 패킷에 적힌 주소로 전달
              serverSocket.send(sendPacket);
          }
      }
  }
  ```

* **클라이언트**

  ```java
  public static void main(String[] args) {
      System.out.println("UDP Client Started");
      // 스캐너 사용
      Scanner scanner = new Scanner(System.in);
      // 클라이언트 소켓은 생성자의 인자값이 없이 생성함.
      try (DatagramSocket clientSocket = new DatagramSocket()) {
          // 보낼 주소를 적음. 한 컴퓨터에서 돌릴 거니까 localhost로.
          InetAddress inetAddress = InetAddress.getByName("localhost");
          byte[] sendMessage;
          while (true) {
              System.out.print("Enter a message : ");
              // 사용자의 입력을 받음.
              String message = scanner.nextLine();
              // byte[] 로 변환함
              sendMessage = message.getBytes();
              // DatagramPacket 생성
              DatagramPacket sendPacket = new DatagramPacket(
                  sendMessage, sendMessage.length, inetAddress, 5000);
              // 서버로 패킷을 전송한다.
              clientSocket.send(sendPacket);
              // 받을 패킷을 생성한다.
              byte[] receiveMessage = new byte[1024];
              DatagramPacket receivePacket = new DatagramPacket(
                  receiveMessage, receiveMessage.length);
              // 서버로부터 데이터를 받는다. 1번 참고.
              clientSocket.receive(receivePacket);
              String receivedSentence = new String(receivePacket.getData());
              System.out.println("Received from server [" + receivedSentence + "]");
              System.out.println("From " + receivePacket.getSocketAddress());
          }
      }
  }
  ```

  1. 여기서 보면 `clientSocket`은 포트를 설정하지 않았지만 서버로부터 `receive()`를 수행한다. 이게 가능한 이유가 서버에서 `getPort()`를 했을 때 값은 41032(다를 수 있다) 대충 이런 클라이언트 패킷에서 보낸 임시 포트가 나오는데, 이 임시 포트는 클라이언트에서 `DatagramSocket clientSocket = new DatagramSocket()` 할 때 자동으로 생성이 된다.그리고 `receive`를 호출하면 해당 임시 포트를 이용해  receive를 한다. - [참고 자료](https://stackoverflow.com/a/29337540)

## UDP 멀티캐스팅

멀티캐스팅은 동일한 시간에 다수의 클라이언트에 메시지를 전송하는 프로세스다.

그래서 멀티캐스트에 참여를 해야 하는데, 기존 IPv4 클래스 D공간과 224.0.0.0~239.255.255.255의 주소를 사용한다.

> 교과서엔 위처럼 나와 있는데 IPv4 D클래스가 224.0.0.0~239.255.255.255다. 그냥 IPv4 D클래스만 사용한다고 보자.

사실 멀티캐스트에는 서버, 클라이언트의 개념이 애매하다. 걍 모두가 방에 접속해서 send, receive하여서 데이터를 주고받는다. 여기서는 보내는 역할이 서버, 받는 역할이 클라이언트로 보는거 같다.

* 서버

  ```java
  public static void main(String[] args) {
      System.out.println("UDP Multicasts Server Started");
      try {
          // 멀티캐스트 소켓을 생성한다.
          MulticastSocket multicastSocket = new MulticastSocket();
          // 연결할 멀티캐스트 방의 주소 생성
          InetAddress inetAddress = InetAddress.getByName("228.5.6.7");
          // 방에 참여
          multicastSocket.joinGroup(inetAddress);
          // 데이터를 전송한다. DatagramPacket이라서 UDP와 같다.
          byte[] data;
          DatagramPacket packet;
          while (true) { // 1초마다 데이터를 전송한다.
              Thread.sleep(1000); // 1초 대기
              String message = "Hello!";
              System.out.println("Send : " + message);
              data = message.getBytes();
              // 패킷을 만든다. 기존 UDP와 크게 다른게 없다.
              packet = new DatagramPacket(data, message.length(),
                  inetAddress, 5000);
              // 전송
              multicastSocket.send(packet);
          }
      } catch (IOException | InterruptedException ex) {
         e.printStackTrace();
      }
  }
  ```

* 클라이언트

  ```java
  public static void main(String[] args) {
      System.out.println("UDP Multicast Client Started");
      try {
          // 포트를 지정한 상태로 소켓 생성
          MulticastSocket multicastSocket = new MulticastSocket(5000);
          // 역시나 클라이언트도 방에 참여한다.
          InetAddress inetAddress = InetAddress.getByName("228.5.6.7");
          multicastSocket.joinGroup(inetAddress);
  
          // 받을 패킷을 생성
          byte[] data = new byte[256];
          DatagramPacket packet = new DatagramPacket(data, data.length);
  
          while(true) {
              // 멀티캐스트 서버에서 패킷을 수신한다.
              multicastSocket.receive(packet);
              // String 생성자의 인자값이 3개인데, (bytes, offset, length) 이다.
              // 즉 문자열의 0부터 packet의 길이만큼 패킷의 데이터를 가지고 온다는 것이다. 1번 참고
              String message = new String(packet.getData(), 0, packet.getLength());
              System.out.println("Message from: " + packet.getAddress()
                      + " Message: ["+ message + "]");
          }
  
      } catch (IOException ex) {
          ex.printStackTrace();
      }
  }
  ```

  1. 그냥`new String(packet.getData())` 해도 같은 결과가 나온다. 왜 쓴지는 모르겠다.

## 비동기 소켓

비동기 통신은 요청을 하고 그 요청이 완료될 때까지 대기하지 않고 다른 작업을 진항해는 것이다.

이를 **논블로킹**(non-blocking)이라고 부른다.

* `Future` 인터페이스 : 보류 결과를 나타내는 인터페이스인데, 실행 중이고 블록 중이 아닌  실행 상황을 저장한다.

  제네릭을 사용하는게 일반적인데 제네릭 안에는 반환하는 값을 넣는다, `Future`은 값을 반환하는데 몇 초가 걸리는 작업들에 대해 나타내기 때문이다. 하지만 소켓에서는 리턴 값이 필요없는 작업들이 있기 때문이 제네릭을 안쓰기도 한다.

  > javascript를 어느 정도 아는 사람은 Promise 개념과 같다라고 알면 된다.

  Future은 즉시 리턴이 되며 아래 방법으로 값을 가지고 올 수 있다. (밑에 방법이 더 있다.)

  ```java
  Future<Integer> future = sometask;
  System.out.println("작업 진행 중");
  System.out.println("결과 : " + future.get());
  ```

  출력 결과는

  ```java
  작업 진행 중
  결과 : 4 (그냥 값)
  ```

  이렇게 나오는데, 일단 중요 메소드부터 살펴보자

  * `future.get()` : 메소드에서 값을 리턴할 때까지 대기(블록킹)한다. 그러고 값을 리턴한다.

    * `future.get(long timeout, TimeUnit unit)` : 대기하지만 설정해놓은 시간이 지나면 `TimeoutException`이 발생한다. 

  * `future.isDone()` : 메소드에서 값이 리턴됐으면 `true`반환, 아니면 `false`반환

    그래서 보통 값을 불러오는 방법이 3가지가 있다.

    ```java
    // 1
    int result = future.get();
    // 2
    while (!future.isDone());
    int result = future.get(); // 값을 리턴할 필요가 없으면 안 쓰면 된다.
    // 3
    try {
        int result = future.get(10, TimeUnit.SECONDS);
    } catch (TimeoutException ex) {
        System.out.println("타임아웃");
    }
    ```

* 그러면 비동기 서버와 클라이언트를 보자. (TCP다)

  TCP와 비슷한 부분도 꽤 많다. 

  **서버**

  ```java
  
  public static void main(String[] args) {
  
      // 서버를 연다 (이름이 드럽게 길다)
      try (AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open()) {
          // 연결할 서버 IP
          InetSocketAddress hostAddress = new InetSocketAddress("localhost", 5000);
          serverChannel.bind(hostAddress); // bind 한다.
          System.out.println("Waiting for client to connect...");
          // Future을 리턴하는데, 이는 대기하지 않고 바로 다음을 실행한다
          Future acceptResult = serverChannel.accept();
          System.out.println("Waiting Accept...");
          // 하지만 여기서 .get()을 호출했으므로 여기서 대기하게 된다.
          try (AsynchronousSocketChannel clientChannel = (AsynchronousSocketChannel)acceptResult.get())
          {
              System.out.println("Messages from cilent: ");
              // clientChanel이 null이 아니거나 열리지 않았을 때 1번 참고
              while ((clientChannel != null) && (clientChannel.isOpen())) {
                  ByteBuffer buffer = ByteBuffer.allocate(32);
                  // AsynchronousServerSocketChannl의 거의 모든 소켓 메소드는 Future로 반환한다.
                  Future result = clientChannel.read(buffer);
                  // Timeout 10초 설정 2번 참고
                  result.get(10, TimeUnit.SECONDS);
                  // Position을 초기화 시킨다. 3번 참고
                  buffer.flip();
                  // 역시나 3번 참고
                  String message = new String(buffer.array()).trim();
                  System.out.println(message);
                  if (message.equals("quit")) {
                      break;
                  }
              }
          }            
      } catch (IOException | InterruptedException | ExecutionException | TimeoutException ex) {
          ex.printStackTrace();
      }
  }
  ```

  1. 여기서 while문을 쓰는 이유는 `acceptResult.get` 에서 `accept` 오류가 발생한 경우를 체크하기 위한 것이다.

  2. 저 `result.get()`은 위에서 본 Future 값을 불러오는 방법 3가지가 전부 가능하다.

  3. 여기서 `buffer.flip()` 이 의미가 없다. `buffer.array()`는 현재 Position을 무시하고 모든 값을 받아온다.

     [여기](https://code.i-harness.com/ko-kr/q/a5d82) 참고

  **클라이언트**

  ```java
  public static void main(String[] args) {
      // client 생성
      try (AsynchronousSocketChannel client = AsynchronousSocketChannel.open()) {
          InetSocketAddress hostAddress = new InetSocketAddress("localhost", 5000);
          // 서버에 연결 (Future 반환)
          Future future = client.connect(hostAddress);
          // 여기서 연결을 기다린다.
          future.get();
          System.out.println("Client is started: " + client.isOpen());
          System.out.println("Sending message to server: ");
          Scanner scanner = new Scanner(System.in);
          String message;
          while(true) {
              System.out.print("> ");
              message = scanner.nextLine();
              // warp 메소드는 위에 Buffer 메소드 설명에 있다. message의 바이트로 버퍼 생성
              ByteBuffer buffer = ByteBuffer.wrap(message.getBytes());
              // write한다. (Future) 반환
              Future result = client.write(buffer);
              // 대기. 역시나 3방법 전부 가능
              while (!result.isDone()) {
              }
  
              if (message.equalsIgnoreCase("quit")) {
                  scanner.close();
                  break;
              }
          }
      } catch (IOException | InterruptedException | ExecutionException ex) {
          ex.printStackTrace();
      }
  }
  ```
