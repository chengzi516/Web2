---
title: 【算法】快速排序，归并排序，两种二分的模板干货讲解，附带边界问题的分析。
cover: https://imgbed.link/file/19737
tags:
  - 算法
  - c++
  - 排序
abbrlink: ac898649
swiper_index: 5
categories: 
- 算法 
date: 2023-03-07 22:32:08

---
>前言：本篇内容会总结快速排序与归并排序两种常见的排序以及整数二分，浮点数二分，并给出相应的模板代码与示例题目。在代码的讲解过程中也会附带讲解让人头疼的边界问题，到底如何划分区间，划分后又该如何设定参数。

# 📣快速排序
 
##  🥗 基本思想
快速排序的中心思想就是`分治算法`。其操作过程就是在区间上选定一个值，然后排序整个数组，使得`值左边的都小于它，右边的都大于它`，然后整个数组就被分成了两段，分治的思想就体现在这里，分别在左右两个数组里取一个值，又继续上述的操作，直到只剩一个数。
比如给出一个数组
{1,3,6,4,7,8,9,3,4}
 我们以（左边界+右边界>>1）为每次确定的值的下标，那么取到的第一个值就是7，我们需要进行的操作就是将比7大的排到7右边，比7小的排到7左边。‘
 可以得到如下结果
 {1,3,6,4,3,4}{7}{8,9}
 此时7就被放到了最合适的位置，只需要分别排序左右两个数组即可。
 上述的便是快排的基础思想。最初的快排是由hoare提出的，经由后人的不断优化有了多种的版本。
 <img src='https://imgbed.link/file/21637'>
 ##  🍌hoare版快排
 在开篇时谈到其中心思想是分治，需要找到区间中的一个值来作为分隔两边的界限，如何去寻找这个值呢？
 有一种明显可以降低复杂度的方法叫`三数取中`，也就是在三个数里取出一个`处在中间的值`，用此数来作为划分的值。这种算法相较于直接取`中间`，或者`左右两边`会有明显的提升。

```c
int GetMidNumi(int* a, int left, int right)
{
	int mid = (left + right) / 2;
	if (a[left] < a[mid])
	{
		if (a[mid] < a[right])
		{
			return mid;
		}
		else if (a[left] > a[right])
		{
			return left;
		}
		else
		{
			return right;
		}
	}
	else // a[left] > a[mid]
	{
		if (a[mid] > a[right])
		{
			return mid;
		}
		else if (a[left] < a[right])
		{
			return left;
		}
		else
		{
			return right;
		}
	}
}

```
找到了区分界限的值，就可以逐步的进行分治了。
```c
int quickSort(int* a, int left, int right) {
	if (left >= right)
			return;
		
	int begin = left, end = right;
	// 三数取中
	int midi = GetMidNumi(a, left, right);
	if (midi != left)
		Swap(&a[midi], &a[left]);

	int keyi = left;
	while (left < right)
	{
		while (left < right && a[right] >= a[keyi])
			--right;
		while (left < right && a[left] <= a[keyi])
			++left;

		Swap(&a[left], &a[right]);
	}

	Swap(&a[keyi], &a[left]);
	QuickSort1(a, begin, keyi - 1);
	QuickSort1(a, keyi+1, end);
}

```
 上述代码还有一个非常重要的点，那就是`当左边的值做key时，右边先走，可以保证相遇位置的值比key要小`,这一点可以自行佐证.
 同理,`当右边的值做key时，左边先走，可以保证相遇位置的值比key要大`.
 上述的方法是hoare的基础版本,经过了一些小优化所得到的,其中很多地方都蕴含着坑,只要稍微写错了一点都会引发bug.
 ## 🌯改良的算法模板
 我个人更推荐采用如下的算法模板，直接取中，显得更加简洁,且更易记住,多写几遍即可。
 ```c
 void quick_sort(int* arr, int l, int r) {
  if(l>=r)
  return;
  int i=l-1;
  int j=r+1;
  int x=arr[(l+r>>1)];
  while(i<j){
      do{i++;}while(arr[i]<x);
      do{j--;}while(arr[j]>x);
      if(i<j)
      {
          int tmp=arr[i];
          arr[i]=arr[j];
          arr[j]=tmp;
      }
      
}
quick_sort(arr,l,j);
      quick_sort(arr,j+1,r);
}
```

参数部分的arr代表传入的数组，l与r则是数组的两个边界下标。
在快速排序的过程中最核心的部分也就是排序的部分。在这里我采取的是左右指针的方式。
如上，我定义了两个指针i与j，当i所指向的那个数比选取值要大时，则停下来，要小也就是符合要求就一直往后走，j则是同理，两个指针的本质都是在`筛选不符合要求的值`。
但上述的写法在进行筛选时可能某一趟无法实现让选取值的两边都完全符合要求，但即便如此在接下来的趟数中会进行逐步的纠正。上述模板是方便记忆的一个`最优解`。
当然，如果忘记了如何调整，也可使用开辟新数组的方式，或者`挖坑法`。
<img src='https://imgbed.link/file/21640'>
此处就不再展示挖坑的代码，感兴趣的可以自行写或者百度。
同时，因为使用的是do while结构，所以定义i与j时选择`各自往两边靠一位`。
## 🍣关于边界问题的一些分析

