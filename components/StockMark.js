export const STOCK_MARKS = {
  NVDAc: { bg: "#76b900", letter: "N" },
  AAPLc: { bg: "#f5f5f7", letter: "", color: "#111" },
  METAc: { bg: "#0081fb", letter: "∞" },
  GOOGLc: { bg: "#fff", letter: "G", color: "#4285F4" },
};

export default function StockMark({ symbol }) {
  const mark = STOCK_MARKS[symbol] || { bg: "#1d4ed8", letter: symbol[0] };
  if (symbol === "AAPLc") {
    return (
      <span className="stock-mark apple" aria-hidden>
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path fill="#111" d="M16.4 12.3c0-2.4 2-3.4 2.1-3.5-1.2-1.7-3-1.9-3.6-1.9-1.5-.2-3 .9-3.7.9s-2-.9-3.3-.8c-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.5 1.3 0 1.8-.8 3.4-.8s2 .8 3.4.8 2.2-1.3 3.1-2.5c1-.1 2-1.1 2.8-2.2-7.3-2.8-6.1-10.3-4.6-10.3z"/>
          <path fill="#111" d="M14.2 5.4c.7-.9 1.2-2.1 1.1-3.4-1 .1-2.3.7-3 .1-1.6.7-2.2 2-2.2 2 .1 1.3 1.4 2.3 4.1 1.3z"/>
        </svg>
      </span>
    );
  }
  return (
    <span className="stock-mark" style={{ background: mark.bg, color: mark.color || "#fff" }} aria-hidden>
      {mark.letter}
    </span>
  );
}
