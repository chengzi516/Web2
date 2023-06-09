---
title: 【算法】插入排序与希尔排序的一些理解
cover: https://tuchuang-1317757279.cos.ap-chengdu.myqcloud.com/%E7%AE%97%E6%B3%95.png
abbrlink: 1000f306
date: 2023-03-31 17:18:47
updated: 2023-03-31 17:18:47
tags:
- 排序
categories:
- 数据结构与算法
ai: ture
---

>本章讲解了插入排序与其升级版--希尔排序的主要思想与代码实现。

# 🤑插入排序
插入排序是最简单的一种排序方法，其本质就在于`不断从后向前插入`。
意思就是，将待排序序列的第一个当做`有序序列`，然后将第二个往前插入，要求升序则将两数中较小的那个排至最前面，降序则把较大的放在最前面。这样操作一次就把前两个数变成了一个有序数列，同理操作第三个数，第四个数·······直到将整个数列排列完成。
以下是一张动图，可以直观感受插排的过程。
<img src='https://www.runoob.com/wp-content/uploads/2019/03/insertionSort.gif'>
图源[菜鸟教程](https://www.runoob.com/)。
就像是打牌一样，将手中的牌进行整理，按照一个顺序依次排好。
思想清楚了就可以写代码了，先书写单趟的循环（这里写的是`升序`）。
我们将每次`排好序的队列`的下标的`最后`一位定为`end`，那么需要往前插入的就是处在`end+1`的元素。将这个元素暂存在tmp中，并向前比较，遇到比他大的则依次`向后放`。
```c
int end;
	int tmp = a[end + 1];
	while (end >= 0) {
		if (a[end] > tmp) {
			a[end + 1] = a[end];
			end--;
		}
		else {
			break;
		}
	}
	a[end + 1] = tmp;
```
要想对整个数列进行排序，就需要对end做出相应的变化。
```c
void insertsort(int* a, int asize) {
	for (int i = 1; i < asize; i++) {
		int end=i-1;
		int tmp = a[end + 1];
		while (end >= 0) {
			if (a[end] > tmp) {
				a[end + 1] = a[end];
				end--;
			}
			else {
				break;
			}
		}
		a[end + 1] = tmp;
	}
}
```

# 🤠希尔排序
希尔排序算是一个插入排序的升级版。插入排序虽然思路简单，但一遇到数据量过大，运算就会非常吃力，在最不理想情况下，其时间复杂度会到达O（n^2），显然插入排序在使用中存在着巨大的缺陷。
希尔排序则很巧妙的解决了复杂度过高的问题。
希尔排序的主要思想就是进行`预排序`：
比如有一个队列 1，3,5,2,6,4,7,8,9,10，5,2
希尔排序会要求先对其进行分组，我们这里将其分为4组，`gap`(间隔)为3：
会得到第一组：1,6,9,，第二组3,4,10，第三组5,7,5，第四组2,8,2。
我们现在要求进行降序排列，那么对四组分别进行排序，就会使得整个数组变成：
9,10,7,8,6,4,5,2,1,3,5,2
相比于初始数列，会发现其变的`基本有序`，此时再对整个数组进行插入排序，就会减少很多的运算量。
但需要注意的是希尔排序是一种`不稳定的排序`，因为预排序的结果是不可控的。
即其算法思想为：`先进行多组预排序，最后执行插入排序`。
<img src='https://pic.leetcode-cn.com/1630914539-YCEFCI-file_1630914537571'>
[图源此处](https://leetcode.cn/circle/article/0akb5U/)
还是先书写`单趟`的排序。其本质与插排是一样的，所以只需要更改几个地方即可。
```c
    int end;
	int gap;
	int tmp = a[end + gap];
	while (end >= 0) {
		if (a[end] > tmp) {
			a[end + gap] = a[end];
			end-=gap;
		}
		else {
			break;
		}
	}
	a[end + gap] = tmp;
```
从代码可以看出，就是将+1或者-1的地方替换为了gap的步长。
再书写整体的循环。
那么问题又来了，如何确定gap的大小呢？gap过大，可能会使得整个数列的预排序收效甚微，gap过小，其效果又基本等同于插入排序。
我们可以选择进行`多次多趟`的预排序，让`gap=asize`，之后不断`gap/=2`，在不断的预排序过程中就会使得数列接近有序，同时最终`gap会等于1`，此时等同于对一个接近有序的数列进行插入排序。
在进行排序的过程中，可以选择多组排序同时进行的方式，这样代码会显得会更加简洁。也就是同样的gap时，对队列中的所有分组进行预排序，实现也非常简单，让i循环时`+1`而非+gap即可。
那么代码的实现如下：
```c
void shellsort(int* a, int asize) {
	int gap = asize;
	while (gap > 1) {
		gap /= 2;
		for (int i = 0; i < asize - gap; i++) {
			int end = i;
			int tmp = a[end + gap];
			while (end >= 0) {
				if (a[end] > tmp) {
					a[end + gap] = a[end];
					end -= gap;
				}
				else {
					break;
				}
			}
			a[end + gap] = tmp;
		}
	}
}
```
但希尔排序并非是一种稳定的排序，也因为gap的计算方式五花八门，所以其时间复杂度是存在变数的。此处的gap计算方式遵循`Knuth`提出的算法，gap=[gap/3]+1，且在Kunth的大量实验统计下，其时间复杂度在
$$
 O(n^{1.25})到O(1.6n^{1.25})
 $$
 这个区间内。


