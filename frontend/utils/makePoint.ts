export default function makePoint(a: number, b?: number) {
  return `path("M ${a} ${b ?? a}")`;
}
