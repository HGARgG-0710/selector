import { TokenType, is } from "@hgargg-0710/parsers.js"
import { Child, Namespace, Plus, Sibling, Space } from "../char/tokens.mjs"
import { function as _f } from "@hgargg-0710/one"
const { or } = _f

export const isCombinator = or(...[Child, Space, Plus, Namespace, Sibling].map(is))
export const CombinatorToken = TokenType("combinator")
