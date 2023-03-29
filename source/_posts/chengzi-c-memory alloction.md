---
title: 【c】简述内存中数据如何存储？动态内存该如何分配？
cover: https://imgbed.link/file/19736
tags:
  - c语言
abbrlink: f2154748
date: 2023-03-03 09:55:42
categories: 
- c/c++
---
> 😍在本章的内容里会详细的介绍在c语言的程序中，整型int与浮点型float是如何进行存储的，以及动态分配的一些基础知识点。

# 🥕数据类型
数据类型在初始c语言的阶段就已经与大家见过面了。基本上可以分为以下几种基本的内置类型：

```
char //  字符数据类型
short // 短整型
int //  整型
long // 长整型
long long//  更长的整型
float //  单精度浮点数
double //  双精度浮点数
```
通常就上述的七种类型就可以满足我们的日常需要了。
那么开始进入正题。

# 🥔类型的分类

在c语言中，我们大致将数据类型分为五大类。其具备不一样的特点。

>整型

```
char
short
int 
long 
```

整型基本就为上面四种，将字符型归入整型是因为`字符型在存储时是以asc码的形式`，而asc码又是整数，故将其归纳在整型之中了。
有时候我们还会见到类似这样的写法
```
unsigned int
unsigned short
signed int
```

unsigned意思是无符号型，signed则是有符号型。其中signed int中的signed也可以省略不写，其等价于int。
>但是有一点请注意，char类型省去了signed，到底有无符号是由`编译器本身`去决定的。

>浮点型

```
float
double
```
常见的浮点型也就这两种，其区别主要在于单精度和双精度。在后文存储方式我们再仔细地去研究。

>构造类型

```
int arr[];  //数组类型
struct //结构体类型
enum //枚举类型
union //联合类型
```

构造类型也是我们非常熟悉的类型了。其中列举的数组和结构体是需要重点掌握的内容。


>指针类型

```
int* a;
char* p;
```
指针类型的一些详细使用可以参考上一篇博客的内容。

>空类型

```c
void test(void)
void* p
```

空类型也是老朋友了。函数中的常客，指针中的应用要少一些。

唠完了基本的分类，就来看看整型和浮点型是如何在内存中进行存储的吧。

# 🥒整型的存储

在了解整型的储存之前，需要了解原码，反码以及补码的基本表示方式。
三个码都具备`符号位`和`数值位`，其中的符号位用`1和0来表示负和正`，数值位的结构就稍微复杂一点。
总的可以分为以下几点。
>正数的原反补皆相同。
负数的原反补不相同。
其中，原码就是直接将数值翻译到二进制即可。例如-3，翻译为1····011，第一个1是符号位，代表是负数，最后两位11则表示3。
反码则在原码基础上`除了符号位之外`全部取反。
补码则是在反码基础上`+1`即可。
并且补码和原码的转换是`可逆`的，二者取反+1都可以得到对方。


关于原反补的概念大致理解这么多也就足够了。各位会在计算机组成原理中还会遇到它，并会进行更深刻的学习。

还需要强调的一点就是，在计算机中，数据是以`补码`的形式来存放的。一定要牢记这一点。

采用补码而非原码反码主要有以下三点原因。
其一，采用补码可以使得符号位和数值域统一的进行处理。
其二，加法减法也能统一进行处理。
其三，正如上面提到的，补码原码的转换是相通的，也就不需要再添加额外的硬件电路了。

不理解的可以试试分别用原码和补码去做1+（-1）的加法（因为计算机只有alu加法器，所以需要将减法转化为加法），原码得到的结果是错误的。


回过头来，思考本章的内容。在之前的文章中，我们也曾经提到过，int a=10这样的式子并非只是简单的给a赋值为10，而是在创建变量的同时也就在内存中`开辟了相应大小的空间`，这也是数据类型具有的意义之一。
调用内存空间来看看这个a是如何存放的吧。
<img src="https://imgbed.link/file/15192">

我的窗口是以16进制显示的，所以a就代表这个10，但我们会发现他的存储方式很奇怪，不是a0 00 00 也不是00 00 00 a0，这就要引出下面的内容了。

