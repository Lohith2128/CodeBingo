import type { Language } from "../types";

export const LANGUAGES: Language[] = [
  {
    id: "python",
    name: "Python",
    version: "3.10",
    pistonLanguage: "python",
    monacoLanguage: "python",
    fileExtension: "py",
    icon: "🐍",
    starterCode: `# Python 3.10
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))
`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    version: "18.15",
    pistonLanguage: "javascript",
    monacoLanguage: "javascript",
    fileExtension: "js",
    icon: "🟨",
    starterCode: `// JavaScript ES2022
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    version: "5.0",
    pistonLanguage: "typescript",
    monacoLanguage: "typescript",
    fileExtension: "ts",
    icon: "🔷",
    starterCode: `// TypeScript 5.0
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`,
  },
  {
    id: "cpp",
    name: "C++",
    version: "10.2",
    pistonLanguage: "c++",
    monacoLanguage: "cpp",
    fileExtension: "cpp",
    icon: "⚙️",
    starterCode: `#include <iostream>
#include <string>

int main() {
    std::string name = "World";
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}
`,
  },
  {
    id: "c",
    name: "C",
    version: "10.2",
    pistonLanguage: "c",
    monacoLanguage: "c",
    fileExtension: "c",
    icon: "🔧",
    starterCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`,
  },
  {
    id: "csharp",
    name: "C#",
    version: "6.12",
    pistonLanguage: "csharp",
    monacoLanguage: "csharp",
    fileExtension: "cs",
    icon: "💜",
    starterCode: `using System;

class Program {
    static void Main(string[] args) {
        string name = "World";
        Console.WriteLine($"Hello, {name}!");
    }
}
`,
  },
  {
    id: "java",
    name: "Java",
    version: "15.0",
    pistonLanguage: "java",
    monacoLanguage: "java",
    fileExtension: "java",
    icon: "☕",
    starterCode: `public class Main {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "!");
    }
}
`,
  },
  {
    id: "r",
    name: "R",
    version: "4.1",
    pistonLanguage: "r",
    monacoLanguage: "r",
    fileExtension: "r",
    icon: "📊",
    starterCode: `# R 4.1
greet <- function(name) {
  paste0("Hello, ", name, "!")
}

cat(greet("World"), "\\n")
`,
  },
  {
    id: "ruby",
    name: "Ruby",
    version: "3.0",
    pistonLanguage: "ruby",
    monacoLanguage: "ruby",
    fileExtension: "rb",
    icon: "💎",
    starterCode: `# Ruby 3.0
def greet(name)
  "Hello, #{name}!"
end

puts greet("World")
`,
  },
  {
    id: "go",
    name: "Go",
    version: "1.16",
    pistonLanguage: "go",
    monacoLanguage: "go",
    fileExtension: "go",
    icon: "🐹",
    starterCode: `package main

import "fmt"

func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

func main() {
    fmt.Println(greet("World"))
}
`,
  },
  {
    id: "php",
    name: "PHP",
    version: "8.2",
    pistonLanguage: "php",
    monacoLanguage: "php",
    fileExtension: "php",
    icon: "🐘",
    starterCode: `<?php

function greet(string $name): string {
    return "Hello, $name!";
}

echo greet("World") . PHP_EOL;
`,
  },
  {
    id: "kotlin",
    name: "Kotlin",
    version: "1.8",
    pistonLanguage: "kotlin",
    monacoLanguage: "kotlin",
    fileExtension: "kt",
    icon: "🟠",
    starterCode: `fun greet(name: String): String {
    return "Hello, $name!"
}

fun main() {
    println(greet("World"))
}
`,
  },
  {
    id: "swift",
    name: "Swift",
    version: "5.5",
    pistonLanguage: "swift",
    monacoLanguage: "swift",
    fileExtension: "swift",
    icon: "🦅",
    starterCode: `import Foundation

func greet(_ name: String) -> String {
    return "Hello, \\(name)!"
}

print(greet("World"))
`,
  },
  {
    id: "rust",
    name: "Rust",
    version: "1.65",
    pistonLanguage: "rust",
    monacoLanguage: "rust",
    fileExtension: "rs",
    icon: "🦀",
    starterCode: `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
}
`,
  },
  {
    id: "html",
    name: "HTML",
    version: "live",
    pistonLanguage: "",
    monacoLanguage: "html",
    fileExtension: "html",
    icon: "🌐",
    isPreview: true,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hello World</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #0f172a;
      color: #e2e8f0;
    }
    h1 { color: #22d3ee; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>
`,
  },
  {
    id: "css",
    name: "CSS",
    version: "live",
    pistonLanguage: "",
    monacoLanguage: "css",
    fileExtension: "css",
    icon: "🎨",
    isPreview: true,
    starterCode: `/* CSS Live Preview */
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: system-ui, sans-serif;
  color: #e2e8f0;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  color: #22d3ee;
  text-shadow: 0 0 30px rgba(34, 211, 238, 0.4);
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  opacity: 0.7;
}
`,
  },
];

export const LANGUAGE_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));

export function getLanguageById(id: string): Language | undefined {
  return LANGUAGE_MAP[id];
}

export const DEFAULT_LANGUAGE_ID = "python";
