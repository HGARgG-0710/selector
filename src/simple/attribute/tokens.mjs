import {
	EndsWithMatch,
	IncludesMatch,
	HyphenBeginMatch,
	PrefixMatch,
	FindMatch,
	EqMatch
} from "../../char/tokens.mjs"

import { TokenType, is } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"

const { or } = _f

export const [AttributeName, SelectorIdentifier] = ["attrname", "identifier"].map(
	TokenType
)

export const isMatch = or(
	...[
		EndsWithMatch,
		IncludesMatch,
		HyphenBeginMatch,
		PrefixMatch,
		FindMatch,
		EqMatch
	].map(is)
)
