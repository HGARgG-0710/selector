import {
	EndsWithMatch,
	IncludesMatch,
	HyphenBeginMatch,
	PrefixMatch,
	FindMatch,
	EqMatch
} from "../../char/tokens.mjs"

import { TokenType } from "@hgargg-0710/parsers.js"
export const [AttributeName, SelectorIdentifier] = ["attrname", "identifier"].map(
	TokenType
)

export const isMatch = (y) =>
	[
		EndsWithMatch,
		IncludesMatch,
		HyphenBeginMatch,
		PrefixMatch,
		FindMatch,
		EqMatch
	].some((x) => x.is(y))
