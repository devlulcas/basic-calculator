# 🤓💯📚 BASIC CALCULATOR

This is just a simple experiment to practice the Shunting Yard Algorithm.
In this little project we are able to read an infix math expression that makes usage of simple math operators like +, -, \*, /, ( and ) and compute it without using `eval()` or `Function()`.

What do we do?

```ts
evaluateExpression('10 + 5 * 2');
```

- The first step is to turn the string into a token list

```ts
[
  {
    type: 'number',
    value: '10',
  },
  {
    type: 'operator',
    value: '+',
  },
  {
    type: 'number',
    value: '5',
  },
  {
    type: 'operator',
    value: '*',
  },
  {
    type: 'number',
    value: '2',
  },
];
```

- The second step is to transform the infix notation token list into a reverse polish notation token list using the SYA algorithm

```ts
[
  {
    type: 'number',
    value: '10',
  },
  {
    type: 'number',
    value: '5',
  },
  {
    type: 'number',
    value: '2',
  },
  {
    type: 'operator',
    value: '*',
  },
  {
    type: 'operator',
    value: '+',
  },
];
```

- The third step is the evaluation step where we can make our computations without fear of messing the order of operations

```ts
20;
```

The first step uses some regex groups to parse the string into tokens with the correct type.

The second step uses an array as stack for the operators, another array for the output buffer and an object for the operations precedence. We loop through the token list, if it's a number we just push it to the output, if not we check if the current operator has a smaller precedence than the last operator in the stack, if it has we pop the operator stack until thats false. After that we push the current operator to the operator stack.

```ts
10 + 5 * 2

// start
out = []
ops = []

// in: 10
out = [10]
ops = []

// in: +
out = [10]
ops = [+]

// in: 5
out = [10, 5]
ops = [+] // + has 1 point of precedence

// in: *
out = [10, 5]
ops = [+, *] // * has 2 points of precedence, since + is not >= * we do not push it to the out array

// in: 2
out = [10, 5, 2]
ops = [+, *]

// last step = push the ops into the out in reverse order
out = [10, 5, 2, *, +]
ops = []
```

The third step is just a stack based evaluation of those already ordered steps. All of our operations are binary, so we can use an array to store the current state and keep running the operations by popping the last two entries til there is no more tokens to eval.

```ts
function evaluateRPN(tokens: Token[]): number {
  const stack: number[] = [];

  tokens.forEach((token) => {
    if (token.type === 'number') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'operator') {
      const r = stack.pop()!;
      const l = stack.pop()!;

      switch (token.value) {
        case '+':
          stack.push(l + r);
          break;
        case '-':
          stack.push(l - r);
          break;
        case '*':
          stack.push(l * r);
          break;
        case '/':
          stack.push(l / r);
          break;
      }
    }
  });

  return stack[0];
}
```

```ts
[10, 5, 2, *, +]
s = [10]
s = [10, 5]
s = [10, 5, 2]
s = [10, 10] // pop 5, 2 run * = 10
s = [20] // pop 10, 10 run + = 20
```

Just like that!

You can expand it to suport logical operations but it can become a mess. In those cases you may want to look into LR parser.
