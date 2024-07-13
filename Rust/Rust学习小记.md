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


 `String` 类型

`String` 是 Rust 标准库中定义的一个可变、拥有所有权的字符串类型，它存储在堆内存上，并且可以动态增长或缩小。`String` 类似于其他编程语言中的可变字符串，如 C++ 的 `std::string` 或 Python 的字符串对象。它包含以下特性：

- **动态大小**：`String` 可以在程序运行时改变其长度。
- **UTF-8 编码**：内部存储的是 UTF-8 编码的字节序列。
- **所有权**：当一个 `String` 被分配给一个变量或被返回时，这个变量或返回值将拥有字符串的所有权，意味着它负责释放内存。
- **方法丰富**：提供了多种方法来操作字符串，如 `push`, `pop`, `push_str`, `truncate`, `replace`, `append`, `clear` 等。

 `&str` 类型

`&str`，通常称为“字符串切片”或者“字符串引用”，是一个不可变的字符串类型。它不是独立存在的，而是对一个已经存在字符串数据的引用（通常是 `String` 或静态字符串字面量）。`&str` 的特点包括：

- **不可变**：一旦创建，其内容不能被修改。
- **栈上的引用**：`&str` 本身存储在栈上，它由一个指向堆上实际数据的指针以及一个长度组成。
- **固定大小**：作为引用，它的大小在编译时就是已知的，因此它可以作为函数参数、结构体成员等，不需要额外的堆分配。
- **UTF-8 编码**：同样采用 UTF-8 编码，和 `String` 一致。
- **无所有权**：持有 `&str` 的变量并不拥有底层数据的所有权，仅仅是借用。

转换关系：

- 从 `&str` 到 `String`：可以使用 `to_string()` 方法或其他相关方法复制一份数据并生成一个新的 `String`。
- 从 `String` 到 `&str`：可以直接获取一个不可变引用，如 `&my_string`，这会隐式地进行类型转换。


一个类型是否具有Copy特征，需要满足
1. 类型自身是 Plain Old Data (POD)，即它是不可变的，不含有任何指针或引用。
2. 类型的所有组成部分（如果是复合类型，比如元组、结构体或枚举）也都实现了 `Copy` 特性。
常见实现了Copy特性的
- 所有的标量类型（如整数、浮点数），例如 `u8`, `i32`, `f64`。
- 布尔类型 `bool`。
- 枚举类型，其中所有的变体都是 `Copy` 类型。
- 具有 `Copy` 类型字段的结构体，且结构体本身没有实现任何自定义的 `Drop` trait。


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
if condition :: 3 {
    // A...
} else if condition :: 4{
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

        if counter :: 10 {
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
    v.iter().filter(|x| x :: MyEnum::Foo);
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

对象安全对于特征对象是必须的，因为一旦有了特征对象，就不再需要知道实现该特征的具体类型是什么了。

标准库中的 `Clone` 特征就不符合对象安全的要求：
```rust
pub struct Screen {
    pub components: Vec<Box<dyn Clone>>,
}

```


####  深入特征
 **`Self` 用来指代当前调用者的具体类型，那么 `Self::Item` 就用来指代该类型实现中定义的 `Item` 类型**：
 ```rust
 impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        // --snip--
    }
}

fn main() {
    let c = Counter{..}
    c.next()
}
```

同时也支持泛型
```rust
pub trait Iterrator<Item>{
	fn next(&mut self) -> Option<Item>;
}
```

可以看到，由于使用了泛型，导致函数头部也必须增加泛型的声明，而使用关联类型，将得到可读性好得多的代码：
```rust
trait Container{
    type A;
    type B;
    fn contains(&self, a: &Self::A, b: &Self::B) -> bool;
}

fn difference<C: Container>(container: &C) {}

```

默认泛型类型参数

当使用泛型类型参数时，可以为其指定一个默认的具体类型，例如标准库中的 `std::ops::Add` 特征：
```rust
use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

fn main() {
    assert_eq!(Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
               Point { x: 3, y: 3 });
}
```
上面的代码主要干了一件事，就是为 `Point` 结构体提供 `+` 的能力，这就是**运算符重载**，不过 Rust 并不支持创建自定义运算符，你也无法为所有运算符进行重载，目前来说，只有定义在 `std::ops` 中的运算符才能进行重载。
跟 `+` 对应的特征是 `std::ops::Add`


两个不同类型的相加
```rust
use std::ops::Add;

struct Millimeters(u32);
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;

    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + (other.0 * 1000))
    }
}

```
默认类型参数的主要用于：
1. 减少实现的样板代码
2. 扩展类型但是无需大幅修改现有的代码

不同特征拥有同名方法是很正常 的事情，你没有任何办法阻止；
```rust
trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}

impl Human {
    fn fly(&self) {
        println!("*waving arms furiously*");
    }
}

```

这里，不仅仅两个特征 `Pilot` 和 `Wizard` 有 `fly` 方法，就连实现那两个特征的 `Human` 单元结构体，也拥有一个同名方法 `fly` 

优先调用类型上的方法：
```rust
fn main() {
    let person = Human;
    person.fly();
}
```
调用的是Human上的fly方法
如果需要调用特征方法：
```rust
fn main() {
    let person = Human;
    Pilot::fly(&person); // 调用Pilot特征上的方法
    Wizard::fly(&person); // 调用Wizard特征上的方法
    person.fly(); // 调用Human类型自身的方法
}
```

因为 `fly` 方法的参数是 `self`，当显式调用时，编译器就可以根据调用的类型( `self` 的类型)决定具体调用哪个方法。


```rust
trait Animal {
    fn baby_name() -> String;
}

struct Dog;

impl Dog {
    fn baby_name() -> String {
        String::from("Spot")
    }
}

impl Animal for Dog {
    fn baby_name() -> String {
        String::from("puppy")
    }
}

fn main() {
    println!("A baby dog is called a {}", Dog::baby_name());
}
```

上面这种调用方法时正确的
下面这个是错误的，(相当于Animal有很多子类，不知道调用的是那个子类的方法)，实际上是特征可以属于多个，因此需要指明是哪一个类型的特征。
```rust
fn main() {
    println!("A baby dog is called a {}", Animal::baby_name());
}
```
需要使用完全限定语法

```rust
fn main() {
    println!("A baby dog is called a {}", <Dog as Animal>::baby_name());
}
```
其定义为：
```rust
<Type as Trait>::function(receiver_if_method, next_arg, ...);

```


特征定义中的特征约束
```rust
use std::fmt::Display;
trait OutlinePrint: Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("*{}*", " ".repeat(len + 2));
        println!("* {} *", output);
        println!("*{}*", " ".repeat(len + 2));
        println!("{}", "*".repeat(len + 4));
    }
}
```

这里的 `OutlinePrint:Dispaly`这个很像特征约束。
这和特征约束非常类似，都用来说明一个特征需要实现另一个特征，这里就是：如果你想要实现 `OutlinePrint` 特征，首先你需要实现 `Display` 特征。


```rust
use std::fmt;

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

```
上面代码为 `Point` 实现了 `Display` 特征，那么 `to_string` 方法也将自动实现：最终获得字符串是通过这里的 `fmt` 方法获得的。



### 集合类型

#### 动态数组vector

创建动态数组
```rust
let vec:Vec<i32> = Vec::new();
```

2. vec!宏创建
```rust
let vec = vec![1,2,3];
```

如果需要更新vector需要声明mut
```rust
let mut v = vec![1,3,4];
v.push(1);
```

从vector读取元素
- 下标索引读取
- 使用get方法读取

```rust
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
println!("第三个元素是 {}", third);

match v.get(2) {
    Some(third) => println!("第三个元素是 {third}"),
    None => println!("去你的第三个元素，根本没有！"),
}

```

当确保索引不会越界时推荐使用索引，否则.get
同时借用多个数组元素
```rust
let mut v = vec![1, 2, 3, 4, 5];

let first = &v[0];

v.push(6);

println!("The first element is: {first}");

```
这个会引发编译器报错
原因在于：数组的大小是可变的，当旧数组的大小不够用时，Rust 会重新分配一块更大的内存空间，然后把旧数组拷贝过来。这种情况下，之前的引用显然会指向一块无效的内存，这非常 rusty —— 对用户进行严格的教育。

迭代遍历Vector中的元素
```rust
let v = vec![1, 2, 3];
for i in &v {
    println!("{i}");
}

```

也可以迭代修改
```rust
let mut v = vec![1, 2, 3];
for i in &mut v {
    *i += 10
}

```


存储不同类型的元素
开始提到数组中存放元素类型必须相同，但是可以通过使用枚举类型和特征对象来实现不同类型元素的存储
对于枚举类型
```rust
#[derive(Debug)]
enum IpAddr {
    V4(String),
    V6(String)
}
fn main() {
    let v = vec![
        IpAddr::V4("127.0.0.1".to_string()),
        IpAddr::V6("::1".to_string())
    ];

    for ip in v {
        show_addr(ip)
    }
}

fn show_addr(ip: IpAddr) {
    println!("{:?}",ip);
}
```

特征对象的实现
```rust
trait IpAddr {
    fn display(&self);
}

struct V4(String);
impl IpAddr for V4 {
    fn display(&self) {
        println!("ipv4: {:?}",self.0)
    }
}
struct V6(String);
impl IpAddr for V6 {
    fn display(&self) {
        println!("ipv6: {:?}",self.0)
    }
}

fn main() {
    let v: Vec<Box<dyn IpAddr>> = vec![
        Box::new(V4("127.0.0.1".to_string())),
        Box::new(V6("::1".to_string())),
    ];

    for ip in v {
        ip.display();
    }
}
```

在实际使用场景中，**特征对象数组要比枚举数组常见很多**，主要原因在于特征对象非常灵活，而编译器对枚举的限制较多，且无法动态增加类型。


Vector常用方法：
```rust
fn main() {
    let v = vec![0; 3];   // 默认值为 0，初始长度为 3
    let v_from = Vec::from([0, 0, 0]);
    assert_eq!(v, v_from);
}
```

动态数组意味着我们增加元素时，如果**容量不足就会导致 vector 扩容**，一般扩容策略是往2倍增加，类似于c++的vector

为了避免多次频繁扩容（因为大量的内存拷贝会降低程序的性能）
```rust
fn main() {
    let mut v = Vec::with_capacity(10);
    v.extend([1, 2, 3]);    // 附加数据到 v
    println!("Vector 长度是: {}, 容量是: {}", v.len(), v.capacity());

    v.reserve(100);        // 调整 v 的容量，至少要有 100 的容量
    println!("Vector（reserve） 长度是: {}, 容量是: {}", v.len(), v.capacity());

    v.shrink_to_fit();     // 释放剩余的容量，一般情况下，不会主动去释放容量
    println!("Vector（shrink_to_fit） 长度是: {}, 容量是: {}", v.len(), v.capacity());
}


```

打印的分别是：
- Vector 长度是: 3, 容量是: 10
- Vector（reserve） 长度是: 3, 容量是: 103
- Vector（shrink_to_fit） 长度是: 3, 容量是: 3

```rust
let mut v =  vec![1, 2];
assert!(!v.is_empty());         // 检查 v 是否为空

v.insert(2, 3);                 // 在指定索引插入数据，索引值不能大于 v 的长度， v: [1, 2, 3] 
assert_eq!(v.remove(1), 2);     // 移除指定位置的元素并返回, v: [1, 3]
assert_eq!(v.pop(), Some(3));   // 删除并返回 v 尾部的元素，v: [1]
assert_eq!(v.pop(), Some(1));   // v: []
assert_eq!(v.pop(), None);      // 记得 pop 方法返回的是 Option 枚举值
v.clear();                      // 清空 v, v: []

let mut v1 = [11, 22].to_vec(); // append 操作会导致 v1 清空数据，增加可变声明
v.append(&mut v1);              // 将 v1 中的所有元素附加到 v 中, v1: []
v.truncate(1);                  // 截断到指定长度，多余的元素被删除, v: [11]
v.retain(|x| *x > 10);          // 保留满足条件的元素，即删除不满足条件的元素

let mut v = vec![11, 22, 33, 44, 55];
// 删除指定范围的元素，同时获取被删除元素的迭代器, v: [11, 55], m: [22, 33, 44]
let mut m: Vec<_> = v.drain(1..=3).collect();    

let v2 = m.split_off(1);        // 指定索引处切分成两个 vec, m: [22], v2: [33, 44]

```


获取部分元素也可以通过切片
```rust
fn main() {
    let v = vec![11, 22, 33, 44, 55];
    let slice = &v[1..=3];
    assert_eq!(slice, &[22, 33, 44]);
}
```


vector的排序
分为两类
- sort_unstable 和sort_unstable_by，不稳定排序
- sort和sort_by，稳定排序
当然，这个所谓的 `非稳定` 并不是指排序算法本身不稳定，而是指在排序过程中对相等元素的处理方式。在 `稳定` 排序算法里，对相等的元素，不会对其进行重新排序。而在 `不稳定` 的算法里则不保证这点。

总体而言，`非稳定` 排序的算法的速度会优于 `稳定` 排序算法，同时，`稳定` 排序还会额外分配原数组一半的空间。

浮点数类型并没有实现全数值可比较 `Ord` 的特性，而是实现了部分可比较的特性 `PartialOrd`。
因此浮点数排序不能这样子写
```rust
fn main() {
    let mut vec = vec![1.0, 5.6, 10.3, 2.0, 15f32];    
    vec.sort_unstable();    
    assert_eq!(vec, vec![1.0, 2.0, 5.6, 10.3, 15f32]);
}
```

如此，如果我们确定在我们的浮点数数组当中，不包含 `NAN` 值，那么我们可以使用 `partial_cmp` 来作为大小判断的依据。
```rust
fn main() {
    let mut vec = vec![1.0, 5.6, 10.3, 2.0, 15f32];    
    vec.sort_unstable_by(|a, b| a.partial_cmp(b).unwrap());    
    assert_eq!(vec, vec![1.0, 2.0, 5.6, 10.3, 15f32]);
}
```



排序需要我们实现 `Ord` 特性，那么如果我们把我们的结构体实现了该特性，是否就不需要我们自定义对比函数了呢？

是，但不完全是，实现 `Ord` 需要我们实现 `Ord`、`Eq`、`PartialEq`、`PartialOrd` 这些属性。好消息是，你可以 `derive` 这些属性：

```rust
#[derive(Debug, Ord, Eq, PartialEq, PartialOrd)]
struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Person {
        Person { name, age }
    }
}

fn main() {
    let mut people = vec![
        Person::new("Zoe".to_string(), 25),
        Person::new("Al".to_string(), 60),
        Person::new("Al".to_string(), 30),
        Person::new("John".to_string(), 1),
        Person::new("John".to_string(), 25),
    ];

    people.sort_unstable();

    println!("{:?}", people);
}
```
这样就不用我们手写许多的比较函数了



#### KV存储HashMap

`HashMap` 中存储的是一一映射的 `KV` 键值对，并提供了平均复杂度为 `O(1)` 的查询方法

创建hashmap
使用hashmap时需要手动使用 `use ...`来进行导入
Rust 为了简化用户使用，提前将最常用的类型自动引入到作用域中，际preload中，但是hashmap不在其中
1. 使用new方法创建
```rust
use std::collections::HashMap;

// 创建一个HashMap，用于存储宝石种类和对应的数量
let mut my_gems = HashMap::new();

// 将宝石类型和对应的数量写入表中
my_gems.insert("红宝石", 1);
my_gems.insert("蓝宝石", 2);
my_gems.insert("河边捡的误以为是宝石的破石头", 18);

```

hashmap的k必须是同类型，v也是
跟 `Vec` 一样，如果预先知道要存储的 `KV` 对个数，可以使用 `HashMap::with_capacity(capacity)` 创建指定大小的 `HashMap`，避免频繁的内存分配和拷贝，提升性能。

2. 使用迭代起和collect方法创建
比如有一个数组存储了一个元组，如何将数组中的数据迁移到hashmap中
1. 使用遍历
   ```rust
   fn main() {
    use std::collections::HashMap;

    let teams_list = vec![
        ("中国队".to_string(), 100),
        ("美国队".to_string(), 10),
        ("日本队".to_string(), 50),
    ];

    let mut teams_map = HashMap::new();
    for team in &teams_list {
        teams_map.insert(&team.0, team.1);
    }

    println!("{:?}",teams_map)
}
```
2. 先讲vec转化为迭代器，然后使用collect方法，将迭代器中的元素收集之后转化成hashmap
   ```rust
   fn main() {
    use std::collections::HashMap;

    let teams_list = vec![
        ("中国队".to_string(), 100),
        ("美国队".to_string(), 10),
        ("日本队".to_string(), 50),
    ];

    let teams_map: HashMap<_,_> = teams_list.into_iter().collect();
    
    println!("{:?}",teams_map)
}
```

所有权转移
- 若类型实现 `Copy` 特征，该类型会被复制进 `HashMap`，因此无所谓所有权
- 若没实现 `Copy` 特征，所有权将被转移给 `HashMap` 中
```rust
fn main() {
    use std::collections::HashMap;

    let name = String::from("Sunface");
    let age = 18;

    let mut handsome_boys = HashMap::new();
    handsome_boys.insert(name, age);

    println!("因为过于无耻，{}已经被从帅气男孩名单中除名", name);
    println!("还有，他的真实年龄远远不止{}岁", age);
}
```

比如这里name是String类型，没有实现Copy特征
因此这段代码会报错。name的所有权已经移交给handsome_boys了


如果将引用类型放在hashMap中，请确保改引用的生命周期至少跟hashMap活的一样久

```rust
fn main() {
    use std::collections::HashMap;

    let name = String::from("Sunface");
    let age = 18;

    let mut handsome_boys = HashMap::new();
    handsome_boys.insert(&name, age);

    std::mem::drop(name);
    println!("因为过于无耻，{:?}已经被除名", handsome_boys);
    println!("还有，他的真实年龄远远不止{}岁", age);
}
```
比如说这里的name被drop掉了
那么这里就会报错，因为hashmap中存储引用的值的内存地址已经被释放了

查询hashmap
通过get方法获取元素

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

let team_name = String::from("Blue");
let score: Option<&i32> = scores.get(&team_name);

```
注意
- `get` 方法返回一个 `Option<&i32>` 类型：当查询不到时，会返回一个 `None`，查询到时返回 `Some(&i32)`
- `&i32` 是对 `HashMap` 中值的借用，如果不使用借用，可能会发生所有权的转移

copied方法是对Option<&T>或者Option<&mut T>使用的，T必须实现Copy特性，此方法会尝试从 `Some(&T)` 中复制出 `T` 类型的值，并返回一个 `Option<T>`。如果原始 `Option` 为 `None`，则结果也是 `None`。

```rust
let x: Option<&i32> = Some(&5);
let y = x.copied(); // y: Option<i32> = Some(5)

let z: Option<&i32> = None;
let w = z.copied(); // w: Option<i32> = None
```

unwrap_or，用于从 `Option<T>` 中取出 `Some(T)` 中的值，如果 `Option` 为 `None`，则返回一个默认值。该方法接受一个 `T` 类型的参数作为默认值。

```rust
let maybe_number: Option<i32> = Some(42);
let number = maybe_number.unwrap_or(0); // number: i32 = 42

let empty_option: Option<i32> = None;
let default_number = empty_option.unwrap_or(0); // default_number: i32 = 0
```

这样就可以得到值
通过copeid从Some< T >得到Option< T>，然后再通过unwrap_or得到值

通过循环的方式遍历hashmap
```rust
for (key,value) in &scores{
	println!("{}:{}",key,value);
}
```

更新hashmap中的值
```rust
fn main() {
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert("Blue", 10);

    // 覆盖已有的值
    let old = scores.insert("Blue", 20);
    assert_eq!(old, Some(10));

    // 查询新插入的值
    let new = scores.get("Blue");
    assert_eq!(new, Some(&20));

    // 查询Yellow对应的值，若不存在则插入新值
    let v = scores.entry("Yellow").or_insert(5);
    assert_eq!(*v, 5); // 不存在，插入5

    // 查询Yellow对应的值，若不存在则插入新值
    let v = scores.entry("Yellow").or_insert(50);
    assert_eq!(*v, 5); // 已经存在，因此50没有插入
}
```

上面代码中，新建一个 `map` 用于保存词语出现的次数，插入一个词语时会进行判断：若之前没有插入过，则使用该词语作 `Key`，插入次数 0 作为 `Value`，若之前插入过则取出之前统计的该词语出现的次数，对其加一。

- `or_insert` 返回了 `&mut v` 引用，因此可以通过该可变引用直接修改 `map` 中对应的值
- 使用 `count` 引用时，需要先进行解引用 `*count`，否则会出现类型不匹配


一个类型能否作为 `Key` 的关键就是是否能进行相等比较，或者说该类型是否实现了 `std::cmp::Eq` 特征。

f32 和 f64 浮点数，没有实现 `std::cmp::Eq` 特征，因此不可以用作 `HashMap` 的 `Key`。

哈希函数：通过它把 `Key` 计算后映射为哈希值，然后使用该哈希值来进行存储、查询、比较等操作。

高性能第三方库，可以去creates.io上寻找其他的哈希函数实现
比如：
```rust
use std::hash::BuildHasherDefault;
use std::collections::HashMap;
// 引入第三方的哈希函数
use twox_hash::XxHash64;

// 指定HashMap使用第三方的哈希函数XxHash64
let mut hash: HashMap<_, _, BuildHasherDefault<XxHash64>> = Default::default();
hash.insert(42, "the answer");
assert_eq!(hash.get(&42), Some(&"the answer"));

```




### 生命周期
生命周期，简而言之就是引用的`有效作用域`。在大多数时候，我们无需手动的声明生命周期，因为编译器可以自动进行推导，用类型来类比下：
- 就像编译器大部分时候可以自动推导类型 <-> 一样，编译器大多数时候也可以自动推导生命周期
- 在多种类型存在时，编译器往往要求我们手动标明类型 <-> 当多个生命周期存在，且编译器无法推导出某个引用的生命周期时，就需要我们手动标明生命周期

悬垂指针和生命周期
生命周期的主要作用就是避免悬垂引用和，会导致程序引用了不该引用和的数据
```rust
{
    let r;

    {
        let x = 5;
        r = &x;
    }

    println!("r: {}", r);
}

```

比如这里
- `let r;` 的声明方式貌似存在使用 `null` 的风险，实际上，当我们不初始化它就使用时，编译器会给予报错
- `r` 引用了内部花括号中的 `x` 变量，但是 `x` 会在内部花括号 `}` 处被释放，因此回到外部花括号后，`r` 会引用一个无效的 `x`

此处 `r` 就是一个悬垂指针，它引用了提前被释放的变量 `x`，可以预料到，这段代码会报错：
在这里 `r` 拥有更大的作用域，或者说**活得更久**。如果 Rust 不阻止该悬垂引用的发生，那么当 `x` 被释放后，`r` 所引用的值就不再是合法的，会导致我们程序发生异常行为，且该异常行为有时候会很难被发现。


借用检查
```rust
{
    let r;                      // ---------+-- 'a
                       //          |
    {                            //          |
        let x = 5;        // -+-- 'b  |
        r = &x;           //  |       |
    }                           // -+       |
                     //          |
    println!("r: {}", r); //          |
}                                 // ---------+

```

函数中的生命周期
```rust
fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}

fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```
这段代码是报错的，因为编译器需要知道这些，来确保函数调用后的引用生命周期分析。
在存在多个引用时，编译器有时会无法自动推导生命周期，此时就需要我们手动去标注，通过为参数标注合适的生命周期来帮助编译器进行借用检查的分析。

生命周期标注语法（标注生命周期为了让编译器知道）

```rust
&i32        // 一个引用
&'a i32     // 具有显式生命周期的引用
&'a mut i32 // 具有显式生命周期的可变引用

```

此处生命周期标注仅仅说明，**这两个参数 `first` 和 `second` 至少活得和'a 一样久，至于到底活多久或者哪个活得更久，抱歉我们都无法得知**：
```rust
fn useless<'a>(first: &'a i32, second: &'a i32) {}
```

之前那个进行标注生命周期之后就能通过编译了
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

```
- 和泛型一样，使用生命周期参数，需要先声明 `<'a>`
- `x`、`y` 和返回值至少活得和 `'a` 一样久(因为返回值要么是 `x`，要么是 `y`)

虽然两个参数的生命周期都是标注了 `'a`，但是实际上这两个参数的真实生命周期可能是不一样的(生命周期 `'a` 不代表生命周期等于 `'a`，而是大于等于 `'a`)。

**在通过函数签名指定生命周期参数时，我们并没有改变传入引用或者返回引用的真实生命周期，而是告诉编译器当不满足此约束条件时，就拒绝编译通过**。
没有改变原来的，只是说向编译器声一个约束条件


```rust
fn main() {
    let string1 = String::from("long string is long");

    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}
```

这一段和下面一段都是result偏向于生命周期更小的那一个也就是string2的生命周期，但是在下面这个代码第二个花括号结束之后，string2就被回收了，那么result就不能借用
```rust
fn main() {
    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
    }
    println!("The longest string is {}", result);
}
```


如果一个函数的返回值是一个引用类型，那么他的生命周期之后来源于
- 函数参数的生命周期
- 函数体重某个新建引用的生命 周期
如果是后者那么就是典型了悬垂引用场景，因为在函数结束之后返回的是一个借用，而借用本身指向的值会在函数结束之后被回收
![](Pasted%20image%2020240419205341.png)
因此如果是后者的情况，最好返回这个类型的所有权。


结构体的生命周期：

只要为结构体中的**每一个引用标注上生命周期**即可
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
```
当结构体比引用 的字符串活的更久，那么就会导致无效的引用


生命周期消除
**编译器为了简化用户的使用，运用了生命周期消除大法**。
对于 `first_word` 函数，它的返回值是一个引用类型，那么该引用只有两种情况：

- 从参数获取
- 从函数体内部新创建的变量获取
Rust1.0版本之前
必须显示标注生命周期
```rust
fn first_word<'a>(s: &'a str) -> &'a str {}

```


- 消除规则不是万能的，若编译器不能确定某件事是正确时(Rust的安全性！)，会直接判为不正确，那么你还是需要手动标注生命周期
- **函数或者方法中，参数的生命周期被称为 `输入生命周期`，返回值的生命周期被称为 `输出生命周期`**

Rust使用三条消除规则来确认哪些场景不需要显示地去标注生命周期
1. **每一个引用参数都会获得独自的生命周期**
   例如一个引用参数的函数就有一个生命周期标注: `fn foo<'a>(x: &'a i32)`，两个引用参数的有两个生命周期标注:`fn foo<'a, 'b>(x: &'a i32, y: &'b i32)`, 依此类推。
2. **若只有一个输入生命周期(函数参数中只有一个引用类型)，那么该生命周期会被赋给所有的输出生命周期**，也就是所有返回值的生命周期都等于该输入生命周期
   例如函数 `fn foo(x: &i32) -> &i32`，`x` 参数的生命周期会被自动赋给返回值 `&i32`，因此该函数等同于 `fn foo<'a>(x: &'a i32) -> &'a i32`
3. **若存在多个输入生命周期，且其中一个是 `&self` 或 `&mut self`，则 `&self` 的生命周期被赋给所有的输出生命周期**
   拥有 `&self` 形式的参数，说明该函数是一个 `方法`，该规则让方法的使用便利度大幅提升。

方法中的生命周期：
```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

```

为具有生命周期的结构体实现方法时，我们使用的语法跟泛型参数语法相似
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
}

```

### 返回值和错误处理

#### panic深入
panic!与不可恢复错误，如果有些错误可能严重影响程序运行的错误，触发painic是很好的解决方式。
Rust中触发panic有两种方式：被动触发和主动调用

被动触发：
```rust
fn main(){
	let v = vec![1,2,3];
	v[99];
}
```
指针越界了


主动调用，当执行该宏时，程序会打印一个错误信息，展开报错电往前的函数调用堆栈然后退出程序。
```rust
fn main() {
    panic!("crash and burn");
}
```
输出：
>thread 'main' panicked at 'crash and burn', src/main.rs:2:5 note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

backtrace栈展开

为什么上面的一个简单的数组越界会引发程序崩溃？
对于C语言而言，即使越界了，依然尝试访问，这个值是否是可取的与它无关，它只管取，那么可能造成安全漏洞（内存泄露），这个叫**缓冲区溢出**。
Rust宁愿程序崩溃也不愿出现一些可能造成安全漏洞的问题，因为这些问题出现后往往难以调试。
然后通过`RUST_BACKTRACE=1 cargo run`
执行就可以展开执行栈。


panic的两种中止方式
栈展开和直接终止。
对于绝大多数用户，使用默认选择是最好的，但是当你关心最终编译出的二进制可执行文件大小时，那么可以尝试去使用直接终止的方式，例如下面的配置修改 `Cargo.toml` 文件，实现在 [`release`](https://course.rs/first-try/cargo.html#%E6%89%8B%E5%8A%A8%E7%BC%96%E8%AF%91%E5%92%8C%E8%BF%90%E8%A1%8C%E9%A1%B9%E7%9B%AE) 模式下遇到 `panic` 直接终止：
```toml
[profile.release]
panic = 'abort'
```

何时使用panic!

这几个场景下，需要快速地搭建代码，错误处理会拖慢编码的速度，也不是特别有必要，因此通过 `unwrap`、`expect` 等方法来处理是最快的。
当然，如果该字符串是来自于用户输入，那在实际项目中，就必须用错误处理的方式，而不是 `unwrap`，否则你的程序一天要崩溃几十万次吧！

可能导致全局有害状态时
有害状态分为几种：
- 非预期的错误
- 后续代码的运行会受到显著影响
- 内存安全的问题

当错误预期会出现时，返回一个错误较为合适，例如解析器接收到格式错误的数据，HTTP 请求接收到错误的参数甚至该请求内的任何错误（不会导致整个程序有问题，只影响该次请求）。**因为错误是可预期的，因此也是可以处理的**。

当启动时某个流程发生了错误，对后续代码的运行造成了影响，那么就应该使用 `panic`，而不是处理错误后继续运行，当然你可以通过重试的方式来继续。



#### 可恢复的错误

比如有个代码
```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");
}
```
f是Result类型
>enum Result<T, E> {
    Ok(T),
    Err(E),
}
获知变量类型或者函数的返回类型
有几种常用的方式，此处更推荐第二种方法：

- 第一种是查询标准库或者三方库文档，搜索 `File`，然后找到它的 `open` 方法
- 在 [Rust IDE](https://course.rs/first-try/editor.html) 章节，我们推荐了 `VSCode` IDE 和 `rust-analyzer` 插件，如果你成功安装的话，那么就可以在 `VSCode` 中很方便的通过代码跳转的方式查看代码，同时 `rust-analyzer` 插件还会对代码中的类型进行标注，非常方便好用！
- 你还可以尝试故意标记一个错误的类型，然后让编译器告诉你：

比如这里故意标错类型
```rust
let f: u32 = File::open("hello.txt");

```
这些信息可以通过 `Result` 枚举提供：
```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => {
            panic!("Problem opening the file: {:?}", error)
        },
    };
}
```

对打开文件后的 `Result<T, E>` 类型进行匹配取值，如果是成功，则将 `Ok(file)` 中存放的的文件句柄 `file` 赋值给 `f`，如果失败，则将 `Err(error)` 中存放的错误信息 `error` 使用 `panic` 抛出来，进而结束程序，这非常符合上文提到过的 `panic` 使用场景。

panic处理错误非常粗暴，我们可以对部分错误进行特殊处理，而不是所有错误都直接崩溃
```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => panic!("Problem opening the file: {:?}", other_error),
        },
    };
}
```
上面代码在匹配出 `error` 后，又对 `error` 进行了详细的匹配解析，最终结果：

- 如果是文件不存在错误 `ErrorKind::NotFound`，就创建文件，这里创建文件`File::create` 也是返回 `Result`，因此继续用 `match` 对其结果进行处理：创建成功，将新的文件句柄赋值给 `f`，如果失败，则 `panic`
- 剩下的错误，一律 `panic`

失败就panic:unwrap金额expect
unwrap
```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").unwrap();
}
```
如果调用这段代码时hello.txt文件不存在，那么unwrap就将直接panic

expect和unwrap很像，也是遇到错误直接panic，但是会带上自定义的错误提示信息，相当于重载了错误打印的函数
```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").expect("Failed to open hello.txt");
}
```

传播错误
一个设计良好的程序，一个功能设计十几层的函数调用都有可能。而错误处理也往往不是哪里调用出错，就在哪里处理，实际应用中，大概率会把错误层层上传然后交给调用链的上游函数进行处理，错误传播将极为常见。

比如下面函数从文件中读取用户名，然后将结果进行返回
```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    // 打开文件，f是`Result<文件句柄,io::Error>`
    let f = File::open("hello.txt");

    let mut f = match f {
        // 打开文件成功，将file句柄赋值给f
        Ok(file) => file,
        // 打开文件失败，将错误返回(向上传播)
        Err(e) => return Err(e),
    };
    // 创建动态字符串s
    let mut s = String::new();
    // 从f文件句柄读取数据并写入s中
    match f.read_to_string(&mut s) {
        // 读取成功，返回Ok封装的字符串
        Ok(_) => Ok(s),
        // 将错误向上传播
        Err(e) => Err(e),
    }
}

```
有几点值得注意：

- 该函数返回一个 `Result<String, io::Error>` 类型，当读取用户名成功时，返回 `Ok(String)`，失败时，返回 `Err(io:Error)`
- `File::open` 和 `f.read_to_string` 返回的 `Result<T, E>` 中的 `E` 就是 `io::Error`

传播使用 `?`进行简化
比如上面的代码就能简化为
```rust
use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}

```
?就是一个宏，作用跟上面的match几乎一模一样
?还可以进行链式调用
更加精简的代码
```rust
use std::fs;
use std::io;

fn read_username_from_file() -> Result<String, io::Error> {
    // read_to_string是定义在std::io中的方法，因此需要在上面进行引用
    fs::read_to_string("hello.txt")
}

```

强大的`?`不仅是用于Result的传播，还能用于Option的传播

```rust
fn first(arr: &[i32]) -> Option<&i32> {
   let v = arr.get(0)?;
   Some(v)
}

```

```rust
fn last_char_of_first_line(text: &str) -> Option<char> {
    text.lines().next()?.chars().last()
}
```
上面代码展示了在链式调用中使用 `?` 提前返回 `None` 的用法， `.next` 方法返回的是 `Option` 类型：如果返回 `Some(&str)`，那么继续调用 `chars` 方法,如果返回 `None`，则直接从整个函数中返回 `None`，不再继续进行链式调用。

**切记**：`?` 操作符需要一个变量来承载正确的值，这个函数只会返回 `Some(&i32)` 或者 `None`
```rust
fn first(arr: &[i32]) -> Option<&i32> {
   arr.get(0)?
}

```
由上面的话可以知道，这段代码是错误的 ，编译无法通过。
?适用于以下形式
- `let v = xxx()?;`
- `xxx()?.yyy()?;`

带返回值的main函数
```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt")?;
}
```

因为 `?` 要求 `Result<T, E>` 形式的返回值，而 `main` 函数的返回是 `()`，因此无法满足，那是不是就无解了呢？

这里可以写main函数的其他类型了
```rust
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    let f = File::open("hello.txt")?;

    Ok(())
}
```
提前返回一个`()`


### 包和模块
#### 包
包：对于Rust而言，包是一个独立的可编译的单元，它编译之后生吃一个可执行文件或者一个库
例如标准库中没有提供但是在三方库中提供的 `rand` 包，它提供了随机数生成的功能，我们只需要将该包通过 `use rand;` 引入到当前项目的作用域中，就可以在项目中使用 `rand` 的功能：`rand::XXX`。

项目package
鉴于 Rust 团队标新立异的起名传统，以及包的名称被 `crate` 占用，库的名称被 `library` 占用，经过斟酌， 我们决定将 `Package` 翻译成项目，你也可以理解为工程、软件包。
一个 `Package` 只能包含**一个**库(library)类型的包，但是可以包含**多个**二进制可执行类型的包。


二进制package
创建一个二进制package
```shell
cargo new my-project
     ls my-project

ls my-project/src

```

创建一个库类型的package
```shell
cargo new my-lib --lib
ls my-lib
ls my-lib/src
```

不过，只要你牢记 `Package` 是一个项目工程，而包只是一个编译单元，基本上也就不会混淆这个两个概念了：`src/main.rs` 和 `src/lib.rs` 都是编译单元，因此它们都是包。


#### 模块Module
使用 `cargo new --lib restaurant` 创建一个小餐馆，注意，这里创建的是一个库类型的 `Package`，然后将以下代码放入 `src/lib.rs` 中：
```rust
// 餐厅前厅，用于吃饭
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}

```
- 使用 `mod` 关键字来创建新模块，后面紧跟着模块名称
- 模块可以嵌套，这里嵌套的原因是招待客人和服务都发生在前厅，因此我们的代码模拟了真实场景
- 模块中可以定义各种 Rust 类型，例如函数、结构体、枚举、特征等
- 所有模块均定义在同一个文件中

类似上述代码中所做的，使用模块，我们就能将功能相关的代码组织到一起，然后通过一个模块名称来说明这些代码为何被组织在一起。这样其它程序员在使用你的模块时，就可以更快地理解和上手。


模块树：
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
这颗树展示了模块之间**彼此的嵌套**关系，因此被称为**模块树**。其中 `crate` 包根是 `src/lib.rs` 文件，包根文件中的三个模块分别形成了模块树的剩余部分。

父子模块：
如果模块 `A` 包含模块 `B`，那么 `A` 是 `B` 的父模块，`B` 是 `A` 的子模块。在上例中，`front_of_house` 是 `hosting` 和 `serving` 的父模块，反之，后两者是前者的子模块。



使用路径引用模块
在Rust中路径常有两种形式
- 绝对路径，从包根开始，路径名以包名或者crate作为开头
- 相对路径，从当前模块开始，以self，supper或当前模块的标识符作为开头

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}

```

再回到模块树中，因为 `eat_at_restaurant` 和 `front_of_house` 都处于包根 `crate` 中，因此相对路径可以使用 `front_of_house` 作为开头：
```rust
front_of_house::hosting::add_to_waitlist();

```

实际使用时，需要遵守一个原则：`当代码被挪动位置时，尽量减少引用路径的修改`


不过，如果不确定哪个好，你可以考虑优先使用绝对路径，因为调用的地方和定义的地方往往是分离的，而定义的地方较少会变动。

代码可见性
```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}

```
这个是有报错问题的
```shell
error[E0603]: module `hosting` is private
 --> src/lib.rs:9:28
  |
9 |     crate::front_of_house::hosting::add_to_waitlist();
  |                            ::^^::^ private module

```

Rust 出于安全的考虑，默认情况下，所有的类型都是私有化的，包括函数、方法、结构体、枚举、常量，是的，就连模块本身也是私有化的。在中国，父亲往往不希望孩子拥有小秘密，但是在 Rust 中，**父模块完全无法访问子模块中的私有项，但是子模块却可以访问父模块、父父..模块的私有项**。


pub关键字
可以通过pub关键字控制模块和模块中指定想的可见性。
```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

/*--- snip ----*/

```

使用super引用模块
`super`代表是父模块为开始的引用方式，类似于`..和../a/b`方式
```rust
fn serve_order() {}

// 厨房模块
mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::serve_order();
    }

    fn cook_order() {}
}

```

那么你可能会问，为何不使用 `crate::serve_order` 的方式？额，其实也可以，不过如果你确定未来这种层级关系不会改变，那么 `super::serve_order` 的方式会更稳定，未来就算它们都不在包根了，依然无需修改引用路径。所以路径的选用，往往还是取决于场景，以及未来代码的可能走向。

self
`self`其实就是引用自身模块中的项，
```rust
fn serve_order() {
    self::back_of_house::cook_order()
}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        crate::serve_order();
    }

    pub fn cook_order() {}
}
```


注意：
- 将结构体设置为 `pub`，但它的所有字段依然是私有的
- 将枚举设置为 `pub`，它的所有字段也将对外可见
原因在于，枚举和结构体的使用方式不一样。如果枚举的成员对外不可见，那该枚举将一点用都没有，因此枚举成员的可见性自动跟枚举可见性保持一致，这样可以简化用户的使用。

