import {
	PredicateMap,
	StreamParser,
	Token,
	TokenSource,
	TypeMap,
	limit,
	miss,
	read,
	skip
} from "@hgargg-0710/parsers.js"
import { Quote, SelectorSymbol } from "../../char/tokens.mjs"
import { AttributeName, SelectorIdentifier, SelectorString } from "./tokens.mjs"

export const attributeMap = TypeMap(PredicateMap)(
	new Map([
		[
			SelectorSymbol,
			function (input) {
				const name = read(
					(input) => SelectorSymbol.is(input.curr()),
					TokenSource(AttributeName(""))
				)(input).value.value

				let comparison
				skip(input)(
					(input) =>
						![
							EndsWithMatch,
							IncludesMatch,
							HyphenBeginMatch,
							PrefixMatch,
							FindMatch,
							EqMatch
						].some((x) => x.is(input.curr()) && (comparison = input.next()))
				)

				let quote = ""
				skip(input)(
					(input) =>
						!SelectorSymbol.is(input.curr()) &&
						(!Quote.is(input.curr()) ||
							((quote = Token.value(input.next())) && false))
				)

				const isQuote = ['"', "'"].includes(quote)

				const value = read(
					() => true,
					TokenSource((isQuote ? SelectorString : SelectorIdentifier)(""))
				)(
					InputStream(
						limit(
							isQuote
								? (input) =>
										!Quote.is(input.curr()) ||
										Token.value(input.curr()) !== quote
								: (input) => SelectorSymbol.is(input.curr())
						)(input)
					)
				)

				return [
					{
						name,
						comparison,
						value
					}
				]
			}
		]
	]),
	miss
)
export const AttributeParser = StreamParser(attributeMap)