## 🥝大小端

直接丢出定义。
>大端模式：也被称为大端字节序，将数据的`低位`保存在内存的`高位`里，而`高位`保存在内存的`低位`。
小端模式： 也被称为小端字节序，将数据的`低位`保存在内存的`低位`里，而`高位`保存在内存的`高位`。

在计算机的严密的机制下，存在即合理，同样，大端小端的出现也正是为了解决一些存储上的问题。
我们知道，计算机里每个内存单元都对应着一个字节，并且一个字节大小为8bit，但是除了char，c中还有很多的数据类型是比8bit要大的，所以就涉及到了如何存储多字节的问题。采用乱序排放也可，但是在取出的时候必须按顺序存储，乱序虽然放的时候很爽，但取就很麻烦了。所以才有大端和小端两种存储方式来解决多字节的存储问题。比如常见的x86就是小端存储，一些arm处理器则是大端存储。
如上文的内存窗口，`左边`就是内存单元的`低位`，`右边`则是内存单元的`高位`。
那a=10，a的原码是000····001010，转换为十六进制则为 00 00 00 0a，不会转换的请自行查资料。低位的0a被放在了内存的低位，那么就知道我的编译器采用的是小端存储啦。

如何去设计程序验证到底是大端还是小端呢？
可以利用`指针`来做。
在指针的学习中我们应该知道，指针的大小取决于平台是32位还是64位，而不同类型赋予它的是`指针+1时它可以访问多少个内存单元`。这点非常重要，请一定要理解。
首先是选取易于我们验证的对象，在这里我选用1来验证。
再建立一个char型的指针p，他就只能取int型的第一个内存单元，也就是说，如果是小端，取到的第一个内存单元中的内容就会是1，而如果是大端，就会取到0。大概的思想就是这样。

```c
int b = 1;
	char* p = (char*)&b;
	if (*p == 1)
	{
		printf("小端");
	}
	else
	{
		printf("大端");

	}
```
稍微解释下其中的细节，因为b是int型，所以使用char型的p来取b的地址就需要进行强制的`类型转换`了。如果采用函数来书写这个环节的话，返回类型是int和char都无所谓，虽然会发生整型提升，但由于取到的是1，所以并没有什么大的影响。
经过测试，我的编译器是小端存储，也是符合上文的推论的。

## 🧀小练习

用几个小例题练练手，测试下自己是否真的掌握了吧。

### 🥑例1

-1使用不同的类型来存储，会输出些什么呢？

```c
char a=-1;
signed char b =-1;
unsigned char c = -1;
printf("%d %d %d",a,b,c);
return 0;
```

首先，可以确定的是-1存储到char中，是会发生`截断`的。因为-1默认为int型，是比char要大的，-1的补码是111···111，截断后将`最后八位`放到char型空间里。
再用%d将char型的a进行输出，会发生什么呢？
>%d是打印`有符号`整数。

此时打印a就会发生`整型提升`。在整型提升时，负数会加1。此时就会变成111···111，一共32位1。转换为原码则得到了-1这个值。同样的，signed char和char效果一样，就不多做解释。第三个是unsigned char，也就是无符号的类型，那么截断后的11111111，第一位就`不会被认为是符号位`。那么正数在整型提升时加的是0，也就得到了000···11111，换算成十进制就是255了。

对整型提升不清楚的可自行谷歌。




### 🍑例2

```c
char a = -128;
printf("%u",a);

```

>%u 的意思是打印一个无符号的整数。

还是同样的思路。先写-128的原码。1000··10000000，转换为补码为11···10000000截断取后8位，10000000，此时再以int类型来打印，则发生整形提升，注意整型提升的符号位这里看的是`char`，所以就补1，变成了111···1000000，由于是采用%u形式打印，那么第一位的1就不会被认为是符号位，那么就会得到一个非常大的数了。


### 🌽例3

```c
unsigned int i;
for(i =9;i>=0;i++)
{
	printf("%u\n",i);
}
```

