# Rust学习小记

参考，([关于本书 - Rust语言圣经(Rust Course)](https://course.rs/about-book.html))

## 工欲善其事必先利其器

由于 rust 安装过程中会使用网络下载文件，默认从国外下载，所以我们需要配置 rust 安装镜像源。

对于配置，建议参考这里，[Windows 上安装 Rust 及配置 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/655386777)

安装包放这里，[rust](https://www.alipan.com/s/Wh1H4NYhuvR)

安装好后，查看版本

```
$  rustc -V

$  cargo -V
```



Cargo，优秀的包管理工具。

创建项目命令 `cargo new <项目名称> --bin`



运行rust项目：cargo run 

cargo run 是先编译再运行

相当于cargo build 再 `./target/debug/xxx`

编译很快但是，运行速度慢 			可以添加 --release解决

- cargo run --release
- cargo build --release



cargo check：快速检查代码能否编译通过，能够节省大量的编译时间



Cargo.toml和Cargo.lock是cargo的核心文件

- `Cargo.toml` 是 `cargo` 特有的**项目数据描述文件**。它存储了项目的所有元配置信息，如果 Rust 开发者希望 Rust 项目能够按照期望的方式进行构建、测试和运行，那么，必须按照合理的方式构建 `Cargo.toml`。
- `Cargo.lock` 文件是 `cargo` 工具根据同一项目的 `toml` 文件生成的**项目依赖详细清单**，因此我们一般不用修改它，只需要对着 `Cargo.toml` 文件撸就行了。

 在Cargo.toml中，主要通过各种依赖段落来描述该项目的各种依赖项



在cargo中打印信息，使用了println!宏

## Rust基础入门

### 变量绑定和解构

```rust
// Rust 程序入口函数，跟其它语言一样，都是 main，该函数目前无返回值
fn main() {
    // 使用let来声明变量，进行绑定，a是不可变的
    // 此处没有指定a的类型，编译器会默认根据a的值为a推断类型：i32，有符号32位整数
    // 语句的末尾必须以分号结尾
    let a = 10;
    // 主动指定b的类型为i32
    let b: i32 = 20;
    // 这里有两点值得注意：
    // 1. 可以在数值中带上类型:30i32表示数值是30，类型是i32
    // 2. c是可变的，mut是mutable的缩写
    let mut c = 30i32;
    // 还能在数值和类型中间添加一个下划线，让可读性更好
    let d = 30_i32;
    // 跟其它语言一样，可以使用一个函数的返回值来作为另一个函数的参数
    let e = add(add(a, b), add(c, d));

    // println!是宏调用，看起来像是函数但是它返回的是宏定义的代码块
    // 该函数将指定的格式化字符串输出到标准输出中(控制台)
    // {}是占位符，在具体执行过程中，会把e的值代入进来
    println!("( a + b ) + ( c + d ) = {}", e);
}

// 定义一个函数，输入两个i32类型的32位有符号整数，返回它们的和
fn add(i: i32, j: i32) -> i32 {
    // 返回相加值，这里可以省略return
    i + j
}
```

**Rust 不要警告未使用的变量，为此可以用下划线作为变量名的开头**

```rust
fn main(){
    let _x = 5;
    let y = 10;
    println!("{}",y)
}
```

**变量解构**

```rust
fn main() {
    let (a, mut b): (bool,bool) = (true, false);
    // a = true,不可变; b = false，可变
    println!("a = {:?}, b = {:?}", a, b);

    b = true;
    assert_eq!(a, b);
}
```



解构式复制

```rust
struct Struct {
    e: i32
}

fn main() {
    let (a, b, c, d, e);

    (a, b) = (1, 2);
    // _ 代表匹配一个值，但是我们不关心具体的值是什么，因此没有使用一个变量名而是使用了 _
    [c, .., d, _] = [1, 2, 3, 4, 5];
    Struct { e, .. } = Struct { e: 5 };

    assert_eq!([1, 2, 1, 4, 5], [a, b, c, d, e]);
}
```

这种使用方式跟之前的 `let` 保持了一致性，但是 `let` 会重新绑定，而这里仅仅是对之前绑定的变量进行再赋值



常量不允许使用 mut，常量使用const 声明，且类型必须标注



**变量遮蔽**

rust允许声明相同的变量名，在后面声明的变量会遮蔽掉前面的声明

```rust
fn main() {
    let x = 5;
    // 在main函数的作用域内对之前的x进行遮蔽
    let x = x + 1;

    {
        // 在当前的花括号作用域内，对之前的x进行遮蔽
        let x = x * 2;
        println!("The value of x in the inner scope is: {}", x);
    }

    println!("The value of x is: {}", x);
}
```

这里打印出来就是12,6

与mut不同，这里相当于生成了一个完全不同的新变量，两个变量只是恰好拥有相同的名称，设计一次内存对象的再分配，

而mut声明的变量，可以修改同一个内存地址上的值，不涉及内存对象的再分配，性能更好。

```rust
// 字符串类型
let spaces = "   ";
// usize数值类型
let spaces = spaces.len();
```

这样是可行的，但是，下面这个不行

```rust
let mut spaces = "   ";
spaces = spaces.len();
```

因为Rust，对于类型要求，及其严格，起初的spaces类型为字符串，而要被赋值为整数类型，这是不被允许的



### 基本类型

- 数值类型: 有符号整数 (`i8`, `i16`, `i32`, `i64`, `isize`)、 无符号整数 (`u8`, `u16`, `u32`, `u64`, `usize`) 、浮点数 (`f32`, `f64`)、以及有理数、复数
- 字符串：字符串字面量和字符串切片 `&str`
- 布尔类型： `true`和`false`
- 字符类型: 表示单个 Unicode 字符，存储为 4 个字节
- 单元类型: 即 `()` ，其唯一的值也是 `()`

**整型溢出**

在rust的debug模式编译时，rust会检查整型溢出，若存在问题，会在编译时崩溃

而在release模式下，rust不检查溢出，相反，当检测到整型溢出时



**浮点数陷阱**

浮点数往往是你想要的数字的近似表达，因为浮点数类型是基于二进制实现的

浮点数在某些特性上是饭直觉的

比如 0.1 + 0.2 是不等于0.3的



**NaN**

非法的数字操作都会产生NaN，比如对于一个负数开平方根。

对于NaN的任何交互，都会返回一个NaN

如何判断NaN，调用`x.is_nan`方法

**序列**

生成连续的数值

比如`1..5`生成1到4 的连续数字

而`1..=5`生成1到5的连续数字

不只是数字还有字符类型。 `‘a’..='z'`

**类型转换**
可以使用as来完成一个类型转化为另一个类型

**有理数和复数**
Rust标准库并未有有理数和复数
-  有理数和复数
- 任意大小的整数和任意精度的浮点数
- 固定精度的十进制小数，常用于货币相关的场景
但是社区开发了一个高质量的Rust数据库：num
```rust
use num::complex::Complex;

 fn main() {
   let a = Complex { re: 2.1, im: -1.2 };
   let b = Complex::new(11.1, 22.2);
   let result = a + b;

   println!("{} + {}i", result.re, result.im)
 }
```


#### 字符、布尔、单元类型

**字符类型（char）**
Rust的字符类型是unicode编码，基本所有字符都支持
```rust
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let g = '国';
    let heart_eyed_cat = '😻';
}
```
由于 `Unicode` 都是 4 个字节编码，因此字符类型也是占用 4 个字节：

**布尔类型**
只有true或者false
```rust
fn main() {
    let t = true;

    let f: bool = false; // 使用类型标注,显式指定f的类型

    if f {
        println!("这是段毫无意义的代码");
    }
}
```
其大小只有一个字节

**单元类型**
()，其为一只也是`()`，没有返回值的函数在Rust是由单独的定义，发散函数
例如常见的`println!()`，的返回值也是单元类型`()`
你可以使用`()`作为map的值

#### 语句与表达式
语句：`let x = x + 1`
表达式：`x+y`

语句会执行操作但是不返回一个值，而表达式在求值之后要返回一个值

语句：
```rust
let a = 8;
let b:Vec<f64> = Vec::new();
let (a,c) = ("hi",false);
```

let 是语句，因此不能将`let`语句赋值给其他值
`let b = (let a = 8)`

表达式：

表达式会进行求值然后返回，比如`1+1`求值后得到`2`因此，他就是一个表达式
表达式可以成为语句的一部分

比如`let x = x+1`，x+1为表达式，成为了语句的一部分
调用一个函数也是表达式，因为返回一个值，调用宏也是表达式，总之，`能返回值的就是表达式`
表达式不能包含分号，否则就变为语句了，就**不会**返回一个值
最后，表达式如果不返回任何一个值，会隐式返回一个`()`即单元类型

#### 函数
```rust
fn add(i:i32,j:i32){
	i+j
}
```

函数要点：
- 函数名和变量名使用蛇形命名法，例如`fn add()->{}`
- 函数的位置可以任意放置
- 每个函数都需要标明类型
Rust是强类型语言，和C类似，传入的每一个参数需要定义类型

rust函数的特殊返回类型

- 函数没有返回值，那么返回一个元组`()`
- 通过;结尾的语句返回一个`()`

比如这段代码，就会报错
```rust
fn add(x:u32,y:u32) -> u32 { x + y; }
```
因为加了;，返回一个元组，但是希望u32类型

当使用`!`作为函数的返回类型时，表示该函数永不返回，这样会导致函数的崩溃


### 所有权与借用
理解**所有权和借用**是Rust学习中至关重要的一点
在计算机语言不断演变过程中出现了三种流派
- **垃圾回收机制（GC）**，在程序运行时不断寻找不在使用的内存，典型：Java，Go
- **手动管理内存的分配和释放**，在程序中，通过函数调用的方式来申请和释放内存，典型代表C++
- **通过所有权来管理内存**，编译器在编译时会根据一系列规则进行检查
Rust选择的第三者。这种检查只发生在编译期，因此在程序运行期，不会有任何性能上的损失

比如一段c的代码
```c
int* foo() {
    int a;          // 变量a的作用域开始
    a = 100;
    char *c = "xyz";   // 变量c的作用域开始
    return &a;
}                   // 变量a和c的作用域结束
```
变量 `a` 和 `c` 都是局部变量，函数结束后将局部变量 `a` 的地址返回，但局部变量 `a` 存在栈中，在离开作用域后，`a` 所申请的栈上内存都会被系统回收，从而造成了 `悬空指针(Dangling Pointer)` 的问题。这是一个非常典型的内存安全问题，虽然编译可以通过，但是运行的时候会出现错误, 很多编程语言都存在。


栈和堆
向堆上放数据时，操作系统会在堆的某处寻找一片空间，然后标记已经使用，并返回一个指针，该过程被称为在堆上分配内存，然后可以使用在栈上的指针来访问该数据

在栈上分配内存比在堆上更快
理解堆栈在理解所有权这个上会起很大的帮助

#### 所有权原则

1. Rust每个值都被一个变量所拥有，该变量被称为值的所有者
2. 一个值同时只能被一个变量所拥有，或者说一个值只能拥有一个所有者
3. 当所有者（变量）离开作用域，这个值被丢弃

**变量作用域**

变量`s`绑定到一个字符串字面值，该字符串字面值是硬编码到程序代码中的。`s`变量从声明的点开始直到当前作用域结束都有效
```rust
{ //s在这里无效
let s:string = "aaa" //从这里开始s有效的


}//此作用域已结束，s不在有效
```

`s` 是被硬编码进程序里的字符串值（类型为 `&str` ）
- **字符串字面量**是不变的，因为被硬编码到程序代码中
- 并非所有的字符串的值都能在编译时拿到
字符串是需要程序运行时，通过用户动态输入然后存储在内存中的，这种情况，字符串字面值就完全无用武之地。 为此，Rust 为我们提供动态字符串类型: `String`, 该类型被分配到堆上，因此可以动态伸缩，也就能存储在编译时大小未知的文本。


可以基于下面字面量来创建字符串
```rust
let s = String::from("hello")
```
`::`是调用操作符，这里表示调用String的from方法
String放在堆上的，因此可以动态追加
```rust
let mut s = String::from("hello");

s.push_str(", world!"); // push_str() 在字符串后追加字面值

println!("{}", s); // 将打印 `hello, world!`

```


当整个过程中的赋值都是通过值拷贝的方式完成(发生在栈中)，因此并不需要所有权转移。
比如
```rust
let x = 1
let y = x
```
 Rust 基本类型都是通过自动拷贝的方式来赋值的，就像上面代码一样。(这个比在堆上创建内存更快)
对于存储在堆上面的（复杂类型），就不是自动拷贝
复杂类型是由：由存储在栈中的**堆指针**、**字符串长度**、**字符串容量**共同组成
容量为堆内存分配的大小，长度是目前已经使用的大小

对于这种情况
```rust
let s1 = String::from("hello_world")
let s2 = s1
```
如果是拷贝的情况下
这里可以讨论一下是如何拷贝的？
1. 深拷贝所有数据，但是这个性能消耗非常大
2. 浅拷贝`8字节的指针`、`8字节的长度`、`8字节的容量`，但是所有权规定——一个值只能允许一个所有者
如果一个值有多个所有者，那么可能出现`多次释放`，离开作用域，释放内存，但是这种情况会导致同一片空间多次释放造成内存泄漏。
因此，Rust 这样解决问题：**当 `s1` 被赋予 `s2` 后，Rust 认为 `s1` 不再有效，因此也无需在 `s1` 离开作用域后 `drop` 任何东西，这就是把所有权从 `s1` 转移给了 `s2`，`s1` 在被赋予 `s2` 后就马上失效了**。

那么这样子，再次访问s1就会报错
```rust
let s1 = String::from("hello_world")
let s2 = s1
println!("{}",s1)
```
可以理解为，将s1的所有权移动到s2了

再来看看👀👀
```rust
fn main() {
    let x: &str = "hello, world";
    let y = x;
    println!("{},{}",x,y);
}
```
这个不会报错。为什么？？
这个和前面的创建字符串有本质的区别
这段代码和之前的 `String` 有一个本质上的区别：在 `String` 的例子中 `s1` 持有了通过`String::from("hello")` 创建的值的所有权，而这个例子中，`x` 只是引用了存储在二进制中的字符串 `"hello, world"`，并没有持有所有权。
因此 `let y = x` 中，仅仅是对该引用进行了拷贝，此时 `y` 和 `x` 都引用了同一个字符串。

**深拷贝**
Rust永远不会自动创建数据的"深拷贝"，因此，任何`自动`的复制都不是深拷贝
如果确实需要深度复制String堆上的数据，可以使用clone方法
```rust
let s1 = String::from("hello");
let s2 = s1.clone();
println!("s1 = {}, s2 = {}", s1, s2);
```
这行代码就能正常进行。但是这个性能较低，谨慎使用

**浅拷贝**

浅拷贝只发生在栈上，因此性能很高，浅拷贝无处不在
```rust
let x = y;
let y = x;
println!("x = {}, y = {}", x, y);
```
这里，y就是对x的浅拷贝
copy：可以用在类似整型这样在栈中存储的类型
**<mark style="background: #ADCCFFA6;">任何基本类型的组合</mark>可以 `Copy` ，不需要分配内存或某种形式资源的类型是可以 `Copy` 的**。
- 所有整数类型，比如 `u32`
- 布尔类型，`bool`，它的值是 `true` 和 `false`
- 所有浮点数类型，比如 `f64`
- 字符类型，`char`
- 元组，当且仅当其包含的类型也都是 `Copy` 的时候。比如，`(i32, i32)` 是 `Copy` 的，但 `(i32, String)` 就不是
- 不可变引用 `&T` ，例如[转移所有权](https://course.rs/basic/ownership/ownership.html#%E8%BD%AC%E7%A7%BB%E6%89%80%E6%9C%89%E6%9D%83)中的最后一个例子，**但是注意: 可变引用 `&mut T` 是不可以 Copy的**


**函数传值与返回**
将值传递给函数，一样会发生 `移动` 或者 `复制`，就跟 `let` 语句一样，下面的代码展示了所有权、作用域的规则：
```rust
fn main() {
    let s = String::from("hello");  // s 进入作用域

    takes_ownership(s);             // s 的值移动到函数里 ...
    // ... 所以到这里不再有效

    let x = 5;                      // x 进入作用域

    makes_copy(x);                  // x 应该移动函数里，
    // 但 i32 是 Copy 的，所以在后面可继续使用 x

} // 这里, x 先移出了作用域，然后是 s。但因为 s 的值已被移走，
  // 所以不会有特殊操作

fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{}", some_string);
} // 这里，some_string 移出作用域并调用 `drop` 方法。占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{}", some_integer);
} // 这里，some_integer 移出作用域。不会有特殊操作
```
这里传入`s`之后，相当于讲s的所有权交给了`take_ownership`，如果函数结束后，仍然需要使用`s`那么需要`take_ownership`归还所有权

#### 引用与借用
Rust通过`借用`，来获取变量的引用
常规引用是一个指针类型，指向对象存储的内存地址，例如下面
```rust
fn main(){
	let x = 5;
	let y = &x;
}
```
这样就可以使用`*y`得到y指向地址的值。引用不能和其他类型比较

**不可变引用**
函数传参的时候，传引用进入，就无需函数传出所有权了
这里可以和上面的<mark style="background: #FFB86CA6;">函数传值与返回</mark>进行对比
```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);//这里仍然可以使用s
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```
引用，允许你获取值，但是不会获得其所有权

引用指向的值默认是不变的。如果要改变引用可以做一点修改
传入引用`&s`变为  `&mut s`
且**可变引用只能同时存在一个**，两个可变引用可能会导致值无法预估的改变。

**可变引用和不可变引用不可同时存在**
在老的编译器，不可变引用的作用域在`}`之后结束
但是在新的编译器，**引用作用域的结束位置从花括号变成最后一次使用的位置**
```rust
fn main() {
   let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;
    println!("{} and {}", r1, r2);
    // 新编译器中，r1,r2作用域在这里结束

    let r3 = &mut s;//老编译器这里会报错，因为触犯了可变与不可变引用同时存在
    println!("{}", r3);
} // 老编译器中，r1、r2、r3作用域在这里结束
  // 新编译器中，r3作用域在这里结束
```

**悬垂引用**
意思是指针指向某个值后，这个值释放掉了，但是指针仍然存在其指向的内存可能不存在任何值或已被其它变量重新使用。
在 Rust 中编译器可以确保引用永远也不会变成悬垂状态：当你获取数据的引用后，编译器可以确保数据不会在引用结束前被释放，要想释放数据，必须先停止其引用的使用。
```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");

    &s
}
```
这里dangle就创建了一个悬垂引用，因为s在dangle执行完成之后，内存被回收，但是返回了指向该内存的一个指针。因此Rust会报错。
但是返回的不是一个引用，而是整个（相当于所有权转移）那么就不会报错。


### 复合类型

#### 字符串与切片
**字符串**

```rust
fn main() {
  let my_name = "Pascal";
  greet(my_name);
}

fn greet(name: String) {
  println!("Hello, {}!", name);
}
```
这段代码有错吗？
其实会，因为定义greet是接受的String类型的参数，但是传入的是一个`&str`的字符串

**切片**
对于字符串而言，切片就是堆String类型中某一部分的引用
```rust
let s = String::from("hello world");
let hello = &s[0..5];
let world = &s[6..11];
```

对于切片，要小心，索引必须是落在`祖父之间的辩解位置`，也就是UTF-8字符的辩解，例如中文在UTF-8中占用三个字节，下面代码就会崩溃
```rust
let s = "中国人";
let a = &[0..2];
println!("{}",a);
```

每个汉字占三个字节，但是这里只取到2，没有落在边界处，因此程序直接崩溃退出

切片是对集合的部分引用，因此其他也有切片。

实际上字符串字面量是切片
```rust
let s:&str = "hello world!"
```
因此字符串字面量是不可变的。

Rust中字符是Unicode类，因此每个字符占据4个字节空间，但是在字符串中不一样，字符串是UTF-8编码，也就是字符串中字符所占的字节数是变化的（`1-4`）

`str` 类型是硬编码进可执行文件，也无法被修改，但是 `String` 则是一个可增长、可改变且具有所有权的 UTF-8 编码字符串，**当 Rust 用户提到字符串时，往往指的就是 `String` 类型和 `&str` 字符串切片类型，这两个类型都是 UTF-8 编码**。

讲String类型转化为&str类型
采用引用即可

String类型不能直接通过索引进行访问 
**字符串内部**
字符串的底层的数据存储格式实际上是[u8]，一个字节数组
对于`let hello = "hello"`取的是引用，长度为5.
对于 `let hello = String:from("中国人");`实际上是九个字节的长度

Rust不允许去索引字符串，因为索引操作，我们总是期望他的性能表现是O(1)，然而对于String类型来说，无法保证这一点

**操作字符串**

**追加**（push），push追加字符，push_str追加字符串
```rust
let mut s = String::from("hello");
s.push_str("rust");
s.push('!');
```
**插入**（insert），insert插入字符，insert_str插入字符串。这个需要两个参数`(index,content)`
```rust
let mut s = String::from("hello nihao");
s.insert(5,',');
s.insert(6," zhongguo");
```

**替换**（Replace）

1.replace，可以使用**String和&str**类型，接受两个参数，`(oldstring,newstring)`
这个会**替换所有能匹配**到的字符串。从传入类型可以看出，因为可以传入&str类型，那么**一定不是在当前字符串上做修改，而是返回一个新的字符串**
```rust
let string_replace = String::from("I like rust. Learning rust is my favorite!"); let new_string_replace = string_replace.replace("rust", "RUST");
```


2.replacen
适用于`String类型和&str`，接受三个参数，前两个与replace方法的参数一致，第三个参数是指替换的个数
```rust
let str = "rust,rust,rust!!!"
let newStr = str.replacen("rust","Rust",1);
```
如果指定替换数量超过了在字符串中存在的数量，就是将全部替换。

3.replace_range
仅适用于`String`类型。replace_range接受两个参数，第一个是要替换字符串的范围，第二个是新的字符串。**该方法会直接操作原来的字符串，不会返回新的字符串，该方法需要使用mut关键字修饰**

**删除**
1.pop ——删除并返回字符串的最后一个字符
**直接操作原来的字符串**，弹出最后一个字符，存在返回值，其返回值是一个 `Option` 类型，如果字符串为空，则返回None
![](Rust%E5%AD%A6%E4%B9%A0%E5%B0%8F%E8%AE%B0.assets/Pasted%20image%2020240313112941.png)

2.remove——删除并返回字符串中指定位置的字符
**该方法是直接操作原来的字符串**，存在返回值，其返回值是删除位置的字符串，只接受一个参数，表示该字符其实索引位置，`remove()` 方法是按照字节来处理字符串的，如果参数所给的位置不是合法的字符边界，则会发生错误。
```rust
fn main() {
    let mut string_remove = String::from("测试remove方法");
    println!(
        "string_remove 占 {} 个字节",
        std::mem::size_of_val(string_remove.as_str())
    );
    // 删除第一个汉字
    string_remove.remove(0);
    // 下面代码会发生错误
     string_remove.remove(1);
    // 直接删除第二个汉字,这里就会报错，因为删除之后，试为第一个字符，但是他的起始是在0
    // string_remove.remove(3);
    dbg!(string_remove);
}
```

3.truncate——删除字符串中从指定位置开始到结尾的全部字符。
**该方法是直接操作原来的字符串**，无返回值，truncate方法是按照字节来处理字符串的。

4.clear ——清空字符串
**该方法是直接操作原来的字符串**，相当于truncate从0开始


**连接**
1.使用+或者+=连接字符串，右边的参数<mark style="background: #BBFABBA6;">必须是</mark>字符串的切片引用类型。
其实当调用+操作符时，相当于调用了std::string标准库中的add()方法，这里add()方法的第二个参数是一个引用类型。 +是返回一个新的字符串，所以变量声明可以不需要mut关键字修饰
add的定义如下
```rust
fn add(self, s: &str) -> String
```

```rust
fn main(){
	let s1 = String::from("Hello, world!");
    let s2 = String::from("こんにちは、世界！");
    let result = s1 + &s2;
    let mut result = result + "!";
    println!("{}", result);
}
```


操作utf-8字符串

遍历字符
```rust
for c in "中国人".chars() {
    println!("{}", c);
}

```


为什么String可以变化，字符串字面量str不可变

对于String类型，为了支持一个可变的文本片段，需要在堆上面分配内存
- 首先向操作系统请求内存来存放 `String` 对象
- 在使用完成后，将内存释放，归还给操作系统

第一部分由`String::from`完成
Rust是在什么时候释放内存呢？变了离开作用域之后，自动释放其内存
```rust
{
	let s = String::from("hello");
}
//离开这里之后，s被回收
```


#### 元组
元组是多个类型复合一起形成的
```rust
fn main(){
	let tup:(i32,f64,u8) = (500,6.4,1);
}
```

同时这个元组支持解构
```rust
let tup:(i32,f64,u8) = (500,6.4,1);
let (x,y,z) = tup;
```

元组支持`.`进行访问
```rust
tup.0
```



#### 结构体
类似于C语言的结构体
```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

```

1. 初始化实例时，**每个字段**都需要进行初始化
2. 初始化时的字段顺序**不需要**和结构体定义时的顺序一致

`.`操作符可以进行访问， 可以进行修改
```rust
user1.email = String::from("anotheremail@example.com");
```

解构赋值
```rust
let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
```

结构体更新语法跟赋值语句 `=` 非常相像，因此在上面代码中，`user1` 的部分字段所有权被转移到 `user2` 中：`username` 字段发生了所有权转移，作为结果，`user1` 无法再被使用。
其他两个因为不是复合类型（bool和u64），自动完成了复制，而非所有权的转移
因此再次访问user1.username就会报错

内存排列
```rust
#[derive(Debug)]
 struct File {
   name: String,
   data: Vec<u8>,
 }

 fn main() {
   let f1 = File {
     name: String::from("f1.txt"),
     data: Vec::new(),
   };

   let f1_name = &f1.name;
   let f1_length = &f1.data.len();

   println!("{:?}", f1);
   println!("{} is {} bytes long", f1_name, f1_length);
 }
```



![](Rust%E5%AD%A6%E4%B9%A0%E5%B0%8F%E8%AE%B0.assets/Pasted%20image%2020240411101353.png)


结构体必须要有名称，但是结构体的字段可以不需要名称。
写出来有点像元组


我们想要这个结构体拥有它所有的数据，而不是从其它地方借用数据。
但是：如果你想在结构体中使用一个引用，就必须加上生命周期，否则就会报错

使用`#[derive(Debug)]`来打印结构体信息，如果不使用就会报错
如果要用 `{}` 的方式打印结构体，那就自己实现 `Display` 特征。
```rust
#[derive(Debug)]
struct P {
    name:String,
    age:u8,
}

fn main() {
    let p1 = P{
        name:String::from("John"),
        age:25,
    };
    println!("{:?}", p1);
}
//P { name: "John", age: 25 }
```

如果不加那么便会出现
>error[E0277]: `P` doesn't implement `Debug`
  --> src\main.rs:11:22
   |
   | println!("{:?}", p1);
   |                      ^^ `P` cannot be formatted using `{:?}

当结构体较大时，我们可能希望能够有更好的输出表现，此时可以使用 `{:#?}` 来替代 `{:?}`



#### 数组

使用最多的数据结构常见两种，定长和变长的：array和Vector

数组的定义
```rust
let arr = [1,2,3,4,5];
```

数组array元素类型大小固定，长度固定，因此存储在栈上
动态数组Vector是存储在堆上。
类型声明

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```


当你尝试使用索引访问元素时，Rust 将检查你指定的索引是否小于数组长度。如果索引大于或等于数组长度，Rust 会出现 **_panic_**。这种检查只能在运行时进行，比如在上面这种情况下，编译器无法在编译期知道用户运行代码时将输入什么值。
```rust
let a = [3; 5];
```
创建一个数组，长度为5，初始值为3.

当数组元素为非基本类型时，不能使用上面那种简洁的方法进行快速创建
```rust
let array = [String::from("rust is good!"); 8];
```

因为他本质是通过Copy实现的，基本类型可以进行Copy但是复杂类型不能（非Copy类型）
非Copy类型：
1. **堆分配类型**：
    - `String`：可增长的文本字符串，存储在堆上。
    - `Vec<T>`：动态大小的数组，其元素也可能是非 `Copy` 类型。
    - `Box<T>`：智能指针，用于堆上的唯一拥有权。
    - `Rc<T>`：引用计数的智能指针，用于共享拥有权。
    - `Arc<T>`：原子引用计数的智能指针，用于线程安全的共享拥有权。
2. **结构体和枚举**：
   
    - 当结构体或枚举内部包含任何非 `Copy` 类型字段时，该结构体或枚举自动变为非 `Copy` 类型。
    - 若结构体或枚举的所有字段都实现了 `Copy`，则该结构体或枚举也会实现 `Copy`。
3. **其他拥有权相关的类型**：
   
    - `HashMap<K, V>` 和 `BTreeMap<K, V>` 等映射类型，其中键值对可能包含非 `Copy` 类型。
    - `HashSet<T>` 和 `BTreeSet<T>` 等集合类型，如果元素类型是非 `Copy` 的，则集合也是非 `Copy` 的。
    - 标准库以及其他第三方库中涉及资源管理的自定义类型，比如文件句柄、网络套接字等。


正确的写法应该是
```rust
let array: [String; 8] = std::array::from_fn(|_i| String::from("rust is good!"));

println!("{:#?}", array);
```

数组的切片：
```rust

fn main() {
    let a: [i32; 5] = [1, 2, 3, 4, 5];
    let slice: &[i32] = &a[1..3];
    assert_eq!(slice, &[2, 3]);
    for i in &a{
        print!("{},", i);
    }
    println!("");
    for i in slice{
        print!("{},", i);
    }
    println!("");
}

```


### 流程控制
#### if
```rust
if condition == 3 {
    // A...
} else if condition == 4{
    // B...
}else{
	//c...
}

```


使用的代码需要注意以下几点：
1. if语句块是表达式，可以使用if表达式进行赋值
2. if赋值的时候需要保证每个分支上面的类型一样（Rust是静态语言，在编译时会查看）


#### for
语法：`for 元素 in 集合{}`
通常我们是使用集合的引用类型，否则这个集合的所有权都交给for语句块中了，这样，我们无法使用该集合

```rust 
for i in 1..=5{
	print!("{} ",i);
}
//这里输出1,2,3,4,5
```

如果是1..4那么就是输出1,2,3

如果想在循环中修改元素可以
```rust
for i in &mut collection{
	//修改操作
}
```



| 使用方法                        | 等价使用方式                                          | 所有权   |
| --------------------------- | ----------------------------------------------- | ----- |
| for item in collection      | for item in IntoIterator::into_iter(collection) | 转移所有权 |
| for item in &collection<br> | for item in collection.iter()                   | 不可变借用 |
| for item in &mut collection | for item in collection.iter_mut()               | 可变借用  |


获取**索引**
```rust
fn main() {
    let a = [4, 3, 2, 1];
    // `.iter()` 方法把 `a` 数组变成一个迭代器
    for (i, v) in a.iter().enumerate() {
        println!("第{}个元素是{}", i + 1, v);
    }
}
```

两种循环的优劣性：
```rust
// 第一种
let collection = [1, 2, 3, 4, 5];
for i in 0..collection.len() {
  let item = collection[i];
  // ...
}

// 第二种
for item in collection {

}
```
- **性能**：第一种使用方式中 `collection[index]` 的索引访问，会因为边界检查(Bounds Checking)导致运行时的性能损耗 —— Rust 会检查并确认 `index` 是否落在集合内，但是第二种直接迭代的方式就不会触发这种检查，因为编译器会在编译时就完成分析并证明这种访问是合法的
- **安全**：第一种方式里对 `collection` 的索引访问是非连续的，存在一定可能性在两次访问之间，`collection` 发生了变化，导致脏数据产生。而第二种直接迭代的方式是连续访问，因此不存在这种风险( 由于所有权限制，在访问过程中，数据并不会发生变化)。

#### while循环
和c里面的相差无几
```rust 
while n <=5{
	n++;
}
```


#### loop循环
`loop` 循环毋庸置疑，是适用面最高的，它可以适用于所有循环场景（虽然能用，但是在很多场景下， `for` 和 `while` 才是最优选择


```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {}", result);
}
```

- **break 可以单独使用，也可以带一个返回值**，有些类似 `return`
- **loop 是一个表达式**，因此可以返回一个值


### 模式匹配
#类似于switch

#### match匹配

`match` 的匹配必须要穷举出所有可能
其实 `match` 跟其他语言中的 `switch` 非常像，`_` 类似于 `switch` 中的 `default`。

```rust
match target {
    模式1 => 表达式1,
    模式2 => {
        语句1;
        语句2;
        表达式2
    },
    _ => 表达式3
}
```

例如：
```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny =>  {
            println!("Lucky penny!");
            1
        },
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

```

**一个模式和针对该模式的处理代码**。第一个分支的模式是 `Coin::Penny`，其后的 `=>` 运算符将模式和将要运行的代码分开。这里的代码就仅仅是表达式 `1`，不同分支之间使用逗号分隔。


```rust
enum IpAddr {
   Ipv4,
   Ipv6
}

fn main() {
    let ip1 = IpAddr::Ipv6;
    let ip_str = match ip1 {
        IpAddr::Ipv4 => "127.0.0.1",
        _ => "::1",
    };

    println!("{}", ip_str);
}
```

_ 通配运算符，在match里面也可以使用其他变量充当
```rust
#[derive(Debug)]
enum Direction {
    East,
    West,
    North,
    South,
}

fn main() {
    let dire = Direction::South;
    match dire {
        Direction::East => println!("East"),
        other => println!("other direction: {:?}", other),
    };
}
```


#### if let匹配
当只有一个值需要处理时，就可以使用if let进行匹配
比如
```rust
    let v = Some(3u8);
    match v {
        Some(3) => println!("three"),
        _ => (),
    }

```
等同于
```rust
if let Some(3) = v {
    println!("three");
}

```

matches!
```rust
enum MyEnum {
    Foo,
    Bar
}

fn main() {
    let v = vec![MyEnum::Foo,MyEnum::Bar,MyEnum::Foo];
    v.iter().filter(|x| x == MyEnum::Foo);
    //过滤，只保留类型时MyEnum::Foo的
}
```

```rust
let foo = 'f';
assert!(matches!(foo, 'A'..='Z' | 'a'..='z'));

let bar = Some(4);
assert!(matches!(bar, Some(x) if x > 2));

```

`Some(value)`：表示枚举中含有一个有效的值，这里的 `value` 是类型 `T` 的实例。在 `Some(4)` 这个具体的例子中，`T` 是 `i32` 类型，因此 `Some(4)` 指的是有一个存在的整数值 4

变量屏蔽
无论是 `match` 还是 `if let`，这里都是一个新的代码块，而且这里的绑定相当于新变量，如果你使用同名变量，会发生变量遮蔽:
```rust
fn main() {
   let age = Some(30);
   println!("在匹配前，age是{:?}",age);
   if let Some(age) = age {
       println!("匹配出来的age是{}",age);
   }

   println!("在匹配后，age是{:?}",age);
}
```
cargo run 执行之后的结果

>在匹配前，age是Some(30)
匹配出来的age是30
在匹配后，age是Some(30)


####  解构Option

Option枚举：
```rust
enum Option<T>{
	Some(T),
	None
}
```
**一个变量要么有值：`Some(T)`, 要么为空：`None`**。

#### 模式适用场景

 match分支
```rust
match VALUE {
    PATTERN => EXPRESSION,
    PATTERN => EXPRESSION,
    _ => EXPRESSION,
}

```

if let分支
```rust
if let pattern = some_value{

}
```


while let 分支
```rust
// Vec是动态数组
let mut stack = Vec::new();

// 向数组尾部插入元素
stack.push(1);
stack.push(2);
stack.push(3);

// stack.pop从数组尾部弹出元素
while let Some(top) = stack.pop() {
    println!("{}", top);
}

```
这个例子会打印出 `3`、`2` 接着是 `1`。`pop` 方法取出动态数组的最后一个元素并返回 `Some(value)`，如果动态数组是空的，将返回 `None`，对于 `while` 来说，只要 `pop` 返回 `Some` 就会一直不停的循环。


for循环
```rust
let v = vec!['a', 'b', 'c'];

for (index, value) in v.iter().enumerate() {
    println!("{} is at index {}", value, index);
}

```


let语句
没错let语句也是一种模式匹配


#### 全模式列表

可以匹配字面量
```rust
let x = 1;

match x {
    1 => println!("one"),
    2 => println!("two"),
    3 => println!("three"),
    _ => println!("anything"),
}

```

取特定值，打印`one`

匹配命名变量
```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(y) => println!("Matched, y = {:?}", y),
        _ => println!("Default case, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {:?}", x, y);
}
```

第二个匹配分支中的模式引入了一个新变量 `y`，它会匹配任何 `Some` 中的值。因为这里的 `y` 在 `match` 表达式的作用域中，而不是之前 `main` 作用域中，所以这是一个新变量，不是开头声明为值 10 的那个 `y`。这个新的 `y` 绑定会匹配任何 `Some` 中的值，在这里是 `x` 中的值。因此这个 `y` 绑定了 `x` 中 `Some` 内部的值。这个值是 5，所以这个分支的表达式将会执行并打印出 `Matched，y = 5`。

如果x是none那么就会匹配最后一个


还可以通过序列`..=`匹配值的范围
```rust
let x = 5;

match x {
    1..=5 => println!("one through five"),
    _ => println!("something else"),
}

```


解构结构体
```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };

    let Point { x, y } = p;
    assert_eq!(0, x);
    assert_eq!(7, y);
    

    let Point { x: a, y: b } = p;
    assert_eq!(0, a);
    assert_eq!(7, b);
}
```

上下两种都可以
知道解构结构体之后
我们可以通过匹配结构体来进行控制
```rust
fn main() {
    let p = Point { x: 0, y: 7 };

    match p {
        Point { x, y: 0 } => println!("On the x axis at {}", x),
        Point { x: 0, y } => println!("On the y axis at {}", y),
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),
    }
}
```

打印第二分之，on the y axis at 7


解构结构体和元组
```rust
struct Point {
     x: i32,
     y: i32,
 }

