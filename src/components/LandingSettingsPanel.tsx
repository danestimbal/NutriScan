import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_LANDING_SETTINGS, LandingSettings } from '../data/landingSettings';
import { saveLandingSettings, useLandingSettings } from '../hooks/useLandingSettings';

type SectionKey = keyof LandingSettings;
type FieldValue = string | boolean | Record<string, string>[];

const SECTIONS: { key: SectionKey; label: string; icon: string; hint: string }[] = [
  { key: 'hero', label: 'Hero & Background', icon: 'wallpaper', hint: 'Top banner: background photo, headline, buttons, badge' },
  { key: 'theme', label: 'Page Colours', icon: 'palette', hint: 'Tint used behind the alternating bands' },
  { key: 'why', label: 'Why Section', icon: 'help', hint: 'Two oval photos with intro text' },
  { key: 'join', label: 'Sign-up Band', icon: 'person_add', hint: 'Name + email band (shown twice)' },
  { key: 'steps', label: 'How It Works', icon: 'format_list_numbered', hint: 'Four numbered step cards' },
  { key: 'features', label: 'Feature Grid', icon: 'apps', hint: 'Six icon features with a round side photo' },
  { key: 'catalog', label: 'Product Catalog Page', icon: 'storefront', hint: 'Heading and button on the catalog page' },
  { key: 'decoder', label: 'Label Decoder Cards', icon: 'science', hint: 'E-code explanation cards' },
  { key: 'testimonials', label: 'Testimonials', icon: 'reviews', hint: 'Hidden until you add at least one' },
  { key: 'about', label: 'About Panel', icon: 'info', hint: 'Photo on the left, blue panel on the right' },
];

const FIELD_LABELS: Record<string, string> = {
  show: 'Show this section',
  showDecor: 'Show floating decorations',
  titleLead: 'Heading (plain part)',
  titleAccent: 'Heading (blue underlined part)',
  primaryCta: 'Primary button label',
  secondaryCta: 'Secondary button label',
  badgeLine1: 'Photo badge, line 1',
  badgeLine2: 'Photo badge, line 2',
  sealText: 'Rotating seal text',
  backgroundImage: 'Background photo',
  overlayImage: 'Front image over the photo (optional, replaces the scan card)',
  imageOne: 'Left oval photo',
  imageTwo: 'Right oval photo',
  sideImage: 'Round side photo',
  image: 'Photo',
  pageTint: 'Band background colour',
  lead: 'Lead sentence',
  body: 'Body text',
  desc: 'Description',
  icon: 'Icon name (Material Symbols)',
};

const LONG_TEXT = new Set(['subtitle', 'body', 'lead', 'desc', 'quote', 'note']);
const MAX_IMAGE_CHARS = 170_000; // per uploaded image, as a data URL
const MAX_DOC_CHARS = 950_000; // Firestore documents are capped at 1 MiB

const labelFor = (field: string) =>
  FIELD_LABELS[field] ||
  field.replace(/([A-Z0-9])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

const INPUT_CLASS =
  'w-full px-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]';

/** Shrinks an uploaded picture until it fits the per-image budget. WebP keeps transparency for cut-outs. */
async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  let width = Math.min(1600, bitmap.width);
  for (let attempt = 0; attempt < 9; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = Math.round((bitmap.height / bitmap.width) * width);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/webp', 0.78);
    if (url.length <= MAX_IMAGE_CHARS) return url;
    width = Math.round(width * 0.8);
  }
  throw new Error('This image could not be reduced enough. Try a smaller picture or paste an image link instead.');
}

