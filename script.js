import { offers } from "./offers.js";

const offersList = document.querySelector("#offers-list");
const selectedSlug = new URLSearchParams(window.location.search).get("offre") || window.location.hash.slice(1);
const detailPaths = {
  lucya: "code-lucya-cnp/",
  boursorama: "code-parrainage-boursorama/",
  fortuneo: "code-parrainage-fortuneo/"
};

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderOffer(offer) {
  const card = createElement("article", "offer-card");
  card.id = offer.slug;
  card.setAttribute("aria-labelledby", `${offer.id}-name`);

  const top = createElement("div", "offer-card__top");
  const identity = createElement("div");
  const partnerMark = createElement("span", `partner-mark partner-mark--${offer.slug}`, offer.name.slice(0, 2).toUpperCase());
  partnerMark.setAttribute("aria-hidden", "true");
  identity.append(partnerMark);
  identity.append(createElement("h3", "offer-card__name", offer.name));
  identity.querySelector("h3").id = `${offer.id}-name`;
  identity.append(createElement("p", "offer-card__category", offer.category));
  top.append(identity);
  top.append(createElement("span", "eyebrow", offer.featured ? "Sélection" : "Offre"));
  card.append(top);

  card.append(createElement("p", "offer-card__number", offer.bonusLabel));
  card.append(createElement("p", "offer-card__period", `${offer.searchTitle} · ${offer.periodLabel}`));
  card.append(createElement("p", "offer-card__description", offer.description));
  card.append(createElement("p", "offer-card__conditions", offer.conditions));

  const codePanel = createElement("div", "offer-card__code-panel");
  codePanel.append(createElement("span", "offer-card__code-label", "Code de parrainage"));
  codePanel.append(createElement("strong", "offer-card__code", offer.code || "Pas de code nécessaire"));
  card.append(codePanel);

  const action = createElement("a", "offer-card__action", offer.referralUrl ? "Accéder à l’offre officielle" : "Lien à renseigner");
  if (offer.referralUrl) {
    action.href = offer.referralUrl;
    action.target = "_blank";
    action.rel = "sponsored noopener";
  } else {
    action.href = "#offres";
    action.setAttribute("aria-disabled", "true");
    action.addEventListener("click", (event) => event.preventDefault());
  }
  card.append(action);

  const detailLink = createElement("a", "offer-card__details", `Voir la fiche ${offer.name}`);
  detailLink.href = detailPaths[offer.slug] || `?offre=${offer.slug}`;
  card.append(detailLink);

  if (offer.code) {
    const codeButton = createElement("button", "code-button", "Copier le code");
    codeButton.type = "button";
    codeButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(offer.code);
      } catch {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = offer.code;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.append(temporaryInput);
        temporaryInput.select();
        document.execCommand("copy");
        temporaryInput.remove();
      }
      codeButton.textContent = "Code copié";
    });
    card.append(codeButton);
  } else if (!offer.requiresCode) {
    codePanel.classList.add("offer-card__code-panel--link-only");
  }
  return card;
}

const activeOffers = offers.filter((offer) => offer.active);
const selectedOffer = activeOffers.find((offer) => offer.slug === selectedSlug);
const displayedOffers = selectedOffer ? [selectedOffer] : activeOffers;

if (selectedOffer) {
  document.title = `${selectedOffer.searchTitle} | MonCodeParrainage`;
  document.querySelector('meta[name="description"]').content = selectedOffer.searchDescription;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = selectedOffer.searchDescription;
  document.querySelector("#offers-title").textContent = selectedOffer.searchTitle;
  document.querySelector(".hero__lead").textContent = selectedOffer.searchDescription;
  document.querySelector('link[rel="canonical"]').href = `${window.location.origin}${window.location.pathname}?offre=${selectedOffer.slug}`;
}

displayedOffers.forEach((offer) => offersList.append(renderOffer(offer)));

const structuredOffers = displayedOffers
  .filter((offer) => offer.referralUrl && offer.bonusAmount !== null && offer.validThrough)
  .map((offer, position) => ({
    "@type": "ListItem",
    position: position + 1,
    item: {
      "@type": "Offer",
      name: `${offer.name} - ${offer.bonusLabel}`,
      description: offer.description,
      url: offer.referralUrl,
      price: offer.bonusAmount,
      priceCurrency: offer.currency,
      priceValidUntil: offer.validThrough
    }
  }));

if (structuredOffers.length) {
  const structuredData = document.createElement("script");
  structuredData.type = "application/ld+json";
  structuredData.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", itemListElement: structuredOffers });
  document.head.append(structuredData);
}