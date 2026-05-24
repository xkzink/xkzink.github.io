import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

function getTypeContentLength(contents) {
  return contents.reduce((length, item) => length + (item.break ? 1 : item.text.length), 0);
}

function renderTypeContent(contents, visibleLength) {
  let consumed = 0;

  return contents.flatMap((item, index) => {
    if (consumed >= visibleLength) return [];

    if (item.break) {
      consumed += 1;
      return <br key={`break-${index}`} />;
    }

    const remaining = visibleLength - consumed;
    const visibleText = item.text.slice(0, remaining);
    consumed += item.text.length;

    if (!visibleText) return [];

    return (
      <span className={item.className} key={`text-${index}`}>
        {visibleText}
      </span>
    );
  });
}

const TypeWriter = forwardRef(function TypeWriter({ contents }, ref) {
  const [index, setIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const timerRef = useRef(null);
  const contentLength = useMemo(() => getTypeContentLength(contents), [contents]);
  const visibleContent = useMemo(() => renderTypeContent(contents, index), [contents, index]);

  useImperativeHandle(ref, () => ({
    showAll() {
      clearTimeout(timerRef.current);
      setIndex(contentLength);
    },
  }), [contentLength]);

  useEffect(() => {
    const blinkTimer = setInterval(() => setBlink((value) => !value), 500);
    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => setIndex(1), 900);
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (index === 0 || index >= contentLength) return undefined;

    timerRef.current = setTimeout(() => setIndex(index + 1), 80);
    return () => clearTimeout(timerRef.current);
  }, [contentLength, index]);

  return (
    <div className="typewriter-text">
      <span>{visibleContent}</span>
      {blink && <span aria-hidden="true">|</span>}
    </div>
  );
});

export default function TypeWriterIsland({ contents }) {
  const typeWriterRef = useRef(null);

  return (
    <div className="typewriter-wrap" onDoubleClick={() => typeWriterRef.current?.showAll()}>
      <TypeWriter ref={typeWriterRef} contents={contents} />
    </div>
  );
}
