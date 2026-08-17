import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from './Modal.jsx';

const OUTPUTS = {
  profile: { width: 720, height: 720, label: 'profile photo', rotatable: true },
  cover: { width: 1500, height: 500, label: 'cover photo', rotatable: false }
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function ProfileImageEditor({ file, type, onClose, onSave }) {
  const output = OUTPUTS[type] || OUTPUTS.profile;
  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const dragState = useRef(null);

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => () => imageUrl && URL.revokeObjectURL(imageUrl), [imageUrl]);

  useEffect(() => {
    setNaturalSize(null);
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, [file, type]);

  // Track the stage's actual rendered size (it's sized responsively via CSS)
  // so the zoom/pan math always matches what's on screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const measure = () => setStageSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [file, type]);

  // The scale that fits the entire (possibly rotated) image inside the
  // stage at zoom = 1, so the whole photo is visible by default — zooming
  // in from there is an explicit, opt-in crop rather than an automatic one.
  const baseScale = useMemo(() => {
    if (!naturalSize || !stageSize.width || !stageSize.height) return 1;
    const swapped = rotation % 180 !== 0;
    const w = swapped ? naturalSize.h : naturalSize.w;
    const h = swapped ? naturalSize.w : naturalSize.h;
    return Math.min(stageSize.width / w, stageSize.height / h);
  }, [naturalSize, rotation, stageSize]);

  const finalScale = baseScale * zoom;

  const clampOffset = (next) => {
    if (!naturalSize || !stageSize.width || !stageSize.height) return { x: 0, y: 0 };
    const swapped = rotation % 180 !== 0;
    const w = swapped ? naturalSize.h : naturalSize.w;
    const h = swapped ? naturalSize.w : naturalSize.h;
    const maxX = Math.max(0, (w * finalScale - stageSize.width) / 2);
    const maxY = Math.max(0, (h * finalScale - stageSize.height) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y))
    };
  };

  // Re-clamp whenever zoom/rotation change the coverage math, so a pan from
  // a more-zoomed-out state can't leave empty space after zooming back in.
  useEffect(() => {
    setOffset((prev) => clampOffset(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, rotation, stageSize.width, stageSize.height, naturalSize]);

  const onImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setNaturalSize({ w: naturalWidth, h: naturalHeight });
  };

  const beginDrag = (event) => {
    if (!naturalSize) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { startX: event.clientX, startY: event.clientY, origin: offset };
    setDragging(true);
  };
  const onDrag = (event) => {
    if (!dragState.current) return;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    setOffset(clampOffset({ x: dragState.current.origin.x + dx, y: dragState.current.origin.y + dy }));
  };
  const endDrag = () => {
    dragState.current = null;
    setDragging(false);
  };

  const rotate = (delta) => setRotation((r) => (r + delta + 360) % 360);
  const reset = () => { setZoom(1); setRotation(0); setOffset({ x: 0, y: 0 }); };

  const save = () => {
    const image = imgRef.current;
    if (!image || !naturalSize || !stageSize.width) return;
    setSaving(true);

    const k = output.width / stageSize.width; // display-to-output pixel ratio
    const canvas = document.createElement('canvas');
    canvas.width = output.width;
    canvas.height = output.height;
    const ctx = canvas.getContext('2d');
    ctx.translate(output.width / 2, output.height / 2);
    ctx.translate(offset.x * k, offset.y * k);
    ctx.scale(finalScale * k, finalScale * k);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -naturalSize.w / 2, -naturalSize.h / 2, naturalSize.w, naturalSize.h);

    canvas.toBlob((blob) => {
      setSaving(false);
      if (!blob) return;
      onSave(new File([blob], `${type}-${Date.now()}.jpg`, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.92);
  };

  const imageStyle = naturalSize
    ? {
        width: naturalSize.w,
        height: naturalSize.h,
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${finalScale}) rotate(${rotation}deg)`
      }
    : { opacity: 0 };

  return createPortal(
    <div className="profile-crop-modal-shell">
      <Modal
        show={!!file}
        title={`Adjust ${output.label}`}
        subtitle="Drag to reposition, use the slider to zoom in or out."
        onClose={onClose}
        size="lg"
      >
        <div
          ref={stageRef}
          className={`profile-cropper-stage profile-cropper-${type} ${dragging ? 'is-dragging' : ''}`}
          onPointerDown={beginDrag}
          onPointerMove={onDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {imageUrl && (
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Choose the photo crop"
              draggable={false}
              className="profile-cropper-image"
              style={imageStyle}
              onLoad={onImageLoad}
            />
          )}
        </div>

        <div className="profile-cropper-controls">
          <div className="profile-cropper-zoom-row">
            <i className="bi bi-zoom-out" aria-hidden="true" />
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              disabled={!naturalSize}
              aria-label="Zoom"
            />
            <i className="bi bi-zoom-in" aria-hidden="true" />
          </div>

          <div className="profile-cropper-rotate-row">
            {output.rotatable && (
              <>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => rotate(-90)} disabled={!naturalSize}>
                  <i className="bi bi-arrow-counterclockwise me-1" /> Rotate left
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => rotate(90)} disabled={!naturalSize}>
                  <i className="bi bi-arrow-clockwise me-1" /> Rotate right
                </button>
              </>
            )}
            <button type="button" className="mini-link" onClick={reset} disabled={!naturalSize}>
              Reset
            </button>
          </div>
        </div>

        <p className="profile-cropper-help">
          <i className="bi bi-arrows-move" aria-hidden="true" /> Drag the photo to reposition it within the frame.
        </p>
        <div className="profile-editor-footer">
          <button className="btn btn-outline-secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-brand" type="button" onClick={save} disabled={!naturalSize || saving}>
            {saving ? 'Saving...' : 'Save photo'}
          </button>
        </div>
      </Modal>
    </div>,
    document.body
  );
}