而结构体的应用场景比较复杂，其中的字段也往往部分在 A 处被使用，部分在 B 处被使用，因此无法确定成员的可见性，那索性就设置为全部不可见，将选择权交给程序员。


模块文件分离
`src/front_of_house.rs`
```rust
pub mod hosting {
    pub fn add_to_waitlist() {}
}

```

然后另一段代码`src/lib.rs`
```rust
mod front_of_house;

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}

```


#### use
使用use简化路径

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}

```

在以上两种情况中，使用 `use front_of_house::hosting;` 引入模块要比 `use front_of_house::hosting::add_to_waitlist;` 引入函数更好。

例如引入HashMap
```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert(1, 2);
}
```

**先使用最细粒度(引入函数、结构体等)的引用方式，如果引起了某种麻烦(例如前面两种情况)，再使用引入模块的方式**。

需要避免同名引用
```rust
use std::fmt;
use std::io;

fn function1() -> fmt::Result {
    // --snip--
}

fn function2() -> io::Result<()> {
    // --snip--
}

```

上面的例子给出了很好的解决方案，使用模块引入的方式，具体的 `Result` 通过 `模块::Result` 的方式进行调用。

可以看出，避免同名冲突的关键，就是使用**父模块的方式来调用**，除此之外，还可以给予引入的项起一个别名。

as别名引用
```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // --snip--
}

fn function2() -> IoResult<()> {
    // --snip--
}

```

当外部的模块项 `A` 被引入到当前模块中时，它的可见性自动被设置为私有的，如果你希望允许其它外部代码引用我们的模块项 `A`，那么可以对它进行再导出：
```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}

```

使用 pub use实现
这里 `use` 代表引入 `hosting` 模块到当前作用域，`pub` 表示将该引入的内容再度设置为可见。

第三方库
推荐使用lib.rs还有crate.io
`lib.rs`，搜索功能更强大，内容展示也更加合理，但是下载依赖包还是得用`crates.io`。

使用{}简化引入方式
比如
```rust
use std::io;
use std::io::Write;

```
简化为`use std::io::{self,Write}`

使用* 引入模块下的所有项
```rust
use std::collections::*;
```

指定模块可见性
```rust
pub mod a {
    pub const I: i32 = 3;

    fn semisecret(x: i32) -> i32 {
        use self::b::c::J;
        x + J
    }

    pub fn bar(z: i32) -> i32 {
        semisecret(I) * z
    }
    pub fn foo(y: i32) -> i32 {
        semisecret(I) + y
    }

    mod b {
        pub(in crate::a) mod c {
            pub(in crate::a) const J: i32 = 4;
        }
    }
}

```
比如指定模块c和常量j可见范围都是a模块中

- `pub` 意味着可见性无任何限制
- `pub(crate)` 表示在当前包可见
- `pub(self)` 在当前模块可见
- `pub(super)` 在父模块可见
- `pub(in <path>)` 表示在某个路径代表的模块中可见，其中 `path` 必须是父模块或者祖先模块


#### 格式化输出
- `print!` 将格式化文本输出到标准输出，不带换行符
- `println!` 同上，但是在行的末尾添加换行符
- `format!` 将格式化文本输出到 `String` 字符串

在实际项目中，最常用的是 `println!` 及 `format!`，前者常用来调试输出，后者常用来生成格式化的字符串：

eprint!，eprintln!输出到标准错误输出

与其它语言常用的 `%d`，`%s` 不同，Rust 特立独行地选择了 `{}` 作为格式化占位符（说到这个，有点想吐槽下，Rust 中自创的概念其实还挺多的，真不知道该夸奖还是该吐槽-,-），事实证明，这种选择非常正确，它帮助用户减少了很多使用成本，你无需再为特定的类型选择特定的占位符，统一用 `{}` 来替代即可，剩下的类型推导等细节只要交给 Rust 去做。

- `{}` 适用于实现了 `std::fmt::Display` 特征的类型，用来以更优雅、更友好的方式格式化文本，例如展示给用户
- `{:?}` 适用于实现了 `std::fmt::Debug` 特征的类型，用于调试场景

其实两者的选择很简单，当你在写代码需要调试时，使用 `{:?}`，剩下的场景，选择 `{}`


Debug特征
事实上，为了方便我们调试，大多数 Rust 类型都实现了 `Debug` 特征或者支持派生该特征：
```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u8
}

fn main() {
    let i = 3.1415926;
    let s = String::from("hello");
    let v = vec![1, 2, 3];
    let p = Person{name: "sunface".to_string(), age: 18};
    println!("{:?}, {:?}, {:?}, {:?}", i, s, v, p);
}
```
对于数值、字符串、数组，可以直接使用 `{:?}` 进行输出，但是对于结构体，需要派生`Debug`特征后，才能进行输出，总之很简单。
与大部分类型实现了 `Debug` 不同，实现了 `Display` 特征的 Rust 类型并没有那么多，往往需要我们自定义想要的格式化方式：
比如
```rust
let i = 3.1415926;
let s = String::from("hello");
let v = vec![1, 2, 3];
let p = Person {
    name: "sunface".to_string(),
    age: 18,
};
println!("{}, {}, {}, {}", i, s, v, p);

```
运行后可以看到 `v` 和 `p` 都无法通过编译，因为没有实现 `Display` 特征，但是你又不能像派生 `Debug` 一般派生 `Display`，只能另寻他法：

- 使用 `{:?}` 或 `{:#?}`
- 为自定义类型实现 `Display` 特征
- 使用 `newtype` 为外部类型实现 `Display` 特征
比如这里自定义
```rust
struct Person {
    name: String,
    age: u8,
}

use std::fmt;
impl fmt::Display for Person {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "大佬在上，请受我一拜，小弟姓名{}，年芳{}，家里无田又无车，生活苦哈哈",
            self.name, self.age
        )
    }
}
fn main() {
    let p = Person {
        name: "sunface".to_string(),
        age: 18,
    };
    println!("{}", p);
}
```


位置参数
```rust
fn main() {
    println!("{}{}", 1, 2); // =>"12"
    println!("{1}{0}", 1, 2); // =>"21"
    // => Alice, this is Bob. Bob, this is Alice
    println!("{0}, this is {1}. {1}, this is {0}", "Alice", "Bob");
    println!("{1}{}{0}{}", 1, 2); // => 2112
}
```
除了指定索引，还可以指定名称
需要注意的是：**带名称的参数必须放在不带名称参数的后面**


格式化参数
```rust
fn main() {
    let v = 3.1415926;
    // Display => 3.14
    println!("{:.2}", v);
    // Debug => 3.14
    println!("{:.2?}", v);
}
```
指定参数
```rust
fn main() {
    //-----------------------------------
    // 以下全部输出 "Hello x    !"
    // 为"x"后面填充空格，补齐宽度5
    println!("Hello {:5}!", "x");
    // 使用参数5来指定宽度
    println!("Hello {:1$}!", "x", 5);
    // 使用x作为占位符输出内容，同时使用5作为宽度
    println!("Hello {1:0$}!", 5, "x");
    // 使用有名称的参数作为宽度
    println!("Hello {:width$}!", "x", width = 5);
    //-----------------------------------

    // 使用参数5为参数x指定宽度，同时在结尾输出参数5 => Hello x    !5
    println!("Hello {:1$}!{}", "x", 5);
}
```

数字填充
```rust
fn main() {
    // 宽度是5 => Hello     5!
    println!("Hello {:5}!", 5);
    // 显式的输出正号 => Hello +5!
    println!("Hello {:+}!", 5);
    // 宽度5，使用0进行填充 => Hello 00005!
    println!("Hello {:05}!", 5);
    // 负号也要占用一位宽度 => Hello -0005!
    println!("Hello {:05}!", -5);
}
```

对齐
```rust
fn main() {
    // 以下全部都会补齐5个字符的长度
    // 左对齐 => Hello x    !
    println!("Hello {:<5}!", "x");
    // 右对齐 => Hello     x!
    println!("Hello {:>5}!", "x");
    // 居中对齐 => Hello   x  !
    println!("Hello {:^5}!", "x");

    // 对齐并使用指定符号填充 => Hello x&&&&!
    // 指定符号填充的前提条件是必须有对齐字符
    println!("Hello {:&<5}!", "x");
}
```





## 高级进阶

### 生命周期

#### 1.深入生命周期
生命周期检查往往不太“聪明”。
比如
```rust
#[derive(Debug)]
struct Foo;

impl Foo {
    fn mutate_and_share(&mut self) -> &Self {
        &*self
    }
    fn share(&self) {}
}

fn main() {
    let mut foo = Foo;
    let loan = foo.mutate_and_share();
    foo.share();
    println!("{:?}", loan);
}
```

loan得到的foo的不可变借用
但是因为在main函数中尝试使用了一个可变的借用。
RUST规则：在同一作用于内，要么只能有一个`可变引用`，要么可以有多个不可变引用，但是不能同时存在可变引用和不可变引用。foo是一个可变引用，而loan是一个不可变引用，不能同时出现。

总结报错结果如下
`&mut self` 借用的生命周期和 `loan` 的生命周期相同，将持续到 `println` 结束。而在此期间 `foo.share()` 又进行了一次不可变 `&foo` 借用，违背了可变借用与不可变借用不能同时存在的规则，最终导致了编译错误。

无界生命周期

不安全的代码经常会凭空产生引用或生命周期，这些生命周期就是无界的。

```rust
fn f<'a, T>(x: *const T) -> &'a T {
    unsafe {
        &*x
    }
}

```
上述代码中，参数 `x` 是一个裸指针，它并没有任何生命周期，然后通过 `unsafe` 操作后，它被进行了解引用，变成了一个 Rust 的标准引用类型，该类型必须要有生命周期，也就是 `'a`。


HRTB生命周期约束
通过`'a:'b`的语法来说明生命周期的长短关系

如果'a的生命周期长于‘b那么，可以使用'a:'b来进行标注
表明至少'a和'b一样久
```rust
struct DoubleRef<'a,'b:'a,T>{
	r:&'a T,
	s:&'b T,
}
```

由于我们使用了生命周期约束 `'b: 'a`，因此 `'b` 必须活得比 `'a` 久，也就是结构体中的 `s` 字段引用的值必须要比 `r` 字段引用的值活得要久。

T:'a
表示类型T要比'a
```rust
struct Ref<'a, T: 'a> {
    r: &'a T
}

```

因为结构体字段 `r` 引用了 `T`，因此 `r` 的生命周期 `'a` 必须要比 `T` 的生命周期更短(被引用者的生命周期必须要比引用长)。

```rust
fn fn_elision(x: &i32) -> &i32 { x }
let closure_slision = |x: &i32| -> &i32 { x };

```

**如果函数参数中只有一个引用类型，那该引用的生命周期会被自动分配给所有的返回引用**。我们当前的情况完美符合， `function` 函数的顺利编译通过，就充分说明了问题。



NLL（Non-Lexical Lifetime）
正常情况下而言：
引用的生命周期从借用处开始，一致持续到作用域结束

但是从1.31版本引入`NLL`之后，引用的生命周期`从借用处开始，一致持续到最后一次使用的地方`
```rust
fn main() {
   let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;
    println!("{} and {}", r1, r2);
    // 新编译器中，r1,r2作用域在这里结束

    let r3 = &mut s;
    println!("{}", r3);
}
```

再借用
```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn move_to(&mut self, x: i32, y: i32) {
        self.x = x;
        self.y = y;
    }
}

fn main() {
    let mut p = Point { x: 0, y: 0 };
    let r = &mut p;
    let rr: &Point = &*r;

    println!("{:?}", rr);//因为到这里我没有使用原来的借用r，因此没有问题
    r.move_to(10, 10);
    println!("{:?}", r);
}
```

以上代码，大家可能会觉得可变引用 `r` 和不可变引用 `rr` 同时存在会报错吧？但是事实上并不会，原因在于 `rr` 是对 `r` 的再借用。
但是如果
```rust
r.move_to(10,10);
println!("{:?}",rr);//就会出现报错
```
只要在再借用rr的生命周期中使用原来的借用r就会报错




生命周期消除规则

1.impl块消除
```rust
impl<'a> Reader for BufReader<'a> {
    // methods go here
    // impl内部实际上没有用到'a
}
```
如果没有用到'a,那么可以写成
```rust
impl Reader for BufReader<'_> {
    // methods go here
}
```
`'_` 生命周期表示 `BufReader` 有一个不使用的生命周期，我们可以忽略它，无需为它创建一个名称。
生命周期也是参数的一部分，不能不写

2.生命周期约束消除
```rust
// Rust 2015
struct Ref<'a, T: 'a> {
    field: &'a T
}

// Rust 2018
struct Ref<'a, T> {
    field: &'a T
}

```

#### 2. &'static 和 T:'static
'static在rust中相当常见，比如
在 Rust 中，`'static` 生命周期是一种特殊的生命周期，表示整个程序的运行期间。它是可能的生命周期中最长的，长过任何其他生命周期。 `'static` 生命周期通常与静态变量（static variables）和字符串字面量（string literals）相关联。这里有两种方式使变量拥有 `'static` 生命周期，它们都将数据保存在可执行文件的只读内存区：

1. 使用 `static` 声明来产生常量（constant）。
2. 产生一个拥有 `&'static str` 类型的字符串字面量。
```rust
static MY_CONSTANT: i32 = 42;
```
或者创建一个 `'static` 生命周期的字符串字面量：
`let my_string: &'static str = "Hello, world!";`
这些`'static`生命周期的值可以在程序的任何时刻保持有效，因此他们非常有用。但是需要谨慎使用，以避免不必要的长期资源占用或或者的生命周期依赖。

```rust
fn main() {
  let mark_twain: &str = "Samuel Clemens";
  print_author(mark_twain);
}
fn print_author(author: &'static str) {
  println!("{}", author);
}
```
那么&'static又是什么东西呢？
其实他也是生命周期，不过仅仅针对的引用，而不是持有该引用的便利，对于变量来说，还是要遵循相对应的作用域规则
```rust
use std::{slice::from_raw_parts, str::from_utf8_unchecked};

fn get_memory_location() -> (usize, usize) {
  // “Hello World” 是字符串字面量，因此它的生命周期是 `'static`.
  // 但持有它的变量 `string` 的生命周期就不一样了，它完全取决于变量作用域，对于该例子来说，也就是当前的函数范围
  let string = "Hello World!";
  let pointer = string.as_ptr() as usize;
  let length = string.len();
  (pointer, length)
  // `string` 在这里被 drop 释放
  // 虽然变量被释放，无法再被访问，但是数据依然还会继续存活
}

fn get_str_at_location(pointer: usize, length: usize) -> &'static str {
  // 使用裸指针需要 `unsafe{}` 语句块
  unsafe { from_utf8_unchecked(from_raw_parts(pointer as *const u8, length)) }
}

fn main() {
  let (pointer, length) = get_memory_location();
  let message = get_str_at_location(pointer, length);
  println!(
    "The {} bytes at 0x{:X} stored: {}",
    length, pointer, message
  );
  // 如果大家想知道为何处理裸指针需要 `unsafe`，可以试着反注释以下代码
  // let message = get_str_at_location(1000, 10);
}
```



T:'static
首先，在以下两种情况下，`T: 'static` 与 `&'static` 有相同的约束：`T` 必须活得和程序一样久。

```rust
use std::fmt::Debug;

fn print_it<T: Debug + 'static>( input: T) {
    println!( "'static value passed in is: {:?}", input );
}

fn print_it1( input: impl Debug + 'static ) {
    println!( "'static value passed in is: {:?}", input );
}



fn main() {
    let i = 5;

    print_it(&i);
    print_it1(&i);
}
```

1. `'static` 生命周期表示整个程序执行的持续时间。它意味着它所引用的值必须在整个程序的生命周期内存在。
2. 当你调用 `print_it(&i)` 时，你传递的是对 `i` 的引用（其生命周期比 `'static` 更短）。由于 `&i` 不满足 `'static` 约束，编译器会报错。
解释：
当我们调用这两个函数时，它们分别打印了 i 的值。由于我们传递的是一个指针而不是一个值，所以这些打印操作实际上是在打印指针所指向的值（即 i 的值）。当我们离开这两个函数后，这些指针仍然保留着原始的 i 变量的内存地址。这意味着它们的生命周期并没有立即结束。
然而，由于我们使用的是 `'static` 修饰符，这意味着这些变量的生命周期仅限于函数调用结束时。因此，当我们在离开这两个函数后尝试打印这些变量时（即尝试打印指针所指向的值），我们已经超出了这些变量的生命周期范围。这就是为什么不能满足 `'static` 约束的原因。

少做修改即可
```rust
fn print_it<T: Debug + 'static>(input : &T){
	println!( "'static value passed in is: {:?}", input );
}
fn main(){
	let i = 5;
	print_it(&i);
}
```
原因在于我们约束的是 `T`，但是使用的却是它的引用 `&T`，换而言之，我们根本没有直接使用 `T`，因此编译器就没有去检查 `T` 的生命周期约束！它只要确保 `&T` 的生命周期符合规则即可，在上面代码中，它自然是符合的。

```rust
fn main() {
   let x = 1;
   let sum = |y| x + y;

    assert_eq!(3, sum(2));
}
```



### 函数式编程：闭包，迭代器

#### 闭包Closure
```rust
fn main() {
   let x = 1;
   let sum = |y| x + y;

    assert_eq!(3, sum(2));
}
```

Rust 闭包在形式上借鉴了 `Smalltalk` 和 `Ruby` 语言，与函数最大的不同就是它的参数是通过 `|parm1|` 的形式进行声明，如果是多个参数就 `|param1, param2,...|`， 下面给出闭包的形式定义：
```rust
|param1, param2,...| {
    语句1;
    语句2;
    返回表达式
}

```

如果，一个参数，定义简化为：
```rust
|param1| 返回表达式
```

- **闭包中最后一行表达式返回的值，就是闭包执行后的返回值**，因此 `action()` 调用返回了 `intensity` 的值 `10`
- `let action = ||...` 只是把闭包赋值给变量 `action`，并不是把闭包执行后的结果赋值给 `action`，因此这里 `action` 就相当于闭包函数，可以跟函数一样进行调用：`action()`

```rust
let sum  = |x, y| x + y;
let v = sum(1, 2);
```

```RUST
fn  add_one_v1   (x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1  ;

```

**当编译器推导出一种类型后，它就会一直使用该类型**
```rust
let example_closure = |x| x;

let s = example_closure(String::from("hello"));
let n = example_closure(5);
```
这个就会报错。

结构体中的闭包
```rust
struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    query: T,
    value: Option<u32>,
}

```
这段代码定义了一个名为 `Cacher` 的结构体，并对其泛型参数 `T` 设置了一个约束。这里的约束说明 `T` 必须是一个能够接受一个 `u32` 类型的参数并返回 `u32` 类型结果的闭包或者函数（即实现了 `Fn(u32) -> u32` 这个特质的类型）。

```RUST
use std::ops::Fn;

impl<T,V>Cacher<T,V>
where
	T: Fn(V)->V,
	V:Copy,
{
	fn new(query:T) -> Cacher<T,V>{
		Cacher{
			query,
			value:None,
		}
	}

	fn value(&mut self,arg: V) -> V{
		match self.value{
			Some(ref v) => *v,
			None =>{
				let v = (self.value)(arg);
				self.value = Some(v);
				v
			}
		}
	}
}
```



捕获作用域中的值
```rust
fn main() {
    let x = 4;

    let equal_to_x = |z| z :: x;

    let y = 4;

    assert!(equal_to_x(y));
}
```

上面代码中，`x` 并不是闭包 `equal_to_x` 的参数，但是它依然可以去使用 `x`，因为 `equal_to_x` 在 `x` 的作用域范围内。

对于函数来说，就算你把函数定义在 `main` 函数体中，它也不能访问 `x`
比如：
```rust
fn main() {
    let x = 4;

    fn equal_to_x(z: i32) -> bool {
        z :: x
    }

    let y = 4;

    assert!(equal_to_x(y));
}
```
这段代码是会报错的，提示使用闭包代替函数