const ImageField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onError: (message: string) => void;
}> = ({ value, onChange, onError }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const isUpload = value.startsWith('data:');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToDataUrl(file));
    } catch (err: any) {
      onError(err?.message || 'Could not read that image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined">image</span>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <input
          type="text"
          value={isUpload ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isUpload ? `Uploaded image (${Math.round(value.length / 1370)} KB)` : 'Paste an image link (https://...)'}
          className={`${INPUT_CLASS} h-10`}
        />
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5379EE] text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            {busy ? 'Processing…' : 'Upload image'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#64748b] text-[11px] font-bold cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const LandingSettingsPanel: React.FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const { setActiveTab } = useApp();
  const live = useLandingSettings();
  const [draft, setDraft] = useState<LandingSettings>(live);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState<SectionKey | null>('hero');

  // Follow live settings until the admin starts editing
  useEffect(() => {
    if (!dirty) setDraft(live);
  }, [live, dirty]);

  const setField = (section: SectionKey, field: string, value: FieldValue) => {
    setDraft((prev) => ({ ...prev, [section]: { ...(prev[section] as object), [field]: value } }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (JSON.stringify(draft).length > MAX_DOC_CHARS) {
      onToast('Too many uploaded images to save. Replace some with image links.');
      return;
    }
    setSaving(true);
    const result = await saveLandingSettings(draft);
    setSaving(false);
    setDirty(false);
    onToast(
      result === 'cloud'
        ? 'Front page published for all visitors.'
        : 'Saved on this device only. Cloud save was rejected (check Firestore rules / sign-in).'
    );
  };

  const renderField = (section: SectionKey, field: string, value: FieldValue) => {
    if (typeof value === 'boolean') {
      return (
        <label key={field} className="flex items-center justify-between gap-3 py-1 cursor-pointer">
          <span className="text-xs font-semibold text-[#1e293b]">{labelFor(field)}</span>
          <button
            type="button"
            role="switch"
            aria-checked={value}
            aria-label={labelFor(field)}
            onClick={() => setField(section, field, !value)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${value ? 'bg-[#5379EE]' : 'bg-slate-300'}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${value ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      );
    }

    if (Array.isArray(value)) {
      const isTestimonials = section === 'testimonials';
      const updateItem = (index: number, key: string, next: string) =>
        setField(section, field, value.map((item, i) => (i === index ? { ...item, [key]: next } : item)));
      return (
        <div key={field} className="space-y-3">
          {value.length === 0 && (
            <p className="text-xs text-[#64748b]">
              Nothing added yet, so this section stays hidden on the front page.
            </p>
          )}
          {value.map((item, index) => (
            <div key={index} className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#64748b]">
                  {isTestimonials ? 'Testimonial' : 'Item'} {index + 1}
                </span>
                {isTestimonials && (
                  <button
                    type="button"
                    onClick={() => setField(section, field, value.filter((_, i) => i !== index))}
                    className="text-[11px] font-bold text-[#e11d48] hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {Object.keys(item).map((key) =>
                LONG_TEXT.has(key) ? (
                  <textarea
                    key={key}
                    value={item[key]}
                    onChange={(e) => updateItem(index, key, e.target.value)}
                    placeholder={labelFor(key)}
                    aria-label={labelFor(key)}
                    rows={2}
                    className={`${INPUT_CLASS} py-2 leading-relaxed`}
                  />
                ) : (
                  <input
                    key={key}
                    type="text"
                    value={item[key]}
                    onChange={(e) => updateItem(index, key, e.target.value)}
                    placeholder={labelFor(key)}
                    aria-label={labelFor(key)}
                    className={`${INPUT_CLASS} h-9`}
                  />
                )
              )}
            </div>
          ))}
          {isTestimonials && (
            <button
              type="button"
              onClick={() => setField(section, field, [...value, { quote: '', name: '', role: '' }])}
              className="px-3.5 py-2 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5379EE] text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add testimonial
            </button>
          )}
        </div>
      );
    }

    const isImage = /image/i.test(field);
    return (
      <div key={field} className="space-y-1">
        <label className="block text-[11px] font-semibold text-[#1e293b]">{labelFor(field)}</label>
        {isImage ? (
          <ImageField value={value} onChange={(next) => setField(section, field, next)} onError={onToast} />
        ) : field === 'pageTint' ? (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#EEF2FF'}
              onChange={(e) => setField(section, field, e.target.value)}
              aria-label={labelFor(field)}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => setField(section, field, e.target.value)}
              className={`${INPUT_CLASS} h-10 max-w-40`}
            />
          </div>
        ) : LONG_TEXT.has(field) ? (
          <textarea
            value={value}
            onChange={(e) => setField(section, field, e.target.value)}
            rows={3}
            className={`${INPUT_CLASS} py-2 leading-relaxed`}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setField(section, field, e.target.value)}
            className={`${INPUT_CLASS} h-10`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="sticky top-16 z-20 bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">web</span>
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#0f172a]">Front Page Settings</h2>
            <p className="text-xs text-[#64748b] truncate">
              {dirty ? 'You have unsaved changes.' : 'Showing what visitors currently see.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('auth')}
            className="px-3.5 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            View front page
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Replace the form with the original default content? Nothing is published until you save.')) {
                setDraft(DEFAULT_LANDING_SETTINGS);
                setDirty(true);
              }
            }}
            className="px-3.5 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold cursor-pointer"
          >
            Load defaults
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => {
              setDraft(live);
              setDirty(false);
            }}
            className="px-3.5 py-2 rounded-full bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a] text-xs font-bold cursor-pointer disabled:opacity-40"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <span className={`material-symbols-outlined text-sm ${saving ? 'animate-spin' : ''}`}>
              {saving ? 'refresh' : 'save'}
            </span>
            {saving ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </div>

      {/* Section editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {SECTIONS.map((meta) => {
          const data = draft[meta.key] as unknown as Record<string, FieldValue>;
          const isOpen = openSection === meta.key;
          const hidden = data.show === false;
          return (
            <div key={meta.key} className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : meta.key)}
                aria-expanded={isOpen}
                className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-[#f8fafc]"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-[#EEF2FF] text-[#5379EE] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">{meta.icon}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0f172a]">{meta.label}</span>
                      {hidden && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#64748b] text-[10px] font-bold">
                          HIDDEN
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-[#64748b] truncate">{meta.hint}</span>
                  </span>
                </span>
                <span className="material-symbols-outlined text-[#64748b]">{isOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-5 pt-1 space-y-3.5 border-t border-slate-100">
                  {Object.keys(data).map((field) => renderField(meta.key, field, data[field]))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