在使用快速排序时，需要额外的注意边界的划分问题，其核心在于是否会`死循环`。
判断是否死循环也十分简单，在不断的递归中，l与r不断变化，若在参数为（arr，l，r）的函数递归中再次出现了（arr，l，r），很明显，这样就会造成死循环。

 先来看边界是如何确定的。快速排序的方法核心在于分治，也就是将序列划分为`左部分小于等于x，右部分大于等于x`，那么对于i而言，i左边的数都是必定小于等于x，且j右边的数必定大于等于x，那么就可划分为以下两种情况：
 ```c
quick_sort(l,i-1) ,quick_sort(i,r)
quick_sort(l,j) ,quick_sort(j+1,r)
 ```
 *也就是arr[i]不能保证小于等于x，但i-1可以，arr[j]不可以保证大于等于x，但j+1可以。*
此时对于x的选择就会造成某些死循环。
>当x=arr[l]
例如数组里只有1，2，在一轮循环之后会使得`i=l`，此时进行递归会得到sort(l,i-1),sort(i,r)，你会发现sort(i,r)是等价于sort(l,r)的，那么必然会发生死循环。

>当x=arr[r]
例如数组里只有1，2，在一轮循环之后会使得`j=r`，此时进行递归会得到sort(l,j),sort(j+1,r)，你会发现sort(l,j)是等价于sort(l,r)的，那么必然会发生死循环。

还可以考虑一下x=arr[l+r>>1]的情况，此时的arr`是向下取整的`，那么还是使用1，2的例子，其等价于当x=arr[l]这种情况了。

所以我们可以总结这样的规律：
>如果x=arr[l] or x=arr[l+r>>1]，此时只可以使用sort(l,j),sort(j+1,r)
如果x=arr[r],此时就只可以使用sort(l,i-1),sort(i,r)

一定要熟记上面的规律。

## 🍰非递归实现快排
还有一种快速排序,是`非递归`的形式来实现的.

# 🔔归并排序
归并排序的思想也是`分治`。
第一步仍然是取一个分界点，第二步就是将这个数组分为两个数组，第三步，对两个数组分别进行排序。
当然，当数组只有一个数就直接返回即可，因为此时不需要进行排序。
归并，字面意思理解就是`合二为一`，不断的通过递归，将`小数组变成有序数组`，再不断通过递归返回，将有序数组的长度越拼接越大，直到拼完整个数组。

其模板如下：

```c
void mergesort(int* arr,int l,int r){
    if(l>=r)
    return;
    int mid=(l+r>>1);
    mergesort(arr,l,mid);
    mergesort(arr,mid+1,r);
    int tmp[100000];
    int i=l;
    int j=mid+1;
    int k=0;
    while(i<=mid&&j<=r){
        if(arr[i]>arr[j]){
            tmp[k++]=arr[j++];
            
        }else{
            tmp[k++]=arr[i++];
        }
    }
    while(i<=mid) tmp[k++]=arr[i++];
    while(j<=r) tmp[k++]=arr[j++];
    for(int i=l,k=0;i<=r;i++,k++){
        arr[i]=tmp[k];
    }
}
```
在排序的过程中，这里使用的方法是`开辟新数组`，分别用`两个指针`指向要拼接的小数组，不断进行比较，取出更小的放到新数组中。
当然，别忘了将排序好的新数组再依次放回原数组中去。
归并排序也是要考虑到`边界问题`的。
和快速排序是一个道理，因为mid的值是`向下取整`的，所以`mid可能会取到l`（可以再想想只有两个数的数组的例子）,那么如果划分为（l，mid-1）与（mid，r），也会出现（mid，r）等价于（l，r）的死循环了。
但是如果使用`mid`作为分割的位置，也就是（l，mid）与（mid+1，r），因为mid向下取整，所以再怎样`都不会取到r`，如果数组中只有一个数也是直接返回，不会造成死循环。

边界划分的问题大多都可以这样思考，可以规避掉很多的问题。

##  🤠利用归并排序求逆序对的数量
这是一道很经典的题。
给定一个长度为 n的整数数列，请你计算数列中的逆序对的数量。
逆序对的定义如下：对于数列的第 i个和第 j个元素，如果满足 i<j且 a[i]>a[j]，则其为一个逆序对；否则不是。

输入格式
第一行包含整数 n，表示数列的长度。

第二行包含 n个整数，表示整个数列。

输出格式
输出一个整数，表示逆序对的个数。