三种Fn特征
闭包捕获变量有三种途径，恰好对应函数参数的传入方式：转移所有权、不可变借用、可变借用。
1.FnOnce，该类型闭包会拿走被捕获变量的所有权。
```rust
fn fn_once<F>(func: F)
where
    F: FnOnce(usize) -> bool + Copy,// 改动在这里
{
    println!("{}", func(3));
    println!("{}", func(4));
}

fn main() {
    let x = vec![1, 2, 3];
    fn_once(|z|{z :: x.len()})
}
```

这里不实现Copy特征会报错，因为转移在func3，但是func4又用了
如果你想强制闭包取得捕获变量的所有权，可以在参数列表前添加 `move` 关键字，这种用法通常用于闭包的生命周期大于捕获变量的生命周期时，例如将闭包返回或移入其他线程。

2.Fnmut，他以可变借用的方式捕获了环境中的值，因此可以修改该值：
```rust
fn main() {
    let mut s = String::new();

    let mut update_string =  |str| s.push_str(str);
    update_string("hello");

    println!("{:?}",s);
}
```

3.Fn特征，它以不可变借用的方式捕获环境中的值 让我们把上面的底阿妈中exec的F泛型参数类型修改为`Fn(&'a str)`:
```rust
fn main() {
    let mut s = String::new();

    let update_string =  |str| s.push_str(str);

    exec(update_string);

    println!("{:?}",s);
}

fn exec<'a, F: Fn(&'a str)>(mut f: F)  {
    f("hello")
}
```
我们的闭包实现的是 `FnMut` 特征，需要的是可变借用，但是在 `exec` 中却给它标注了 `Fn` 特征，因此产生了不匹配，因此会报错。

这里需要改变exec的声明
```rust
fn main() {
    let s = "hello, ".to_string();

    let update_string =  |str| println!("{},{}",s,str);

    exec(update_string);

    println!("{:?}",s);
}
//这下面就是重新改变的exec
fn exec<'a, F: Fn(String) -> ()>(f: F)  {
    f("world".to_string())
}
```

三种Fn的关系：
实际上，一个闭包并不仅仅实现某一种 `Fn` 特征，规则如下：
- 所有的闭包都自动实现了 `FnOnce` 特征，因此任何一个闭包都至少可以被调用一次
- 没有移出所捕获变量的所有权的闭包自动实现了 `FnMut` 特征
- 不需要对捕获变量进行改变的闭包自动实现了 `Fn` 特征

**一个闭包实现了哪种 Fn 特征取决于该闭包如何使用被捕获的变量，而不是取决于闭包如何捕获它们**，跟是否使用 `move` 没有必然联系。


闭包作为函数返回值

```rust
fn factory() -> Fn(i32) -> i32 {
    let num = 5;

    |x| x + num
}

let f = factory();

let answer = f(1);
assert_eq!(6, answer);

```

这段代码无法通过编译。
因为Rust 要求函数的参数和返回类型，必须有固定的内存大小，例如 `i32` 就是 4 个字节，引用类型是 8 个字节，总之，绝大部分类型都有固定的大小，但是不包括特征，因为特征类似接口，对于编译器来说，无法知道它后面藏的真实类型是什么，因为也无法得知具体的大小。
可以使用impl关键字，返回一个制定特征的类型
```rust
fn factory<T>() -> impl Fn(i32) -> i32 {}
```
这个就可以但是，只能返回相同类型。
比如下面这个使用impl实现就会报错
```rust
fn factory(x:i32) -> impl Fn(i32) -> i32 {

    let num = 5;

    if x > 1{
        move |x| x + num
    } else {
        move |x| x - num
    }
}

```
它使用impl返回两个闭包，虽然两个闭包签名相同，但是类型不同。那么这里可以使用Box智能指针
```rust
fn factory(x:i32) -> Box<dyn Fn(i32) -> i32> {
    let num = 5;

    if x > 1{
        Box::new(move |x| x + num)
    } else {
        Box::new(move |x| x - num)
    }
}

```


#### 迭代器Iterator


For循环与迭代器
他俩的最大差异就是，**是否通过索引来访问集合**。
js的for循环
```js
let arr = [1, 2, 3];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

```

Rust的for
```rust
let arr = [1, 2, 3];
for v in arr {
    println!("{}",v);
}
```
首先，不得不说这两语法还挺像！与 JS 循环不同，`Rust`中没有使用索引，它把 `arr` 数组当成一个迭代器，直接去遍历其中的元素，从哪里开始，从哪里结束，都无需操心。因此严格来说，Rust 中的 `for` 循环是编译器提供的语法糖，最终还是对迭代器中的元素进行遍历。
实现了 `IntoIterator` 特征,for循环是语法糖
`IntoIterator` 特征拥有一个 `into_iter` 方法，因此我们还可以显式的把数组转换成迭代器
```rust
let arr = [1, 2, 3];
for v in arr.into_iter() {
    println!("{}", v);
}

```

惰性初始化
在Rust中，迭代器是惰性的，不使用它，就不会发生任何事
```rust
let v1 = vec![1, 2, 3];

let v1_iter = v1.iter();

for val in v1_iter {
    println!("{}", val);
}

```

在 `for` 循环之前，我们只是简单的创建了一个迭代器 `v1_iter`，此时不会发生任何迭代行为，只有在 `for` 循环开始后，迭代器才会开始迭代其中的元素，最后打印出来。

这种惰性初始化的方式确保了创建迭代器不会有任何额外的性能损耗，其中的元素也不会被消耗，只有使用到该迭代器的时候，一切才开始。


next方法
对于for如何遍历迭代器，是如何取出迭代器中的元素呢
特征:
```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // 省略其余有默认实现的方法
}

```

呦，该特征竟然和迭代器 `iterator` 同名，难不成。。。没错，它们就是有一腿。**迭代器之所以成为迭代器，就是因为实现了 `Iterator` 特征**
最主要的就是实现next
可以手动调用next方法来获取值，比如
```rust
fn main() {
    let arr = [1, 2, 3];
    let mut arr_iter = arr.into_iter();

    assert_eq!(arr_iter.next(), Some(1));
    assert_eq!(arr_iter.next(), Some(2));
    assert_eq!(arr_iter.next(), Some(3));
    assert_eq!(arr_iter.next(), None);
}
```

- `next` 方法返回的是 `Option` 类型，当有值时返回 `Some(i32)`，无值时返回 `None`
- 遍历是按照迭代器中元素的排列顺序依次进行的，因此我们严格按照数组中元素的顺序取出了 `Some(1)`，`Some(2)`，`Some(3)`
- 手动迭代必须将迭代器声明为 `mut` 可变，因为调用 `next` 会改变迭代器其中的状态数据（当前遍历的位置等），而 `for` 循环去迭代则无需标注 `mut`，因为它会帮我们自动完成

