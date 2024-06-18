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

export const selectorStringMap = TypeMap(PredicateMap)(
	new Map([
		[
			Quote,
			function (input) {
				const quote = input.next().value
				return [
					read(
						(input) =>
							!Quote.is(input.curr()) ||
							Token.value(input.curr()) !== quote,
						TokenSource(SelectorString(""))
					)
				]
			}
		]
	]),
	preserve
)

export const SelectorStringParser = StreamParser(selectorStringMap)
