## wiringPi

wiringled.c에서 wiringPi 헤더파일을 사용하므로

wPi열의 번호만 보면 됨

#### wiringPi를 이용하여 gpio 핀 제어하기

physical 11번에 High를 주고 싶을 때

1. wiringPiSetup()

2. pinMode(0, OUTPUT)

3. digitalWrite(0, HIGH)

## FILE 입출력

FILE 입출력은 stdio.h만 인클루드 해주면 됨

FILE * fd; // 파일 디스크립터

fd = fopen(파일이름, 모드); // 파일 열기

#### 모드 종류

| "r"  | **read:** Open file for input operations. The file must exist.                                                                                                                                                                                                                                                                                                                                                                                |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "w"  | **write:** Create an empty file for output operations. If a file with the same name already exists, its contents are discarded and the file is treated as a new empty file.                                                                                                                                                                                                                                                                  |
| "a"  | **append:** Open file for output at the end of a file. Output operations always write data at the end of the file, expanding it. Repositioning operations ([fseek](http://www.cplusplus.com/fseek),[fsetpos](http://www.cplusplus.com/fsetpos),[rewind](http://www.cplusplus.com/rewind)) are ignored. The file is created if it does not exist.                                                                                             |
| "r+" | **read/update:** Open a file for update (both for input and output). The file must exist.                                                                                                                                                                                                                                                                                                                                                    |
| "w+" | **write/update:** Create an empty file and open it for update (both for input and output). If a file with the same name already exists its contents are discarded and the file is treated as a new empty file.                                                                                                                                                                                                                               |
| "a+" | **append/update:** Open a file for update (both for input and output) with all output operations writing data at the end of the file. Repositioning operations ([fseek](http://www.cplusplus.com/fseek),[fsetpos](http://www.cplusplus.com/fsetpos),[rewind](http://www.cplusplus.com/rewind)) affects the next input operations, but output operations move the position back to the end of file. The file is created if it does not exist. |

#### 파일 출력함수들

+ fprintf(stream, format, ... ) : 기존 printf와 거의 동일한 함수

  + ex ) fprintf(fd, "%s\n", "123");

+ fwrite(buffer, elesize, elemcount, stream) : 배열을 출력하고 싶을 때 사용

  + ```c
    #include <stdio.h>
     #define NUM 100
     int main(void)
     {
     FILE *stream;
     long list[NUM];
     int numwritten;
     int i;
     stream = fopen("MYLIB/MYFILE", "w+b");
     /* assign values to list[] */
     for (i=0; i<=NUM; i++)
     list[i]=i;
     numwritten = fwrite(list, sizeof(long), NUM, stream);
     printf("Number of items successfully written = %d\n", numwritten);
     }
    ```

+ fputs(buffer, stream) : 기존 puts와 거의 동일한 함수

#### 파일 입력함수들

+ fscanf(stream, format, ... ) : 기존 printf와 거의 동일한 함수

  - ex ) fscantf(fd, "%s\n", ch ); // ch는 char 배열의 배열 이름

+ fread(buffer,elesize, elecount, stream): 배열을 받고 싶을 때 사용

  + ```c
    #include <stdio.h>
     #define NUM 100
     int main(void)
     {
     FILE *stream;
     long list[NUM], list2[NUM];
     int numwritten,numread;
     int i;
     stream = fopen("MYLIB/MYFILE", "w+b");
     /* assign values to list[] */
     for (i=0; i<=NUM; i++)
     list[i]=i;
     numwritten = fwrite(list, sizeof(long), NUM, stream);
     printf("Number of items successfully written = %d\n", numwritten);
     fclose(stream)
    
     stream = fopen("MYLIB/MYFILE","r+b");
     numread = fread(list2, sizeof(long),NUM, stream);
    printf("Number of items successfully read = %d\n", numwritten); 
     }
    ```

+ fgets(buffer,maxcount, stream) : 기존 gets와 거의 동일한 함수

  + 최대 maxcount길이의 문자열을 받아옴

##### ※ stream은 일반적으로 마지막 인자여야 한다. 근데, printf나 scanf는 가변인자함수이므로 앞에 쓰는 것이다.

##### ※ buffer, {elemsize,} elemcount로 쓰는 것이 일반적이다.

#### 기타 함수들

+ feof(stream) : eof는 end of file의 약자  

### 문자열 다루기

+ memcmp (buf1, buf2, size)

  + size는 바이트 수

  + 문자열 버퍼 두 개를 넘겨줄 경우 strncmp와 역할이 같음

+ memcpy (buf1, buf2, size)

  + size는 바이트 수

  + 문자열 버퍼 두 개를 넘겨줄 경우 strncpy와 역할이 같음

#### memcmp.c 분석

+ 쌤 코드

  + ```c
    #include<stdio.h>
    #include<stdlib.h>
    #include<string.h>
    int main(int argc,char**argv){
        char *target="apple";
        char *new="banana";
        char *str="apple is red fruit , banana is yellow fruit";
        char *buf,*temp;
        int i=0,j=0;
        buf=(char *)malloc(BUFSIZ);
    
        temp=buf;
    
        while(*str){
            if(memcmp(str,target,strlen(target))==0){
                 memcpy(buf,new,strlen(new));
                str+=strlen(target); // 
                temp+=strlen(new);    
             }
            else{
                *temp++=*str++;
            }
        }
        *temp='\0';
        printf("%s",buf);
    
        return 0;
    }
    ```

  + ```c
    memcpy(buf,new,strlen(new))가 아니라 memcpy(temp,new,strlen(new))로 바꿔야 함
    ```

+ 수정본

  + ```c
    #include<stdio.h>
    #include<stdlib.h>
    #include<string.h>
    int main(int argc, char**argv) {
        const char * const target = "apple";
        //target의 원소도 안바뀌고, target도 안바뀜
        const char * const new = "banana";
        //new의 원소도 안바뀌고, new도 안바뀜
        const char * str = "apple is red fruit , apple is yellow fruit";
        //str의 원소는 바뀌지 않지만, str은 바뀜
        const char * const buf = (const char * const)malloc(BUFSIZ);
        //buf의 원소도 안바뀌고, buf도 안바뀜
        char * temp    = (char *) buf;
        //temp도 바뀌고, temp의 원소도 바뀜
        while (*str) {
            if (strncmp(str, target, strlen(target)) == 0) { 
                str += strlen(target); //str커서 target의 길이 만큼 증가
                strncpy(temp, new, strlen(new)); //temp의 커서를 시작으로 하여 new 추가하기
                temp += strlen(new); //temp커서 new의 길이 만큼 증가
            } else {
                *temp = *str; //temp가 가리키는 원소에 str이 가리키는 원소 대입
                temp++; // temp커서 1증가
                str++; // str커서 1증가
            }
        }
        *temp = '\0';
        printf("%s", buf);
        return 0;
    }
    ```

  + ++(후위 연산자)가 *(참조 연산자)보다 우선순위가 높기 때문에 

    *temp++ <=> *(temp++)

#### ftrans.c 분석

+ ```c
  if(target_len==new_len){
          i=strlen(str); 
      }
      else{
          while(str[i]){// 문자열의마지막은항상NULL\0
              if(memcmp(&str[i],target,target_len)==0){//문자열값비교
                  replace_count++;//일치할경우일치횟수증가
                  i+=target_len;//총문자열길이환산
              }
              else{
                  i++;//일치하지않을경우
              }
          }
      }
      //33행에서는 항상 i는 strlen(str)임
      transtr=(char*)malloc(i-replace_count*(target_len-new_len)+1);
      // str 길이에서 치환 한번에 new_len-target_len만큼 늘어남 
      // 예를들어 banana에서 apple 치환 한번이면 길이가 1늘어남
      // 즉, 치환 횟수 * (치환 한 번에 늘어나는 길이) + 1(널문자) + str길이 연산 시 변환문자열의 길이가 나옴.
      // 또 14행의 분기 이유를 알 수 있다
      // new_len와 target_len가 같으면 치환 한 번에 늘어나는 길이가 0이기에 변환문자열의 길이 =
      // 치환 횟수 * (치환 한번에 늘어나는 길이) + 1(널문자) + str길이 = 1(널문자) + str길이이기 때문이다.
  ```

## 멀티프로세스

#### pid_t fork(void)

child에게는 0을 리턴, parent에게는 child process id를 리턴 해줌 0미만은 에러임

+ child는 getpid(): child, getppid() :parent

+ parent는 fork() 리턴 값 : child, getpid(): parent

필요헤더 : #include<unistd.h>

#### pid_t wait(int *)

임의의 자식 프로세스가 종료되길 기다림

리턴 값 : 종료된 프로세스 id

인자 : 종료 상태 정보를 저장할 변수의 주소

필요 헤더 : 

#include <sys/types.h>  

#include <sys/wait.h>  

#### pid_t waitpid(pid_t, int *, int)

첫 번째 인자 : 기다릴 자식 프로세스의 id ( 0 초과인 경우)

두 번째 인자 : 종료 상태 정보를 저장할 변수의 주소

세 번째 인자 : option으로 0 주면 됨

리턴 값 : 종료된 프로세스의 id

필요헤더 :

#include <sys/types.h>

#include <sys/wait.h> 

#### ※ wait하는 이유 좀비 프로세스 형성을 막기 위해

## 프로세스간 통신

#### int pipe(int array{2})

2칸 짜리 int형 배열을 넘겨주면 된다.

pfd{0}이 읽는 데고 pfd{1}이 쓰는 데다.  {'0'과 '읽'에는 동그라미가 있다}

pipe함수를 호출하면 새로운 입출력 통로를 만든다. 별도의 파일디스크립터 선언이 없었다면3,4번으로 만들어지며 이후 5,6으로 할당된다.

필요헤더 : #include<unistd.h>

### 쓰레드

프로세스와 스레드의 공통점 : 여러 흐름이 동시에 진행된다.

프로세스와 스레드의 차이점 : 

+ 프로세스는 독립적으로 실행되며, 각각 별개의 메모리를 차지함 $ \rightarrow $ 프로세스 문맥교환 속도가 더 느림 

+ 스레드는 한 프로세스 내에 존재하므로 메모리를 공유하여 사용할 수 있다.

멀티스레드의 장점:

+ cpu가 여러 개일 경우에 각각의 cpu가 스레드 하나씩을 담당하는 방법으로 속도를 높일 수 있음

+ 이러한 시스템에서는 스레드가 **실제로** 동시에 수행될 수 있기 때문이다.

#### int pthread_create(pthread_t \*, const pthread_attr_t \*, void\*(\* start_routine)(void \*), void \* arg )

인자 겁나 끔찍하다... 

첫 번째 인자 : pthread_t 타입으로 선언한 변수의 주소

두 번째 인자 : 쓰레드 관련 특성 지정이다 , NULL을 줄경우 기본 특성으로 동작한다

세 번째 인자 : void * 을 리턴하고 void *을 인자로 받는 함수를 주면 된다.

네 번째 인자 : 세 번째 인자에 전달해줄 값이다.

필요헤더 :

 #include <pthread.h>

#include <sys/types.h>

#### 그렇다면 이 쓰레드는 void이외의 타입은 받을 수 없는 것인가?

답은 NO!, 그냥 (void \*)로 캐스팅만 해줘서 넘기고, 받은 후에는 다시 캐스팅 해주면 된다.

인자로 구조체 넘기기 예제:

[http://pragp.tistory.com/entry/pthread%EC%97%90-%EC%97%AC%EB%9F%AC-%EC%9D%B8%EC%9E%90-%EC%A0%84%EB%8B%AC%ED%95%98%EA%B8%B0](http://pragp.tistory.com/entry/pthread%EC%97%90-%EC%97%AC%EB%9F%AC-%EC%9D%B8%EC%9E%90-%EC%A0%84%EB%8B%AC%ED%95%98%EA%B8%B0)

+ 또한, 쌤은 반환도 여러 타입으로 할 수 있다고 하셨다. 예 : return (int \*)a, return (double \*) a
  + 근데 인터넷 예제들 보면 전부다 return (void \*)a; 라고 썼다, 그냥 이런게 가능하다고만 알고 있으면 될 듯

#### pthread\_join (pthread\_t , void **)

1번째 인자 : pthread_t 타입으로 선언된 변수

2번째 인자 : 쓰레드의 반환 값 (void \*)를 저장할 변수의 주소 (void \*\*)

쓰레드 내에서 return (void \*)42를 했고, pthread\_join으로 &returnValue를 적었다면

(int)returnValue 를 print하면 42가 나온다.    

출처: https://stackoverflow.com/questions/13315575/c-pthread-join-return-value

필요헤더 :

#include <pthread.h>

#include <sys/types.h>

#### 뮤텍스!!!

사용법

1. pthread\_mutex\_t  mid; 

2. pthread_mutex_init(&mid,NULL);  

   + 두번째 인자는 역할이 뭔지 모르겠음 

3. pthread_mutex_lock(&mid);

4. pthread_mutex_unlock(&mid);

필요헤더 :

#include <pthread.h>

#include <sys/types.h>

## 시그널 보내 시그널 보내 찌릿찌릿찌릿찌릿

필요헤더:#include <stdio.h>

## 선생님 코드에 쓰인 함수들 정리

+ int ledControl(int gpio,int d_time) //d\_time은 ms임

+ char *transString(char *str,const char *target,const char *new)

+ void sig\_handler(int signo)

※ pid\_t, pthread\_t 같이 \_t가 붙은 자료형들은 <sys/type.h>에 선언됨 

※ \_t 타입 중에서 주소가 아닌 값을 넘겨주는 함수는 wait, waitpid, pthread\_join 뿐이다.