let ((feet, inches), Point {x, y}) = ((3, 10), Point { x: 3, y: -10 });

```


解构数组
数组有定长和非定长
对于定长可以
```rust
let arr: [u16; 2] = [114, 514];
let [x, y] = arr;

assert_eq!(x, 114);
assert_eq!(y, 514);

```

对于不定长数组
```rust
let arr: &[u16] = &[114, 514];

if let [x, ..] = arr {
    assert_eq!(x, &114);
}

if let &[.., y] = arr {
    assert_eq!(y, 514);
}

let arr: &[u16] = &[];

assert!(matches!(arr, [..]));
assert!(!matches!(arr, [x, ..]));

```

下划线_开头可以忽略未使用的变量同时也不会设计所有权的移交
..忽略剩余值
```rust
fn main() {
    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (first, .., last) => {
            println!("Some numbers: {}, {}", first, last);
        },
    }
}
```

省略中间值

```rust
fn main() {
    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (.., second, ..) => {
            println!("Some numbers: {}", second)
        },
    }
}
```
但是这种是错误的有歧义，无法知道second到底是第几个


```rust
let x = 4;
let y = false;

match x {
    4 | 5 | 6 if y => println!("yes"),
    _ => println!("no"),
}

```
这个匹配条件表明此分支只匹配 `x` 值为 `4`、`5` 或 `6` **同时** `y` 为 `true` 的情况。



### 方法Method

Rust使用impl来定义方法，例如：
```rust
struct Circle {
    x: f64,
    y: f64,
    radius: f64,
}