总之，`next` 方法对**迭代器的遍历是消耗性的**，每次消耗它一个元素，最终迭代器中将没有任何元素，只能返回 `None`。
因为for循环是一个语法糖，我们完全可以实现它。
```rust
fn main(){
    let values = vec![1,2,3];
    {
        let result = match IntoIterator::into_iter(values) {
            mut iter => loop{
                match iter.next() {
                    Some(x) => { println!("{}",x); },
                    None => break,
                }
            },
        };
        result
    }
}
```
`IntoIterator::into_iter` 是使用[完全限定](https://course.rs/basic/trait/advance-trait.html#%E5%AE%8C%E5%85%A8%E9%99%90%E5%AE%9A%E8%AF%AD%E6%B3%95)的方式去调用 `into_iter` 方法，这种调用方式跟 `values.into_iter()` 是等价的。

同时我们使用了 `loop` 循环配合 `next` 方法来遍历迭代器中的元素，当迭代器返回 `None` 时，跳出循环。


IntoIterator特征
Vec动态数组实现了IntoIterator特征，因此可以通过into_iter将其转换成迭代器。
```rust
impl<I: Iterator> IntoIterator for I {
    type Item = I::Item;
    type IntoIter = I;

    #[inline]
    fn into_iter(self) -> I {
        self
    }
}
```

into_iter, iter, iter_mut三者的区别
- `into_iter` 会夺走所有权
- `iter` 是借用
- `iter_mut` 是可变借用

```rust
fn main() {
    let values = vec![1, 2, 3];

    for v in values.into_iter() {
        println!("{}", v)
    }

    // 下面的代码将报错，因为 values 的所有权在上面 `for` 循环中已经被转移走
    // println!("{:?}",values);

    let values = vec![1, 2, 3];
    let _values_iter = values.iter();

    // 不会报错，因为 values_iter 只是借用了 values 中的元素
    println!("{:?}", values);

    let mut values = vec![1, 2, 3];
    // 对 values 中的元素进行可变借用
    let mut values_iter_mut = values.iter_mut();

    // 取出第一个元素，并修改为0
    if let Some(v) = values_iter_mut.next() {
        *v = 0;
    }

    // 输出[0, 2, 3]
    println!("{:?}", values);
}
```
具体解释在代码注释中，就不再赘述，不过有两点需要注意的是：

- `.iter()` 方法实现的迭代器，调用 `next` 方法返回的类型是 `Some(&T)`
- `.iter_mut()` 方法实现的迭代器，调用 `next` 方法返回的类型是 `Some(&mut T)`，因此在 `if let Some(v) = values_iter_mut.next()` 中，`v` 的类型是 `&mut i32`，最终我们可以通过 `*v = 0` 的方式修改其值

Iterator和IntoIterator的区别
Iterator是迭代器特征，只有实现了他才能称为迭代器，才能使用next
而IntoIterator强调的是一个类型实现了该特征可以通过into_iter，iter等方法变成一个迭代器。

消费者与适配器

消费者是迭代器上的方法，它会消费掉迭代器中的元素，然后返回其类型的值，这些消费者都有一个共同的特点：在它们的定义中，都依赖 `next` 方法来消费元素，因此这也是为什么迭代器要实现 `Iterator` 特征，而该特征必须要实现 `next` 方法的原因。

###### 消费者适配器
只要迭代器上某个方法A在其内部调用了next方法，那么A就被称为**消费性适配器**。A方法的调用会消耗掉迭代器上的元素。
例如sum方法，他会拿走迭代器的所有权，然后不断调用next，里面的元素进行求和
```rust
fn main() {
    let v1 = vec![1, 2, 3];

    let v1_iter = v1.iter();

    let total: i32 = v1_iter.sum();

    assert_eq!(total, 6);

    // v1_iter 是借用了 v1，因此 v1 可以照常使用
    println!("{:?}",v1);

    // 以下代码会报错，因为 `sum` 拿到了迭代器 `v1_iter` 的所有权
    // println!("{:?}",v1_iter);
}
```

sum源码如下
```rust
fn sum<S>(self) -> S
    where
        Self: Sized,
        S: Sum<Self::Item>,
    {
        Sum::sum(self)
    }

```


###### 迭代器适配器
迭代器适配器就是会返回一个新的迭代器，这是实现链式调用的关键`v.iter().map().filter()`
迭代器适配器是惰性的，需要一个消费者适配器来收尾，最终迭代器转换成一个具体的值，比如
```rust
let v1:Vec<i32> = vec![1,2,3];
let v2:Vec<_> = v1.iter().map(|x| x+1).collect();
assert_eq!(v2, vec![2, 3, 4]);
```

这里collect就是一个消费者适配器

collect还可以收集hashMap集合
```rust
use std::collections::HashMap;
fn main() {
    let names = ["sunface", "sunfei"];
    let ages = [18, 18];
    let folks: HashMap<_, _> = names.into_iter().zip(ages.into_iter()).collect();

    println!("{:?}",folks);
}
```

`zip` 是一个迭代器适配器，它的作用就是将两个迭代器的内容压缩到一起，形成 `Iterator<Item=(ValueFromA, ValueFromB)>` 这样的新的迭代器，在此处就是形如 `[(name1, age1), (name2, age2)]` 的迭代器。


闭包作为适配器参数
```rust
struct Shoe {
    size: u32,
    style: String,
}

fn shoes_in_size(shoes: Vec<Shoe>, shoe_size: u32) -> Vec<Shoe> {
    shoes.into_iter().filter(|s| s.size :: shoe_size).collect()
}
```

实现Iterator特征：
```rust
struct Counter {
    count: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { count: 0 }
    }
}
impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

```


enumerate
enumerate是Iterator上的方法，这个方法可以产生一个新的迭代器，其中每个元素均是元组
```rust
let v = vec![1u64, 2, 3, 4, 5, 6];
for (i,v) in v.iter().enumerate() {
    println!("第{}个值是{}",i,v)
}
```


for循环和迭代器iterator相比，迭代器要更快一些。

迭代器是Rust的零成本之一，味着抽象并不会引入运行时开销，这与 `Bjarne Stroustrup`（C++ 的设计和实现者）在 `Foundations of C++（2012）` 中所定义的 **零开销**（zero-overhead）如出一辙：


### 深入类型

#### 类型转换
不同类型之间是不能比较的，包括i32 , u16.
一般来说是将小类型转化为大类型
类型转换时需要注意，比如
>使用类型转换需要小心，因为如果执行以下操作 `300_i32 as i8`，你将获得 `44` 这个值，而不是 `300`，因为 `i8` 类型能表达的的最大值为 `2^7 - 1`，使用以下代码可以查看 `i8` 的最大值：

```rust
let a = i8::MAX;
println!("{}",a);
```


内存地址转化为指针
```rust
let mut values: [i32; 2] = [1, 2];
let p1: *mut i32 = values.as_mut_ptr();
let first_address = p1 as usize; // 将p1内存地址转换为一个整数
let second_address = first_address + 4; // 4 :: std::mem::size_of::<i32>()，i32类型占用4个字节，因此将内存地址 + 4
let p2 = second_address as *mut i32; // 访问该地址指向的下一个整数p2
unsafe {
    *p2 += 1;
}
assert_eq!(values[1], 3);

```

转化不具有传递性，比如，e as U1 as U2是合法的，但是e as U2可能是不合法的
类似于ts的
```ts
a as unknow as B //是合法的，但是a as B可能不是合法的。
```

处理转化错误的时候可以使用TryInto：
```rust
use std::convert::TryInto;

fn main() {
   let a: u8 = 10;
   let b: u16 = 1500;

   let b_: u8 = b.try_into().unwrap();

   if a < b_ {
     println!("Ten is less than one hundred.");
   }
}
```


**如果你要使用一个特征的方法，那么你需要引入该特征到当前的作用域中**，我们在上面用到了 `try_into` 方法，因此需要引入对应的特征。
`try_into` 会尝试进行一次转换，并返回一个 `Result`，此时就可以对其进行相应的错误处理。由于我们的例子只是为了快速测试，因此使用了 `unwrap` 方法，该方法在发现错误时，会直接调用 `panic` 导致程序的崩溃退出，在实际项目中，请不要这么使用，具体见[panic](https://course.rs/basic/result-error/panic.html#%E8%B0%83%E7%94%A8-panic)部分。

最主要的是 `try_into` 转换会捕获大类型向小类型转换时导致的溢出错误：
```rust
fn main() {
    let b: i16 = 1500;

    let b_: u8 = match b.try_into() {
        Ok(b1) => b1,
        Err(e) => {
            println!("{:?}", e.to_string());
            0
        }
    };
}
```

try_into转化会捕获大类型向小类型转换时导致的溢出错误
```rust
fn main() {
    let b: i16 = 1500;

    let b_: u8 = match b.try_into() {
        Ok(b1) => b1,
        Err(e) => {
            println!("{:?}", e.to_string());
            0
        }
    };
}
```
这个运行之后就会报错。u8无法承受1500这个数值。

通用类型转换
```rust
struct Foo {
    x: u32,
    y: u16,
}

struct Bar {
    a: u32,
    b: u16,
}

fn reinterpret(foo: Foo) -> Bar {
    let Foo { x, y } = foo;
    Bar { a: x, b: y }
}

```
虽然啰嗦，但是简单粗暴

强制类型转换
首先，在匹配**特征**时，不会做任何强制转换(除了方法)。一个类型 `T` 可以强制转换为 `U`，不代表 `impl T` 可以强制转换为 `impl U`，例如下面的代码就无法通过编译检查：
```rust
trait Trait {}

fn foo<X: Trait>(t: X) {}

impl<'a> Trait for &'a i32 {}

fn main() {
    let t: &mut i32 = &mut 0;
    foo(t);
}
```
`&i32` 实现了特征 `Trait`， `&mut i32` 可以转换为 `&i32`，但是 `&mut i32` 依然无法作为 `Trait` 来使用。

点操作符
方法调用的点操作符看起来简单，实际上非常不简单，它在调用时，会发生很多魔法般的类型转换，例如：自动引用、自动解引用，强制类型转换直到类型能匹配等。

1. 首先，编译器检查它是否可以直接调用 `T::foo(value)`，称之为**值方法调用**
2. 如果上一步调用无法完成(例如方法类型错误或者特征没有针对 `Self` 进行实现，上文提到过特征不能进行强制转换)，那么编译器会尝试增加自动引用，例如会尝试以下调用： `<&T>::foo(value)` 和 `<&mut T>::foo(value)`，称之为**引用方法调用**
3. 若上面两个方法依然不工作，编译器会试着解引用 `T` ，然后再进行尝试。这里使用了 `Deref` 特征 —— 若 `T: Deref<Target = U>` (`T` 可以被解引用为 `U`)，那么编译器会使用 `U` 类型进行尝试，称之为**解引用方法调用**
4. 若 `T` 不能被解引用，且 `T` 是一个定长类型(在编译期类型长度是已知的)，那么编译器也会尝试将 `T` 从定长类型转为不定长类型，例如将 `[i32; 2]` 转为 `[i32]`
5. 若还是不行，那...没有那了，最后编译器大喊一声：汝欺我甚，不干了！

比如数组按索引取值是因为实现了Index特征，`arr[0]`是Index的语法糖，实际上是arr.index(0)调用；
比如下面的
```rust
let array: Rc<Box<[T; 3]>> = ...;
let first_entry = array[0];
```

1. 首先， `array[0]` 只是[`Index`](https://doc.rust-lang.org/std/ops/trait.Index.html)特征的语法糖：编译器会将 `array[0]` 转换为 `array.index(0)` 调用，当然在调用之前，编译器会先检查 `array` 是否实现了 `Index` 特征。
2. 接着，编译器检查 `Rc<Box<[T; 3]>>` 是否有实现 `Index` 特征，结果是否，不仅如此，`&Rc<Box<[T; 3]>>` 与 `&mut Rc<Box<[T; 3]>>` 也没有实现。
3. 上面的都不能工作，编译器开始对 `Rc<Box<[T; 3]>>` 进行解引用，把它转变成 `Box<[T; 3]>`
4. 此时继续对 `Box<[T; 3]>` 进行上面的操作 ：`Box<[T; 3]>`， `&Box<[T; 3]>`，和 `&mut Box<[T; 3]>` 都没有实现 `Index` 特征，所以编译器开始对 `Box<[T; 3]>` 进行解引用，然后我们得到了 `[T; 3]`
5. `[T; 3]` 以及它的各种引用都没有实现 `Index` 索引(是不是很反直觉:D，在直觉中，数组都可以通过索引访问，实际上只有数组切片才可以!)，它也不能再进行解引用，因此编译器只能祭出最后的大杀器：将定长转为不定长，因此 `[T; 3]` 被转换成 `[T]`，也就是数组切片，它实现了 `Index` 特征，因此最终我们可以通过 `index` 方法访问到对应的元素。



变形！！！
`mem::transmute<T, U>`，强行将T变化为U，只要他们类型占的字节数相同。
这个会导致什么问题？
1. 首先也是最重要的，转换后创建一个任意类型的实例会造成无法想象的混乱，而且根本无法预测。不要把 `3` 转换成 `bool` 类型，就算你根本不会去使用该 `bool` 类型，也不要去这样转换
2. 变形后会有一个重载的返回类型，即使你没有指定返回类型，为了满足类型推导的需求，依然会产生千奇百怪的类型
3. 将 `&` 变形为 `&mut` 是未定义的行为
    - 这种转换永远都是未定义的
    - 不，你不能这么做
    - 不要多想，你没有那种幸运
4. 变形为一个未指定生命周期的引用会导致[无界生命周期](https://course.rs/advance/lifetime/advance.html)
5. 在复合类型之间互相变换时，你需要保证它们的排列布局是一模一样的！一旦不一样，那么字段就会得到不可预期的值，这也是未定义的行为，至于你会不会因此愤怒， **WHO CARES** ，你都用了变形了，老兄！

transmute虽然危险，但是高风险高回报，他也有相当多的应用场景，比如
- 将裸指针转化为函数指针
```rust
fn foo() -> i32 {
    0
}

let pointer = foo as *const ();
let function = unsafe { 
    // 将裸指针转换为函数指针
    std::mem::transmute::<*const (), fn() -> i32>(pointer) 
};
assert_eq!(function(), 0);
```

- 延长声明周期，或者缩短一个静态生命周期寿命：
```rust
struct R<'a>(&'a i32);

// 将 'b 生命周期延长至 'static 生命周期
unsafe fn extend_lifetime<'b>(r: R<'b>) -> R<'static> {
    std::mem::transmute::<R<'b>, R<'static>>(r)
}

// 将 'static 生命周期缩短至 'c 生命周期
unsafe fn shorten_invariant_lifetime<'b, 'c>(r: &'b mut R<'static>) -> &'b mut R<'c> {
    std::mem::transmute::<&'b mut R<'static>, &'b mut R<'c>>(r)
}
```

这些不建议学习



#### newtype和类型别名

newtype是什么，简单的来说，`struct Meters(u32)`那么此处的Meters就是一个newtype
为何需要 `newtype`？Rust 这多如繁星的 Old 类型满足不了我们吗？这是因为：

- 自定义类型可以让我们给出更有意义和可读性的类型名，例如与其使用 `u32` 作为距离的单位类型，我们可以使用 `Meters`，它的可读性要好得多
- 对于某些场景，只有 `newtype` 可以很好地解决
- 隐藏内部类型的细节


比如在外部类型上实现外部特征必须使用newtype
否则就要遵循孤儿规则：要为类型A实现特征T，那么A或者T必须至少有一个在当前作用域范围。
比如想格式化输出一个动态数组vec。那么就需要为Vec实现Display特征
```rust
use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("w = {}", w);
}
```
如上所示，使用元组结构体语法 `struct Wrapper(Vec<String>)` 创建了一个 `newtype` Wrapper，然后为它实现 `Display` 特征，最终实现了对 `Vec` 动态数组的格式化输出。

支持更好的可读性：
```rust
use std::ops::Add;
use std::fmt;

struct Meters(u32);
impl fmt::Display for Meters {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "目标地点距离你{}米", self.0)
    }
}

impl Add for Meters {
    type Output = Self;

    fn add(self, other: Meters) -> Self {
        Self(self.0 + other.0)
    }
}
fn main() {
    let d = calculate_distance(Meters(10), Meters(20));
    println!("{}", d);
}

fn calculate_distance(d1: Meters, d2: Meters) -> Meters {
    d1 + d2
}
```

更好的可读性不代表更少的代码，而是让输出更加简洁，代码更加语义化。



<<<<<<< HEAD
隐藏内部实现细节
::::::=
隐藏内部类型的细节
```rust
struct Meters(u32);

fn main() {
    let i: u32 = 2;
    assert_eq!(i.pow(2), 4);

    let n = Meters(i);
    // 下面的代码将报错，因为`Meters`类型上没有`pow`方法
    // assert_eq!(n.pow(2), 4);
}
```
实际上可以调用`n.0.pow(2)`

类型别名：

有点类似c的define
比如 `type Meters = u32`
```rust
type Meters = u32;

let x : u32 = 5;
let y : Meters = 6;
println!("{}",x+y);
//这段代码并不会报错
```

类型别名只是为了可读性更好。
类型别名和newtype的区别
- 类型别名仅仅是别名，只是为了让可读性更好，并不是全新的类型，`newtype` 才是！
- 类型别名无法实现_为外部类型实现外部特征_等功能，而 `newtype` 可以

比如`type Result<T> = std::result::Result<T, std::io::Error>;`



#### Sized和不定长类型DST
动态类型只有运行时才能动态获知，使用`DST`（dynamically sized typed）或者`unsized`
**正因为编译器无法在编译期获知类型大小，若你试图在代码中直接使用 DST 类型，将无法通过编译。**

比如
```rust
fn my_function(n: usize) {
    let array = [123; n];
}
```
以上代码就会报错(错误输出的内容并不是因为 DST，但根本原因是类似的)，因为 `n` 在编译期无法得知，而数组类型的一个组成部分就是长度，长度变为动态的，自然类型就变成了 unsized 。

`str`是一个动态类型他的大小只有在运行时知道，那么
```rust
// error
let s1: str = "Hello there!";
let s2: str = "How's it going?";

// ok
let s3: &str = "on?"
```
Rust 需要明确地知道一个特定类型的值占据了多少内存空间，同时该类型的所有值都必须使用相同大小的内存。如果 Rust 允许我们使用这种动态类型，那么这两个 `str` 值就需要占用同样大小的内存，这显然是不现实的: `s1` 占用了 12 字节，`s2` 占用了 15 字节，总不至于为了满足同样的内存大小，用空白字符去填补字符串吧？
所以出现了一个固定大小的类型&str——他的引用存储在栈上，具有固定大小（类似于指针），同时他只想的数据存储在堆中，也是已知大小的。

特征对象
只能通过引用或Box的方式来使用特征对象，直接使用会报错
```rust
fn foobar_1(thing: &dyn MyThing) {}     // OK
fn foobar_2(thing: Box<dyn MyThing>) {} // OK
fn foobar_3(thing: MyThing) {}          // ERROR!

```

`只能间接使用的DST`
Rust中常见的DST有：str、[T] 、 dyn Trait，他们都无法单独被使用，必须要通过引用或者Box来间接使用。

Sized特征
在使用泛型的时候，如何保证参数是固定大小的类型呢？这就要靠Sized特征
比如
```rust
fn generic<T>(t: T) {
    // --snip--
}
fn generic<T: Sized>(t: T) {
    // --snip--
}
//实际上是第二个
```
编译器自动加上了Sized特征约束
**所有在编译时就能知道其大小的类型，都会自动实现 `Sized` 特征**（除了str和特征基本所有类型都实现了Sized特征
但是不能在编译时知道其大小的DST怎么办呢？
```rust
fn generic<T: ?Sized>(t: &T) {
    // --snip--
}
```
由于T可能是动态大小的，因此函数的参数类型变为了&T

Box可以讲一个动态大小的类型转化为固定大小的类型：使用引用指向这些动态数据，然后在引用中存储相关的内存位置、长度等信息。

```rust
fn main(){
	let s1 = Box<str> = Box::new("hello" as str);
}
```
这个会报错，不知道str的大小
但是可以这样子做：`let s1: Box<str> = "Hello there!".into();`


#### 枚举和整数
例如你有一个枚举类型，然后需要从外面传入一个整数，用于控制后续的流程走向，此时就需要用整数去匹配相应的枚举。
最好不要匹配整数，需要语义化操作。

C的实现
```c
#include <stdio.h>

enum atomic_number {
    HYDROGEN = 1,
    HELIUM = 2,
    // ...
    IRON = 26,
};

int main(void)
{
    enum atomic_number element = 26;

    if (element :: IRON) {
        printf("Beware of Rust!\n");
    }

    return 0;
}
```
但是在rust中会报错：`MyEnum::A => {} mismatched types, expected i32, found enum MyEnum`。
```rust
enum MyEnum {
    A = 1,
    B,
    C,
}

fn main() {
    // 将枚举转换成整数，顺利通过
    let x = MyEnum::C as i32;

    // 将整数转换为枚举，失败
    match x {
        MyEnum::A => {}
        MyEnum::B => {}
        MyEnum::C => {}
        _ => {}
    }
}
```


Rust不能直接解决，可以通过第三方库来搞定：比如`num-traits`和`num-derive`
在Cargo.toml中引入
```toml
[dependencies]
num-traits = "0.2.14"
num-derive = "0.3.3"
```
其使用
```rust
use num_derive::FromPrimitive;
use num_traits::FromPrimitive;

#[derive(FromPrimitive)]
enum MyEnum {
    A = 1,
    B,
    C,
}

fn main() {
    let x = 2;

    match FromPrimitive::from_i32(x) {
        Some(MyEnum::A) => println!("Got A"),
        Some(MyEnum::B) => println!("Got B"),
        Some(MyEnum::C) => println!("Got C"),
        None            => println!("Couldn't convert {}", x),
    }
}
```

在Rust1.34之后可以使用TryFrom特征来做转换
```rust
use std::convert::TryFrom;
impl TryFrom<i32> for MyEnum{
	type Error = ();
	fn try_from(v:i32) -> Result<Self, Self::Error> {
		match v{
			x if x:: MyEnum::A as i32 => Ok(MyEnum::A),
			x if x :: MyEnum::B as i32 => Ok(MyEnum::B),
            x if x :: MyEnum::C as i32 => Ok(MyEnum::C),
            _ => Err(()),
		}
	}
}
```
这段代码实现了从i32到MyEnum的转换，接着就可以使用TryInto来实现转换：
```rust
use std::convert::TryInto;

fn main() {
    let x = MyEnum::C as i32;

    match x.try_into() {
        Ok(MyEnum::A) => println!("a"),
        Ok(MyEnum::B) => println!("b"),
        Ok(MyEnum::C) => println!("c"),
        Err(_) => eprintln!("unknown number"),
    }
}
```
但是上面的代码有个问题，你需要为每个枚举成员都实现一个转换分支，非常麻烦。好在可以使用宏来简化，自动根据枚举的定义来实现`TryFrom`特征:
```rust
#[macro_export]
macro_rules! back_to_enum {
    ($(#[$meta:meta])* $vis:vis enum $name:ident {
        $($(#[$vmeta:meta])* $vname:ident $(= $val:expr)?,)*
    }) => {
        $(#[$meta])*
        $vis enum $name {
            $($(#[$vmeta])* $vname $(= $val)?,)*
        }

        impl std::convert::TryFrom<i32> for $name {
            type Error = ();

            fn try_from(v: i32) -> Result<Self, Self::Error> {
                match v {
                    $(x if x :: $name::$vname as i32 => Ok($name::$vname),)*
                    _ => Err(()),
                }
            }
        }
    }
}

back_to_enum! {
    enum MyEnum {
        A = 1,
        B,
        C,
    }
}

```

前面学习了类型转化中的transmute，当能确保传入的数值一定不会超过枚举范围是，就可以使用这个方法完成变形（比如枚举成员对应1,2,3，传入的整数也在这个范围内，就可以使用）
>最好使用#[repr(..)]来控制底层类型的大小，免得本来需要 i32，结果传入 i64，最终内存无法对齐，产生奇怪的结果
`强大但伴随着风险，一份风险一份收获`
```rust
#[repr(i32)]
enum MyEnum {
    A = 1, B, C
}

fn main() {
    let x = MyEnum::C;
    let y = x as i32;
    let z: MyEnum = unsafe { std::mem::transmute(y) };

    // match the enum that came from an int
    match z {
        MyEnum::A => { println!("Found A"); }
        MyEnum::B => { println!("Found B"); }
        MyEnum::C => { println!("Found C"); }
    }
}
```



### 智能指针
指针：一个包含了内存地址的变量，该内存地址引用或者指向了另外的数据。


Rust中最常见的指针类型是`引用`，通过`&`表示。它相对特殊一点，除了指向某个值外没有其他功能，那么就不会造成性能上的损耗。
Rust中的智能指针和C++的智能指针相类似（应该说和其他语言的智能指针相类似，并非独创。
主要包个最常用最具有代表性的智能指针
- `Box<T>`，将值分配在堆上。
- `Rc<T>`，引用计数类型，允许多所有权存在！
- `Ref<T>`和`RefMut<T>`，允许将借用规则检查从编译期移动到运行期进行。


#### Box< T>堆对象分配

Rust中的堆栈：
高级语言 Python/Java 等往往会弱化堆栈的概念，但是要用好 C/C++/Rust，就必须对堆栈有深入的了解，原因是两者的内存管理方式不同：前者有 GC 垃圾回收机制，因此无需你去关心内存的细节。

栈内存从高位地址向下增长，且栈内存是连续分配的，一般来说操作系统对栈内存的大小都有限制，因此C语言中无法创建一个任意长度的数组。
在Rust中**main线程的栈大小是8MB**，普通线程是2MB，函数调用时会在其中创建一个临时栈空间，调用结束后 Rust 会让这个栈空间里的对象自动进入 `Drop` 流程，最后栈顶指针自动移动到上一个调用栈顶，无需程序员手动干预，因而栈内存申请和释放是非常高效的。

与栈相反，堆上内存则是从低位地址向上增长，**堆内存通常只受物理内存限制**，而且通常是不连续的，因此从性能的角度看，栈往往比堆更高。
堆栈的性能并非绝对，要看数据的使用情况等。
- 小型数据，在栈上的分配性能和读取性能都要比堆上高
- 中型数据，栈上分配性能高，但是读取性能和堆上并无区别，因为无法利用寄存器或 CPU 高速缓存，最终还是要经过一次内存寻址
- 大型数据，只建议在堆上分配和使用


总之，栈的分配速度肯定比堆上快，但是读取速度往往取决于你的数据能不能放入寄存器或 CPU 高速缓存。 因此不要仅仅因为堆上性能不如栈这个印象，就总是优先选择栈，导致代码更复杂的实现。

Box的使用场景
由于 `Box` 是简单的封装，除了将值存储在堆上外，并没有其它性能上的损耗。而性能和功能往往是鱼和熊掌，因此 `Box` 相比其它智能指针，功能较为单一，可以在以下场景中使用它：
- 特意的将数据分配在堆上
- 数据较大时，又不想在转移所有权时进行数据拷贝
- 类型的大小在编译期无法确定，但是我们又需要固定大小的类型时
- 特征对象，用于说明对象实现了一个特征，而不是某个特定的类型


##### 1.使用`Box<T>`将数据存储在堆上
比如将一个`let a = 3`储存在堆上。
```rust
fn main() {
    let a = Box::new(3);
    println!("a = {}", a); // a = 3

    // 下面一行代码将报错
    // let b = a + 1; // cannot add `{integer}` to `Box<{integer}>`
}
```
这样就可以创建一个智能指针指向存储在堆上的3，并且a持有了这个指针，只能只能往往实现了`Deref`和`Drop`特征，那么
- `println!` 可以正常打印出 `a` 的值，是因为它隐式地调用了 `Deref` 对智能指针 `a` 进行了解引用
- 最后一行代码 `let b = a + 1` 报错，是因为在表达式中，我们无法自动隐式地执行 `Deref` 解引用操作，你需要使用 `*` 操作符 `let b = *a + 1`，来显式的进行解引用
- `a` 持有的智能指针将在作用域结束（`main` 函数结束）时，被释放掉，这是因为 `Box<T>` 实现了 `Drop` 特征

##### 2.避免栈上的数据拷贝
当栈上数据转移所有权时，实际上是把数据拷贝了一份，最终新旧变量各自拥有不同的数据，因此所有权并未转移。
而堆上则不然，底层数据并不会被拷贝，转移所有权仅仅是复制一份栈中的指针，再将新的指针赋予新的变量，然后让拥有旧指针的变量失效，最终完成了所有权的转移：
```rust
fn main() {
    // 在栈上创建一个长度为1000的数组
    let arr = [0;1000];
    // 将arr所有权转移arr1，由于 `arr` 分配在栈上，因此这里实际上是直接重新深拷贝了一份数据
    let arr1 = arr;

    // arr 和 arr1 都拥有各自的栈上数组，因此不会报错
    println!("{:?}", arr.len());
    println!("{:?}", arr1.len());

    // 在堆上创建一个长度为1000的数组，然后使用一个智能指针指向它
    let arr = Box::new([0;1000]);
    // 将堆上数组的所有权转移给 arr1，由于数据在堆上，因此仅仅拷贝了智能指针的结构体，底层数据并没有被拷贝
    // 所有权顺利转移给 arr1，arr 不再拥有所有权
    let arr1 = arr;
    println!("{:?}", arr1.len());
    // 由于 arr 不再拥有底层数组的所有权，因此下面代码将报错
    // println!("{:?}", arr.len());
}
```


##### 3.将动态大小类型变为Sized固定大小类型
另一种无法再编译时知道大小的类型是**递归类型**
比如
```rust
enum List {
    Cons(i32, List),
    Nil,
}
```
这段代码就会报错，无法通过编译。但是使用Box可以解决
```rust
enum List{
	Cons(i32,Box<List>),
	Nil,
}
```
就可以完成从DST到Sized类型的转变。

##### 4.特征对象
在 Rust 中，想实现不同类型组成的数组只有两个办法：枚举和特征对象，前者限制较多，因此后者往往是最常用的解决办法。
比如：
```rust
trait Draw {
    fn draw(&self);
}

struct Button {
    id: u32,
}
impl Draw for Button {
    fn draw(&self) {
        println!("这是屏幕上第{}号按钮", self.id)
    }
}

struct Select {
    id: u32,
}

impl Draw for Select {
    fn draw(&self) {
        println!("这个选择框贼难用{}", self.id)
    }
}

fn main() {
    let elems: Vec<Box<dyn Draw>> = vec![Box::new(Button { id: 1 }), Box::new(Select { id: 2 })];

    for e in elems {
        e.draw()
    }
}
```
使用特征对象实现存储不同类型的数组，将不同类型的 `Button` 和 `Select` 包装成 `Draw` 特征的特征对象，放入一个数组中，`Box<dyn Draw>` 就是特征对象。


##### Box的内存布局
`Vec<i32>`的布局
![Vec< i32>](https://files.catbox.moe/jk74kq.png)
之前提到过 `Vec` 和 `String` 都是智能指针，从上图可以看出，该智能指针存储在栈中，然后指向堆上的数组数据。

`Vec<Box<i32>>`的内存布局
![](https://files.catbox.moe/ym0h06.png)
上面的 `B1` 代表被 `Box` 分配到堆上的值 `1`。

可以看出智能指针 `vec2` 依然是存储在栈上，然后指针指向一个堆上的数组，该数组中每个元素都是一个 `Box` 智能指针，最终 `Box` 智能指针又指向了存储在堆上的实际值。
当我们从数组中取出某个值时，去到的是对应的智能指针Box，需要对该智能指针进行解引用，才能取出最终的值。比如
```rust
fn main() {
    let arr = vec![Box::new(1), Box::new(2)];
    let (first, second) = (&arr[0], &arr[1]);
    let sum = **first + **second;
}
```
上面提到`arr[0]`实际上是arr.index(0)实现的Index特征，再加上自动解引用，因此在`vec<i32>`中可以
```rust
let arr2 = vec![2,3];
println!("{}",arr2[0]+arr2[1]);
```



##### Box::leak
他可以消费掉Box并且强制目标值从内存中泄露。
比如可以将一个String类型，变成一个'static生命周期的&str类型：
```rust
fn main() {
   let s = gen_static_str();
   println!("{}", s);
}

fn gen_static_str() -> &'static str{
    let mut s = String::new();
    s.push_str("hello, world");

    Box::leak(s.into_boxed_str())
}
```
在之前的代码中，如果 `String` 创建于函数中，那么返回它的唯一方法就是转移所有权给调用者 `fn move_str() -> String`，而通过 `Box::leak` 我们不仅返回了一个 `&str` 字符串切片，它还是 `'static` 生命周期的。
真正具有'static生命周期的往往都是编译期就创建的值。

**你需要一个在运行期初始化的值，但是可以全局有效，也就是和整个程序活得一样久**，那么就可以使用 `Box::leak`
Box::leak虽然强大，但是会使值的生命周期变得非常长，可能会造成资源泄露的问题。同时因为值和程序共存亡，那么大量数据存储在内存中导致内存占用非常高。且这个修改生命周期后，可能产生复杂的生命周期依赖。


#### Deref
```rust
fn main() {
    let x = 5;
    let y = &x;

    assert_eq!(5, x);
    assert_eq!(5, *y);
}
```

智能指针正是因为实现了Deref，因此才有智能一称。不用繁琐的疯狂解引用，比如出现`*******a`这种代码


定义自己的智能指针：
```rust
use std::ops::Deref;
struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}
impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

```
同时实现了Deref特征，以支持* 解引用
- 在 `Deref` 特征中声明了关联类型 `Target`，在之前章节中介绍过，关联类型主要是为了提升代码可读性
- `deref` 返回的是一个常规引用，可以被 `*` 进行解引用

`*`背后的原理
当对Box进行解引用时，实际上Rust调用了`*(y.deref())`
deref方法返回值的常规引用，然后通过* 对常规引用进行解引用
需要注意的是，`*` 不会无限递归替换，从 `*y` 到 `*(y.deref())` 只会发生一次，而不会继续进行替换然后产生形如 `*((y.deref()).deref())` 的怪物。
```rust
fn main() {
    let s = String::from("hello world");
    display(&s)
}

fn display(s: &str) {
    println!("{}",s);
}
```

- `String` 实现了 `Deref` 特征，可以在需要时自动被转换为 `&str` 类型
- `&s` 是一个 `&String` 类型，当它被传给 `display` 函数时，自动通过 `Deref` 转换成了 `&str`
- 必须使用 `&s` 的方式来触发 `Deref`(仅引用类型的实参才会触发自动解引用)

还可以连续隐式的Deref，比如
```rust
fn main() {
    let s = MyBox::new(String::from("hello world"));
    display(&s)
}

fn display(s: &str) {
    println!("{}",s);
}
```

Deref规则总结：
- 把智能指针（比如在库中定义的，Box、Rc、Arc、Cow 等）从结构体脱壳为内部的引用类型，也就是转成结构体内部的 `&v`
- 把多重`&`，例如 `&&&&&&&v`，归一成 `&v`

三种Deref转化
- 当 `T: Deref<Target=U>`，可以将 `&T` 转换成 `&U`，也就是我们之前看到的例子
- 当 `T: DerefMut<Target=U>`，可以将 `&mut T` 转换成 `&mut U`
- 当 `T: Deref<Target=U>`，可以将 `&mut T` 转换成 `&U`
DerefMut
```rust
struct MyBox<T> {
    v: T,
}

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox { v: x }
    }
}

use std::ops::Deref;

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.v
    }
}

use std::ops::DerefMut;

impl<T> DerefMut for MyBox<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.v
    }
}

fn main() {
    let mut s = MyBox::new(String::from("hello, "));
    display(&mut s)
}

fn display(s: &mut String) {
    s.push_str("world");
    println!("{}", s);
}
```
- 要实现 `DerefMut` 必须要先实现 `Deref` 特征：`pub trait DerefMut: Deref`
- `T: DerefMut<Target=U>` 解读：将 `&mut T` 类型通过 `DerefMut` 特征的方法转换为 `&mut U` 类型，对应上例中，就是将 `&mut MyBox<String>` 转换为 `&mut String`




#### Drop释放资源
无GC的语言中需要手动，释放变量否则可能造成内存泄露的问题。
而在 Rust 中，你可以指定在一个变量超出作用域时，执行一段特定的代码，最终编译器将帮你自动插入这段收尾代码。
Drop就是做这样的事情。

```rust
struct HasDrop1;
struct HasDrop2;
impl Drop for HasDrop1 {
    fn drop(&mut self) {
        println!("Dropping HasDrop1!");
    }
}
impl Drop for HasDrop2 {
    fn drop(&mut self) {
        println!("Dropping HasDrop2!");
    }
}
struct HasTwoDrops {
    one: HasDrop1,
    two: HasDrop2,
}
impl Drop for HasTwoDrops {
    fn drop(&mut self) {
        println!("Dropping HasTwoDrops!");
    }
}

struct Foo;

impl Drop for Foo {
    fn drop(&mut self) {
        println!("Dropping Foo!")
    }
}

fn main() {
    let _x = HasTwoDrops {
        two: HasDrop2,
        one: HasDrop1,
    };
    let _foo = Foo;
    println!("Running!");
}
```
- `Drop` 特征中的 `drop` 方法借用了目标的可变引用，而不是拿走了所有权，这里先设置一个悬念，后边会讲
- 结构体中每个字段都有自己的 `Drop`
>Running!
Dropping Foo!
Dropping HasTwoDrops!
Dropping HasDrop1!
Dropping HasDrop2!


Drop的顺序
- **变量级别，按照逆序的方式**，`_x` 在 `_foo` 之前创建，因此 `_x` 在 `_foo` 之后被 `drop`
- **结构体内部，按照顺序的方式**，结构体 `_x` 中的字段按照定义中的顺序依次 `drop`
原因在于，Rust 自动为几乎所有类型都实现了 `Drop` 特征，因此就算你不手动为结构体实现 `Drop`，它依然会调用默认实现的 `drop` 函数

手动回收
当使用智能指针来管理锁的时候，你可能希望提前释放这个锁，然后让其它代码能及时获得锁，此时就需要提前去手动 `drop`。
drop函数会拿走所有权
比如
```rust
#[derive(Debug)]
struct Foo;

impl Drop for Foo {
    fn drop(&mut self) {
        println!("Dropping Foo!")
    }
}

fn main() {
    let foo = Foo;
    drop(foo);
}
```
这样就会打印Dropping Foo！


Drop的使用场景
- 回收内存资源
- 执行一些收尾工作
有极少数情况，需要你自己来回收资源的，例如文件描述符、网络 socket 等，当这些值超出作用域不再使用时，就需要进行关闭以释放相关的资源，在这些情况下，就需要使用者自己来解决 `Drop` 的问题。

互斥的Copy和Drop
无法为一个类型同时实现Copy和Drop特征。因为实现了 `Copy` 的特征会被编译器隐式的复制，因此非常难以预测析构函数执行的时间和频率。因此这些实现了 `Copy` 的类型无法拥有析构函数。
```rust
#[derive(Copy)]
struct Foo;

impl Drop for Foo {
    fn drop(&mut self) {
        println!("Dropping Foo!")
    }
}
```
这里就会报错



#### Rc与Arc
Rust的所有权要求，一个值只能有一个所有者。大多数情况下没有问题，但是可能出现一些情况不满足
- 在图数据结构中，多个边可能会拥有同一个节点，该节点直到没有边指向它时，才应该被释放清理
- 在多线程中，多个线程可能会持有同一个数据，但是你受限于 Rust 的安全机制，无法同时获取该数据的可变引用
通过引用计数的方式，允许一个数据资源在同一时刻拥有多个所有者。
Rc适合单线程，Arc适用于多线程。

##### Rc< T>
Rc即reference counting，引用计数器的缩写。
们**希望在堆上分配一个对象供程序的多个部分使用且无法确定哪个部分最后一个结束时，就可以使用 `Rc` 成为数据值的所有者**，例如之前提到的多线程场景就非常适合。

```rust
fn main() {
    let s = String::from("hello, world");
    // s在这里被转移给a
    let a = Box::new(s);
    // 报错！此处继续尝试将 s 转移给 b
    let b = Box::new(s);
}
```

这里"hello, world"的所有权被转交给a和b，就是错误的。
但是可以使用Rc解决
```rust
use std::rc::Rc;
fn main() {
    let a = Rc::new(String::from("hello, world"));
    let b = Rc::clone(&a);

    assert_eq!(2, Rc::strong_count(&a));
    assert_eq!(Rc::strong_count(&a), Rc::strong_count(&b))
}
```

智能指针 `Rc<T>` 在创建时，还会将引用计数加 1，此时获取引用计数的关联函数 `Rc::strong_count` 返回的值将是 `1`。

然后再使用了Rc::clone使得该智能指针的计数+1
由于 `a` 和 `b` 是同一个智能指针的两个副本，因此通过它们两个获取引用计数的结果都是 `2`。

。这里的 `clone` **仅仅复制了智能指针并增加了引用计数，并没有克隆底层数据**，因此 `a` 和 `b` 是共享了底层的字符串 `s`，这种**复制效率是非常高**的。
也可以使用a.clone()的方式克隆，但是不如上面的高效。

实际上很多Rust中的clone还是浅拷贝，比如迭代器的克隆。

可以使用Rc::strong_count查看当前指针的引用数量
```rust
use std::rc::Rc;
fn main() {
        let a = Rc::new(String::from("test ref counting"));
        println!("count after creating a = {}", Rc::strong_count(&a));
        let b =  Rc::clone(&a);
        println!("count after creating b = {}", Rc::strong_count(&a));
        {
            let c =  Rc::clone(&a);
            println!("count after creating c = {}", Rc::strong_count(&c));
        }
        println!("count after c goes out of scope = {}", Rc::strong_count(&a));
}
```
- 由于变量 `c` 在语句块内部声明，当离开语句块时它会因为超出作用域而被释放，所以引用计数会减少 1，事实上这个得益于 `Rc<T>` 实现了 `Drop` 特征
- `a`、`b`、`c` 三个智能指针引用计数都是同样的，并且共享底层的数据，因此打印计数时用哪个都行
- 无法看到的是：当 `a`、`b` 超出作用域后，引用计数会变成 0，最终智能指针和它指向的底层字符串都会被清理释放


事实上，`Rc<T>` 是指向底层数据的不可变的引用，因此你无法通过它来修改数据，这也符合 Rust 的借用规则：要么存在多个不可变借用，要么只能存在一个可变借用。

但是实际开发中我们往往需要对数据进行修改，这时单独使用 `Rc<T>` 无法满足我们的需求，需要配合其它数据类型来一起使用，例如内部可变性的 `RefCell<T>` 类型以及互斥锁 `Mutex<T>`。事实上，在多线程编程中，`Arc` 跟 `Mutex` 锁的组合使用非常常见，它们既可以让我们在不同的线程中共享数据，又允许在各个线程中对其进行修改。


- `Rc/Arc` 是不可变引用，你无法修改它指向的值，只能进行读取，如果要修改，需要配合后面章节的内部可变性 `RefCell` 或互斥锁 `Mutex`
- 一旦最后一个拥有者消失，则资源会自动被回收，这个生命周期是在编译期就确定下来的
- `Rc` 只能用于同一线程内部，想要用于线程之间的对象共享，你需要使用 `Arc`
- `Rc<T>` 是一个智能指针，实现了 `Deref` 特征，因此你无需先解开 `Rc` 指针，再使用里面的 `T`，而是可以直接使用 `T`，例如上例中的 `gadget1.owner.name`

##### Arc
`Arc` 是 `Atomic Rc` 的缩写，顾名思义：原子化的 `Rc<T>` 智能指针。
原因在于原子化或者其它锁虽然可以带来的线程安全，但是都会伴随着性能损耗，而且这种性能损耗还不小。

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let s = Arc::new(String::from("多线程漫游者"));
    for _ in 0..10 {
        let s = Arc::clone(&s);
        let handle = thread::spawn(move || {
           println!("{}", s)
        });
    }
}
```


#### Cell和RefCell
Rust通过严格的规则来保证所有权和借用的正确性，为程序的安全保驾护航。但是也失去了灵活性，因此 Rust 提供了 `Cell` 和 `RefCell` 用于内部可变性，简而言之，可以在拥有不可变引用的同时修改目标数据，对于正常的代码实现来说，这个是不可能做到的（要么一个可变借用，要么多个不可变借用）。

cell和RefCell没什么太大的区别，区别在于 `Cell<T>` 适用于 `T` 实现 `Copy` 的情况
```rust
use std::cell::Cell;
fn main() {
  let c = Cell::new("asdf");
  let one = c.get();
  c.set("qwer");
  let two = c.get();
  println!("{},{}", one, two);
}
```

必须是实现了Copy的情况，比如在Cell::new中放入一个String，那么就会报错，因为String没有实现Copy方法。
Cell类型针对是实现了Copy特征的情况，因此实际开发中用的更多的是RefCell，因为我们要解决的往往是可变、不可变引用共存导致的问题

|Rust 规则|智能指针带来的额外规则|
|---|---|
|一个数据只有一个所有者|`Rc/Arc`让一个数据可以拥有多个所有者|
|要么多个不可变借用，要么一个可变借用|`RefCell`实现编译期可变、不可变引用共存|
|违背规则导致**编译错误**|违背规则导致**运行时`panic`**|
```rust
use std::cell::RefCell;

fn main() {
    let s = RefCell::new(String::from("hello, world"));
    let s1 = s.borrow();
    let s2 = s.borrow_mut();

    println!("{},{}", s1, s2);
}
```

可以看出，`Rc/Arc` 和 `RefCell` 合在一起，解决了 Rust 中严苛的所有权和借用规则带来的某些场景下难使用的问题。但是它们并不是银弹，例如 `RefCell` 实际上并没有解决可变引用和引用可以共存的问题，`只是将报错从编译期推迟到运行时`，从编译器错误变成了 `panic` 异常
报错推迟罢了。
那么这种"没用"的东西为什么会存在呢？在于 Rust 编译期的**宁可错杀，绝不放过**的原则（不能确定是否正确，那么就一定不正确）

而 `RefCell` 正是**用于你确信代码是正确的，而编译器却发生了误判时**。
RefCell总结
- 与 `Cell` 用于可 `Copy` 的值不同，`RefCell` 用于引用
- `RefCell` 只是将借用规则从编译期推迟到程序运行期，并不能帮你绕过这个规则
- `RefCell` 适用于编译期误报或者一个引用被在多处代码使用、修改以至于难于管理借用关系时
- 使用 `RefCell` 时，违背借用规则会导致运行期的 `panic`

Cell和RefCell的区别：
- `Cell` 只适用于 `Copy` 类型，用于提供值，而 `RefCell` 用于提供引用
- `Cell` 不会 `panic`，而 `RefCell` 会


Cell没有额外的性能损耗
```rust
// code snipet 1
let x = Cell::new(1);
let y = &x;
let z = &x;
x.set(2);
y.set(3);
z.set(4);
println!("{}", x.get());

// code snipet 2
let mut x = 1;
let y = &mut x;
let z = &mut x;
x = 2;
*y = 3;
*z = 4;
println!("{}", x);

```
比如这两段代码，性能一致。但是第一段能够通过编译
与 `Cell` 的 `zero cost` 不同，`RefCell` 其实是有一点运行期开销的，原因是它包含了一个字节大小的“借用状态”指示器，该指示器在每次运行时借用时都会被修改，进而产生一点开销。

总之，当非要使用内部可变性时，首选 `Cell`，只有你的类型没有实现 `Copy` 时，才去选择 `RefCell`。

说了这么多内部可变性，那他是什么呢？
简单的来说就是，对一个不可变的值进行可变借用。
比如这段代码
```rust
// use std::cell::Cell;
// 定义在外部库中的特征
pub trait Messenger {
    fn send(&self, msg: String);
}

// --------------------------
// 我们的代码中的数据结构和实现
struct MsgQueue {
    msg_cache: Vec<String>,
}

impl Messenger for MsgQueue {
    fn send(&self, msg: String) {
        self.msg_cache.push(msg)
    }
}

fn main() {
    let msgQ = MsgQueue{
        msg_cache:Vec::new(),
    };
    msgQ.send("hello".to_string());
}
```
直接运行是报错的
我们要在自己的代码中使用该特征实现一个异步消息队列，出于性能的考虑，消息先写到本地缓存(内存)中，然后批量发送出去，因此在 `send` 方法中，需要将消息先行插入到本地缓存 `msg_cache` 中。但是问题来了，该 `send` 方法的签名是 `&self`，因此代码会报错
![](https://files.catbox.moe/dcxu02.png)
报错提醒需要可变引用。

但是将代码改写为下面这个就可以了
```rust
use std::cell::RefCell;
pub trait Messenger {
    fn send(&self, msg: String);
}

pub struct MsgQueue {
    msg_cache: RefCell<Vec<String>>,
}

impl Messenger for MsgQueue {
    fn send(&self, msg: String) {
        self.msg_cache.borrow_mut().push(msg)
    }
}

fn main() {
    let mq = MsgQueue {
        msg_cache: RefCell::new(Vec::new()),
    };
    mq.send("hello, world".to_string());
}
```

这个 MQ 功能很弱，但是并不妨碍我们演示内部可变性的核心用法：通过包裹一层 `RefCell`，成功的让 `&self` 中的 `msg_cache` 成为一个可变值，然后实现对其的修改。

Rc+RefCell组合使用

```rust
use std::cell::RefCell;
use std::rc::Rc;
fn main() {
    let s = Rc::new(RefCell::new("我很善变，还拥有多个主人".to_string()));

    let s1 = s.clone();
    let s2 = s.clone();
    // let mut s2 = s.borrow_mut();
    s2.borrow_mut().push_str(", oh yeah!");

    println!("{:?}\n{:?}\n{:?}", s, s1, s2);
}

```
上面代码中，我们使用 `RefCell<String>` 包裹一个字符串，同时通过 `Rc` 创建了它的三个所有者：`s`、`s1`和`s2`，并且通过其中一个所有者 `s2` 对字符串内容进行了修改。

由于 `Rc` 的所有者们共享同一个底层的数据，因此当一个所有者修改了数据时，会导致全部所有者持有的数据都发生了变化。

性能损耗：
两者结合在一起使用的性能其实非常高，大致相当于没有线程安全版本的 C++ `std::shared_ptr` 指针，事实上，C++ 这个指针的主要开销也在于原子性这个并发原语上，毕竟线程安全在哪个语言中开销都不小。

内存损耗：
Rc+RefCell两者一起使用的数据解构类似于
```rust
struct Wrapper<T> {
    // Rc
    strong_count: usize,
    weak_count: usize,

    // Refcell
    borrow_count: isize,

    // 包裹的数据
    item: T,
}

```
多了几个字段

通过Cell::from_mut解决借用冲突
- Cell::from_mut，该方法将 `&mut T` 转为 `&Cell<T>`
- Cell::as_slice_of_cells，该方法将 `&Cell<[T]>` 转为 `&[Cell<T>]`
比如常见的：
```rust
fn is_even(i: i32) -> bool {
    i % 2 :: 0
}

fn retain_even(nums: &mut Vec<i32>) {
    let mut i = 0;
    for num in nums.iter().filter(|&num| is_even(*num)) {
        nums[i] = *num;
        i += 1;
    }
    nums.truncate(i);
}

```
在for循环中，同时出现了可变和不可变借用。
为了避免可以使用索引访问的方式
```rust
fn retain_even(nums: &mut Vec<i32>) {
    let mut i = 0;
    for j in 0..nums.len() {
        if is_even(nums[j]) {
            nums[i] = nums[j];
            i += 1;
        }
    }
    nums.truncate(i);
}
```

或者这样子
```rust
use std::cell::Cell;

fn retain_even(nums: &mut Vec<i32>) {
    let slice: &[Cell<i32>] = Cell::from_mut(&mut nums[..])
        .as_slice_of_cells();

    let mut i = 0;
    for num in slice.iter().filter(|num| is_even(num.get())) {
        slice[i].set(num.get());
        i += 1;
    }

    nums.truncate(i);
}

```
因为 `Cell` 上的 `set` 方法获取的是不可变引用 `pub fn set(&self, val: T)`。



### 循环引用和自引用

#### Weak与循环引用
Rust 的安全性是众所周知的，但是不代表它不会内存泄漏。一个典型的例子就是同时使用 `Rc<T>` 和 `RefCell<T>` 创建循环引用，最终这些引用的计数都无法被归零，因此 `Rc<T>` 拥有的值也不会被释放清理。
循环引用的例子
![](https://files.catbox.moe/renf9x.png)
例如
```rust
use crate::List::{Cons, Nil};
use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}

fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));

    println!("a的初始化rc计数 = {}", Rc::strong_count(&a));
    println!("a指向的节点 = {:?}", a.tail());

    // 创建`b`到`a`的引用
    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));

    println!("在b创建后，a的rc计数 = {}", Rc::strong_count(&a));
    println!("b的初始化rc计数 = {}", Rc::strong_count(&b));
    println!("b指向的节点 = {:?}", b.tail());

    // 利用RefCell的可变性，创建了`a`到`b`的引用
    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }

    println!("在更改a后，b的rc计数 = {}", Rc::strong_count(&b));
    println!("在更改a后，a的rc计数 = {}", Rc::strong_count(&a));

    // 下面一行println!将导致循环引用
    // 我们可怜的8MB大小的main线程栈空间将被它冲垮，最终造成栈溢出
    // println!("a next item = {:?}", a.tail());
}
```
然后就造就了a指向b，b指向a的场景。
![](https://files.catbox.moe/e7exy3.png)
最后一行代码。
了解到这里，再看看weak如何解决的。


Weak
`Weak` 非常类似于 `Rc`，但是与 `Rc` 持有所有权不同，`Weak` 不持有所有权，它仅仅保存一份指向数据的弱引用：如果你想要访问数据，需要通过 `Weak` 指针的 `upgrade` 方法实现，该方法返回一个类型为 `Option<Rc<T>>` 的值。
弱引用——**不保证引用关系依然存在**
因为 `Weak` 引用不计入所有权，因此它**无法阻止所引用的内存值被释放掉**，而且 `Weak` 本身不对值的存在性做任何担保，引用的值还存在就返回 `Some`，不存在就返回 `None`。

Weak和Rc的比较

| `Weak`                                | `Rc`                      |
| ------------------------------------- | ------------------------- |
| 不计数                                   | 引用计数                      |
| 不拥有所有权                                | 拥有值的所有权                   |
| 不阻止值被释放(drop)                         | 所有权计数归零，才能 drop           |
| 引用的值存在返回 `Some`，不存在返回 `None`          | 引用的值必定存在                  |
| 通过 `upgrade` 取到 `Option<Rc<T>>`，然后再取值 | 通过 `Deref` 自动解引用，取值无需任何操作 |

那么Weak适用的场景也比较明了了。
- 持有一个 `Rc` 对象的临时引用，并且不在乎引用的值是否依然存在
- 阻止 `Rc` 导致的循环引用，因为 `Rc` 的所有权机制，会导致多个 `Rc` 都无法计数归零

`Weak` 通过 `use std::rc::Weak` 来引入，它具有以下特点:
- 可访问，但没有所有权，不增加引用计数，因此不会影响被引用值的释放回收
- 可由 `Rc<T>` 调用 `downgrade` 方法转换成 `Weak<T>`
- `Weak<T>` 可使用 `upgrade` 方法转换成 `Option<Rc<T>>`，如果资源已经被释放，则 `Option` 的值是 `None`
- 常用于解决循环引用的问题

```rust
use std::rc::Rc;
fn main() {
    // 创建Rc，持有一个值5
    let five = Rc::new(5);

    // 通过Rc，创建一个Weak指针
    let weak_five = Rc::downgrade(&five);

    // Weak引用的资源依然存在，取到值5
    let strong_five: Option<Rc<_>> = weak_five.upgrade();
    assert_eq!(*strong_five.unwrap(), 5);

    // 手动释放资源`five`
    drop(five);

    // Weak引用的资源已不存在，因此返回None
    let strong_five: Option<Rc<_>> = weak_five.upgrade();
    assert_eq!(strong_five, None);
}
```

Weak常见的场景
工具间里，每个工具都有其主人，且多个工具可以拥有一个主人；同时一个主人也可以拥有多个工具，在这种场景下，就很容易形成循环引用，例如图中的每个节点，基本都是多对多。

```rust
use std::rc::Rc;
use std::rc::Weak;
use std::cell::RefCell;

