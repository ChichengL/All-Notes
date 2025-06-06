# 初识Git
借鉴了，语雀——前端充电宝的知识
Git 是最流行的分布式版本控制系统
版本控制系统主要有两种
集中式版本控制和分布式版本控制

对于集中式版本控制 SVN
![](https://cdn.nlark.com/yuque/0/2022/png/1500604/1655564197949-720163a8-3abd-44e0-b9a4-7f5b6f718a20.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_40%2Ctext_5b6u5L-h5YWs5LyX5Y-377ya5YmN56uv5YWF55S15a6d%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fformat%2Cwebp%2Fresize%2Cw_750%2Climit_0)

集中式版本控制系统，版本库是集中存放在中央服务器的。<mark style="background: [[FFB8EBA6]];">工作时，每个人都要先从中央服务器获取最新的版本。</mark>完成之后，再把自己添加/修改的内容提交到中央服务器。

特点：
集中式版本控制系统的缺点就是必须联网才能使用，如果使用局域网还好，速度会比较快。而如果是使用互联网，网速慢的话，就可能需要等待很长时间。除此之外，如果中央服务器出现故障，那么版本控制将不可用。如果中心数据库损坏，若数据未备份，数据就会丢失。


分布式版本控制系统
![](https://cdn.nlark.com/yuque/0/2022/png/1500604/1655564205360-a5b5c251-ead0-43a4-ab33-d07122a5da75.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_40%2Ctext_5b6u5L-h5YWs5LyX5Y-377ya5YmN56uv5YWF55S15a6d%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fformat%2Cwebp%2Fresize%2Cw_750%2Climit_0)
和集中式版本控制系统相比，分布式版本控制系统的安全性要高很多，因为每个人电脑里都有完整的版本库，某一个人的电脑损坏不会影响到协作的其他人。



git的结构
![](Public%20Image/Git/Pasted%20image%2020240314211954.png)


可用使用git status检查当前分支的状态

基础操作

### 暂存文件
使用 `git add <filename>`或者 `git add .`


### 提交暂存
使用`git commit -m "message"` 
如果提交暂存区的commit写错了可以使用`git commit --amend -m <messgae>`

如果是一个新的文件的修改提交到上一个commit中，可以使用
```shell
git add .
git commit --amend --no-edit
```
其详细讲解在`Git操作 > Git撤销更改的方法 > 1修改最近提交`

### 暂储更改
当开发一个功能没有完成，一个紧急bug出现，你需要切换到另一个分支，但是你的暂存区不是空的，这时候就需要`git stash`来存储一下修改的内容
后面继续开发这个功能
然后使用`git stash list`来显示所有已经暂存的列表
然后使用`git stash apply`或者`git stash pop`取回更改

apply 和 pop 之间的区别在于，pop 应用了 stash 中的更改并将其也从 stash 中删除，但 apply 即使在应用后仍将更改保留在 stash 中。
取回存储列表中第N个存储

```shell
git stash apply stash@{N}
git stash apply <n>
```


### 合并指定提交
在不同分支之间进行代码合并时，通常会有两种情况：一种情况是需要另一个分支的所有代码变动，那么就可以直接合并（git merge），另一种情况是只需要部分代码的变动（某几次提交），这时就可以使用以下命令来合并指定的提交：
```shell
git cherry-pick -x <commit hash>
```
添加 `-x`，可以生吃标准化的提交信息，让用户知道是从哪里pick出来的。

### 检查提交
`git show`
这是查看最近的一次操作

如果要查找之前的提交，可以使用
```shell
git show HEAD~3
```
就是从现在往前数第三个提交（现在这个是第一个）


### 查看贡献者
```shell
git shortlog
```
![](Public%20Image/Git/Pasted%20image%2020240428203151.png)
可以添加两个参数
- s：省略每次 commit 的注释，仅仅返回一个简单的统计。
- n：按照 commit 数量从多到少的顺利对用户进行排序。

还可以使用`git shortlog -sn --no-merges`，以此忽略合并提交的次数









# Git操作
## git常规操作
1. git init 新建一个git库，然后能在当前目录下生成一个隐藏文件夹.git
![](Public%20Image/Git/Pasted%20image%2020240314183020.png)   
2. git status,查看目前状态
   ![](Public%20Image/Git/Pasted%20image%2020240314183307.png)
3. git add < fileName >将该文件名的文件添加到缓冲区
   或者使用 **git add .** 将所有文件提交到缓冲区
4. git commit -m "提示信息" ：将当前缓冲区的所有中所有源文件的快照永久保存到本地仓库的历史记录中。 然后创建一个对象，讲提交者的昵称，邮箱，时间戳以及通过 -m参数指定的提交信息附加在上面
5. git push origin xxx： 提交到远程分支xxx上，并将HEAD指针指向最新提交的同步。
6. git log：查看提交commit的信息
7. git remote add origin < 仓库地址> ：将远程仓库和本地分支进行联系起来
8. git push -u origin master：将本地的master分支推送到远程origin主机，-u参数表记住对应关系，下次可以直接使用git push推送到当前分支上
9. git diff HEAD：查看与上一次commit的区别

<span id='Modify_last_update'></span>
<a href='#go_back_modify_last_update'>回去</a>



![](Public%20Image/Git/Pasted%20image%2020240314211954.png)


### 分支
分支作为最为常见的操作之一，也是最为重要的概念
常见命令
```sh
git branch
```
列出**本地**所有分支

```sh
git branch xxx
```
在**本地**创建一个xxx的新分支，但是注意这里不会跳转到新分支。

```sh
git push -u origin xxx
```
在**远程主机**origin上创建一个xxx分支

```sh
git branch -m Vir
```
将当前分支改名为 Vir

```sh
git branch -d xxx
```
删除xxx分支，可能因为存在一些没有合并的分支从而报错

```sh
git branch -D xxx
```
强制删除xxx分支不管是否合并

```sh
git checkout -b newbranch
```
创建一个新的分支，newbranch并且切换到新的分支上面

```sh
git checkout xxx
```
切换到xxx分支


### git add
git add  用于将变化的文件从工作区提交到缓冲区。
其命令有三种情况
```sh
git add <file>  提交某个文件
git add <directory> //提交某个文件夹到暂存区
git add .提交所有文件到暂存区
```

git add 添加的文件默认会忽略，`.girignore`文件里面声明的
但是使用 `git add -f <fileName>` 会强行添加某个文件

### git branch
git branch是进行分支操作。
git branch 列出本地所有分支
git branch -a 列出所有本地分支和远程分支


### git stash
这个是干嘛的？
通过上面图知道了add之后文档会到暂存区，如果此时切换分支就会出现，暂存区没清空的情况，提示`please commit your changes or stash them`
也就是需要提交commit，如果commit 了那么分支提交记录就会保存这条历史，为了避免这个情况，使用`git stash`进行清空（暂时）
如果后面切回这个分支之后可以使用`git stash apply`来恢复缓存区。
git stash相关的代码

```sh
# 保存当前未commit的代码
git stash

# 保存当前未commit的代码并添加备注
git stash save "备注的内容"

# 列出stash的所有记录
git stash list

# 删除stash的所有记录
git stash clear

# 应用最近一次的stash
git stash apply

# 应用最近一次的stash，随后删除该记录
git stash pop

# 删除最近的一次stash
git stash drop

```



### git reset --soft
**软重置**，回退你已提交的commit，并将commit的修改内容放回暂存区
比如commit了错误信息，需要进行回滚，以免造成黑历史。
![](Public%20Image/Git/Pasted%20image%2020240314215121.png)比如说这里，我有一个test的comiit
然后执行一下 git reset --soft
![](Public%20Image/Git/Pasted%20image%2020240314215401.png)
这样就让HEAD指针移到最近的一次提交
```sh
# 恢复最近一次 commit 
git reset --soft HEAD^
```

这里是针对没有推送到仓库的，如果是需要对已经推送到远程仓库的话，也可以使用，只不过后续强制推送`git push -f`（切忌：任何强制的操作都需要谨慎使用!!!!）

当指定版本号来恢复时，需要注意，会讲该commit到指定的commit之间所有的内容全部恢复，而不只针对该commit

```sh
git reset --soft
```
这个是移动HEAD指针，到指定的版本
**缓存区不变**，虽然在历史记录上看起来已经被撤销了
**文件内容不变**
总结起来，**相当于只是将错误的commit进行恢复**，但是文件内容等不会变化，因此组织好之后可以再次commit

对于 
```sh
git reset --hard
```
撤销更改HEAD指针移动指向你指定的提交，然后让**工作目录恢复到指定版本**，然后暂存区也会被清空，即暂存区所有的更改都会被丢弃。
这个很危险，很可能将你的努力付之东流。


### git cherry-pick

	将已经提交的commit，复制到新的commit应用分支
什么时候能用到？
比如：你开发分支的代码记录被污染了，导致开发分支合到线上的分支有问题，这时就需要拉一条干净的开发分支，从旧的分支的commit复制到新分支。

比如复制一个commit的hash值，然后切换分支到另一个然后使用`git cherry-pick <hash>`这样就可以复习一个。

如果复制多个可以使用 `git cherry-pick <hash1> <hash2>`
如果复制的是连续的几个 那么就是`git cherry-pick <hash1>^..<hash2>`


### git revert

讲现有的提交还原，恢复提交的内容，并生成一条还原记录📝

比如：你上传了代码，发现了错误，但是其他协作者也上传了新的代码，如果这时候使用`git reset`那么会撤回其他人的代码，这样会引来其他人的狂喷。

那么使用revert，会产生哪样子的呢？
![](Public%20Image/Git/Pasted%20image%2020240315145822.png)
使用 `git revert <hash>`
然后出现页面，使用 `:wq`退出
![](Public%20Image/Git/Pasted%20image%2020240315145917.png)
>通常无法 revert 合并，因为您不知道合并的哪一侧应被视为主线。此选项指定主线的父编号（从1开始），并允许 revert 反转相对于指定父编号的更改

因此，需要使用 -m标注主线
```sh
git revert -m 1 <commitHash>
```

当revert合并提交后，再次合并分支会失效。
这时候就需要revert掉之前revert合并提交


Git 常用操作

## Git撤销更改的方法

### 1修改最近提交（查看提交`git log`）
比如我最近提交是
![](Public%20Image/Git/Pasted%20image%2020240428135450.png)

使用 `git commit --amend`进入最近的一次commit
然后进行修改
![](Public%20Image/Git/Pasted%20image%2020240428135712.png)
这里就是commit的信息，然后就可以尽情修改了

这里是完成之后的。（当然是没有push到远程仓库之前）
PS：<a href='#Modify_last_update'>点击</a>这里回到查看 git add   commit  push 的关系<div id='go_back_modify_last_update'></div>

![](Public%20Image/Git/Pasted%20image%2020240428135646.png)


如果在修改之前已经将旧分支推送到了远程分支，如果运行`git status`，就会被告知本地分支和远程分支有一个提交不同
如果还需要推送可以尝试，`git push -f`，切记这是会让远程的分支文件丢失，小心使用！！！
当然还可以撤销推送


当然也可以使用git reset --soft，来撤销commit（在推送到远程分支之前）
![](Public%20Image/Git/Pasted%20image%2020240428142444.png)
比如这里使用了git reset --soft 撤销了一条commit，让head指针移动到他的下一个

然后重新commit就完事了


如果这里已经存在推送到远程分支上，且有其他协作者一同工作，那么我们最好不要采用git push --force，以免覆盖别人的代码（怕挨打✋）
我们可以在本地创建一个新的分支

![](Public%20Image/Git/Pasted%20image%2020240428143643.png)
这里创建了一个新的分支基于main分支，然后基于main分支合并fix-error分支
然后重新push，这里虽然多了很多commit，但是没有存在`git push -f`的风险

### 2将分支重置为旧的提交（即前面的git reset）
![](Public%20Image/Git/Pasted%20image%2020240428144041.png)

然后我们需要不保留最近的提交，直接删除
使用 `git reset --hard HEAD~1`
	Tips：如果进行硬重置，将丢失在该提交时或之后所做的所有工作。
这里表示git从当前的HEAD头指针回溯多少次提交

![](Public%20Image/Git/Pasted%20image%2020240428144224.png)
然后HEAD指针就指向了另一个地方
比如再次删除不必要的commit

![](Public%20Image/Git/Pasted%20image%2020240428144430.png)

还可以使用 `git reset --hard <hash-id> `  通过提交的hash进行重置

同时也可以重置本地分支指向另一个本地分支
甚至到远程分支
```shell
git reset --hard <someOtherBranch>
```

```shell
git reset --hard origin/master
```
这个就很有用，例如，如果不小心将内容提交到本地 master 分支。 假设应该在一个 feat/X 分支上进行提交，但忘记了创建它，而且一直在向本地 master 提交代码。

这个也可以通过`git cherry-pick`来解决这个问题
	将已经提交的commit，复制到新的commit应用分支，使用`git cherry-pick <hash-id1> <hash-id2>`

如果有多次提交的话，最好是使用reset

```shell
git checkout -b feat/X
```
创建一个新的分支
```shell
git checkout main && git reset --hard origin/main
```
将本地main分支重置为远程master分支

并且不要忘记回到功能分支
```shell
git checkout feat/X
```

#### 软重置
如果想在git的暂存环境中保留更改，可以进行软重置
```shell
git reset --soft HEAD~1
```
该提交引入的所有更改以及它之后的任何提交都将出现在 git 的暂存环境中。在这里，可以使用 `git reset HEAD file(s)` 取消暂存文件，对已经暂存的文件进行所需的任何更改。 然后，可以根据需要进行任何新的提交。

#### 创建备份分支
```shell
git reset --hard backup
```
我们可以将分支用作备份机制，以防你知道即将运行的某个命令（例如 `git reset --hard`）可能会损坏分支的提交历史记录。在运行这些命令之前，可以简单地创建一个临时备份分支（例如 `git branch backup`）。如果出现任何问题，就可以针对备份分支执行硬重置操作：


### 3交互式变基

`git rebase` 是一个强大的Git命令，它允许你将一个分支的更改应用到另一个分支上，同时重新整理提交历史，使其看起来更清晰。下面是使用 `git rebase` 的基本步骤和一些常见用法：

### 基本使用

1. **确保工作区干净**：在开始之前，确认你的工作目录中没有未提交的更改。你可以使用 `git status` 来检查。
    
2. **切换到你的特性分支**：假设你在一个名为 `my-feature` 的分支上工作，并希望将其更改应用到 `main` 或 `master` 分支上，首先确保你位于 `my-feature` 分支。
    
3. **执行 rebase**：接下来，使用以下命令将 `my-feature` 分支的更改应用到 `main` 分支上：

```shell
git rebase main
```

这条命令会让Git找到 `my-feature` 和 `main` 分支的最近共同祖先，然后逐个应用 `my-feature` 分支上相对于那个共同祖先的所有提交，放到 `main` 分支的部。


### 处理冲突

- 如果在 rebase 过程中遇到冲突，Git会暂停并等待你解决冲突。
    - 使用 `git status` 查看哪些文件有冲突。
    - 手动编辑这些文件，解决冲突。
    - 使用 `git add <冲突文件>` 告诉Git冲突已被解决。
    - 继续 rebase 过程，使用 `git rebase --continue`。

### 交互式 Rebase

- 若要更精细地控制 rebase，可以使用交互式模式，通过 `-i` 选项：

```shell
git rebase -i main
```
这会打开一个文本编辑器，列出即将被 rebase 的所有提交。在这里，你可以重新排序提交、合并（squash）多个提交为一个、编辑提交消息或完全跳过某些提交。

### 跳过或中止 Rebase

- 如果需要跳过某个提交，可以使用：
```shell
 git rebase --skip
```
- 如果想要放弃整个 rebase 过程，恢复到 rebase 开始前的状态，可以使用：
```shell
    git rebase --abort
    ```

### 注意事项

- 在公共分支上使用 `git rebase` 需要格外小心，因为它会改变提交历史，可能导致与他人工作的冲突。通常，只在自己的私有分支或团队内部已协调好的情况下使用 rebase。
    
- 在 rebase 后，由于提交哈希值改变了，你可能需要强制推送 (`git push --force` 或 `git push --force-with-lease`)，但这也会覆盖远程分支的历史，所以务必谨慎操作。

即`git rebase -i`,所有交互式变基都始于 `git rebase -i` 命令，并且必须指定一个提交来重新设置当前分支。
可以完成：
- 允许倒回历史并进行任何所需的更改
- 如果想要删除旧的提交、更改旧的提交消息
- 将旧的提交压缩成其他的提交

#### 删除旧提交

![](Public%20Image/Git/Pasted%20image%2020240428152909.png)

比如这个多了`Update33 .gitignore`commit我们需要将它删除
```shell
 git rebase -ir 57875af9d01a469a4419eef83d98bd002f578284^
```
需要变基的hash，然后出现这个页面
![](Public%20Image/Git/Pasted%20image%2020240428153107.png)
删除`update33 .gitignore`，将pick更改为drop。
然后退出文件
![](Public%20Image/Git/Pasted%20image%2020240428153235.png)
就没有update 33的提交了
![](Public%20Image/Git/Pasted%20image%2020240428153454.png)

注意，在已删除提交之后的所有提交哈希都将被重新计算。因此，虽然根提交仍保持为 0beebfb，但在它之后的所有哈希值都已更改。正如现在已经看到几次，如果之前将此分支推送到了远程仓库中，那么本地分支和远程分支现在将不同步。因此，只需要进行一次强制推送即可更新远程分支：

#### 改写提交信息
这里先随便提交两个
```shell
echo 1 > 1.txt && git add . && git commit -m "创建1.txt"
echo 2312313 > 1.txt && git add . && git commit -m "更新1.txt"
```

![](Public%20Image/Git/Pasted%20image%2020240428154006.png)
添加了两条记录

针对最后两个提交进行修改`git rebase -i HAED~2`
然后出现了页面，将`pick`更改为`reword(r)`两种都行
![](Public%20Image/Git/Pasted%20image%2020240428154413.png)
然后就会出现提交消息的语句，然后修改之后逐渐关闭
![](Public%20Image/Git/Pasted%20image%2020240428154634.png)

再次使用`git log`之后
![](Public%20Image/Git/Pasted%20image%2020240428154724.png)
`随意提交1` --->`初始创建1.txt`



#### 编辑旧提交
假设我们需要编辑根提交
比如添加一个 .yarnrc的文件
然后使用`git rebase -i --root`
![](Public%20Image/Git/Pasted%20image%2020240428155430.png)
更改第一个commit为edit

关闭文件之后出现
![](Public%20Image/Git/Pasted%20image%2020240428155546.png)
然后使用`git add . && git commit --amend`
打开编译器之后就更改消息
然后使用`git rebse --continue`继续变基
![](Public%20Image/Git/Pasted%20image%2020240428170707.png)
可以看到将初始的commit进行更改了
然后因为这里是变化了的，需要强制推送。
由于你修改了项目的历史（特别是根提交），直接推送会被拒绝，以防止丢失历史信息或与其他协作者的工作产生冲突。
>当你在本地通过 `git rebase -i --root` 修改了初始提交，并尝试用 `git push` 将这些改动推送到远程仓库时，遇到了 "rejected" 错误，这是因为你的推送不是快进（fast-forward）的——即你试图推送的提交历史与远程仓库中的历史不连续。
![](Public%20Image/Git/Pasted%20image%2020240428171718.png)
#### 压缩
压缩可以将 n 个提交合并为一个，使提交历史更加紧凑。
如果一个功能分支引入大量提交，并且只希望该功能在历史记录中表示为单个提交（称为 squash-and-rebase 工作流），这有时很有用。但是，如果将来需要，将无法恢复或修改旧的提交，这在某些情况下可能是不可取的。

下面来创建一个功能分支并添加一些提交
```shell
git checkout -b feature && \
touch file1 && git add . && git commit -m "Add file1" && \
touch file2 && git add . && git commit -m "Add file2" && \
touch file3 && git add . && git commit -m "Add file3"
```

我们使用`git rebase -i master`来压缩这些提交记录
![](Public%20Image/Git/Pasted%20image%2020240428172524.png)


将后面的`pick`变为`squash`
![](Public%20Image/Git/Pasted%20image%2020240428172759.png)
现在将三个合成为一个了



### 4还原提交
上面我们学到，在要删除的提交范围之前，将HEAD指针软或硬重置为提交
对不想保留的任何提交执行交互式变基并更改`pick`--->`drop`

不幸的是，这两种方法都会重写提交历史。以使用交互式变基从 `master` 分支中删除 `.env` 文件为例。如果在现实中这样做，在像 `master` 这样的共享分支上删除提交会导致一些麻烦，团队中的每个人都必须硬重置本地的 `master` 分支以匹配 `origin/master`。
因此推出了`git revert <hash-id>`
与通过变基或硬/软重置删除提交不同，revert 命令创建一个新提交以撤消目标提交引入的任何更改


使用`git revert <hash-id>`之后
![](Public%20Image/Git/Pasted%20image%2020240428190846.png)


![](Public%20Image/Git/Pasted%20image%2020240428190950.png)
在分支的顶部新添了一个提交，以还原此前提交所引入的更改，就好像手动删除了最初引入的更改。
因此，与交互式变基或重置相比，撤销提交会引入额外的一个提交，因此会更加混乱。但这并不是非常重要的问题。而且，好处在于，它不会破坏公共分支。


### 5签出文件
`git checkout`命令是另一种撤销git更改的基本方法。其目的
- 创建新分支：`git checkout -b <newBranch>`
- 切换到分支或提交：`git checkout <existBranch>`
- 恢复不同版本的文件

```shell
git checkout <pathspec>
```
这里，`<pathspec>` 可以是任何有效的路径说明符，例如： `.` 对于当前目录、`path/to/file`、`file.extension`，甚至是正则表达式。

例如，如果想清除当前目录中所有未暂存的更改并从头开始，最简单的方法是使用 `git checkout` 命令和 `.` 作为路径规范：
```shell
git checkout .
```


### 6使用Git Reflog
reflog 代表“参考日志”：HEAD 指针随时间的不同状态的一系列快照。这意味着任何时候引入、删除或修改提交，或者签出新分支，或者重写旧提交的哈希，这些更改都将记录在 reflog 中。 我们将能够回到过去撤消可能不需要的更改，即使它们看似不可逆转。

查看仓库的参考日志
```shell
git reflog
```


也可以查看某一个分支上面的

![](Public%20Image/Git/Pasted%20image%2020240428194610.png)
比如我需要详细查看某个commit
![](Public%20Image/Git/Pasted%20image%2020240428194718.png)Git 的 `reflog` 命令很有用，以防进行硬重置并丢失所有工作，只需查看 reflog 并重置到进行硬重置之前的点，就轻松搞定！

最后，如果出于某种原因想清理 reflog，可以使用以下方法从中删除行：


```shell
git reflog delete HEAD@{n}
```
将 `n` 替换为要从 `reflog` 中删除的任何行。 `HEAD@{0}` 指的是 reflog 中的最新行，`HEAD@{1}` 指的是之前的一行，依此类推。
