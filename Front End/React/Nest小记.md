## 基础
声明接口
```ts
@Controller('user')
export class UserController{
	constructor(private readonly userService:UserService) // 构造器注入
	@Post('create')
	create(@Body() createUserDto:CreateIserDto){
		return this.userService.create(createUserDto)
	}
	@Get('list')
	findAll(){
		return this.userService.findAll()
	}
}
```
@Controller、@Post、@Get这些都是装饰器

通过@Params获取url中的id
```ts
findOne(@Params('id') id:string){
	return this.bookService.findOne(+id)
}
```
通过@Query获取query参数
通过@Body获取post请求中的body

Nest实现了一套依赖注入的机制，IoC (Inverse of Control 反转控制)

@Inject可以讲需要的依赖进行注入，然后直接使用。这是属性注入还有构造器注入
两种注入的时机不同

每个模块都会包含controller、service、module、dto、entities这些东西。

ontroller 是处理路由，解析请求参数的。

service 是处理业务逻辑的，比如操作数据库。

dto 是封装请求参数的。

entities 是封装对应数据库表的实体的。

nest 应用跑起来后，会从 AppModule 开始解析，初始化 IoC 容器，加载所有的 service 到容器里，然后解析 controller 里的路由，接下来就可以接收请求了。

这就是MVC模式：