数据范围
1≤n≤100000
数列中的元素的取值范围 [1,109]

输入样例：
6
2 3 4 5 6 1
输出样例：
5

# 🔊二分

## 🔳整数的二分
二分的核心思想在于对数组或者一段范围找到一个合理的`判断条件`，可以将其`划分为两个区域`。
例如给定一个`有序`的整数数组，我们需要寻找其中是否有4这个数字，那么给定的判断条件就可以是x>=4或者x<=4.
先假设取得的值为mid=（l+r/2），那么可以得到下图的推断。
我们需要寻找的值就是蓝色的最右边，红色的最左边。
<img src='https://imgbed.link/file/18079'>
在此基础上不断的进行二分，缩小数组的查找区间。这就是二分的基本思路。
以下是给出的代码模板。

```c++
bool check(int x) {/* ... */} // 检查x是否满足某种性质

// 区间[l, r]被划分成[l, mid]和[mid + 1, r]时使用：
int bsearch_1(int l, int r)
{
    while (l < r)
    {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;    // check()判断mid是否满足性质
        else l = mid + 1;
    }
    return l;
}
// 区间[l, r]被划分成[l, mid - 1]和[mid, r]时使用：
int bsearch_2(int l, int r)
{
    while (l < r)
    {
        int mid = l + r + 1 >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    return l;
}

```
代码中给出的两个二分查找也就分别对应了`蓝色与红色`的两种划分。
当区间被划分为（l，mid-1）与（mid，r）时，由于mid存在向下取整的情况，所以mid可能`会取到l`，造成`死循环`，那么此时解决的办法就是将`mid+1`，就可以规避死循环。
也就是        int mid = l + r + 1 >> 1;

### 🤡数的范围
给定一个按照升序排列的长度为 n的整数数组，以及 q 个查询。
对于每个查询，返回一个元素 k的起始位置和终止位置（位置从 0开始计数）。
如果数组中不存在该元素，则返回 -1 -1。
输入格式
第一行包含整数 n和 q，表示数组长度和询问个数。

第二行包含 n个整数（均在 1∼10000范围内），表示完整数组。
接下来 q行，每行包含一个整数 k，表示一个询问元素。

输出格式
共 q行，每行包含两个整数，表示所求元素的起始位置和终止位置。

如果数组中不存在该元素，则返回 -1 -1。

数据范围
1≤n≤100000

1≤q≤10000

1≤k≤10000
输入样例：
6 3
1 2 2 3 3 4
3
4
5
输出样例：
3 4
5 5
-1 -1

本题的核心思想就是寻找`特定数字的起始与终止坐标`，那么就需要利用到上面讲的两种区间了，蓝色的可以找到终止，红色的可以找到起始。不要将二分只是局限于寻找一个值，你可以利用check函数寻找到满足某个条件的`临界点`。
代码如下：

```c
#include<stdio.h>
int check1(int *arr,int num,int q){
    if(arr[num]>=q)
    return 1;
    else
    return 0;
}
int check2(int* arr,int num,int q){
    if(arr[num]<=q)
    return 1;
    else
    return 0;
}
int binerysearch1(int q,int* arr,int l,int r){
   
    while(l<r){
    int mid=(l+r>>1);
    if(check1(arr,mid,q)) r=mid;
    else l=mid+1;}
    if(arr[l]==q)
     return l;
     else
     return -1;
}
int binerysearch2(int q,int*arr,int l,int r){
    

   while(l<r){
    int mid=(l+r+1>>1);
    if(check2(arr,mid,q)) l=mid;
    else r=mid-1;}
    if(arr[l]==q)
      return l;
    else
      return -1;
}
```

## 😎浮点数二分
浮点数的二分相较之下就要简单很多了。
只要r与l的差距`足够小`，就可以认为这是我们想要的值了。
其模板如下：
```c++
bool check(double x) {/* ... */} // 检查x是否满足某种性质

double bsearch_3(double l, double r)
{
    const double eps = 1e-6;   // eps 表示精度，取决于题目对精度的要求
    while (r - l > eps)
    {
        double mid = (l + r) / 2;
        if (check(mid)) r = mid;
        else l = mid;
    }
    return l;
}
```
浮点数的二分可以用来求一个数的`三次方根`，计算机对于浮点数的存储本来就不会特别精确，所以只需要将其误差控制在1e-6就可以啦。
给出一种写法：
```c
int check(double num,double mid){
    if(mid*mid*mid>=num){
        return 1;
    }else
    return 0;
}
void binerysearch(double num,double a,double b){
     double eps=1e-6;
     double mid=0.0;
     while(b-a>=eps){
          mid=(a+b)/2;
         if(check(num,mid)) b=mid;
         else a=mid;
     }
     printf("%.6lf",mid);
}
int main(){
    double num=0;
    scanf("%lf",&num);
    binerysearch(num ,-10000.00,10000.00);
}
```