impl Circle {
    // new是Circle的关联函数，因为它的第一个参数不是self，且new并不是关键字
    // 这种方法往往用于初始化当前结构体的实例
    fn new(x: f64, y: f64, radius: f64) -> Circle {
        Circle {
            x: x,
            y: y,
            radius: radius,
        }
    }

    // Circle的方法，&self表示借用当前的Circle结构体
    fn area(&self) -> f64 {
        std::f64::consts::PI * (self.radius * self.radius)
    }
}

```
struct定义属性，impl定义方法，更加灵活


### 泛型极其特征

#### 泛型
```rust
fn add<T>(a:T, b:T) -> T {
    a + b
}

```

但是rust是极其安全的，如果是两个vec类型如何相加
因此这个代码是有些许错误的
应该是要赋予一些权限
```rust
fn add<T: std::ops::Add<Output = T>>(a:T, b:T) -> T {
    a + b
}

```


```rust
struct Point<T,U> {
    x: T,
    y: U,
}
fn main() {
    let p = Point{x: 1, y :1.1};
}
```

下面的数组是有问题的
```rust
fn display_array(arr: [i32; 3]) {
    println!("{:?}", arr);
}
fn main() {
    let arr: [i32; 3] = [1, 2, 3];
    display_array(arr);

    let arr: [i32; 2] = [1, 2];
    display_array(arr);
}
```

因为[i32,3]和[i32,2]是不一样的

```rust
fn display_array<T: std::fmt::Debug>(arr: &[T]) {
    println!("{:?}", arr);
}
fn main() {
    let arr: [i32; 3] = [1, 2, 3];
    display_array(&arr);

    let arr: [i32; 2] = [1, 2];
    display_array(&arr);
}
```

这种是对于不限制长度的数组
如果是限制长度的数组那么应该是
```rust
fn display_array<T: std::fmt::Debug, const N: usize>(arr: [T; N]) {
    println!("{:?}", arr);
}
fn main() {
    let arr: [i32; 3] = [1, 2, 3];
    display_array(arr);

    let arr: [i32; 2] = [1, 2];
    display_array(arr);
}
```


#### 特征行为
```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

