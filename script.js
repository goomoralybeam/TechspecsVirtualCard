/* =========================================================
   TechSpecs — digital business card
   Theme: Black · Brand green · White
   ========================================================= */

const FEEDBACK_MS = 2000;
const DEFAULT_SLUG = "robert";

/** @type {string|null} */
let activeSlug = null;
/** @type {object|null} */
let activeProfile = null;
/** @type {string|null} */
let vcardObjectUrl = null;

const FALLBACK_COMPANY_INFO = {
  addressDisplay: "21/12 Luther James Close, Doolandella QLD 4077",
  addressMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=21%2F12%20Luther%20James%20Close%2C%20Doolandella%20QLD%204077",
  addressStreet: "21/12 Luther James Close",
  addressLocality: "Doolandella",
  addressRegion: "QLD",
  addressPostcode: "4077",
  addressCountry: "Australia",
  hoursDisplay: "",
  websiteDisplay: "techspecs.com.au",
  websiteUrl: "https://techspecs.com.au",
  qrImage: "assets/qr-website.png",
  qrUrl: "https://techspecs.com.au",
  qrLabel: "Scan for website"
};

const FALLBACK_PROFILE = {
  fullName: "Robert Piez",
  role: "Owner / Manager",
  company: "TechSpecs",
  mobileDisplay: "",
  mobileLink: "",
  businessDisplay: "",
  businessLink: "",
  email: "robert@techspecs.com.au",
  slogan: "Outdoor Living. Engineered",
  avatar: "assets/icon-512.png?v=20261027k",
  cover: "assets/cover.jpg",
  shareImage: "assets/share-logo.png",
  cardQrImage: "assets/qr-card-robert.png",
  cardQrUrl: "https://goomoralybeam.github.io/TechspecsVirtualCard/?person=robert",
  cardQrLabel: "Scan for this card",
  ...FALLBACK_COMPANY_INFO
};

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("directory") === "true") {
    showDirectory();
    return;
  }

  const selected = getSelectedPerson();

  if (!selected.profile) {
    showNotFound();
    return;
  }

  showCard();
  applyProfile(selected.slug, selected.profile);
  wireActions();
});

function getPeopleRegistry() {
  if (typeof people === "object" && people !== null) {
    return people;
  }
  return {};
}

function getCompanyInfo() {
  if (typeof companyInfo === "object" && companyInfo !== null) {
    return companyInfo;
  }
  return FALLBACK_COMPANY_INFO;
}

function withCompanyInfo(profile) {
  if (!profile) return null;
  return Object.assign({}, getCompanyInfo(), profile);
}

function getSelectedPerson() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("person");
  const trimmed = raw == null ? "" : String(raw).trim();
  const requestedSlug = trimmed ? trimmed.toLowerCase() : DEFAULT_SLUG;
  const registry = getPeopleRegistry();

  let profile = Object.prototype.hasOwnProperty.call(registry, requestedSlug)
    ? registry[requestedSlug]
    : null;

  if (!profile && requestedSlug === DEFAULT_SLUG) {
    profile = registry[DEFAULT_SLUG] || FALLBACK_PROFILE;
  }

  if (!profile && trimmed && requestedSlug !== DEFAULT_SLUG) {
    return { slug: requestedSlug, profile: null };
  }

  const resolved = profile || FALLBACK_PROFILE;

  return {
    slug: requestedSlug || DEFAULT_SLUG,
    profile: withCompanyInfo(resolved)
  };
}

function showCard() {
  setViewVisibility({ card: true, notFound: false, directory: false });
}

function showNotFound() {
  setViewVisibility({ card: false, notFound: true, directory: false });
  document.title = "Contact not found · TechSpecs";
  const back = document.getElementById("btn-back-home");
  if (back) {
    back.href = "./?person=" + encodeURIComponent(DEFAULT_SLUG);
  }
}

function showDirectory() {
  setViewVisibility({ card: false, notFound: false, directory: true });
  document.title = "Our Team · TechSpecs";
  renderDirectory();
}

function setViewVisibility({ card, notFound, directory }) {
  const cardEl = document.getElementById("view-card");
  const notFoundEl = document.getElementById("view-not-found");
  const directoryEl = document.getElementById("view-directory");
  if (cardEl) cardEl.hidden = !card;
  if (notFoundEl) notFoundEl.hidden = !notFound;
  if (directoryEl) directoryEl.hidden = !directory;
}

function filled(value) {
  return String(value == null ? "" : value).trim().length > 0;
}

function setRowVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.hidden = !visible;
}

