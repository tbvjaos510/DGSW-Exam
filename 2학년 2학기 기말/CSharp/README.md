# C\#

## 시험범위

* 186p ~ 연습문제 위주로

* 연습문제 위치

  * 246~247 - Chapter 05 클래스의 기본

  * 312~314 - Chapter 06 메서드

  * 373~376 - Chapter 07 상속과 다형성 

  * 402 - Chapter 08 클래스 심화

  * 444 - Chapter 09 인터페이스

  * 476 - Chapter 10 예외 처리 

  * 506 - Chapter 11 델리게이트와 람다 

  * 527~529 - Chapter 12 LinQ

  * ~~프로젝트~~ - 안나온다

## Chapter 05 - 클래스의 기본

### 연습문제 정답

| 문제 번호 | 정답                              | 해석                                         |
| ----- | ------------------------------- | ------------------------------------------ |
| 01    | 1: List - 클래스, list - 인스턴스      | int도 클래스지만 자잘하게 보지 말자 **인스턴스는 new를 해야된다.** |
| 02    | 3                               | 메소드 안에서 클래스를 선언할 수 없다                      |
| 03    | `class Book{ string name; ...}` | 클래스 선언 방식을 원하는거 같다.                        |
| 04    | `new Ramdom().Next()` 메소드       | Next메소드는 3개가 있다. 194p 참고                   |
| 05    | 직접 해보자                          | 안해도 될 것 같다.                                |

## Chapter 06 - 메서드

| 문제 번호 | 정답                         | 해석                                        |
| ----- | -------------------------- | ----------------------------------------- |
| 01    | 4                          | 3. 인스턴스는 new를 할 때 생성된다. 4. 미리 정의되 클래스가 존재 |
| 02    | 4                          | 반환형은 매개변수가 다를 때 달라도 된다. 즉 4번만 답.          |
| 03    | 같은 이름을 가진 메소드의 매개변수가 다른 것. | 반환형이 다를 수 있으니                             |
| 04    | 10, 40                     | 만약 INT_MAX를 넘을 때는 long이 실행이 된다.           |
| 05    | 직접 해보자.                    | 할 필요가 없어 보인다.                             |
| 06    | 오버로딩 오류                    | 오버로딩을 할 때는 매개변수가 달라야 하지만, 중복되는 매개변수가 있다.  |
| 07    | A 생성자, B생성자, B 소멸자, A 소멸자  | 태어나는건 부모부터, 죽는건 자식부터                      |

## Chapter 07 - 상속과 다형성

| 문제 번호 | 정답                               | 해석                                                                    |
| ----- | -------------------------------- | --------------------------------------------------------------------- |
| 01    | 부모 B, 자식 A                       | 코드에서 A가 B를 상속받는다                                                      |
| 02    | 오버로딩은 같은 메소드 이름에 다른 매개변수를 받는 것이고 | 오버라이딩은 자식이 부모의 메소드를 재정의 하는 것이다.                                       |
| 03    | 1                                | as키워드는 `exp is type ? (type)exp : (type)null` 와 같다.                   |
| 04    | 2 -> 1 -> 3                      | `private`은 해당 클래스 내에서, `protected`는 상속받은 클래스 내, `public`은  모든 곳에서 된다. |
| 05    | 20                               | 하이딩 문제이다. 아래 참고                                                       |
| 06    | `((Parent)child).question`       | 하이딩 문제.                                                               |
| 07    | 20                               | 부모는 볼 필요가 없다. 캐스팅 하지않고 자식만을 사용한다.                                     |
| 08    | 20                               | 위랑 같다. 그래도 명시적으로 부모를 하이딩 하였다.                                         |
| 09    | 20                               | 위랑 같다. 부모는 virtual하였지만 자식이 하이딩 하였다.                                   |
| 10    | 20                               | 위랑 같다. 오버로딩 하였지만 자식만을 사용한다.                                           |
| 11    | O,O,O,O,X,X,X                    | 6번은 ~~오버로딩~~, 오버라이딩이 안됨.                                              |
| 12    | 2                                | 부모에 자식은 못담는다. 대신 자식에는 부모를 담을 수 있음.                                    |

#### 섀도잉와 하이딩

> 개념이 매우 중요해서 따로 적는다.

* **섀도잉**

  C언어 기반의 프로그래밍 언어의 대부분은 이름이 겹칠 대 자신과 가장 가까운 변수를 사용한다.

  ```csharp
  class Program
  {
      public static int number = 10;
      static void Main(string[] args)
      {
          int number = 20;
          Cnosole.WriteLine(number); // 20
      }
  }
  ```

  여기서 결과는 `20`이 나온다. 이유는 `int number = 20`이 가장 가까운 위치에 있기 때문이다.

  이를 **섀도잉(shadowing)**이라고 부른다.

* **하이딩**

  하이딩은 부모 클래스와 자식 클래스에서 일어나는 겹침이다.

  ```csharp
  class Parent
  {
      public int variable = 273;
  }
  class Child : Parent
  {
      public string variable = "shadowing";
  }
  main() { // 생략
      Child child = new Child();
      Console.WriteLine(child.variable); // shadowing
  }
  ```

  이 때 부모의 variable을 출력하고 싶으면 `((Parent)child).variable`로 출력하면 된다.

  이를 조금 더 명시적으로 표시할 수 있는데, new 키워드와 override 키워드이다. 

  ```csharp
  public new string variable = "shadowing"
  ```

  이렇게 `new`를 넣으면 부모의 값은 무시(hide)를하고 자식에서 새로 만든다는 뜻이다. (`new`를 안쓴 것과 같다.)

  ```csharp
  Console.WriteLine((Parent)child.variable); // 273
  ```

  다음은 오버라이드에 대해 알아보자. 먼저 부모에게 메소드가 오버라이드 될 거라는것을 명시 해줘야한다.

  (**필드는 override 키워드와 virtual 키워드가 안된다.**)

  ```csharp
  public virtual int Do() 
  {
      return 1;
  } // Parent class 내부
  ```

  그리고 자식에서 `override` 키워드를 사용한다.

  ```csharp
  public override int Do()
  {
      return 5;
  } // Child class 내부
  ```

  그리고 부모로 강제 형변환을 한 후 출력하면

  ```csharp
  Consle.WriteLine(((Parent)child).Do()); // 5
  ```

  > virtual을 쓰지 않으면 overide에서 오류가 발생한다.