// 主人
struct Owner {
    name: String,
    gadgets: RefCell<Vec<Weak<Gadget>>>,
}

// 工具
struct Gadget {
    id: i32,
    owner: Rc<Owner>,
}

fn main() {
    // 创建一个 Owner
    // 需要注意，该 Owner 也拥有多个 `gadgets`
    let gadget_owner : Rc<Owner> = Rc::new(
        Owner {
            name: "Gadget Man".to_string(),
            gadgets: RefCell::new(Vec::new()),
        }
    );

    // 创建工具，同时与主人进行关联：创建两个 gadget，他们分别持有 gadget_owner 的一个引用。
    let gadget1 = Rc::new(Gadget{id: 1, owner: gadget_owner.clone()});
    let gadget2 = Rc::new(Gadget{id: 2, owner: gadget_owner.clone()});

    // 为主人更新它所拥有的工具
    // 因为之前使用了 `Rc`，现在必须要使用 `Weak`，否则就会循环引用
    gadget_owner.gadgets.borrow_mut().push(Rc::downgrade(&gadget1));
    gadget_owner.gadgets.borrow_mut().push(Rc::downgrade(&gadget2));

    // 遍历 gadget_owner 的 gadgets 字段
    for gadget_opt in gadget_owner.gadgets.borrow().iter() {

        // gadget_opt 是一个 Weak<Gadget> 。 因为 weak 指针不能保证他所引用的对象
        // 仍然存在。所以我们需要显式的调用 upgrade() 来通过其返回值(Option<_>)来判
        // 断其所指向的对象是否存在。
        // 当然，Option 为 None 的时候这个引用原对象就不存在了。
        let gadget = gadget_opt.upgrade().unwrap();
        println!("Gadget {} owned by {}", gadget.id, gadget.owner.name);
    }

    // 在 main 函数的最后，gadget_owner，gadget1 和 gadget2 都被销毁。
    // 具体是，因为这几个结构体之间没有了强引用（`Rc<T>`），所以，当他们销毁的时候。
    // 首先 gadget2 和 gadget1 被销毁。
    // 然后因为 gadget_owner 的引用数量为 0，所以这个对象可以被销毁了。
    // 循环引用问题也就避免了
}
```

树的数据结构
```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf),
    );

    {
        let branch = Rc::new(Node {
            value: 5,
            parent: RefCell::new(Weak::new()),
            children: RefCell::new(vec![Rc::clone(&leaf)]),
        });

        *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

        println!(
            "branch strong = {}, weak = {}",
            Rc::strong_count(&branch),
            Rc::weak_count(&branch),
        );

        println!(
            "leaf strong = {}, weak = {}",
            Rc::strong_count(&leaf),
            Rc::weak_count(&leaf),
        );
    }

    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf),
    );
}