程序跑起来会发生什么结果呢？答案是发生`死循环`。
i首先会不断地减小到0，但因为i定义时是unsigned，所以不会出现负数，所以循环的终止条件是无法实现的。那么程序就会陷入一个死循环。具体出现什么数可以自行探究，并在编译器上查验猜想。

### 🍌例4

```c
char a[10000];
int i;
for(i=0;i<1000;i++)
{
	a[i]=-1-i;
}
printf("%d"，strlen(a));
return 0;
```

屏幕上会打印出什么呢？
首先复习一下strlen的知识点，strlen是一个计算字符串长度的库函数，当遇到'\0'时终止计算。换言之，只要找到了字符串中为0这个数，就找到了\0(因为asc表中`注明\0对应的整数为0`) 。

看程序，从i=0开始，得到-1，-2，-3，-4，·····，-128 ，再-1就会得到127了（下面有讲解），126，125，·····，0
所以在0以前一共出现了255个数字。得到的结果也就是255了。


拓展：
思考char和unsigned char的取值范围。
>char -128 到 127
unsigned char  0 到 255

讲一下char型
>00000000
00000001
00000010
········
01111111
10000000
········
11111111

不难计算出，0开头的代表正数，从0到127，1开头代表负数，其中10000000代表的是-128，11111111则是-1，注意负数要补码转原码哦。
还可以得到的一个结论，char型的循环+1，其结果也是会循环的，从00000000到11111111，再加1就又回到了00000000了。
unsigned char可以自己试着推演。

### 🍎例5

```c
unsigned int a= 0x1234; unsigned char b=*(unsigned char *)&a;
```

在32位大端模式处理器上变量b等于（ ）

首先，因为a是unsigned int型，所以a要占用4个字节，但这里只有2个字节。所以要补齐成为0x00001234。因为这里显示的是16进制，16进制转2进制的话，`一位16进制转4位2进制`,1234转16位二进制，而int型要占用32个bit，即还有一半没有显示，需要我们自行补齐。
a在大端的存放方式为00001234，这里的b则是用unsigned char的类型从a的首地址开始接收。但char本身只有一个字节，即在大端处理器上只能显示为0x00了。

那么到这里，整型在内存中的存储就告一段落了，下面来讲浮点型的存储。

# 🍉浮点型的存储

## 🍇引入

浮点数大家也都很熟悉了，在c语言大致有double，float，long double等，具体的表示范围可在float.h中查看。

思考浮点数的存储方式到底有何意义呢？举一个例子放在这里。试着思考下到底会出现怎样的答案。

```c
int a = 8;
	float* p = (float*)&a;
	printf("n=%d\n", a);
	printf("p=%f\n", *p);
	*p = 8.0;
	printf("n=%d\n", a);
	printf("p=%f\n", *p);
	return 0;

```

试着想一下，编译器是否会跟着你的想法来走。

得到的编译器答案

>n=8
p=0.000000
n=1090519040
p=8.000000

先将这个问题放在这，等讲完浮点数在内存中的存储就能理解为何出现这样的情况了。

## 🍈浮点数存储规则

在计算机中，根据IEEE754的规定，将任意一个二进制浮点数表示成以下的样子。
懒得码就搬百度咯。

>  IEEE二进制浮点数算术标准（IEEE 754）是20世纪80年代以来最广泛使用的浮点数运算标准，为许多CPU与浮点运算器所采用。这个标准定义了表示浮点数的格式（包括负零-0）与反常值（denormal number）），一些特殊数值（无穷（Inf）与非数值（NaN）），以及这些数值的“浮点数运算符”；它也指明了四种数值舍入规则和五种例外状况（包括例外发生的时机与处理方式）。
IEEE 754规定了四种表示浮点数值的方式：单精确度（32位）、双精确度（64位）、延伸单精确度（43比特以上，很少使用）与延伸双精确度（79比特以上，通常以80位实现）。只有32位模式有强制要求，其他都是选择性的。大部分编程语言都有提供IEEE浮点数格式与算术，但有些将其列为非必需的。例如，IEEE 754问世之前就有的C语言，有包括IEEE算术，但不算作强制要求（C语言的float通常是指IEEE单精确度，而double是指双精确度）。
该标准的全称为IEEE二进制浮点数算术标准（ANSI/IEEE Std 754-1985），又称IEC 60559:1989，微处理器系统的二进制浮点数算术（本来的编号是IEC 559:1989）。后来还有“与基数无关的浮点数”的“IEEE 854-1987标准”，有规定基数为2跟10的状况。最新标准是“ISO/IEC/IEEE FDIS 60559:2010”。


