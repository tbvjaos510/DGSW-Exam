# PHP

## 시험범위

1. [클래스룸](https://classroom.google.com/u/0/c/MTE3MjYwNDcxNzda) PPT 1, 2, 3

### PHP1

- PHP의 변수는 `$`기호로 시작하고 변수명은 문자, 숫자, \_(언더바)로만 사용이 가능하다.

  > 첫 문자는 반드시 문자로 시작

  예시)

  ```php
  $hello = "hello"; // (O)
  $my_value = 4; // (O)
  $Tt = false; // (O)
  $5d // (X)
  my_val = 4; // (X)
  ```

- `echo`와 `print`의 차이

  **echo는 인자값으로 사용될 수 없고 print는 인자값으로 사용할 수 있다.**

  왜나하면 `echo`는 함수가 아니기 때문이다.

  하지만 echo가 속도가 조금 더 빠르다고 한다.

  ```php
  echo "hello"; // (O)
  print "hello"; // (O)

  $my_value == 4 ? print "true" : print "false"; // (O) print는 인자값으로 사용이 가능
  $my_value == 4 ? echo "true" : echo "false"; // (X) echo는 인자값으로 사용이 불가능
  // 윗 줄을 수정하면?
  echo $my_value == 4 ? "true" : "false"; // (O)
  ```

- php 시작 태그 및 주석

  ```php
  <?php // php 시작 태그
  // 한 줄 주석
  /*
  여러 줄 주석
  */
  ?> // 종료태그
  ```

- 상수(const) 사용 - 기본 PHP 상수들

  1. `PHP_VERSION` : PHP 버전

  2. `PHP_OS` : PHP가 실행중인 OS 설명 함수

  3. `__LINE__` : 처리 중에 있는 파일의 현재 줄 번호

  4. `__FILE__` : 처리 중에 있는 파일의 전체 경로와 이름

  5. `__DIR__` : 처리 중에 있는 파일의 디렉토리

  6. `__FUNCTION__` : 함수명

  7. `__CLASS__` : 클래스명

  8. `__TRAIT__` : 트레이트 명

     > 트레이트란?
     >
     > PHP에서는 하나의 클래스만 상속이 가능하고 인터페이스를 사용할 시 모든 자식 클래스들을 구현해줘야 한다는 문제점이 있다. 이를 위해 trait가 생겼는데, trait는 JAVA의 abstract와 비슷하다, 미리 몇몇 메소드들을 구현해놓고 가져다 쓰는 것이다.
     >
     > ```php
     > trait Validation {
     >     public function validate() {
     >         $rules = $this->getRules();
     >         return $this->checkValidate($rules);
     >     }
     > }
     > ```
     >
     > 위에서 특징은 `getRules()` 메소드와 `checkValidate($rules)` 메소드가 존재하지 않지만 사용할 수 있다는 점이다. 하지만 트레이트를 사용할 때에는 무조건 구현해 줘야 한다.
     >
     > ```php
     > class Post {
     >     use Validation; // 트레이트 사용
     >     protected checkValidate($rules) {
     >         ...
     >         return true;
     >     }
     >     protected getRules() {
     >         $rules = "";
     >         ...
     >         return $rules;
     >     }
     > }
     > ```
     >
     > 더 복잡하게 설명하기에는 시험에 안나올거 같으니 여기까지만 알고 건너뛰도록 하자.

  9. `__METHOD__` : 클래스의 메소드명

  10. `__NAMESPACE__` : 현재 네임스페이스 이름

      > php에서 namespace는 자바의 package처럼 위에서 적어주면 된다.
      >
      > ```php
      > <?php
      > namespace ViewModel;
      > class ...
      > ?>
      > ```

- 폼 값 보내기 (html)

  ```html
  <form name="form1" method="post" action="a.php">
    <!-- a.php에 post방식으로 보내겠다. -->
    이름 : <input type="text" name="userName" /><br />
    <!-- 폼값을 받을 때의 key값은 name 속성의 값으로 정해진다. -->
    <input type="submit" value="전송" />
  </form>
  ```

- 폼 값 받기 (php)

  - `$_GET` : GET메소드로 송신된 데이터를 받는 변수. (key와 value로 이루어짐)

  - `$_POST` : POST메소드로 송신된 데이터를 받는 변수 (key와 value로 이루어짐)

  - `$_REQUEST` : 위에 꺼 둘다 받을 수 있는 변수 (key와 value로 이루어짐)

  사용 예)

  ```php
  <?php
  // 아래 둘 다 가능
  $name = $_POST['userName']."님 반갑습니다!"; // .은 문자열을 합치는 문법이다. java의 + 개념
  $name = $_REQUEST['userName']."님 반갑습니다!";
  print $name;
  ?>
  ```

### PHP 2

- GET 메소드는 아래와 같은 형식으로 URL에 적혀서 보내짐

  `URL?key=value&key=value`

  예를들어 `www.naver.com?type=submit&hello=4`를 url에 적었을 때 네이버에서는

  ```php
  $type = $_GET['type']; // submit
  $hello = $_REQUEST['hello']; // 4 - 물론 $_GET도 된다.
  ```

  로 받을 수 있다.

- 멀티라인 텍스트 전송

  php에서 textarea의 데이터를 전송 받을 때 `hello\nworld`이런 형식으로 개행이 된다. 하지만 textarea는 `\n`을 인식하지 못하기 때문에 `\n`을 `<br>` 로 변환해 줘야 하는데, `nl2br(str)`을 사용하면 된다.

  ```php
  echo "MEMO :".nl2br($_POST["nemo"]);
  ```

- 히튼타입 데이터 전송

  ```html
  <input type="hidden" name="userId" value="hiddenvalue" />
  ```

  를 이용해 사용자에게 보이지 않는 폼 값을 추가할 수 있다.

  물론 받아올 때는 똑같이

  ```php
  $userId = $_REQUEST["userId"]; // 혹은 $_GET이나 $_POST
  ```

  이렇게 하면 받아와진다.

- `isset` 함수

  `isset(var)` 함수는 인수로 지정한 변수의 값이 설정(선언?)되었는지 `boolean` 값을 반환한다.

### PHP 3

- 폼 유효성 검사

  - `string trim(str)` : 공백 제거 (리턴 값을 받아야 한다)

  - `string stripslashes(str)` : 역슬래시 제거 (리턴 값을 받아야 한다)

  - `string htmlspecialchars(str)` : html 태그 무효화 (리턴 값을 받아야 한다)

  ```php
  function data_check($data) {
      $data = trim($data); // 공백 제거
      $data = stripslashes($data); // 역슬래시 제거
      $data - htmlspacialchars($data); // html 태그 무효화
      return $data;
  }
  ```

- 이메일 유효성 검사

  - `filter_var(str, option)` : 데이터 유효성 검사.

  - 옵션들

    - `FILTER_VALIDATE_EMAIL` : 이메일이 유효한지 검사.

    - `FILTER_VALIDATE_URL` : URL이 유효한지 검사.

    ```php
    if (filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)) {
        // 이메일이 유효할 때
    }
    if (!filter_var($_REQUEST['url'], FILTER_VALIDATE_URL)) {
        // URL이 유효하지 않을 때
    }
    ```
