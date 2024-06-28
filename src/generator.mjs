import {
	PredicateMap,
	SourceGenerator,
	StringSource,
	TypeMap
} from "@hgargg-0710/parsers.js"
import { CombinatorToken } from "./combinator/tokens.mjs"
import { CompoundSelector } from "./compound/tokens.mjs"
import { Escaped } from "./escaped/tokens.mjs"
import {
	PseudoClassSelector,
	PseudoElementSelector,
	SelectorAttribute,
	SelectorClass,
	SelectorElement,
	SelectorId,
	UniversalSelector,
	ParentSelector
} from "./simple/tokens.mjs"
import { function as _f, map } from "@hgargg-0710/one"
import { IdentifierCharacters, SelectorIdentifier } from "./simple/identifier/tokens.mjs"
import {
	Namespace,
	Sibling,
	Child,
	Space,
	Plus,
	EndsWithMatch,
	IncludesMatch,
	HyphenBeginMatch,
	PrefixMatch,
	FindMatch,
	EqMatch
} from "./char/tokens.mjs"
import { SelectorString, StringCharacters } from "./string/tokens.mjs"
import { SubSelector } from "./bracket/tokens.mjs"
import { SelectorList } from "./list/tokens.mjs"

import { SelectorTree } from "./tree.mjs"
import { trivialCompose } from "@hgargg-0710/one/src/functions/functions.mjs"

const { cache } = _f
const { toObject } = map

// TODO: MAKE KEYS-VALUES PAIRS OF CACHED THINGS INTO EXPORTS!!!!
const elements = toObject(
	cache(
		(string) =>
			function (input, generator) {
				input.next()
				return StringSource(`${string}${generator(input).value}`)
			},
		["", "::", ".", "#"]
	)
)
const trivial = toObject(
	cache(
		(sym) => () => StringSource(sym),
		["&", "*", ">", " ", "+", "|", "~", "$=", "~=", "|=", "^=", "*=", "="]
	)
)
const chars = toObject(
	cache((sym) => (input) => StringSource(`${sym}${input.curr().value}`), ["", "\\"])
)
const arrays = toObject(
	cache(
		(sym) =>
			function (input, generator) {
				const { length } = input.next().value
				return `${sym}${
					Array(length)
						.fill(0)
						.map(() => {
							input.next()
							return generator(input)
						})
						.reduce((last, curr) => last.concat(curr), StringSource()).value
				}${sym}`
			},
		["", '"']
	)
)

export const selectorMap = TypeMap(PredicateMap)(
	new Map([
		[
			CombinatorToken,
			function (input, generator) {
				const { length } = input.next().value.args
				const combinator = generator(input).value
				input.next()
				const isBinary = length > 1
				const args = Array(1 + isBinary)
					.fill(input)
					.map(generator)
					.map((x) => x.value)
				return StringSource(
					`${isBinary ? args[0] : ""}${combinator}${args[+isBinary]}`
				)
			}
		],
		[CompoundSelector, arrays[""]],
		[
			PseudoClassSelector,
			function (input, generator) {
				const areArgs = !!input.next().value.args
				const name = generator(input).value
				if (areArgs) {
					input.next()
					const args = generator(input).value
					return StringSource(`:${name}${args}`)
				}
				return StringSource(`:${name}`)
			}
		],
		[SelectorElement, elements[""]],
		[SelectorId, elements["#"]],
		[SelectorClass, elements["."]],
		[PseudoElementSelector, elements["::"]],
		[
			SelectorAttribute,
			function (input, generator) {
				const { isName: isComparison } = !!input.next().comparison
				const name = generator(input).value
				if (!isComparison) return StringSource(`[${name}]`)

				input.next()
				const comparison = generator(input).value
				input.next()
				const { value } = generator(input)
				return StringSource(`[${name}${comparison}${value}]`)
			}
		],
		[UniversalSelector, trivial["*"]],
		[ParentSelector, trivial["&"]],
		[SelectorIdentifier, arrays[""]],
		[IdentifierCharacters, chars[""]],
		[Escaped, chars["\\"]],
		[Child, trivial[">"]],
		[Space, trivial[" "]],
		[Plus, trivial["+"]],
		[Namespace, trivial["|"]],
		[Sibling, trivial["~"]],
		[EndsWithMatch, trivial["$="]],
		[IncludesMatch, trivial["~="]],
		[HyphenBeginMatch, trivial["|="]],
		[PrefixMatch, trivial["^="]],
		[FindMatch, trivial["*="]],
		[EqMatch, trivial["="]],
		[SelectorString, arrays['"']],
		[StringCharacters, chars[""]],
		[
			SubSelector,
			function (input, generator) {
				input.next()
				return StringSource(`(${string}${generator(input).value})`)
			}
		],
		// ! Refactor.
		[
			SelectorList,
			function (input, generator) {
				const { length } = input.next().value
				return `${sym}${
					Array(length)
						.fill(0)
						.map(() => {
							input.next()
							return generator(input)
						})
						.reduce(
							(last, curr) => last.concat(curr).concat(", "),
							StringSource()
						).value
				}${sym}`
			}
		]
	])
)

export const SelectorSourceGenerator = SourceGenerator(selectorMap)

export const SelectorGenerator = trivialCompose(SelectorSourceGenerator, SelectorTree)

export default SelectorGenerator
