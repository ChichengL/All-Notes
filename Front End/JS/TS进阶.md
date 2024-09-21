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
