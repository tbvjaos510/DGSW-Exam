var test = {
  num: 0, // 프로퍼티
  add: function () {
    num++;
  } // 메소드
}; // 정의

test.num = 4;
test.add();
console.log(test.num);