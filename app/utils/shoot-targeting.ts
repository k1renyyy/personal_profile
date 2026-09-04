/** True only if (x,y) is over a non-empty text character (not padding / empty layout). */
function getTextNodeAtPoint(x: number, y: number): Text | null {
    if (typeof document === "undefined") return null;
    try {
        const doc = document as Document & {
            caretRangeFromPoint?: (nx: number, ny: number) => Range | null;
            caretPositionFromPoint?: (nx: number, ny: number) => CaretPosition | null;
        };
        if (typeof doc.caretRangeFromPoint === "function") {
            const range = doc.caretRangeFromPoint(x, y);
            return range?.startContainer?.nodeType === Node.TEXT_NODE
                ? range.startContainer as Text
                : null;
        }
        if (typeof doc.caretPositionFromPoint === "function") {
            const position = doc.caretPositionFromPoint(x, y);
            return position?.offsetNode?.nodeType === Node.TEXT_NODE
                ? position.offsetNode as Text
                : null;
        }
    } catch {
        return null;
    }
    return null;
}

function pickInnerShootTarget(raw: Element | null): HTMLElement | null {
    let element: Element | null = raw;
    while (element && element instanceof HTMLElement) {
        if (element.matches("[data-shoot-ui]")) return null;
        if (element.hasAttribute("data-shoot-target")) return element;
        element = element.parentElement;
    }
    return null;
}

function pickSemanticTextTarget(raw: Element | null): HTMLElement | null {
    let element: Element | null = raw;
    while (element && element instanceof HTMLElement) {
        if (element.matches("[data-shoot-ui]")) return null;
        if (element.matches("h1,h2,h3,h4,h5,h6,p,span,a,button,li,br,article,img")) return element;
        element = element.parentElement;
    }
    return null;
}

function pickInnerShootTargetFromTextNode(text: Text): HTMLElement | null {
    let element = text.parentElement;
    while (element) {
        if (element.matches("[data-shoot-ui]")) return null;
        if (element.hasAttribute("data-shoot-target")) return element;
        element = element.parentElement;
    }
    return null;
}

function wrapCharInTextNode(textNode: Text, offset: number): HTMLElement | null {
    const parentElement = textNode.parentElement;
    if (parentElement?.getAttribute("data-shoot-char-wrap") === "1") return parentElement;

    const fullText = textNode.textContent ?? "";
    if (fullText.length === 0) return null;
    const safeOffset = Math.max(0, Math.min(offset, fullText.length - 1));
    const character = fullText[safeOffset];
    if (character === undefined) return null;

    const span = document.createElement("span");
    span.setAttribute("data-shoot-char-wrap", "1");
    span.style.display = "inline-block";
    span.textContent = character;

    const fragment = document.createDocumentFragment();
    const before = fullText.slice(0, safeOffset);
    const after = fullText.slice(safeOffset + 1);
    if (before) fragment.appendChild(document.createTextNode(before));
    fragment.appendChild(span);
    if (after) fragment.appendChild(document.createTextNode(after));

    const parent = textNode.parentNode;
    if (!parent) return null;
    parent.replaceChild(fragment, textNode);
    return span;
}

/** iOS WebKit fallback for caret APIs under shoot-mode `user-select: none`. */
function findTextOffsetAtPointWithRanges(root: HTMLElement, x: number, y: number): {node: Text; offset: number} | null {
    const range = document.createRange();
    let best: {node: Text; offset: number; area: number} | null = null;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    let node = walker.nextNode();
    while (node !== null) {
        const textNode = node as Text;
        const text = textNode.textContent ?? "";
        for (let index = 0; index < text.length; index += 1) {
            try {
                range.setStart(textNode, index);
                range.setEnd(textNode, index + 1);
                const rect = range.getBoundingClientRect();
                if (rect.width <= 0 || rect.height <= 0) continue;
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    const area = rect.width * rect.height;
                    if (best === null || area < best.area) best = {node: textNode, offset: index, area};
                }
            } catch {
                // Ignore invalid transient ranges while text is being wrapped.
            }
        }
        node = walker.nextNode();
    }
    return best === null ? null : {node: best.node, offset: best.offset};
}

function wrapShootCharAtPoint(x: number, y: number, root: HTMLElement): HTMLElement | null {
    const doc = document as Document & {
        caretRangeFromPoint?: (nx: number, ny: number) => Range | null;
    };
    let textNode: Text | null = null;
    let offset = 0;

    if (typeof doc.caretRangeFromPoint === "function") {
        const caretRange = doc.caretRangeFromPoint(x, y);
        if (caretRange?.startContainer.nodeType === Node.TEXT_NODE) {
            const candidate = caretRange.startContainer as Text;
            if (root.contains(candidate)) {
                textNode = candidate;
                offset = caretRange.startOffset;
            }
        }
    }

    if (textNode === null) {
        const found = findTextOffsetAtPointWithRanges(root, x, y);
        if (found === null) return null;
        textNode = found.node;
        offset = found.offset;
    }
    return wrapCharInTextNode(textNode, offset);
}

export function resolveShootAnimationTarget(target: HTMLElement, x: number, y: number): HTMLElement {
    if (target.getAttribute("data-shoot-granularity") !== "char") return target;
    return wrapShootCharAtPoint(x, y, target) ?? target;
}

export function pickHitWord(x: number, y: number, raw: Element | null): HTMLElement | null {
    if (!raw || raw.closest("[data-shoot-ui]")) return null;

    const explicitTarget = pickInnerShootTarget(raw);
    if (explicitTarget) return explicitTarget;

    const target = pickSemanticTextTarget(raw);
    if (!target || target.closest("[data-shoot-ui]")) return null;

    if (target.tagName === "IMG" || (raw instanceof HTMLElement && raw.tagName === "IMG")) {
        const image = target.tagName === "IMG" ? target : raw as HTMLElement;
        const rect = image.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom ? image : null;
    }

    const textAtPoint = getTextNodeAtPoint(x, y);
    if (!textAtPoint || !(textAtPoint.textContent ?? "").trim()) {
        for (const image of target.querySelectorAll("img")) {
            const rect = image.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return image;
        }
        return target;
    }

    return pickInnerShootTargetFromTextNode(textAtPoint) ?? target;
}
