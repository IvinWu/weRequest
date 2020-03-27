/*  U+2028 and U+2029 are allowed inside strings in JSON (as all literal
    Unicode characters) but JavaScript defines them as newline
    seperators. Because no literal newlines are allowed in a string, this
    causes a ParseError in the browser. We work around this issue by
    replacing them with the escaped version. This should be safe because
    according to the JSON spec, these characters are *only* valid inside
    a string and should therefore not be present any other places.

    more information: https://github.com/tc39/proposal-json-superset
*/

const LINEFEED = /\u000A/g;
const CARRIAGERETURN = /\u000D/g;
const LINE_SEPARATOR = /\u2028/g;
const PARAGRAPH_SEPARATOR = /\u2029/g;

export default function replace(res: string) {
  res = res.replace(LINEFEED, "");
  res = res.replace(CARRIAGERETURN, "");
  res = res.replace(LINE_SEPARATOR, "");
  res = res.replace(PARAGRAPH_SEPARATOR, "");
  return res
}