```

用于共享的行为

比如

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}
pub struct Post {
    pub title: String, // 标题
    pub author: String, // 作者
    pub content: String, // 内容
}

impl Summary for Post {
    fn summarize(&self) -> String {
        format!("文章{}, 作者是{}", self.title, self.author)
    }
}

pub struct Weibo {
    pub username: String,
    pub content: String
}

impl Summary for Weibo {
    fn summarize(&self) -> String {
        format!("{}发表了微博{}", self.username, self.content)
    }
}

```



默认实现
```rust
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}
impl Summary for Post {}

```
就可以调用post下的方法。

类型约束
```rust
pub fn notify(item1: &impl Summary, item2: &impl Summary) {}

```
约束了需要item1和item2实现了summary基本特征即可


where约束使签名更加可读
比如将
```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {}

```
改为这个
```rust
fn some_function<T, U>(t: &T, u: &U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{}

```

增加特征约束之后前面的问题
无法使用 > 的问题就可以解决

```rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest(&char_list);
    println!("The largest char is {}", result);
}
```


调用方法需要引入特征
```rust
use std::convert::TryInto;

fn main() {
  let a: i32 = 10;
  let b: u16 = 100;

  let b_ = b.try_into()
            .unwrap();

  if a < b_ {
    println!("Ten is less than one hundred.");
  }
}
```

