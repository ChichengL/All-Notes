## git常规操作
1. git init 新建一个git库，然后能在当前目录下生成一个隐藏文件夹.git
   ![[Pasted image 20240314183020.png]]
   
2. git status,查看目前状态
   ![[Pasted image 20240314183307.png]]
3. git add < fileName >将该文件名的文件添加到缓冲区
   或者使用 **git add .** 将所有文件提交到缓冲区
4. git commit -m "提示信息" ：将当前缓冲区的所有中所有源文件的快照永久保存到本地仓库的历史记录中。 然后创建一个对象，讲提交者的昵称，邮箱，时间戳以及通过 -m参数指定的提交信息附加在上面
5. git push origin xxx： 提交到远程分支xxx上，并将HEAD指针指向最新提交的同步。
6. git log：查看提交commit的信息
7. git remote add origin < 仓库地址> ：将远程仓库和本地分支进行联系起来
8. git push -u origin master：将本地的master分支推送到远程origin主机，-u参数表记住对应关系，下次可以直接使用git push推送到当前分支上
9. git diff HEAD：查看与上一次commit的区别
![[Pasted image 20240314211954.png]]

## 分支
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


## git add
git add  用于将变化的文件从工作区提交到缓冲区。
其命令有三种情况
```sh
git add <file>  提交某个文件
git add <directory> //提交某个文件夹到暂存区
git add .提交所有文件到暂存区
```

git add 添加的文件默认会忽略，`.girignore`文件里面声明的
但是使用 `git add -f <fileName>` 会强行添加某个文件

## git branch
git branch是进行分支操作。
git branch 列出本地所有分支
git branch -a 列出所有本地分支和远程分支


## git stash
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



## git reset --soft
**软重置**，回退你已提交的commit，并将commit的修改内容放回暂存区
比如commit了错误信息，需要进行回滚，以免造成黑历史。
![[Pasted image 20240314215121.png]]
比如说这里，我有一个test的comiit
然后执行一下 git reset --soft
![[Pasted image 20240314215401.png]]
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


## git cherry-pick

	将已经提交的commit，复制到新的commit应用分支
什么时候能用到？
比如：你开发分支的代码记录被污染了，导致开发分支合到线上的分支有问题，这时就需要拉一条干净的开发分支，从旧的分支的commit复制到新分支。

比如复制一个commit的hash值，然后切换分支到另一个然后使用`git cherry-pick <hash>`这样就可以复习一个。

如果复制多个可以使用 `git cherry-pick <hash1> <hash2>`
如果复制的是连续的几个 那么就是`git cherry-pick <hash1>^..<hash2>`


## git revert

讲现有的提交还原，恢复提交的内容，并生成一条还原记录📝

比如：你上传了代码，发现了错误，但是其他协作者也上传了新的代码，如果这时候使用`git reset`那么会撤回其他人的代码，这样会引来其他人的狂喷。

那么使用revert，会产生哪样子的呢？
![[Pasted image 20240315145822.png]]
使用 `git revert <hash>`
然后出现页面，使用 `:wq`退出
![[Pasted image 20240315145917.png]]
>通常无法 revert 合并，因为您不知道合并的哪一侧应被视为主线。此选项指定主线的父编号（从1开始），并允许 revert 反转相对于指定父编号的更改

因此，需要使用 -m标注主线
```sh
git revert -m 1 <commitHash>
```

当revert合并提交后，再次合并分支会失效。
这时候就需要revert掉之前revert合并提交