简单的来说，我们可以将一个二进制浮点数表示成下面这样。
<img src=https://imgbed.link/file/15206>
其中的S表示符号位，S=0时，浮点数为正数，S=1则为负数。
M表示有效数字，大于1小于2。
E则代表指数位。

还是得上个例子才能帮助理解。

就拿上面提到的8.0做个例子。
8.0转换为二进制是1000.0，因为8.0是正数，所以S为0，规定有效数字的第一位必须为1，那么得到1.0000 * 2^3 ,其中1.0000就是有效数字M,E就是3了。

那么所有的浮点数都可以按照这样的方式去存储，会给计算机节省很多的空间。

对于单精度浮点数，也就是32位浮点数，最高的一位就是S,接着的就是8位指数E和23位有效数字M 。

64位的双精度浮点数，仍然是一位的S，加上11位指数E，再加上52位的有效数字M。


对于M和E，有一些细小的规则。
因为M必须写成`1.·····`的形式，所以这位1是`默认省略掉`的，这样就可以多出一位来装数据。
对于E呢，则要复杂一些了。
在科学计数法中，E是允许出现负数的，但是在存储中如果不加限制，8位和11位的E的取值范围为0~255和0~2047，为了解决这个问题，IEEE754规定，在存入内存时，其`真实值需要加上一个中间数`。这个中间数在8位就为127，11位就为1023 。

从内存中取出也有三种情况需要讨论，在这里就不再展开了，分别是E不全为0或不全为1，全为0，全为1 。

## 🍐结语

回到刚才的引入，应该对浮点数有一定的认知了吧。
第一个%d得到的是8，这个没有问题。
但第二个就和大家的猜测有很大差异了。
8明明是作为int型来存储的，但是*p表示将8以浮点数的形式往外拿，8的补码可以表示为 0000····00001000 ，以浮点数的形式来划分，就会得到（-1）^0 * 0.001000 * 2^-126 (这里的E是全0，表示为1-127或者1-1023) 。
转化为熟悉的十进制后会发现是一个无限接近0的数 。
第三个第四个也是同样的道理了，这个例子可以揭示的一个道理就是，`用什么类型存就用什么类型拿`，千万不要胡来。

接下来就是内存管理的部分。

#  🍠动态内存的意义
在了解动态分配之前，回顾一下之前学的内存开辟方式。
```c
int a=20;
```
这样就开辟了一块类型为int，存放数据为20的空间，并为其取名为a。
但是，这样的开辟方式，所开辟的空间`大小是固定`的。
那么，当我们遇到了在编译前无法获知数据所需大小，只有`运行时才知道`的情况时，就应当采取动态内存分配了。
摘录一段百度百科的解释：
>在c/c++语言中，编写程序有时不能确定数组应该定义为多大，因此这时在程序运行时要根据需要从系统中`动态多地获得内存空间`。所谓动态内存分配，就是指在程序执行的过程中`动态地分配或者回收存储空间的分配内存`的方法。动态内存分配不像数组等静态内存分配方法那样需要预先分配存储空间，而是由系统根据程序的需要即时分配，且`分配的大小就是程序要求的大小`。