function cardPageUrl(slug) {
  const url = new URL(window.location.href);
  url.searchParams.delete("directory");
  url.searchParams.set("person", slug);
  url.hash = "";
  return url.toString();
}

function applyProfile(slug, profile) {
  activeSlug = slug;
  activeProfile = profile;

  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.getAttribute("data-field");
    if (key === "slogan") return;
    if (key && Object.prototype.hasOwnProperty.call(profile, key)) {
      el.textContent = profile[key] || "";
    }
  });
  renderSlogan(profile);

  const title = `${profile.fullName} · ${profile.company}`;
  const description = [profile.role, profile.company, profile.slogan]
    .filter(filled)
    .join(". ");

  document.title = title;
  setMeta("meta-description", "content", description);
  setMeta("meta-author", "content", `${profile.fullName}, ${profile.company}`);
  setMeta("og-title", "content", title);
  setMeta("og-description", "content", description);
  const shareImage = profile.shareImage || "assets/share-logo.png";
  setMeta("og-image", "content", shareImage);
  setMeta("twitter-title", "content", title);
  setMeta("twitter-description", "content", description);
  setMeta("twitter-image", "content", shareImage);

  const cover = document.getElementById("cover-image");
  if (cover) {
    cover.src = profile.cover;
    cover.alt = `${profile.company} cover`;
  }

  const avatar = document.getElementById("profile-image");
  if (avatar) {
    avatar.src = profile.avatar;
    avatar.alt = profile.fullName;
  }

  const showWebsiteQr = filled(profile.qrUrl) && filled(profile.qrImage);
  setRowVisible("link-qr", showWebsiteQr);
  const qrImage = document.getElementById("qr-image");
  const qrLabel = document.getElementById("qr-label");
  const qr = document.getElementById("link-qr");
  if (showWebsiteQr && qrImage && qr && qrLabel) {
    qrImage.src = profile.qrImage;
    qrImage.alt = `QR code linking to ${profile.websiteDisplay || profile.qrUrl}`;
    qrLabel.textContent = profile.qrLabel || "Scan for website";
    qr.href = profile.qrUrl;
    qr.target = "_blank";
    qr.rel = "noopener noreferrer";
    qr.setAttribute("aria-label", `Scan or tap QR code to open ${profile.qrUrl}`);
  }

  const cardUrl = filled(profile.cardQrUrl) ? profile.cardQrUrl : cardPageUrl(slug);
  const cardQrImage = document.getElementById("qr-card-image");
  const cardQrLabel = document.getElementById("qr-card-label");
  const qrCard = document.getElementById("link-qr-card");
  if (cardQrImage && profile.cardQrImage) {
    cardQrImage.src = profile.cardQrImage;
    cardQrImage.alt = `QR code linking to ${profile.fullName}'s digital business card`;
  }
  if (cardQrLabel) {
    cardQrLabel.textContent = profile.cardQrLabel || "This card";
  }
  if (qrCard) {
    qrCard.hidden = false;
    qrCard.href = cardUrl;
    qrCard.removeAttribute("target");
    qrCard.setAttribute(
      "aria-label",
      `Open ${profile.fullName}'s digital business card`
    );
  }

  const qrSection = document.getElementById("qr-section");
  if (qrSection) qrSection.hidden = !(showWebsiteQr || qrCard);

  setRowVisible("link-mobile", filled(profile.mobileDisplay) && filled(profile.mobileLink));
  setRowVisible("link-business", filled(profile.businessDisplay) && filled(profile.businessLink));
  setRowVisible("link-email", filled(profile.email));
  setRowVisible("link-website", filled(profile.websiteUrl));
  setRowVisible("link-address", filled(profile.addressDisplay));
  setRowVisible("row-hours", filled(profile.hoursDisplay));

  const slogan = document.querySelector(".slogan");
  if (slogan) slogan.hidden = !filled(profile.slogan);

  const mobile = document.getElementById("link-mobile");
  const business = document.getElementById("link-business");
  const email = document.getElementById("link-email");
  const website = document.getElementById("link-website");
  const address = document.getElementById("link-address");

  if (mobile && filled(profile.mobileLink)) {
    mobile.href = `tel:${profile.mobileLink}`;
    mobile.setAttribute("aria-label", `Call mobile ${profile.mobileDisplay}`);
  }
  if (business && filled(profile.businessLink)) {
    business.href = `tel:${profile.businessLink}`;
    business.setAttribute("aria-label", `Call business phone ${profile.businessDisplay}`);
  }
  if (email && filled(profile.email)) {
    email.href = `mailto:${profile.email}`;
    email.setAttribute("aria-label", `Email ${profile.email}`);
  }
  if (website && filled(profile.websiteUrl)) {
    website.href = profile.websiteUrl;
    website.target = "_blank";
    website.rel = "noopener noreferrer";
    website.setAttribute(
      "aria-label",
      `Visit ${profile.websiteDisplay || profile.websiteUrl} (opens in a new tab)`
    );
  }
  if (address && filled(profile.addressMapsUrl)) {
    address.href = profile.addressMapsUrl;
    address.target = "_blank";
    address.rel = "noopener noreferrer";
    address.setAttribute(
      "aria-label",
      `Open address ${profile.addressDisplay} in maps (opens in a new tab)`
    );
  }

  updateSaveLink(profile);
}