实现加法
```rust
use std::ops::Add;
#[derive(Debug,Clone,Copy)]
struct Point<T: Add<T, Output = T>> {
    x: T,
    y: T,
}
impl<T: Add<T, Output = T>> Add for Point<T> {
    type Output = Self;
    fn add(self, p: Self) -> Self::Output {
        Point {
            x: self.x + p.x,
            y: self.y + p.y,
        }
    }
}

fn add<T: Add<Output = T> + Copy>(a:&T, b:&T) -> T {
    *a + *b
}

fn main() {
    let p1 = Point { x: 1, y: 2 };
    let p2 = Point { x: 3, y: 4 };

    println!("{:?}", add(&p1, &p2));
    println!("{:?}",p1.add(p2));
}

```

比如实现选择一个数组中最大数
类型T不知道是否实现了Copy特性，因此我们需要自己增加特征约束
```rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn main() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];

    let result = largest(&char_list);
    println!("The largest char is {}", result);
}
```


derive派生特征
```rust
#[derive(Debug)]
```
这种是一种特征派生语法，被 `derive` 标记的对象会自动实现对应的默认特征代码，继承相应的功能。
比如对于结构体，你想要打印就需要指派这个属性
`derive` 派生出来的是 Rust 默认给我们提供的特征，在开发过程中极大的简化了自己手动实现相应特征的需求

