/* =========================================================
   people.js — TechSpecs digital business card
   =========================================================
   HOW TO ADD A NEW EMPLOYEE
   ---------------------------------------------------------
   1. The object KEY is the URL slug, e.g. ?person=robert
   2. Slug must use lowercase letters, numbers or hyphens only
   3. Avatar filename should normally match the slug
   4. Separate each profile object with a comma
   5. Address, website and website QR are shared (companyInfo)
   6. Leave a field as "" to hide that row on the card
   ========================================================= */

/** Details taken from https://www.tech-specs.com.au */
const companyInfo = {
  addressDisplay: "21/12 Luther James Close, Doolandella QLD 4077",
  addressMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=21%2F12%20Luther%20James%20Close%2C%20Doolandella%20QLD%204077",
  addressStreet: "21/12 Luther James Close",
  addressLocality: "Doolandella",
  addressRegion: "QLD",
  addressPostcode: "4077",
  addressCountry: "Australia",
  hoursDisplay: "",
  websiteDisplay: "tech-specs.com.au",
  websiteUrl: "https://www.tech-specs.com.au",
  qrImage: "assets/qr-website.png",
  qrUrl: "https://www.tech-specs.com.au",
  qrLabel: "Scan for website"
};

const people = {
  robert: {
    fullName: "Robert Piez",
    role: "Structural Engineer and Designer",
    company: "TechSpecs",
    mobileDisplay: "",
    mobileLink: "",
    businessDisplay: "",
    businessLink: "",
    email: "robert@patio-tech.com.au",
    slogan: "Outdoor Living. Engineered",
    avatar: "assets/icon-512.png",
    cover: "assets/cover.jpg",
    shareImage: "assets/share-logo.png",
    cardQrImage: "assets/qr-card-robert.png",
    cardQrUrl: "https://goomoralybeam.github.io/TechspecsVirtualCard/?person=robert",
    cardQrLabel: "Scan for this card"
  }
};
