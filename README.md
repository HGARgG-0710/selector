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

<!-- TODO: FINISH! [group things by parsing layers - would be easiest] USE TABLES -->

#### `char`

<!-- ! descriptions -->

| export              | description |
| ------------------- | ----------- |
| `SelectorTokenizer` |             |
| `charMap`           |             |

#### `escaped`

<!-- ! descriptions -->

| export          | description |
| --------------- | ----------- |
| `EscapeParser`  |             |
| `isHex`         |             |
| `readHex`       |             |
| `readEscaped`   |             |
| `HandleEscaped` |             |
| `escapedMap`    |             |

#### `string`

<!-- ! descriptions -->

| export                  | description |
| ----------------------- | ----------- |
| `SelectorStringParser`  |             |
| `StringCharacterParser` |             |
| `quoteRead`             |             |
| `readUntilEscaped`      |             |
| `stringMap`             |             |
| `stringCharMap`         |             |

#### `bracket`

<!-- ! descriptions -->

| export                   | description |
| ------------------------ | ----------- |
| `EndParser`              |             |
| `SelectorListParser`     |             |
| `BracketParser`          |             |
| `recursiveBracketParser` |             |
| `flatBracketParser`      |             |
| `SubSelectorHandler`     |             |
| `nestedBrack`            |             |

#### `list`

<!-- ! descriptions -->

| export                | description |
| --------------------- | ----------- |
| `SelectorCommaParser` |             |

#### `simple`

<!-- ! descriptions -->

| export                 | description |
| ---------------------- | ----------- |
| `SimpleSelectorParser` |             |
| `HandleElement`        |             |
| `HandleId`             |             |
| `HandleClass`          |             |
| `HandleAttribute`      |             |
| `HandlePseudoClass`    |             |
| `HandlePseudoElement`  |             |
| `HandleUniversal`      |             |
| `HandleParent`         |             |
| `readSimple`           |             |
| `simpleMap`            |             |

#### `attribute`

<!-- ! descriptions -->

| export             | description |
| ------------------ | ----------- |
| `AttributeParser`  |             |
| `AttributeHandler` |             |
| `attributeMap`     |             |

#### `identifier`

<!-- ! descriptions -->

| export             | description |
| ------------------ | ----------- |
| `IdentifierParser` |             |
| `readSymbol`       |             |
| `limitPartial`     |             |
| `parseIdentifier`  |             |
| `identifierMap`    |             |

#### `compound`

<!-- ! descriptions -->

| export                   | description |
| ------------------------ | ----------- |
| `CompoundSelectorParser` |             |
| `CompoundHandler`        |             |
| `compoundMap`            |             |

#### `despace`

<!-- ! descriptions -->

| export       | description |
| ------------ | ----------- |
| `DeSpacer`   |             |
| `DeSpace`    |             |
| `despaceMap` |             |
| `skipSpaces` |             |

#### `combinator`

<!-- ! descriptions -->

| export                     | description |
| -------------------------- | ----------- |
| `SelectorCombinatorParser` |             |
| `HandleCombinator`         |             |
| `HandleCompound`           |             |
| `combinatorMap`            |             |

### `generator`

This module provides functions for generation of selectors, relating to different package's AST-belonging tokens. In particular, it includes the `generate` function as an export (aliased as `SelectorGenerator`).

<!-- TODO: FINISH! [Add descriptions] -->

| export                            | description |
| --------------------------------- | ----------- |
| `SelectorGenerator`               |             |
| `GenerateCombinator`              |             |
| `GeneratePseudoClass`             |             |
| `GenerateAttribute`               |             |
| `GenerateCompound`                |             |
| `GenerateElement`                 |             |
| `GenerateId`                      |             |
| `GenerateClass`                   |             |
| `GeneratePseudoElement`           |             |
| `GenerateCharacters`              |             |
| `GenerateEscaped`                 |             |
| `GenerateChildCombinator`         |             |
| `GenerateDescendantCombinator`    |             |
| `GenerateNextSiblingCombinator`   |             |
| `GenerateNamespaceCombinator`     |             |
| `GenerateSubseqSibilngCombinator` |             |
| `GenerateEndsWithMatch`           |             |
| `GenerateIncludesMatch`           |             |
| `GenerateHyphBeginMatch`          |             |
| `GeneratePrefixMatch`             |             |
| `GenerateFindMatch`               |             |
| `GenerateEqualityMatch`           |             |
| `GenerateUniversalSelector`       |             |
| `GenerateParentSelector`          |             |
| `GenerateString`                  |             |
| `GenerateSubSelector`             |             |
| `GenerateSelectorList`            |             |
| `GenerateIdentifier`              |             |
| `SelectorSourceGenerator`         |             |
| `generatorMap`                    |             |

### `tree`

Provides exports related to `TreeStream`-building based off the `parser`-created `AST`.

<!-- TODO: FINISH! [write descriptions...] -->

| export            | description |
| ----------------- | ----------- |
| `SelectorStream`  |             |
| `SelectorTree`    |             |
| `SimpleTree`      |             |
| `ChildlessTree`   |             |
| `ValueTree`       |             |
| `AttributeTree`   |             |
| `PseudoClassTree` |             |
| `CombinatorTree`  |             |
| `treeMap`         |             |

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
