import { useRef, useState } from "react";

// fractions of the explorer's height
const SNAP_FRACTIONS = { peek: 0.18, mid: 0.46, full: 0.94 };
const SNAP_ORDER = ["peek", "mid", "full"];

const nearestSnap = (fraction) =>
  SNAP_ORDER.reduce((closest, name) =>
    Math.abs(SNAP_FRACTIONS[name] - fraction) <
    Math.abs(SNAP_FRACTIONS[closest] - fraction)
      ? name
      : closest,
  );

const SNAP_LABELS = {
  peek: "collapsed",
  mid: "half open",
  full: "open",
};

/**
 * The gig list over the map. Drag the handle to resize, or press it to cycle
 * through the snap points - so it works without a pointer that can drag.
 */
const BottomSheet = ({ snap, onSnapChange, children }) => {
  const sheetRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [dragHeight, setDragHeight] = useState(null);

  const startDrag = (event) => {
    const sheet = sheetRef.current;
    const container = sheet?.parentElement;
    if (!sheet || !container) return;
    dragRef.current = {
      startY: event.clientY,
      startHeight: sheet.getBoundingClientRect().height,
      containerHeight: container.getBoundingClientRect().height,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const continueDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = drag.startY - event.clientY;
    if (Math.abs(delta) > 4) {
      drag.moved = true;
    }
    const maximum = drag.containerHeight * SNAP_FRACTIONS.full;
    setDragHeight(Math.min(maximum, Math.max(64, drag.startHeight + delta)));
  };

  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.moved && dragHeight != null) {
      onSnapChange(nearestSnap(dragHeight / drag.containerHeight));
    }
    // a drag ends in a click event too, which would otherwise also cycle
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    setDragHeight(null);
  };

  const cycleSnap = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const index = SNAP_ORDER.indexOf(snap);
    onSnapChange(SNAP_ORDER[(index + 1) % SNAP_ORDER.length]);
  };

  const dragging = dragHeight != null;

  return (
    <div
      ref={sheetRef}
      className={`sheet ${dragging ? "is-dragging" : ""}`}
      style={{
        height: dragging ? `${dragHeight}px` : `${SNAP_FRACTIONS[snap] * 100}%`,
      }}
    >
      <button
        type="button"
        className="sheet-handle"
        aria-label={`Gig list, ${SNAP_LABELS[snap]}. Press to resize.`}
        onPointerDown={startDrag}
        onPointerMove={continueDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={cycleSnap}
      >
        <span />
      </button>
      {children}
    </div>
  );
};

export default BottomSheet;
