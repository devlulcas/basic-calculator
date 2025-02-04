type Token = { type: "number" | "operator" | "paren"; value: string };

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];

  const regex = /(\d+\.\d+|\d+)|([\+\-\*\/])|([\(\)])/g;

  let match;
  while ((match = regex.exec(expression)) !== null) {
    if (match[1]) tokens.push({ type: "number", value: match[1] });
    else if (match[2]) tokens.push({ type: "operator", value: match[2] });
    else if (match[3]) tokens.push({ type: "paren", value: match[3] });
  }

  return tokens;
}

function parseToRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];
  const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2 };

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
    } else if (token.type === "operator") {
      const opLen = operators.length
      const lastOp = operators[opLen - 1]

      while (opLen && lastOp.type === "operator" && precedence[lastOp.value] >= precedence[token.value]) {
        output.push(operators.pop()!);
      }

      operators.push(token);
    } else if (token.value === "(") {
      operators.push(token);
    } else if (token.value === ")") {
      while (operators.length && operators[operators.length - 1].value !== "(") {
        output.push(operators.pop()!);
      }

      operators.pop();
    }
  }

  while (operators.length) {
    output.push(operators.pop()!);
  }

  return output;
}

function evaluateRPN(tokens: Token[]): number {
  const stack: number[] = [];

  tokens.forEach((token) => {
    if (token.type === "number") {
      stack.push(parseFloat(token.value));
    } else if (token.type === "operator") {
      const r = stack.pop()!;
      const l = stack.pop()!;

      switch (token.value) {
        case "+": stack.push(l + r); break;
        case "-": stack.push(l - r); break;
        case "*": stack.push(l * r); break;
        case "/": stack.push(l / r); break;
      }
    }
  })

  return stack[0];
}

export function evaluateExpression(expression: string): number {
  const tokens = tokenize(expression.replace(/\s+/g, ""));
  const rpnTokens = parseToRPN(tokens);
  return evaluateRPN(rpnTokens);
}