function renderSlogan(profile) {
  const slogan = document.querySelector(".slogan");
  if (!slogan) return;
  const text = filled(profile.slogan) ? String(profile.slogan).trim() : "";
  slogan.replaceChildren();
  if (!text) return;

  const splitAt = text.indexOf(".");
  const lead = document.createElement("span");
  lead.className = "slogan-lead";
  const rest = document.createElement("span");
  rest.className = "slogan-rest";

  if (splitAt === -1) {
    lead.textContent = text;
    slogan.append(lead);
    return;
  }

  lead.textContent = text.slice(0, splitAt + 1);
  rest.textContent = text.slice(splitAt + 1).trim();
  slogan.append(lead, document.createTextNode(" "), rest);
}

function setMeta(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.setAttribute(attr, value);
}

function wireActions() {
  const saveBtn = document.getElementById("btn-save");
  const copyBtn = document.getElementById("btn-copy");
  const shareBtn = document.getElementById("btn-share");
  const fallbackClose = document.getElementById("fallback-close");
  const fallback = document.getElementById("copy-fallback");

  if (saveBtn) {
    saveBtn.addEventListener("click", (event) => {
      if (!activeProfile) return;
      updateSaveLink(activeProfile);
      if (!vcardObjectUrl) return;
      event.preventDefault();
      triggerBlobDownload(vcardObjectUrl, saveBtn.getAttribute("download") || "contact.vcf");
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      void handleCopyDetails(copyBtn);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      void handleShare(shareBtn);
    });
  }

  if (fallbackClose && fallback) {
    fallbackClose.addEventListener("click", () => {
      fallback.hidden = true;
    });

    fallback.addEventListener("click", (event) => {
      if (event.target === fallback) {
        fallback.hidden = true;
      }
    });
  }
}

function renderDirectory() {
  const list = document.getElementById("directory-list");
  if (!list) return;
  list.replaceChildren();

  const registry = getPeopleRegistry();
  const entries = Object.keys(registry).length
    ? registry
    : { [DEFAULT_SLUG]: FALLBACK_PROFILE };

  Object.keys(entries).forEach((slug) => {
    const profile = entries[slug];
    const li = document.createElement("li");
    li.className = "directory-item";

    const link = document.createElement("a");
    link.className = "directory-link";
    link.href = `?person=${encodeURIComponent(slug)}`;
    link.setAttribute(
      "aria-label",
      `Open digital business card for ${profile.fullName}, ${profile.role}`
    );

    const img = document.createElement("img");
    img.className = "directory-avatar";
    img.src = profile.avatar;
    img.alt = "";
    img.width = 64;
    img.height = 64;
    img.decoding = "async";

    const text = document.createElement("span");
    text.className = "directory-text";

    const name = document.createElement("span");
    name.className = "directory-name";
    name.textContent = profile.fullName;

    const role = document.createElement("span");
    role.className = "directory-role";
    role.textContent = profile.role;

    text.append(name, role);
    link.append(img, text);
    li.append(link);
    list.append(li);
  });
}

function buildDetailsText(profile) {
  const lines = [profile.fullName, profile.role, profile.company];
  if (filled(profile.mobileDisplay)) lines.push(`Mobile: ${profile.mobileDisplay}`);
  if (filled(profile.businessDisplay)) lines.push(`Business: ${profile.businessDisplay}`);
  if (filled(profile.email)) lines.push(`Email: ${profile.email}`);
  if (filled(profile.websiteUrl)) lines.push(`Website: ${profile.websiteUrl}`);
  if (filled(profile.addressDisplay)) lines.push(`Address: ${profile.addressDisplay}`);
  if (filled(profile.hoursDisplay)) {
    lines.push(`Opening hours: ${String(profile.hoursDisplay).replace(/\n/g, "; ")}`);
  }
  if (filled(profile.slogan)) lines.push(profile.slogan);
  return lines.filter(filled).join("\n");
}

