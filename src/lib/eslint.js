import Linter from "eslint4b" // or eslint4b/dist/linter
import { rules } from "eslint-plugin-emmanuel"

export const linter = new class extends Linter {
    /** Initialize this linter. */
    constructor() {
        super()
        // this.defineParser("vue-eslint-parser", parser)
        for (const name of Object.keys(rules)) {
            this.defineRule(`emmanuel/${name}`, rules[name])
        }
    }
}()
