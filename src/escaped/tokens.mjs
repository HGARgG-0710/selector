import { TokenType, is } from "@hgargg-0710/parsers.js"
import { function as _f } from "@hgargg-0710/one"
import { SelectorSymbol } from "../char/tokens.mjs"

const { or } = _f

export const Escaped = TokenType("escaped")
export const SelectorPartial = or(...[Escaped, SelectorSymbol].map(is))
