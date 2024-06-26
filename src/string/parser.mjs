import {
	PredicateMap,
	StreamParser,
	Token,
	TokenSource,
	TypeMap,
	preserve,
	read
} from "@hgargg-0710/parsers.js"
import { SelectorString } from "./tokens.mjs"
import { Quote } from "../char/tokens.mjs"

import { function as _f, map } from "@hgargg-0710/one"

const { cache } = _f
const { toObject } = map

const quoteRead = toObject(
	cache(
		(quote) => (input) =>
			!Quote.is(input.curr()) || Token.value(input.curr()) !== quote,
		['"', "'"]
	)
)

export const selectorStringMap = TypeMap(PredicateMap)(
	new Map([
		[
			Quote,
			function (input) {
				const quote = input.next().value
				return [quoteRead[quote](input, TokenSource(SelectorString(""))).value]
			}
		]
	]),
	preserve
)

export const SelectorStringParser = StreamParser(selectorStringMap)
