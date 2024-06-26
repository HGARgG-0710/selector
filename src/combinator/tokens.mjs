import { is } from "@hgargg-0710/parsers.js"
import { Child, Namespace, Plus, Sibling, Space } from "../char/tokens.mjs"
import { function as _f } from "@hgargg-0710/one"
const { or } = _f
export const Combinator = or(...[Child, Space, Plus, Namespace, Sibling].map(is))