```

还可以使用unsafe来解决循环引用的问题
虽然 `unsafe` 不安全，但是在各种库的代码中依然很常见用它来实现自引用结构，主要优点如下:

- 性能高，毕竟直接用裸指针操作
- 代码更简单更符合直觉: 对比下 `Option<Rc<RefCell<Node>>>`


#### 结构体中的自引用

比如
```rust
struct SelfRef<'a> {
    value: String,

    // 该引用指向上面的value
    pointer_to_value: &'a str,
}
fn main(){
    let s = "aaa".to_string();
    let v = SelfRef {
        value: s,
        pointer_to_value: &s
    };
}
```
这个是会报错的，因为我们试图同时使用值和值的引用，最终所有权转移和借用一起发生了。所以，这个问题貌似并没有那么好解决，不信你可以回想下自己具有的知识，是否可以解决？
1.使用Option
```rust
#[derive(Debug)]
struct WhatAboutThis<'a> {
    name: String,
    nickname: Option<&'a str>,
}

fn main() {
    let mut tricky = WhatAboutThis {
        name: "Annabelle".to_string(),
        nickname: None,
    };
    tricky.nickname = Some(&tricky.name[..4]);

    println!("{:?}", tricky);
}
```
在某种程度上来说，`Option` 这个方法可以工作，但是这个方法的限制较多，例如从一个函数创建并返回它是不可能的：
```rust
fn creator<'a>() -> WhatAboutThis<'a> {
    let mut tricky = WhatAboutThis {
        name: "Annabelle".to_string(),
        nickname: None,
    };
    tricky.nickname = Some(&tricky.name[..4]);

    tricky
}
```


2.unsafe实现
```rust
#[derive(Debug)]
struct SelfRef {
    value: String,
    pointer_to_value: *mut String,
}

impl SelfRef {
    fn new(txt: &str) -> Self {
        SelfRef {
            value: String::from(txt),
            pointer_to_value: std::ptr::null_mut(),
        }
    }

    fn init(&mut self) {
        let self_ref: *mut String = &mut self.value;
        self.pointer_to_value = self_ref;
    }

    fn value(&self) -> &str {
        &self.value
    }

    fn pointer_to_value(&self) -> &String {
        assert!(!self.pointer_to_value.is_null(), "Test::b called without Test::init being called first");
        unsafe { &*(self.pointer_to_value) }
    }
}

fn main() {
    let mut t = SelfRef::new("hello");
    t.init();
    println!("{}, {:p}", t.value(), t.pointer_to_value());

    t.value.push_str(", world");
    unsafe {
        (&mut *t.pointer_to_value).push_str("!");
    }

    println!("{}, {:p}", t.value(), t.pointer_to_value());
}
```

上面的 `unsafe` 虽然简单好用，但是它不太安全，是否还有其他选择？还真的有，那就是 `Pin`。


Pin的作用，防止该值在内存中被移动。
通过开头我们知道，自引用最麻烦的就是创建引用的同时，值的所有权会被转移，而通过 `Pin` 就可以很好的防止这一点：
```rust
use std::marker::PhantomPinned;
use std::pin::Pin;
use std::ptr::NonNull;

// 下面是一个自引用数据结构体，因为 slice 字段是一个指针，指向了 data 字段
// 我们无法使用普通引用来实现，因为违背了 Rust 的编译规则
// 因此，这里我们使用了一个裸指针，通过 NonNull 来确保它不会为 null
struct Unmovable {
    data: String,
    slice: NonNull<String>,
    _pin: PhantomPinned,
}

impl Unmovable {
    // 为了确保函数返回时数据的所有权不会被转移，我们将它放在堆上，唯一的访问方式就是通过指针
    fn new(data: String) -> Pin<Box<Self>> {
        let res = Unmovable {
            data,
            // 只有在数据到位时，才创建指针，否则数据会在开始之前就被转移所有权
            slice: NonNull::dangling(),
            _pin: PhantomPinned,
        };
        let mut boxed = Box::pin(res);

        let slice = NonNull::from(&boxed.data);
        // 这里其实安全的，因为修改一个字段不会转移整个结构体的所有权
        unsafe {
            let mut_ref: Pin<&mut Self> = Pin::as_mut(&mut boxed);
            Pin::get_unchecked_mut(mut_ref).slice = slice;
        }
        boxed
    }
}

fn main() {
    let unmoved = Unmovable::new("hello".to_string());
    // 只要结构体没有被转移，那指针就应该指向正确的位置，而且我们可以随意移动指针
    let mut still_unmoved = unmoved;
    assert_eq!(still_unmoved.slice, NonNull::from(&still_unmoved.data));

    // 因为我们的类型没有实现 `Unpin` 特征，下面这段代码将无法编译
    // let mut new_unmoved = Unmovable::new("world".to_string());
    // std::mem::swap(&mut *still_unmoved, &mut *new_unmoved);
}
```


使用ouroboros
```rust
use ouroboros::self_referencing;

#[self_referencing]
struct SelfRef {
    value: String,

    #[borrows(value)]
    pointer_to_value: &'this str,
}

fn main(){
    let v = SelfRefBuilder {
        value: "aaa".to_string(),
        pointer_to_value_builder: |value: &String| value,
    }.build();

    // 借用value值
    let s = v.borrow_value();
    // 借用指针
    let p = v.borrow_pointer_to_value();
    // value值和指针指向的值相等
    assert_eq!(s, *p);
}
```
可以看到，ouroboros 使用起来并不复杂，就是需要你去按照它的方式创建结构体和引用类型：SelfRef 变成 SelfRefBuilder，引用字段从 pointer_to_value 变成 pointer_to_value_builder，并且连类型都变了。

在使用时，通过 borrow_value 来借用 value 的值，通过 borrow_pointer_to_value 来借用 pointer_to_value 这个指针。


### 多线程并发编程

#### 并发与并行
- **并发(Concurrent)** 是多个队列使用同一个咖啡机，然后两个队列轮换着使用（未必是 1:1 轮换，也可能是其它轮换规则），最终每个人都能接到咖啡
- **并行(Parallel)** 是每个队列都拥有一个咖啡机，最终也是每个人都能接到咖啡，但是效率更高，因为同时可以有两个人在接咖啡
各种语言的并发
- 由于操作系统提供了创建线程的 API，因此部分语言会直接调用该 API 来创建线程，因此最终程序内的线程数和该程序占用的操作系统线程数相等，一般称之为**1:1 线程模型**，例如 Rust。
- 还有些语言在内部实现了自己的线程模型（绿色线程、协程），程序内部的 M 个线程最后会以某种映射方式使用 N 个操作系统线程去运行，因此称之为**M:N 线程模型**，其中 M 和 N 并没有特定的彼此限制关系。一个典型的代表就是 Go 语言。
- 还有些语言使用了 Actor 模型，基于消息传递进行并发，例如 Erlang 语言。


#### 使用多线程
由于多线程的代码是同时运行的，因此我们无法保证线程间的执行顺序，这会导致一些问题：

- 竞态条件(race conditions)，多个线程以非一致性的顺序同时访问数据资源
- 死锁(deadlocks)，两个线程都想使用某个资源，但是又都在等待对方释放资源后才能使用，结果最终都无法继续执行
- 一些因为多线程导致的很隐晦的 BUG，难以复现和解决

虽然 Rust 已经通过各种机制减少了上述情况的发生，但是依然无法完全避免上述情况，因此我们在编程时需要格外的小心，同时本书也会列出多线程编程时常见的陷阱，让你提前规避可能的风险。


创建线程
使用 `thread::spawn` 可以创建线程：
```rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
}
```
如果多运行几次，你会发现好像每次输出会不太一样，因为：虽说线程往往是轮流执行的，但是这一点无法被保证！线程调度的方式往往取决于你使用的操作系统。总之，千万不要依赖线程的执行顺序。

上面的代码你不但可能无法让子线程从 1 顺序打印到 10，而且可能打印的数字会变少，因为主线程会提前结束，导致子线程也随之结束，更过分的是，如果当前系统繁忙，甚至该子线程还没被创建，主线程就已经结束了！

因此我们需要一个方法，让主线程安全、可靠地等所有子线程完成任务后，再 kill self：

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..5 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    handle.join().unwrap();

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
}
```

在线程中也可以使用主线程的数据
```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(|| {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}
```
其实代码本身并没有什么问题，问题在于 Rust 无法确定新的线程会活多久（多个线程的结束顺序并不是固定的），所以也无法确定新线程所引用的 v 是否在使用过程中一直合法
```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();

    // 下面代码会报错borrow of moved value: `v`
    // println!("{:?}",v);
}
```
那么 Rust 中线程是如何结束的呢？答案很简单：线程的代码执行完，线程就会自动结束。但是如果线程中的代码不会执行完呢？那么情况可以分为两种进行讨论：

- 线程的任务是一个循环 IO 读取，任务流程类似：IO 阻塞，等待读取新的数据 -> 读到数据，处理完成 -> 继续阻塞等待 ··· -> 收到 socket 关闭的信号 -> 结束线程，在此过程中，绝大部分时间线程都处于阻塞的状态，因此虽然看上去是循环，CPU 占用其实很小，也是网络服务中最最常见的模型
- 线程的任务是一个循环，里面没有任何阻塞，包括休眠这种操作也没有，此时 CPU 很不幸的会被跑满，而且你如果没有设置终止条件，该线程将持续跑满一个 CPU 核心，并且不会被终止，直到 main 线程的结束

第二种
```rust
use std::thread;
use std::time::Duration;
fn main() {
    // 创建一个线程A
    let new_thread = thread::spawn(move || {
        // 再创建一个线程B
        thread::spawn(move || {
            loop {
                println!("I am a new thread.");
            }
        })
    });

    // 等待新创建的线程执行完成
    new_thread.join().unwrap();
    println!("Child thread is finish!");

    // 睡眠一段时间，看子线程创建的子线程是否还在运行
    thread::sleep(Duration::from_millis(100));
}
```

以上代码中，`main` 线程创建了一个新的线程 `A`，同时该新线程又创建了一个新的线程 `B`，可以看到 `A` 线程在创建完 `B` 线程后就立即结束了，而 `B` 线程则在不停地循环输出。
据不精确估算，创建一个线程大概需要 0.24 毫秒，随着线程的变多，这个值会变得更大
```rust
for i in 0..num_threads {
    let ht = Arc::clone(&ht);

    let handle = thread::spawn(move || {
        for j in 0..adds_per_thread {
            let key = thread_rng().gen::<u32>();
            let value = thread_rng().gen::<u32>();
            ht.set_item(key, value);
        }
    });

    handles.push(handle);
}

for handle in handles {
    handle.join().unwrap();
}

```
总之，多线程的开销往往是在锁、数据竞争、缓存失效上，这些限制了现代化软件系统随着 CPU 核心的增多性能也线性增加的野心。


线程屏障
在 Rust 中，可以使用 Barrier 让多个线程都执行到某个点后，才继续一起往后执行
```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
    let mut handles = Vec::with_capacity(6);
    let barrier = Arc::new(Barrier::new(6));

    for _ in 0..6 {
        let b = barrier.clone();
        handles.push(thread::spawn(move|| {
            println!("before wait");
            b.wait();
            println!("after wait");
        }));
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```

使用 thread_local 宏可以初始化线程局部变量，然后在线程内部使用该变量的 with 方法获取变量值

```rust
use std::cell::RefCell;
use std::thread;

thread_local!(static FOO: RefCell<u32> = RefCell::new(1));

FOO.with(|f| {
    assert_eq!(*f.borrow(), 1);
    *f.borrow_mut() = 2;
});

// 每个线程开始时都会拿到线程局部变量的FOO的初始值
let t = thread::spawn(move|| {
    FOO.with(|f| {
        assert_eq!(*f.borrow(), 1);
        *f.borrow_mut() = 3;
    });
});

// 等待线程完成
t.join().unwrap();

// 尽管子线程中修改为了3，我们在这里依然拥有main线程中的局部值：2
FOO.with(|f| {
    assert_eq!(*f.borrow(), 2);
});

```

上面代码中，`FOO` 即是我们创建的**线程局部变量**，每个新的线程访问它时，都会使用它的初始值作为开始，各个线程中的 `FOO` 值彼此互不干扰。注意 `FOO` 使用 `static` 声明为生命周期为 `'static` 的静态变量。
那么汇总起来就比较困难了


也可以在结构体中使用线程局部变量
```rust
use std::cell::RefCell;

struct Foo;
impl Foo {
    thread_local! {
        static FOO: RefCell<usize> = RefCell::new(0);
    }
}

fn main() {
    Foo::FOO.with(|x| println!("{:?}", x));
}
```

