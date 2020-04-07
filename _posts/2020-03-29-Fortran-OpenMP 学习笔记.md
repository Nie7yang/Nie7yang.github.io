---
layout: post
title:  "Fortran-OpenMP 学习笔记"
categories: Nie
tags:  Fortran OpeMP
author: 
---

* content
{:toc}

# <center>**Fortran-OpenMP 学习笔记**<center>
<p align="right"><font face="微软雅黑">Ni </font></p>  

---      

## <font color=steelblue>**1. 并行区域构造函数**</font>
```fortran
!$OMP PARALLEL
...
!$OMP END PARALLEL
```
1.指令标记```!$OMP```和后面的OpenMP指令之间必须有至少一个空格。   
2.在并行区域的开始部分，可以增加子句以限定并行区域的执行方式。   
```!$OMP END PARALLEL```指令隐含着同步性。  
3.并行区域的要求:  
>（1）```!$OMP PARALLEL clause1 clause2 ```与```!$OMP END PARALLEL``` 指令对必须出现在程序的同一文件中；   
>（2）并行区域内的代码必须为结构化代码，即不能跳入或跳出并行区，如使用GOTO语句。   
>（3） 默认情况下并行区域的嵌套，内层不启用，仅并行最外层。

## <font color=steelblue>**2. OpenMP构件**</font>
&emsp;&emsp;使用指令开辟并行区域后，若需要不同线程执行不同任务则必须要使用到OpenMP的构件。   
### <font color=salmon>**2.1 Work-sharing构件**</font>
&emsp;&emsp;将任务分解成片段传送至不同线程。work-sharing构件不会创建新线程，因此构建需要在并行区域内才会有加速效果，不然仅一个线程执行。   
#### <font color=tomato>```!$OMP DO```与```!$OMP END DO```</font>   
&emsp;&emsp;对最近的do循环分散到不同线程并行执行。可在```!$OMP DO```后连接子句来控制work-sharing构件的执行行为，如：   
```fortran
!$OMP DO clause1 clause2 ...
...
!$OMP END DO end_clause
```
注意：
>（1）使用exit、return等破坏并行循环的语句不合规。  
>（2）使用goto时不可跳出并行循环代码块。   
#### <font color=tomato>```!$OMP SECTIONS```与```!$OMPEND SECTIONS```</font>   
&emsp;&emsp;给每个线程分配完全不同任务，且每段代码仅被一个线程执行一次。
如：
```fortran
!$OMP SECTIONS clause1 clause2 ...
!$OMP SECTION
...
!$OMP SECTION
...
...
!$OMP END SECTIONS end_clause
```
&emsp;&emsp;每段代码被唯一线程执行，以```!$OMP SECTION```指令开始，直到下一个```!$OMP SECTION```指令；或者以```!$OMP END SECTIONS```指令结束。如果代码段的数量大于可用线程数，部分线程将会串行执行不止一段代码。如果代码段的数量少于线程数，又将导致有效资源的低效率使用。 

注意：
>（1）每个代码块片段需为结构化代码，不能goto插入跳出。  
>（2）所有```!$OMP SECTION```指令主要在```!$OMP SECTIONS```与```!$OMPEND SECTIONS```之间。
#### <font color=tomato>```!$OMP SINGLE```与```!$OMP END SINGLE```</font> 
&emsp;&emsp;单线程运行所包含的代码。以先到达起始指令的线程运行。默认状态下别的线程将在结束指令处等待，如：
```fortran
!$OMP PARALLEL
write(*,*) "Hello"
    !$OMP SINGLE
    write(*,*) "hi"
    !$OMP END SINGLE
!$OMP END PARALLEL
```
每个线程内均会输出hello，而仅有一个线程输出hi。