![](Rust%E5%AD%A6%E4%B9%A0%E5%B0%8F%E8%AE%B0.assets/Pasted%20image%2020240417163159.png)

而指派了之后


![](Rust%E5%AD%A6%E4%B9%A0%E5%B0%8F%E8%AE%B0.assets/Pasted%20image%2020240417163305.png)

这里警告是因为，我们没有使用name和age


调用方法引入特征
当有些场景不能使用`as`关键字做类型转化，可以使用TryInto

```rust
use std::convert::TryInto;

fn main() {
  let a: i32 = 10;
  let b: u16 = 100;

  let b_ = b.try_into()
            .unwrap();

  if a < b_ {
    println!("Ten is less than one hundred.");
  }
}
```


#### 特征对象

```rust
pub trait Draw {
    fn draw(&self);
}
pub struct Button {
    pub width: u32,
    pub height: u32,
    pub label: String,
}

impl Draw for Button {
    fn draw(&self) {
        // 绘制按钮的代码
    }
}

struct SelectBox {
    width: u32,
    height: u32,
    options: Vec<String>,
}

impl Draw for SelectBox {
    fn draw(&self) {
        // 绘制SelectBox的代码
    }
}


```



特征对象只想实现了Draw特征的类型的实例，可以通过&或者Box<  T >智能指针实现

当使用特征对象时，Rust 必须使用动态分发。

Self和self

在 Rust 中，有两个`self`，一个指代当前的实例对象，一个指代特征或者方法类型的别名：



```rust
trait Draw {
    fn draw(&self) -> Self;
}

#[derive(Clone)]
struct Button;
impl Draw for Button {
    fn draw(&self) -> Self {
        return self.clone()
    }
}

fn main() {
    let button = Button;
    let newb = button.draw();
}
```




不是所有特征都能拥有特征对象，只有对象安全的特征才行。当一个特征的所有方法都有如下属性时，它的对象才是安全的：

- 方法的返回类型不能是 `Self`
- 方法没有任何泛型参数