async function handleCopyDetails(button) {
  if (!activeProfile) return;
  const text = buildDetailsText(activeProfile);
  const label = button.querySelector(".btn-label");
  const original = label ? label.textContent : "Copy";
  const ok = await copyText(text);
  if (ok) {
    setTemporaryLabel(label, "Details copied", original);
  } else {
    showCopyFallback(text);
  }
}

async function handleShare(button) {
  if (!activeProfile || !activeSlug) return;
  const label = button.querySelector(".btn-label");
  const original = label ? label.textContent : "Share";
  const shareUrl = cardPageUrl(activeSlug);
  const shareData = {
    title: document.title,
    text: `${activeProfile.fullName} · ${activeProfile.role} at ${activeProfile.company}`,
    url: shareUrl
  };

  if (typeof navigator.share === "function") {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) {
        return;
      }
    }
  }

  const ok = await copyText(shareUrl);
  if (ok) {
    setTemporaryLabel(label, "Link copied", original);
  } else {
    showCopyFallback(shareUrl);
  }
}

async function copyText(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fall through to the legacy copy path.
    }
  }
  return legacyCopy(text);
}

function legacyCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  area.style.top = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();

  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (_) {
    success = false;
  }

  document.body.removeChild(area);
  return success;
}

function showCopyFallback(text) {
  const panel = document.getElementById("copy-fallback");
  const field = document.getElementById("fallback-text");
  if (!panel || !field) {
    window.prompt("Copy these details:", text);
    return;
  }
  field.value = text;
  panel.hidden = false;
  field.focus();
  field.select();
}

function setTemporaryLabel(labelEl, temporary, original) {
  if (!labelEl) return;
  labelEl.textContent = temporary;
  window.setTimeout(() => {
    labelEl.textContent = original;
  }, FEEDBACK_MS);
}

function escapeVCardValue(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function splitName(fullName) {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts.slice(0, -1).join(" "),
    last: parts[parts.length - 1]
  };
}

function buildVCard(profile) {
  const { first, last } = splitName(profile.fullName);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(last)};${escapeVCardValue(first)};;;`,
    `FN:${escapeVCardValue(profile.fullName)}`,
    `ORG:${escapeVCardValue(profile.company)}`,
    `TITLE:${escapeVCardValue(profile.role)}`
  ];

  if (filled(profile.mobileLink)) {
    lines.push(`TEL;TYPE=CELL:${escapeVCardValue(profile.mobileLink)}`);
  }
  if (filled(profile.businessLink)) {
    lines.push(`TEL;TYPE=WORK,VOICE:${escapeVCardValue(profile.businessLink)}`);
  }
  if (filled(profile.email)) {
    lines.push(`EMAIL;TYPE=WORK:${escapeVCardValue(profile.email)}`);
  }
  if (filled(profile.websiteUrl)) {
    lines.push(`URL:${escapeVCardValue(profile.websiteUrl)}`);
  }
  if (filled(profile.addressDisplay)) {
    const adr = [
      "",
      "",
      profile.addressStreet || "",
      profile.addressLocality || "",
      profile.addressRegion || "",
      profile.addressPostcode || "",
      profile.addressCountry || ""
    ]
      .map(escapeVCardValue)
      .join(";");
    lines.push(`ADR;TYPE=WORK:${adr}`);
  }

  const note = [profile.slogan, profile.hoursDisplay].filter(filled).join("\n");
  if (filled(note)) lines.push(`NOTE:${escapeVCardValue(note)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

function filenameFromProfile(profile) {
  return (
    String(profile.fullName)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + ".vcf"
  );
}

function updateSaveLink(profile) {
  const btn = document.getElementById("btn-save");
  if (!btn) return;

  const filename = filenameFromProfile(profile) || "contact.vcf";
  btn.setAttribute("download", filename);
  btn.setAttribute("aria-label", `Save contact as vCard for ${profile.fullName}`);

  if (typeof Blob === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) {
    btn.href = "contact.vcf";
    return;
  }

  if (vcardObjectUrl) {
    URL.revokeObjectURL(vcardObjectUrl);
    vcardObjectUrl = null;
  }

  const blob = new Blob([buildVCard(profile)], {
    type: "text/vcard;charset=utf-8"
  });
  vcardObjectUrl = URL.createObjectURL(blob);
  btn.href = vcardObjectUrl;
}

function triggerBlobDownload(objectUrl, filename) {
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
