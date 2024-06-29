import {
	PredicateMap,
	SourceGenerator,
	StringSource,
	TypeMap,
	miss
} from "@hgargg-0710/parsers.js"
import { function as _f, map } from "@hgargg-0710/one"

import { isHex } from "./escaped/parser.mjs"

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

import { SelectorStream } from "./tree.mjs"

const { cache, trivialCompose } = _f
const { toObject } = map

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
		["&", "*", " > ", " ", " + ", " | ", " ~ ", "$=", "~=", "|=", "^=", "*=", "="]
	)
)
const arrays = toObject(
	cache(
		(sym) =>
			function (input, generator) {
				const { length } = input.curr().value
				return StringSource(
					`${sym}${
						Array(length)
							.fill(0)
							.map(() => {
								input.next()
								return generator(input)
							})
							.reduce((last, curr) => last.concat(curr), StringSource())
							.value
					}${sym}`
				)
			},
		["", '"', "'"]
	)
)

export function GenerateCombinator(input, generator) {
	const { length } = input.next().value.args
	const combinator = generator(input).value
	input.next()
	const isBinary = length > 1
	const args = Array(1 + isBinary)
		.fill(input)
		.map(() => {
			input.next()
			return generator(input)
		})
		.map((x) => x.value)
	return StringSource(`${isBinary ? args[0] : ""}${combinator}${args[+isBinary]}`)
}

export function GeneratePseudoClass(input, generator) {
	const areArgs = !!input.next().value.args
	const name = generator(input).value
	if (areArgs) {
		input.next()
		const args = generator(input).value
		return StringSource(`:${name}${args}`)
	}
	return StringSource(`:${name}`)
}

export function GenerateAttribute(input, generator) {
	const isComparison = !!input.next().value.comparison
	const name = generator(input).value
	if (!isComparison) return StringSource(`[${name}]`)

	input.next()
	const comparison = generator(input).value
	input.next()
	const { value } = generator(input)
	return StringSource(`[${name}${comparison}${value}]`)
}

export const GenerateCompound = arrays[""]

export const [GenerateElement, GenerateId, GenerateClass, GeneratePseudoElement] = [
	"",
	"#",
	".",
	"::"
].map((x) => elements[x])

export const GenerateCharacters = (input) => StringSource(`${input.curr().value}`)
export function GenerateEscaped(input) {
	const escaped = input.curr().value
	// ! NOTE: this here is a little bit of a hack (as it relies heavily on the AST's intended structure, and ultimate syntactical correctness of the selector)
	// Ideally, this sort of stuff should be handled as a reverse-parser
	input.next()
	const post = input.prev()
	const addSpace =
		isHex(escaped[0]) &&
		escaped.length < 6 &&
		(Escaped.is(post) || (typeof post.value === "string" && isHex(post.value[0])))
	return StringSource(`\\${escaped}${addSpace ? " " : ""}`)
}

export const [
	GenerateChildCombinator,
	GenerateDescendantCombinator,
	GenerateNextSiblingCombinator,
	GenerateNamespaceCombinator,
	GenerateSubseqSibilngCombinator,
	GenerateEndsWithMatch,
	GenerateIncludesMatch,
	GenerateHyphBeginMatch,
	GeneratePrefixMatch,
	GenerateFindMatch,
	GenerateEqualityMatch,
	GenerateUniversalSelector,
	GenerateParentSelector
] = [" > ", " ", " + ", " | ", " ~ ", "$=", "~=", "|=", "^=", "*=", "=", "*", "&"].map(
	(x) => trivial[x]
)

export const GenerateString = (input, generate) =>
	arrays[input.curr().quote](input, generate)

export const GenerateSubSelector = function (input, generator) {
	input.next()
	return StringSource(`(${generator(input).value})`)
}

export function GenerateSelectorList(input, generator) {
	const { length } = input.curr().value
	const comma = StringSource(", ")
	return StringSource(
		`${
			Array(length)
				.fill(0)
				.map(() => {
					input.next()
					return generator(input)
				})
				.reduce(
					(last, curr, i) =>
						last.concat(curr).concat(i < length - 1 ? comma : StringSource()),
					StringSource()
				).value
		}`
	)
}
export const GenerateIdentifier = arrays[""]

export const selectorMap = TypeMap(PredicateMap)(
	new Map([
		[CombinatorToken, GenerateCombinator],
		[CompoundSelector, GenerateCompound],
		[PseudoClassSelector, GeneratePseudoClass],
		[SelectorElement, GenerateElement],
		[SelectorId, GenerateId],
		[SelectorClass, GenerateClass],
		[PseudoElementSelector, GeneratePseudoElement],
		[SelectorAttribute, GenerateAttribute],
		[UniversalSelector, GenerateUniversalSelector],
		[ParentSelector, GenerateParentSelector],
		[SelectorIdentifier, GenerateIdentifier],
		[IdentifierCharacters, GenerateCharacters],
		[Escaped, GenerateEscaped],
		[Child, GenerateChildCombinator],
		[Space, GenerateDescendantCombinator],
		[Plus, GenerateNextSiblingCombinator],
		[Namespace, GenerateNamespaceCombinator],
		[Sibling, GenerateSubseqSibilngCombinator],
		[EndsWithMatch, GenerateEndsWithMatch],
		[IncludesMatch, GenerateIncludesMatch],
		[HyphenBeginMatch, GenerateHyphBeginMatch],
		[PrefixMatch, GeneratePrefixMatch],
		[FindMatch, GenerateFindMatch],
		[EqMatch, GenerateEqualityMatch],
		[SelectorString, GenerateString],
		[StringCharacters, GenerateCharacters],
		[SubSelector, GenerateSubSelector],
		[SelectorList, GenerateSelectorList]
	]),
	miss
)

export const SelectorSourceGenerator = SourceGenerator(selectorMap)

export const SelectorGenerator = trivialCompose(
	(x) => x.value,
	(x) => SelectorSourceGenerator(x, StringSource()),
	SelectorStream
)

export default SelectorGenerator