---
# 🌰c/c++的内存开辟
在c/c++的程序中，内存会被分配在以下几个区域：
+ 栈区（stack）：`分配给进程的采用先进后出方式访问的内存区`。在执行函数时，内部变量都可在栈上创建，当函数执行完毕则`自动销毁`。有着效率高，但分配容量有限的特点。栈区里主要存放`局部变量，函数参数，返回数据与地址`等。普通的局部变量基本都在栈区进行分配空间，所以在栈区上的变量只要`一出作用域就会被销毁`。
+ 堆区（heap）：一般由程序员分配释放，其方式类似于链表。
+ 数据段（静态区）：也就是熟知的`static`，存放`全局变量与静态数据`，待程序`结束`后才会由系统释放。这也是为何其生命周期同程序一同结束的原因。
+ 代码段：存放函数体的`二进制代码`。



---
# 🍯动态内存函数
C语言允许建立内存动态分配区域，以存放一些临时用的数据，这些数据不必在程序的声明部分定义，也不必等到函数结束时才释放，而是需要时随时开辟，不需要时随时释放。C语言中，内存的动态分配是通过系统提供的库函数来实现的，主要有`malloc`、`calloc`和 `free` 函数。

## 🥐malloc函数
malloc与free都包含于`stdlib.h`头文件中。
其声明为：
```c
void* malloc(size_t size);
```
>其作用为：向函数内存申请一块`连续可用`空间，并返回`指向这块空间`的地址。

+ 如果开辟失败，就会返回`null指针`。
+ 开辟成功，就返回指向开辟空间的指针。
+ size`不应该设置为0`，因为此时其行为未定义，取决于编译器。


使用示例：
```c
int* p=NULL;
p=(int*)malloc(40);
```
申请了一块空间，大小为40个字节，由指针p来指向这块空间。
可能有人会有疑惑：
*为何malloc前需要声明未曾提及的强制类型转换？*
在编译器上`不加强制类型转换`一般也不会报错或者发出警告。
在ANSI/ISO标准c下，反而不如直接使用malloc，使用malloc进行强转，有助于将程序更方便的`移植到c++`里。
所以在这里使用强转大概是因为很多老师将c/c++混在一起教学，且包括我的学校等都在使用devc++这种老掉牙的编译器。

*因为不知道是否申请内存成功，所以一定要检查返回值*
```c
if(p != NULL)
{
     //操作
}
```
或者if（p==NULL），就打印申请失败等类似字面意思。

## 🥖free函数
free函数通常会与malloc`一起使用`。如果在使用完一份空间后不使用free进行销毁，会造成`内存泄露`这样的严重情况。
在使用完一份空间后加上这样的代码块
```c
free(p);
p=NULL;
```
这里在释放内存后一定要`主动将p置为空`。

## 🍳calloc函数
calloc函数也是用来进行内存分配的。
其声明为：
```c
void* calloc(size_t num,size_t size);
```
功能为向`num`个大小为`size`的元素开辟一块空间，并且将空间的`所有字节化为0`。
这点与malloc是有出入的。malloc并不会将每个字节都化为0。具体使用哪个看实际情况。
使用示例：
```c
int* p=(int*)calloc(10,sizeof(int));
```
申请了一块空间，其大小为int*10。
也是注意在使用完后，一定要free掉。

## 🥙realloc函数
如果发现之前使用malloc，calloc申请的空间`太小或太大`了，就可以使用realloc来做一个灵活的调整。
其声明为：
```c
void *realloc(void *ptr,size_t size);
```
+ 其中的ptr是需要调整的`内存地址`。
+ size是调整后的`新大小`。
+ 函数返回值是调整后`内存的起始位置`。
+ 函数在调整原内存空间大小基础上，会将原有内存中数据`移到新空间`。

realloc在调整空间时，会有两种情况出现。
若是原有空间后面有`足够大小`的空间，那么扩展内存就是`直接追加空间`，原空间数据不变化。
但是若空间不够，就需要在堆空间里`另找`合适大小的连续空间，就会导致函数`返回一个新的地址`。

在进行扩展时，尽量不要有这种写法。
```c
ptr=(int*)realloc(ptr,1000);
```
如果申请失败，会把原有的数据也丢了。所以请`定义一个新指针`来作为返回值，如果其不为空，再赋给ptr，这样更为稳妥。