除了标准库外，一位大神还开发了 [thread-local](https://github.com/Amanieu/thread_local-rs) 库，它允许每个线程持有值的独立拷贝
```rust
use thread_local::ThreadLocal;
use std::sync::Arc;
use std::cell::Cell;
use std::thread;

let tls = Arc::new(ThreadLocal::new());
let mut v = vec![];
// 创建多个线程
for _ in 0..5 {
    let tls2 = tls.clone();
    let handle = thread::spawn(move || {
        // 将计数器加1
        // 请注意，由于线程 ID 在线程退出时会被回收，因此一个线程有可能回收另一个线程的对象
        // 这只能在线程退出后发生，因此不会导致任何竞争条件
        let cell = tls2.get_or(|| Cell::new(0));
        cell.set(cell.get() + 1);
    });
    v.push(handle);
}
for handle in v {
    handle.join().unwrap();
}
// 一旦所有子线程结束，收集它们的线程局部变量中的计数器值，然后进行求和
let tls = Arc::try_unwrap(tls).unwrap();
let total = tls.into_iter().fold(0, |x, y| {
    // 打印每个线程局部变量中的计数器值，发现不一定有5个线程，
    // 因为一些线程已退出，并且其他线程会回收退出线程的对象
    println!("x: {}, y: {}", x, y.get());
    x + y.get()
});

// 和为5
assert_eq!(total, 5);

```

条件控制线程的挂起和执行
```rust
use std::thread;
use std::sync::{Arc, Mutex, Condvar};

fn main() {
    let pair = Arc::new((Mutex::new(false), Condvar::new()));
    let pair2 = pair.clone();

    thread::spawn(move|| {
        let (lock, cvar) = &*pair2;
        let mut started = lock.lock().unwrap();
        println!("changing started");
        *started = true;
        cvar.notify_one();
    });

    let (lock, cvar) = &*pair;
    let mut started = lock.lock().unwrap();
    while !*started {
        started = cvar.wait(started).unwrap();
    }

    println!("started changed");
}
```

有时，我们会需要某个函数在多线程环境下只被调用一次，例如初始化全局变量，无论是哪个线程先调用函数来初始化，都会保证全局变量只会被初始化一次，随后的其它线程调用就会忽略该函数：
```rust
use std::thread;
use std::sync::Once;

static mut VAL: usize = 0;
static INIT: Once = Once::new();

fn main() {
    let handle1 = thread::spawn(move || {
        INIT.call_once(|| {
            unsafe {
                VAL = 1;
            }
        });
    });

    let handle2 = thread::spawn(move || {
        INIT.call_once(|| {
            unsafe {
                VAL = 2;
            }
        });
    });

    handle1.join().unwrap();
    handle2.join().unwrap();

    println!("{}", unsafe { VAL });
}
```

```rust
use std::thread;
use std::sync::Once;

static mut VAL: usize = 0;
static INIT: Once = Once::new();

fn main() {
    let handle1 = thread::spawn(move || {
        INIT.call_once(|| {
            unsafe {
                VAL = 1;
            }
        });
    });

    let handle2 = thread::spawn(move || {
        INIT.call_once(|| {
            unsafe {
                VAL = 2;
            }
        });
    });

    handle1.join().unwrap();
    handle2.join().unwrap();

    println!("{}", unsafe { VAL });
}
```
这里只能执行一次
代码运行的结果取决于哪个线程先调用 `INIT.call_once` （虽然代码具有先后顺序，但是线程的初始化顺序并无法被保证！因为线程初始化是异步的，且耗时较久），若 `handle1` 先，则输出 `1`，否则输出 `2`。
执行初始化过程一次，并且只执行一次。

如果当前有另一个初始化过程正在运行，线程将阻止该方法被调用。类似于上锁

当这个函数返回时，保证一些初始化已经运行并完成，它还保证由执行的闭包所执行的任何内存写入都能被其他线程在这时可靠地观察到。

#### 线程间的消息传递
与 Go 语言内置的`chan`不同，Rust 是在标准库里提供了消息通道(`channel`)，你可以将其想象成一场直播，多个主播联合起来在搞一场直播，最终内容通过通道传输给屏幕前的我们，其中主播被称之为**发送者**，观众被称之为**接收者**，显而易见的是：一个通道应该支持多个发送者和接收者。

大多数情况下是不同库满足不同的场景。

多发送者，单接受者。
标准库提供了通道`std::sync::mpsc`，其中`mpsc`是_multiple producer, single consumer_的缩写，代表了该通道支持多个发送者，但是只支持唯一的接收者。 当然，支持多个发送者也意味着支持单个发送者，我们先来看看单发送者、单接收者的

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    // 创建一个消息通道, 返回一个元组：(发送者，接收者)
    let (tx, rx) = mpsc::channel();

    // 创建线程，并发送消息
    thread::spawn(move || {
        // 发送一个数字1, send方法返回Result<T,E>，通过unwrap进行快速错误处理
        tx.send(1).unwrap();

        // 下面代码将报错，因为编译器自动推导出通道传递的值是i32类型，那么Option<i32>类型将产生不匹配错误
        // tx.send(Some(1)).unwrap()
    });

    // 在主线程中接收子线程发送的消息并输出
    println!("receive {}", rx.recv().unwrap());
}
```
- `tx`,`rx`对应发送者和接收者，它们的类型由编译器自动推导: `tx.send(1)`发送了整数，因此它们分别是`mpsc::Sender<i32>`和`mpsc::Receiver<i32>`类型，需要注意，由于内部是泛型实现，一旦类型被推导确定，该通道就只能传递对应类型的值, 例如此例中非`i32`类型的值将导致编译错误
- 接收消息的操作`rx.recv()`会阻塞当前线程，直到读取到值，或者通道被关闭
- 需要使用`move`将`tx`的所有权转移到子线程的闭包中


不阻塞的try_recv方法：
除了使用`rx.recv`还可以使用`rx.try_recv`来接收消息
这个方法不会阻塞线程，当通道中没有消息时，它会立刻返回一个错误：
```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        tx.send(1).unwrap();
    });

    println!("receive {:?}", rx.try_recv());
}
```
比如这一段代码，因为线程的创建是需要时间的，那么这里会抛出错误`receive Err(Empty)`
如果说子线程结束之后，再去接收的话，那么会出现另一种报错`receive Err(Disconnected)`


通道传输数据也需要遵守所有权规则
- 若值的类型实现了`Copy`特征，则直接复制一份该值，然后传输过去，例如之前的`i32`类型
- 若值没有实现`Copy`，则它的所有权会被转移给接收端，在发送端继续使用该值将报错
```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let s = String::from("我，飞走咯!");
        tx.send(s).unwrap();
        println!("val is {}", s);
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

比如这里发送的是String，它没有实现Copy特征，因此在传输之后println那里会报错，不能再次使用，因为传过去的时，所有权也被转移了

可以使用循环进行传输数据
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```


多发送者：
由于子线程会拿走发送者的所有权，因此我们必须对发送者进行克隆，然后让每个线程拿走它的一份拷贝:
```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx1 = tx.clone();
    thread::spawn(move || {
        tx.send(String::from("hi from raw tx")).unwrap();
    });

    thread::spawn(move || {
        tx1.send(String::from("hi from cloned tx")).unwrap();
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```
- 需要所有的发送者都被`drop`掉后，接收者`rx`才会收到错误，进而跳出`for`循环，最终结束主线程
- 这里虽然用了`clone`但是并不会影响性能，因为它并不在热点代码路径中，仅仅会被执行一次
- 由于两个子线程谁先创建完成是未知的，因此哪条消息先发送也是未知的，最终主线程的`输出顺序也不确定`
通道的信息是有序的，但是进入通道的信息谁先谁后不知道。


异步通道是不会阻塞的。
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;
fn main() {
    let (tx, rx)= mpsc::channel();

    let handle = thread::spawn(move || {
        println!("发送之前");
        tx.send(1).unwrap();
        println!("发送之后");
    });

    println!("睡眠之前");
    thread::sleep(Duration::from_secs(3));
    println!("睡眠之后");

    println!("receive {}", rx.recv().unwrap());
    handle.join().unwrap();
}
```
这里输出是连续的。
睡眠前-> 发送前-> 发送后-> 睡眠后。`发送之前`和`发送之后`是连续输出的

同步通道：同步通道**发送消息是阻塞的，只有在消息被接收后才解除阻塞**
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;
fn main() {
    let (tx, rx)= mpsc::sync_channel(0);

    let handle = thread::spawn(move || {
        println!("发送之前");
        tx.send(1).unwrap();
        println!("发送之后");
    });

    println!("睡眠之前");
    thread::sleep(Duration::from_secs(3));
    println!("睡眠之后");

    println!("receive {}", rx.recv().unwrap());
    handle.join().unwrap();
}
```

输出为：
>睡眠之前
发送之前
//···睡眠3秒
睡眠之后
receive 1
发送之后

发送之后，因为不能及时接收到消息，因此子线程也被阻塞
**发送之后**的输出是在**receive 1**之后，说明**只有接收消息彻底成功后，发送消息才算完成**。

消息缓存：
`mpsc::sync_channel(0)`这里0就是缓存的数量
该值可以用来指定同步通道的消息缓存条数，当你设定为`N`时，发送者就可以无阻塞的往通道中发送`N`条消息，当消息缓冲队列满了后，新的消息发送将被阻塞(如果没有接收者消费缓冲队列中的消息，那么第`N+1`条消息就将触发发送阻塞)。
比如设置了0也就是会被阻塞到。


传输多种类型的数据
```rust
use std::sync::mpsc::{self, Receiver, Sender};

enum Fruit {
    Apple(u8),
    Orange(String)
}

fn main() {
    let (tx, rx): (Sender<Fruit>, Receiver<Fruit>) = mpsc::channel();

    tx.send(Fruit::Orange("sweet".to_string())).unwrap();
    tx.send(Fruit::Apple(2)).unwrap();

    for _ in 0..2 {
        match rx.recv().unwrap() {
            Fruit::Apple(count) => println!("received {} apples", count),
            Fruit::Orange(flavor) => println!("received {} oranges", flavor),
        }
    }
}
```

**所有发送者被`drop`或者所有接收者被`drop`后，通道会自动关闭**。
```rust
use std::sync::mpsc;
fn main() {

    use std::thread;

    let (send, recv) = mpsc::channel();
    let num_threads = 3;
    for i in 0..num_threads {
        let thread_send = send.clone();
        thread::spawn(move || {
            thread_send.send(i).unwrap();
            println!("thread {:?} finished", i);
        });
    }

    // 在这里drop send...

    for x in recv {
        println!("Got: {}", x);
    }
    println!("finished iterating");
}
```
发送者全部`drop`或接收者被`drop`，要结束`for`循环显然是要求发送者全部`drop`，但是由于`send`自身没有被`drop`，会导致该循环永远无法结束，最终主线程会一直阻塞。
要想解决，就直接在for循环之前`drop(send)`




#### 线程同步：锁、Condvar和信号量

共享内存可以说是同步的灵魂，因为消息传递的底层实际上也是通过共享内存来实现
- 共享内存相对消息传递能节省多次内存拷贝的成本
- 共享内存的实现简洁的多
- 共享内存的锁竞争更多
消息传递适用的场景很多，我们下面列出了几个主要的使用场景:
- 需要可靠和简单的(简单不等于简洁)实现时
- 需要模拟现实世界，例如用消息去通知某个目标执行相应的操作时
- 需要一个任务处理流水线(管道)时，等等

共享内存为了避免多线程同时对一个变量进行操作，就需要上锁。（OS课里面的

互斥锁：Mutex
他的存在让同一时间内，只允许一个线程访问一个变量。

在单线程中使用
```rust
use std::sync::Mutex;

fn main() {
    // 使用`Mutex`结构体的关联函数创建新的互斥锁实例
    let m = Mutex::new(5);
    {
        // 获取锁，然后deref为`m`的引用
        // lock返回的是Result
        let mut num = m.lock().unwrap();
        *num = 6;
        // 锁自动被drop
    }
    println!("m = {:?}", m);
}
```
需要使用方法`m.lock()`向`m`申请一个锁, 该方法会**阻塞当前线程，直到获取到锁**
**`m.lock()`方法也有可能报错**，例如当前正在持有锁的线程`panic`了。在这种情况下，其它线程不可能再获得锁，因此`lock`方法会返回一个错误。

Mutex< T>是一个智能指针，实现了Dref（解引用）来获取指向的值。也实现了Drop特征，在超出作用域之后，自动释放锁。


多线程使用Mutex
之前提到过Rc来实现多个所有权的存在，但是Rc< T>无法在线程中传输，因为他没有实现Send特征，因此下面代码会报错
```rust
use std::rc::Rc;
use std::sync::Mutex;
use std::thread;

fn main() {
    // 通过`Rc`实现`Mutex`的多所有权
    let counter = Rc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Rc::clone(&counter);
        // 创建子线程，并将`Mutex`的所有权拷贝传入到子线程中
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    // 等待所有子线程完成
    for handle in handles {
        handle.join().unwrap();
    }

    // 输出最终的计数结果
    println!("Result: {}", *counter.lock().unwrap());
}
```

那有什么能保证线程安全的传输呢——`Arc<T>`
他得益于内部计数器是多线程安全的
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
    println!("Result: {}", *counter.lock().unwrap());
}
```

内部可变性：其中`Rc<T>`和`RefCell<T>`的结合，可以实现单线程的内部可变性。

简单总结下：`Rc<T>/RefCell<T>`用于单线程内部可变性， `Arc<T>/Mutex<T>`用于多线程内部可变性。

互斥锁使用条件：
- 在使用数据前必须先获取锁
- 在数据使用完成后，必须**及时**的释放锁，比如文章开头的例子，使用内部语句块的目的就是为了`及时的释放锁`

死锁
单线程死锁：
```rust
use std::sync::Mutex;

fn main() {
    let data = Mutex::new(0);
    let d1 = data.lock();
    let d2 = data.lock();
} // d1锁在此处释放
```
d1没有释放，d2等待d1的释放，那么就走不到程序结束的时候

多线程死锁
当我们拥有两个锁，且两个线程各自使用了其中一个锁，然后试图去访问另一个锁时，就可能发生死锁
```rust
use std::{sync::{Mutex, MutexGuard}, thread};
use std::thread::sleep;
use std::time::Duration;

use lazy_static::lazy_static;
lazy_static! {
    static ref MUTEX1: Mutex<i64> = Mutex::new(0);
    static ref MUTEX2: Mutex<i64> = Mutex::new(0);
}

fn main() {
    // 存放子线程的句柄
    let mut children = vec![];
    for i_thread in 0..2 {
        children.push(thread::spawn(move || {
            for _ in 0..1 {
                // 线程1
                if i_thread % 2 == 0 {
                    // 锁住MUTEX1
                    let guard: MutexGuard<i64> = MUTEX1.lock().unwrap();
                    println!("线程 {} 锁住了MUTEX1，接着准备去锁MUTEX2 !", i_thread);

                    // 当前线程睡眠一小会儿，等待线程2锁住MUTEX2
                    sleep(Duration::from_millis(10));
                    // 去锁MUTEX2
                    let guard = MUTEX2.lock().unwrap();
                // 线程2
                } else {
                    // 锁住MUTEX2
                    let _guard = MUTEX2.lock().unwrap();
                    println!("线程 {} 锁住了MUTEX2, 准备去锁MUTEX1", i_thread);
                    let _guard = MUTEX1.lock().unwrap();
                }
            }
        }));
    }
    // 等子线程完成
    for child in children {
        let _ = child.join();
    }
    println!("死锁没有发生");
}
```
在上面的描述中，我们用了"可能"二字，原因在于死锁在这段代码中不是必然发生的，总有一次运行你能看到最后一行打印输出。这是由于子线程的初始化顺序和执行速度并不确定，我们无法确定哪个线程中的锁先被执行，因此也无法确定两个线程对锁的具体使用顺序。


try_lock
与`lock`方法不同，`try_lock`会**尝试**去获取一次锁，如果无法获取会返回一个错误，因此**不会发生阻塞**:
lock会阻塞
```rust
use std::{sync::{Mutex, MutexGuard}, thread};
use std::thread::sleep;
use std::time::Duration;

use lazy_static::lazy_static;
lazy_static! {
    static ref MUTEX1: Mutex<i64> = Mutex::new(0);
    static ref MUTEX2: Mutex<i64> = Mutex::new(0);
}

fn main() {
    // 存放子线程的句柄
    let mut children = vec![];
    for i_thread in 0..2 {
        children.push(thread::spawn(move || {
            for _ in 0..1 {
                // 线程1
                if i_thread % 2 == 0 {
                    // 锁住MUTEX1
                    let guard: MutexGuard<i64> = MUTEX1.lock().unwrap();

                    println!("线程 {} 锁住了MUTEX1，接着准备去锁MUTEX2 !", i_thread);

                    // 当前线程睡眠一小会儿，等待线程2锁住MUTEX2
                    sleep(Duration::from_millis(10));

                    // 去锁MUTEX2
                    let guard = MUTEX2.try_lock();
                    println!("线程 {} 获取 MUTEX2 锁的结果: {:?}", i_thread, guard);
                // 线程2
                } else {
                    // 锁住MUTEX2
                    let _guard = MUTEX2.lock().unwrap();

                    println!("线程 {} 锁住了MUTEX2, 准备去锁MUTEX1", i_thread);
                    sleep(Duration::from_millis(10));
                    let guard = MUTEX1.try_lock();
                    println!("线程 {} 获取 MUTEX1 锁的结果: {:?}", i_thread, guard);
                }
            }
        }));
    }

    // 等子线程完成
    for child in children {
        let _ = child.join();
    }
    println!("死锁没有发生");
}
```
这段代码基本和上面的相同，但是因为使用的try_lock不会造成阻塞
>线程 0 锁住了MUTEX1，接着准备去锁MUTEX2 !
线程 1 锁住了MUTEX2, 准备去锁MUTEX1
线程 1 获取 MUTEX1 锁的结果: Err("WouldBlock")
线程 0 获取 MUTEX2 锁的结果: Ok(0)
死锁没有发生

如上所示，当`try_lock`失败时，会报出一个错误:`Err("WouldBlock")`，接着线程中的剩余代码会继续执行，不会被阻塞。


读写锁RwLock
`Mutex`会对每次读写都进行加锁，但某些时候，我们需要大量的并发读，`Mutex`就无法满足需求了，此时就可以使用`RwLock`:（不限制读只限制写入
```rust
use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(5);

    // 同一时间允许多个读
    {
        let r1 = lock.read().unwrap();
        let r2 = lock.read().unwrap();
        assert_eq!(*r1, 5);
        assert_eq!(*r2, 5);
    } // 读锁在此处被drop

    // 同一时间只允许一个写
    {
        let mut w = lock.write().unwrap();
        *w += 1;
        assert_eq!(*w, 6);

        // 以下代码会阻塞发生死锁，因为读和写不允许同时存在
        // 写锁w直到该语句块结束才被释放，因此下面的读锁依然处于`w`的作用域中
        // let r1 = lock.read();
        // println!("{:?}",r1);
    }// 写锁在此处被drop
}
```
`RwLock`在使用上和`Mutex`区别不大，只有在多个读的情况下不阻塞程序，其他如读写、写读、写写情况下均会对后获取锁的操作进行阻塞。
我们也可以使用`try_write`和`try_read`来尝试进行一次写/读，若失败则返回错误:
```console
Err("WouldBlock")
```

- 读和写不能同时发生，如果使用`try_xxx`解决，就必须做大量的错误处理和失败重试机制
- 当读多写少时，写操作可能会因为一直无法获得锁导致连续多次失败([writer starvation](https://stackoverflow.com/questions/2190090/how-to-prevent-writer-starvation-in-a-read-write-lock-in-pthreads))
- RwLock 其实是操作系统提供的，实现原理要比`Mutex`复杂的多，因此单就锁的性能而言，比不上原生实现的`Mutex`

大概率还是Mutex梭哈，除开多次读的时候
- 追求高并发读取时，使用`RwLock`，因为`Mutex`一次只允许一个线程去读取
- 如果要保证写操作的成功性，使用`Mutex`
- 不知道哪个合适，统一使用`Mutex`
第三方库的锁：parking_lot


Mutex只能保证同一时间只能一个线程访问，但是不能确保哪个线程先操作。如果需要控制顺序可以使用Condvar可以让线程挂起，直到某个条件发生后再继续执行

```rust
use std::sync::{Arc,Mutex,Condvar};
use std::thread::{spawn,sleep};
use std::time::Duration;

fn main() {
    let flag = Arc::new(Mutex::new(false));
    let cond = Arc::new(Condvar::new());
    let cflag = flag.clone();
    let ccond = cond.clone();

    let hdl = spawn(move || {
        let mut lock = cflag.lock().unwrap();
        let mut counter = 0;

        while counter < 3 {
            while !*lock {
                // wait方法会接收一个MutexGuard<'a, T>，且它会自动地暂时释放这个锁，使其他线程可以拿到锁并进行数据更新。
                // 同时当前线程在此处会被阻塞，直到被其他地方notify后，它会将原本的MutexGuard<'a, T>还给我们，即重新获取到了锁，同时唤醒了此线程。
                lock = ccond.wait(lock).unwrap();
            }
            
            *lock = false;

            counter += 1;
            println!("inner counter: {}", counter);
        }
    });

    let mut counter = 0;
    loop {
        sleep(Duration::from_millis(1000));
        *flag.lock().unwrap() = true;
        counter += 1;
        if counter > 3 {
            break;
        }
        println!("outside counter: {}", counter);
        cond.notify_one();
    }
    hdl.join().unwrap();
    println!("{:?}", flag);
}
```

信号量Semaphore，使用它可以让我们精准的控制当前正在运行的任务最大数量。
```rust
use std::sync::Arc;
use tokio::sync::Semaphore;

#[tokio::main]
async fn main() {
    let semaphore = Arc::new(Semaphore::new(3));
    let mut join_handles = Vec::new();

    for _ in 0..5 {
        let permit = semaphore.clone().acquire_owned().await.unwrap();
        join_handles.push(tokio::spawn(async move {
            //
            // 在这里执行任务...
            //
            drop(permit);
        }));
    }

    for handle in join_handles {
        handle.await.unwrap();
    }
}
```
使用tokio::sync::Semaphore,上面代码创建了一个容量为 3 的信号量，当正在执行的任务超过 3 时，剩下的任务需要等待正在执行任务完成并减少信号量后到 3 以内时，才能继续执行。

这里的关键其实说白了就在于：信号量的申请和归还，使用前需要申请信号量，如果容量满了，就需要等待；使用后需要释放信号量，以便其它等待者可以继续。