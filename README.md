# selector

`selector` is a CSS selector parsing/generation/construction library.

## Installation

```
npm install @hgargg-0710/selector
```

## Documentation

The following is the precise description of the library's exports (v0.1).

1. `parse` (function)
2. `generate` (function)
3. `parser` (submodule)
4. `generator` (submodule)
5. `tokens` (submodule)
6. `tree` (submodule)

NOTE: it is built on top of the [`parsers.js`](https://github.com/HGARgG-0710/parsers.js) library for parser-making,
so some of the terminology comes from there.

### `parse`

This is one of the two primary functions of the library.
Given a `string` with a syntactically correct CSS selector, it returns
an Abstract Syntax Tree constructed using the library's AST API.

```ts
function parse(selector: string): Combinator | CompoundSelector | SelectorList
```

The result of `parse` can later be passed to `generate` to reverse the parsing operation.

### `generate`

An inverse of `parse`. Provided an AST constructed with the usage of library's API,
returns a `string`.

```ts
function generate(selector: Combinator | CompoundSelector | SelectorList): string
```

Funny note: the combination `generate(parse(selector))` can be used as a kind of generally-inneficient-but-easy-to-make-with-the-library selector-formatter...

### `parser`

This is a submodule, including all the exports of the parsing-dedicated modules.
In particular, the mult-layered `parse` function is composed of the contents of the module. It also provides the `parse` function as the export (aliased as `SelectorParser`).

The layers of parsing of a selector employed by the library are (in order of their application):

1. `char` (tokenization)
2. `escaped` (escaped sequences)
3. `string` (string character sequences)
4. `bracket` (identifying of sub-selectors)
5. `list` (identifying of selector-lists)
6. `simple` (finalization of simple selectors)
    1. `attribute` (parsing of attribute selectors)
    2. `identifier` (parsing of identifiers - key elements of all simple selectors)
7. `compound` (uniting simple selectors into compound ones)
8. `despace` (elimination of undesired space tokens to simplify further descendant combinator identification)
9. `combinator` (identifies combinators, and orders the `compound` results based on them)

The `parser` module exports are broken down into these submodules, which are the immidiate exports.

What follows is the enumeration of different submodules' exports and their meanings/uses within the parser.

#### `char`

| export              | description                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SelectorTokenizer` | The tokenization function (a `PatternTokenizer`). Accepts a `Pattern<string, RegExp, RegExp>` (example: `StringPattern`). Returns a `PatternCollection` |
| `charMap`           | The `IndexMap`, on which the `SelectorTokenizer` is based. Keys are regular expressions, values - `TokenType`s corresponding to them                    |

#### `escaped`

| export          | description                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `EscapeParser`  | The main parsing function. Accepts `Stream`, returns an array. Converts `Escape` followed by something else into appropriate `Escaped` |
| `isHex`         | Checks whether the given string tests positive against `/[0-9a-fA-F]/`                                                                 |
| `readHex`       | Reads a hexidecimal from the given stream (up to 6 characters), altering the `Stream` passed                                           |
| `readEscaped`   | Reads a single character from a given `Stream`, altering it                                                                            |
| `HandleEscaped` | Main handler for the `Escape` token within the `escapeMap` `IndexMap`                                                                  |
| `escapedMap`    | The `TypeMap`, on which the `EscapeParser` is based                                                                                    |

#### `string`

| export                  | description                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SelectorStringParser`  | The main parsing function. Accepts `Stream`, returns an array. Converts token sequences between pairs of `"` or `'` to `SelectorString` tokens. Happens after `Escaped` |
| `StringCharacterParser` | Converts a given `Stream`, which is a result of limiting another `Stream` to an array, in which `SelectorSymbols` were grouped into `StringCharacters`                  |
| `quoteRead`             | An object containing cached functions for reading a string starting with `'` and `"` respectively                                                                       |
| `readUntilEscaped`      | Reads from a given `Stream`, altering it, until an `Escaped` is met                                                                                                     |
| `stringMap`             | A `TypeMap`, on which the `SelectorStringParser` is based                                                                                                               |
| `stringCharMap`         | A `TypeMap`, on which the `SelectorCharacterParser` is based                                                                                                            |

#### `bracket`

| export                   | description                                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EndParser`              | The "latter" part of the `parse` function. It unites `BracketParser`, `list`, `simple`, `compound`, `despace` and `combinator`. It also deals with recursive brackets |
| `SelectorListParser`     | Accepts `Stream`, puts the input through `BracketParser` and `SelectorCommaParser` (from `list`).                                                                     |
| `BracketParser`          | Recursively applies `EndParser` on all encountered sub-selectors within the passed `Stream`.                                                                          |
| `recursiveBracketParser` | The recursive component of the `EndParser`                                                                                                                            |
| `flatBracketParser`      | The finite ("flat", non-recursive) component of the `EndParser`                                                                                                       |
| `SubSelectorHandler`     | The handler of sub-selectors within the `subSelectorMap`                                                                                                              |
| `nestedBrack`            | Returns the `nested` limitation of the given `Stream` to cover the entirety of the current sub-selector                                                               |
| `subSelectorMap`         | The `TypeMap`, on which the `BracketMap` is based                                                                                                                     |

#### `list`

| export                | description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| `SelectorCommaParser` | Breaks all the pieces of parsed `Stream` into arrays and eliminates all `Comma`s |

#### `simple`

| export                 | description                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `SimpleSelectorParser` | The main simple selectors' parser. Takes a `Stream`, returns an array of transformed tokens                                    |
| `HandleElement`        | Handles an element selector                                                                                                    |
| `HandleId`             | Handles an id selector                                                                                                         |
| `HandleClass`          | Handles a class selector                                                                                                       |
| `HandleAttribute`      | Handles an attribute selector                                                                                                  |
| `HandlePseudoClass`    | Handles a pseudo-class selector                                                                                                |
| `HandlePseudoElement`  | Handles a pseudo-element selector                                                                                              |
| `HandleUniversal`      | Handles a universal selector                                                                                                   |
| `HandleParent`         | Handles a parent selector                                                                                                      |
| `readSimple`           | Reads an identifier, optionally skipping an element of the passed `Stream`. Sub-routine used for defining some of the handlers |
| `simpleMap`            | The `TypeMap`, on which the `SimpleSelectorParser` is based.                                                                   |

#### `attribute`

| export             | description                                        |
| ------------------ | -------------------------------------------------- |
| `AttributeParser`  | The `BasicParser` for parsing attribute selectors. |
| `AttributeHandler` | Handler for attribute selectors.                   |
| `attributeMap`     | The `TypeMap`, on which `AttributeParser` is based |

#### `identifier`

| export             | description                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `IdentifierParser` | Takes in an array of tokens, returns a `SelectorIdentifier`. Parser for `Identifiers`                            |
| `readSymbol`       | Reads from a `Stream` for as long as its current symbol is a `SelectorSymbol`                                    |
| `limitPartial`     | Limits a given `Stream`, and moves it, to the point where the next identifier ends. Returns the limited portion. |
| `parseIdentifier`  | Parses the identifier (a global sub-routine utilizing the `IdentifierParser` and `limitPartial`)                 |
| `identifierMap`    | A `TypeMap`, on which the `IdentifierParser` is based.                                                           |

#### `compound`

| export                   | description                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `CompoundSelectorParser` | Main parsing function. Combines different simple selectors into `CompoundSelector`s |
| `CompoundHandler`        | The handler for simple selectors                                                    |
| `compoundMap`            | The `TypeMap`, on which `CompoundSelectorParser` is based                           |

#### `despace`

| export       | description                                             |
| ------------ | ------------------------------------------------------- |
| `DeSpacer`   | Replaces sequences of `Space` tokens with a single one. |
| `DeSpace`    | The handler of `Space`                                  |
| `despaceMap` | The `TypeMap`, off which `DeSpacer` is based            |
| `skipSpaces` | Skips spaces within the given `Stream`                  |

#### `combinator`

| export                     | description                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `SelectorCombinatorParser` | Structures compound selectors together using combinators. The main parser function of the module |
| `HandleCombinator`         | Combinator handler.                                                                              |
| `HandleCompound`           | Compound handler.                                                                                |
| `combinatorMap`            | `TypeMap`, off which the `SelectorCombinatorParser` is based                                     |

### `generator`

This module provides functions for generation of selectors, relating to different package's AST-belonging tokens. In particular, it includes the `generate` function as an export (aliased as `SelectorGenerator`).

The abstractions work primarily with `Stream`s , including those based off trees provided by the `tree` submodule.

| export                            | description                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `SelectorGenerator`               | The `generate` function                                                            |
| `GenerateCombinator`              | Generates the Combinator selector                                                  |
| `GeneratePseudoClass`             | Generates the pseudo-class selector                                                |
| `GenerateAttribute`               | Generates the attribute selector                                                   |
| `GenerateCompound`                | Generates the compound selector                                                    |
| `GenerateElement`                 | Generates the element selector                                                     |
| `GenerateId`                      | Generates the id selector                                                          |
| `GenerateClass`                   | Generates the class selector                                                       |
| `GeneratePseudoElement`           | Generates the pseudo-element selector                                              |
| `GenerateCharacters`              | Generates the characters (those are `StringCharacters` and `IdentifierCharacters`) |
| `GenerateEscaped`                 | Generates the `Escaped`                                                            |
| `GenerateChildCombinator`         | Generates the child combinator (`>`)                                               |
| `GenerateDescendantCombinator`    | Generates the descendant combinator (` `)                                          |
| `GenerateNextSiblingCombinator`   | Generates the next sibling combinator (`+`)                                        |
| `GenerateNamespaceCombinator`     | Generates the namespace combinator (`\|`)                                          |
| `GenerateSubseqSibilngCombinator` | Generates the subsequent sibling combinator (`~`)                                  |
| `GenerateEndsWithMatch`           | Generates the ends-with match `$=`                                                 |
| `GenerateIncludesMatch`           | Generates the includes match `~=`                                                  |
| `GenerateHyphBeginMatch`          | Generates the hyphen-begin match `\|=`                                             |
| `GeneratePrefixMatch`             | Generates the prefix match `^=`                                                    |
| `GenerateFindMatch`               | Generates the find match `*=`                                                      |
| `GenerateEqualityMatch`           | Generates the equality match `=`                                                   |
| `GenerateUniversalSelector`       | Generates the universal selector `*`                                               |
| `GenerateParentSelector`          | Generates the parent selector `&`                                                  |
| `GenerateString`                  | Generates a string (note: preserves the quotes used - either `'`, or `"`)          |
| `GenerateSubSelector`             | Generates a sub-selector                                                           |
| `GenerateSelectorList`            | Generates a selector-list                                                          |
| `GenerateIdentifier`              | Generates an identifier                                                            |
| `SelectorSourceGenerator`         | The `SourceGenerator`, on which the `generate` function is based off               |
| `generatorMap`                    | The `TypeMap`, on which the `SelectorSourceGenerator` is based off                 |

### `tree`

Provides exports related to `TreeStream`-building based off the `parser`-created `AST`.

| export            | description                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SelectorStream`  | A function accepting the library's AST (result of `parse`, for instance), and transforming it into a `Stream`                                                                    |
| `SelectorTree`    | The default export of the submodule. Converts the given library's AST into a tree that can be put through `TreeStream` to make a `Stream` (on it, teh `SelectorStream` is based) |
| `SimpleTree`      | Like others below, a function for transforming a node of an AST into a `TreeStream` argument. Converts the `.value` to the tree, and makes `[.value]` the children array         |
| `ChildlessTree`   | The tree without children                                                                                                                                                        |
| `ValueTree`       | The tree in which `.value` is the `.children`                                                                                                                                    |
| `AttributeTree`   | The function that transforms an `SelectorAttribute` into a tree                                                                                                                  |
| `PseudoClassTree` | The function that transforms a `PseudoClassSelector` into a tree                                                                                                                 |
| `CombinatorTree`  | The function that transforms a `CombinatorToken` into a tree                                                                                                                     |
| `treeMap`         | The `IndexMap`, on which the `SelectorTree` is based                                                                                                                             |

### `tokens`

The `tokens` submodule includes various `TokenType`s, used by the library to represent various classes of tokens.

Like, `parser`, `tokens` submodule is, too, broken down onto submodules itself:

1. `char` (tokenization)
2. `escaped` (escaped sequences)
3. `string` (string character sequences)
4. `bracket` (identifying of sub-selectors)
5. `list` (identifying of selector-lists)
6. `simple` (finalization of simple selectors)
    1. `attribute` (parsing of attribute selectors)
    2. `identifier` (parsing of identifiers - key elements of all simple selectors)
7. `compound` (uniting simple selectors into compound ones)
8. `combinator` (identifies combinators, and orders the `compound` results based on them)

The following is the enumeration of `TokenType`s exported by the corresponding submodules.

#### `char`

| `TokenType`        | represents                                     | `type`-word      |
| ------------------ | ---------------------------------------------- | ---------------- |
| `SelectorHash`     | The hash (`#`) symbol                          | `"hash"`         |
| `SelectorDot`      | The dot (`.`) symbol                           | `"dot"`          |
| `Space`            | One of the space (`/\s/`) symbols              | `"space"`        |
| `RectOp`           | The opening square bracket (`[`) symbol        | `"rop"`          |
| `RectCl`           | The closing square bracket (`]`) symbol        | `"rcl"`          |
| `DoubleColon`      | The double colon symbol sequence (`::`)        | `"double-colon"` |
| `Colon`            | The single colon (`:`) symbol                  | `"colon"`        |
| `Plus`             | The plus (`+`) symbol                          | `"plus"`         |
| `Child`            | The child combinator symbol (`>`)              | `"child"`        |
| `OpBrack`          | The opening bracket (`(`) symbol               | `"opbrack"`      |
| `ClBrack`          | The closing bracket (`)`) symbol               | `"clbrack"`      |
| `EndsWithMatch`    | The ends-with match (`$=`) symbol-sequence     | `"endswith"`     |
| `IncludesMatch`    | The includes-match (`~=`) symbol-sequence      | `"includes"`     |
| `HyphenBeginMatch` | The hyphen-beign match (`\|=`) symbol-sequence | `"hyphbeg"`      |
| `PrefixMatch`      | The prefix-match (`^=`) symbol-sequence        | `"prefix"`       |
| `FindMatch`        | The find-match (`*=`) symbol-sequence          | `"find"`         |
| `EqMatch`          | The equality-match (`*=`) symbol               | `"eq"`           |
| `Any`              | The universal selector (`*`) symbol            | `"any"`          |
| `Namespace`        | The namespace combinator symbol (`\|`)         | `"namespace"`    |
| `Sibling`          | The sibling combinator symbol (`~`)            | `"sibling"`      |
| `Quote`            | One of the quote symbols (`'` or `"`)          | `"quote"`        |
| `Comma`            | The comma (`,`) symbol                         | `"comma"`        |
| `Ampersand`        | The ampersand (`&`) symbol                     | `"ampersand"`    |
| `Escape`           | The escape (`\`) symbol                        | `"escape"`       |
| `SelectorSymbol`   | Any other symbol (not in the table already)    | `"symbol"`       |

These `TokenType`s are used for initial tokenization of the given CSS selector.

#### `escaped`

```ts
const Escaped: TokenType
```

Represents an escaped character or a hex number up to 6 digits. Used inside identifiers and strings.

Type-word: `"escaped"`

```ts
const SelectorPartial: (x: any): boolean
```

Checks for whether a given item is one of `SelectorSymbol`s or `Escaped`s.

#### `string`

| `TokenType`        | represents                         | `type`-word      |
| ------------------ | ---------------------------------- | ---------------- |
| `SelectorString`   | A string                           | `"string"`       |
| `StringCharacters` | A sequence of in-string characters | `"string-chars"` |

#### `bracket`

| `TokenType`   | represents     | `type`-word      |
| ------------- | -------------- | ---------------- |
| `SubSelector` | A sub-selector | `"sub-selector"` |

#### `list`

| `TokenType`    | represents                        | `type`-word       |
| -------------- | --------------------------------- | ----------------- |
| `SelectorList` | A selector-list (`..., ..., ...`) | `"selector-list"` |

#### `simple`

| `TokenType`             | represents                                   | `type`-word        |
| ----------------------- | -------------------------------------------- | ------------------ |
| `SelectorElement`       | An element-selector (ex: `h1`)               | `"selector-list"`  |
| `SelectorId`            | An id-selector (ex: `#i-am-unique`)          | `"id"`             |
| `SelectorClass`         | A class-selector (ex: `.we-are-many`)        | `"class"`          |
| `SelectorAttribute`     | An attribute-selector (ex: `[nom="valeur"]`) | `"attribute"`      |
| `PseudoClassSelector`   | A pseudo-class selector (ex: `:hover`)       | `"pseudo-class"`   |
| `PseudoElementSelector` | A pseudo-element selector (ex: `::after`)    | `"pseudo-element"` |
| `UniversalSelector`     | A universal selector (`"*"`)                 | `"universal"`      |
| `ParentSelector`        | Parent-selector (`&`)                        | `"parent"`         |

#### `attribute`

The only export is the `isMatch` predicate.

```ts
const isMatch: (x: any): boolean
```

Returns `true` only for one of `EndsWithMatch`, `IncludesMatch`, `HyphenBegMatch`, `PrefixMatch`, `FindMatch`, `EqMatch`.

#### `identifier`

| `TokenType`            | represents                             | `type`-word    |
| ---------------------- | -------------------------------------- | -------------- |
| `SelectorIdentifier`   | An identifier                          | `"identifier"` |
| `IdentifierCharacters` | A sequence of in-identifier characters | `"id-chars"`   |

#### `compound`

| `TokenType`        | represents                                     | `type`-word  |
| ------------------ | ---------------------------------------------- | ------------ |
| `CompoundSelector` | A compound selector, includes simple selectors | `"compound"` |

Also, contains the `isSelector` predicate

```ts
const isSelector: (x: any): boolean
```

Returns `true` only if the argument is one of `SelectorElement`, `SelectorId`, `SelectorClass`, `SelectorAttribute`, `PseudoClassSelector`, `PseudoElementSelector`,
`UniversalSelector`, `ParentSelector`

#### `combinator`

| `TokenType`       | represents                                                 | `type`-word  |
| ----------------- | ---------------------------------------------------------- | ------------ |
| `CombinatorToken` | A combinator, consists of a combinator token and arguments | `"compound"` |

Also, exports the `isCombinator` predicate.

```ts
const isCombinator: (x: any): boolean
```

Returns `true` only to one of the `Child`, `Space`, `Plus`, `Namespace`, `Sibling`.