---
# 🍗动态内存常见的错误
*越界访问动态开辟的空间*
```c
int *p=malloc(5*sizeof(int));
if(p==NULL)
    printf("malloc failed\n");
for(int i=0;i<10;i++)
  *(p+i)=i;

free(p);    
```
很显然，只开辟5个int大小的空间，却往里面放入了10个int大小的数据，这是不可行的。

*对空指针进行解引用的操作*

```c
int *p=malloc(5*sizeof(int));
*p=20;
free(p);
```
若申请空间失败，导致p的值仍然是NULL，就会出现问题。所以提倡对`是否申请成功`一定要判断。

*用free释放一块动态开辟内存空间*

```c
int *p=malloc(5*sizeof(int));
p++;
free(p);
```

此时的p已经不再指向`动态内存的起始位置`。所以free的操作无法执行完全。

*多次使用free释放*

```c
int *p=malloc(5*sizeof(int));
free(p);
//操作
free(p);
```
这种重复释放的情况也是不被允许的，但是在使用完动态开辟的内存空间之后，一定要记得free掉，不然会造成`内存泄漏`等现象。

*传参出错*
```c
void GetMemory(char *p)
{
    p = (char *)malloc(100);
}
void Test(void)
{
    char *str = NULL;
    GetMemory(str);
    strcpy(str, "hello world");
    printf(str);
}
```
上面这段代码希望将str的内存分配在函数部分完成，然后回到主函数将hello world拷贝到str里。但是事与愿违，其函数传递的参数是有误的，想要改变str里的值，就`必须传递str的地址`。接收str的p不过是一份拷贝，`p的改变不代表str的改变`。所以str仍然是NULL，在strcpy的阶段会因`参数在0地址空间而发生访问内存出错`。
所以将gtememory里的参数替换为`&str`，同时接收的参数换为char**p，以二级指针的形式来接收。

*忽略栈帧的特性*
```c
char *GetMemory(void)
{
    char p[] = "hello world";
return p; }
void Test(void)
{
    char *str = NULL;
    str = GetMemory();
    printf(str);
}
```
这串代码采用了返回一个指针来让str接收的方法，但却忽略了`临时变量出了其作用域，就会被销毁`的特点。所以仍然会出错。在这一点想要深究可以尝试理解栈帧在程序里的作用与运作。

*野指针*
```c
void Test(void)
{
    char *str = (char *) malloc(100);
    strcpy(str, "hello");
    free(str);
    if(str != NULL)
    {
        strcpy(str, "world");
        printf(str);
} }
```
在这里确实还可以正常输出，但需要注意的是，将str free掉以后，str虽然仍旧指向hello，但对其已经没有`使用权限`！str在这里成为了一个`野指针`。野指针是我们在写程序时需要尽量避免的元素。这可能会造成一些不可控的事故。

*再次提醒内存泄漏*
```c
void GetMemory(char **p, int num)
{
    *p = (char *)malloc(num);
}
void Test(void)
{
    char *str = NULL;
    GetMemory(&str, 100);
    strcpy(str, "hello");
    printf(str);
}
```
忘记了free，这点非常重要。在`使用完内存空间后一定要释放掉`！


---

# 🍔柔性数组
>柔性数组（flexible array），在c99中，结构中`最后`一个元素允许是`未知大小`的数组。

```c
struct a
{
int i;
int arr[];
};
```

 其具备以下的特点：
 + 在结构中的柔性数组成员`前`必须要有一个`其他类型`的成员。
 + sizeof返回的结构体大小并`不包含柔性数组的内存`。
 + 如果结构体中包含了柔性数组，那么就应该使用`动态内存分配`的形式，其分配的内存也应该大于结构的大小。

如下为上面的结构体中的柔性数组成员赋100个整型元素的连续空间。
```c
struct a *p=malloc(sizeof(struct a)+100*sizeof(int));
p.i=0;
for(int i=0;i<100;i++)
{
p.arr[i]=[i];
}
```

使用柔性数组可以利于提升`访问速度`，因为其使用的是一段连续的内存空间。                                                                         