注意：
> 对指令内代码不能goto插入跳出。
#### <font color=tomato>```!$OMP WORKSHARE```与```!$OMP END WORKSHARE SINGLE```</font> 
&emsp;&emsp;用于对Where和forall等数组自带并行处理运算符进行支持。
### <font color=salmon>**2.2 Combined parallel work-sharing构件**</font>
&emsp;&emsp;用于简单开辟仅包含一个work-sharing构件的并行区域。
#### <font color=tomato>```!$OMP PARALLEL DO```与```!$OMP END PARALLEL DO```</font> 
&emsp;&emsp;用于简单开辟仅包含DO循环的并行区域
#### <font color=tomato>```!$OMP PARALLEL SECTIONS```与```!$OMP END PARALLEL SECTIONS```</font> 
&emsp;&emsp;用于简单开辟仅包含SECTIONS功能的并行区域
#### <font color=tomato>```!$OMP PARALLEL WORKSHARE```与```!$OMP END PARALLEL WORKSHARE```</font> 
&emsp;&emsp;用于简单开辟仅包含WORKSHARE功能的并行区域
### <font color=salmon>**2.3 Synchronization constructs 同步构件**</font>
&emsp;&emsp;实际工作中不可能让各个线程自己运行，必须按顺序收回，一般使用线程同步。同步可以是显式的，也可以是隐式的，二者功能相同。
#### <font color=tomato>```!$OMP MASTER```与```!$OMP END MASTER```</font> 
&emsp;&emsp;指令中的代码只被主线程执行，其他线程继续执行它们的工作，没有隐含同步。在本质上与```!$OMP SINGLE```+```!$OMP END SINGLE + NOWAIT```子句相似，只是把执行代码的线程指定为主线程而不是最先到达的线程，执行后主线程位于其他线程后面。
#### <font color=tomato>```!$OMP CRITICAL```与```!$OMP END CRITICAL```</font> 
&emsp;&emsp;每次只有一条线程进入内部代码块，以确保内部代码正确执行。可给临界区域命名，。当一条线程到达临界区域的开始部分时，它会在此等待，直到没有其他线程执行其中的代码为止。有相同名字的不同临界区域被看做共同的临界区域，一次只有一个线程在里面。此外，所有的未命名临界区都将看作同一个区域。如：
```fortran
!$OMPCRITICALwrite_file
write(1,*) data
!$OMP END CRITICALwrite_file
```
#### <font color=tomato>```!$OMP BARRIER```</font> 
&emsp;&emsp;线程的显式同步，一个线程遇到它时，处于等待状态，直到所有线程都到达。   
注意
>（1）要么所有线程都到达阻塞点，要么没有任何线程到达。在```!$OMP CRITICAL```与```!$OMP END CRITICAL```、```!$OMP MASTER```与```!$OMP END MASTER```等限制单一线程运行的状况间不能使用，会陷入死锁。
>（2）它会造成资源的闲置浪费，除非必须，尽量不要使用。
#### <font color=tomato>```!$OMP ATOMIC```</font> 
&emsp;&emsp;使其后最近一个语句同时只有一个线程在修改变量的内存地址。
注意
>（1）只对以下运算符适用：+, *, -, /, .AND., .OR., .EQV. or .NEQV。   
>（2）只对一下内置函数使用：MAX, MIN, IAND, IOR or IEOR。
效果与使用```!$OMP CRITICAL```与```!$OMP END CRITICAL```相当，但更简洁。
#### <font color=tomato>```!$OMP ORDERED```与```!$OMP END ORDERED```</font> 
&emsp;&emsp;在循环中，一些语句在每次迭代中需要依次赋值，就像在串行程序里一样。。一方面只允许一个线程在其内运行，另一方面线程入口只能遵循循环迭代的顺序：前面的迭代完成之前，没有线程可以进入```ORDERED```指令区域。  
如：
```fortran
!$OMPDO ORDERED
do i = 1, 100
block1
!$OMPORDERED
A(i) = 2 * A(i-1) !这类有依赖性的运算不使用顺序运算，并行会出错。
!$OMP END ORDERED
block3
enddo
!$OMP END DO
```
&emsp;&emsp;上述代码中初步block1能正常并行，而```!$OMP ORDERED```与```!$OMP END ORDERED```之间的代码按循环顺序控制线程进出，因而对block3及之后的所有代码均按顺序同一时间仅单线程进行。   
注意：
> 一个并行循环内至多只能一个```ORDERED```块
### <font color=salmon>**2.4 Data environment constructs 数据环境构件**</font>
&emsp;&emsp;最后一组OpenMP指令用于控制并行程序里的数据环境。有两种不同的数据环境构件：
>（1）不依赖于其他OpenMP构件  
>（2）与其他OpenMP构件相关、只影响某个构件和它的文本域（数据作用域子句）  
#### <font color=tomato>```!$OMP THREADPRIVATE (list)```</font> 
&emsp;&emsp;在list中指定多个变量，这些变量对每个线程而言均为局部变量，但是在进程中为全局的。list中的变量需要在COMMON或者MODULE之中或者已经定义，而仅定义但不在MODULE之中的变量需要save属性。
&emsp;&emsp;该指令必须紧跟变量声明，并且在主程序之前。例如：
```fortran
integer, save :: a
!$OMPTHREADPRIVATE(a)
!$OMP PARALLEL
a = OMP_get_thread_num()
!$OMP END PARALLEL
!$OMP PARALLEL
write(*,*)a
!$OMP END PARALLEL
```
上式将输出各线程编号，a在个线程中的数值唯一。





