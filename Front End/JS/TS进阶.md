原始类型：
```ts
const name: string = 'linbudu';
const age: number = 24;
const male: boolean = false;
const undef: undefined = undefined;
const nul: null = null;
const obj: object = { name, age, male };
const bigintVar1: bigint = 9007199254740991n;
const bigintVar2: bigint = BigInt(9007199254740991);
const symbolVar: symbol = Symbol('unique');
```

null和undefined：
这两者在没有开启 `strictNullChecks` 检查的情况下，会**被视作其他类型的子类型**


模式匹配提取：


```ts
type p = Promise<'guang'>;
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;

```

**Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，结果保存到通过 infer 声明的局部类型变量里，如果匹配就能从该局部变量里拿到提取出的类型。**
#### 数组类型 
Fitst
```ts
type GetFirst<Arr extends unknown[]> = 
    Arr extends [infer First, ...unknown[]] ? First : never;
```

Last
```ts
type GetLast<Arr extends unknown[]> =
	Arr extends [...unknown[], infer Last] ? Last : never
```

PopArr
```ts
type PopArr<Arr extends unknow[]> = 
	Arr extends [...infer Rest, unknown] ? Rest : never
```
