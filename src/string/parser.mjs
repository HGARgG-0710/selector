import {
	BasicParser,
	InputStream,
	PredicateMap,
	StreamParser,
	Token,
	TokenSource,
	TypeMap,
	forward,
	preserve,
	read,
	limit
} from "@hgargg-0710/parsers.js"
import { SelectorString, StringCharacters } from "./tokens.mjs"
import { Quote } from "../char/tokens.mjs"

import { function as _f, map } from "@hgargg-0710/one"
import { Escaped } from "../escaped/tokens.mjs"

const { cache, trivialCompose } = _f
const { toObject } = map

// ? Add the '(x) => !x' and other such basic predicate functions to 'parsers.js'? [as aliases...]
const readUntilEscaped = read((input) => !Escaped.is(input.curr()))

export const stringCharMap = TypeMap(PredicateMap)(
	new Map([[Escaped, forward]]),
	(input) => [readUntilEscaped(input, TokenSource(StringCharacters("")))]
)

export const StringCharacterParser = BasicParser(stringCharMap)

const quoteRead = toObject(
	cache(
		(quote) =>
			trivialCompose(
				SelectorString,
				StringCharacterParser,
				InputStream,
				limit(
					(input) =>
						!Quote.is(input.curr()) || Token.value(input.curr()) !== quote
				)
			),
		['"', "'"]
	)
)

export const selectorStringMap = TypeMap(PredicateMap)(
	new Map([
		[
			Quote,
			function (input) {
				const quote = input.next().value
				return [quoteRead[quote](input)]
			}
		]
	]),
	preserve
)

export const SelectorStringParser = StreamParser(selectorStringMap)
