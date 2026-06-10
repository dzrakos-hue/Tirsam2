import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "fr";

type Dict = Record<string, { ar: string; fr: string }>;

const dict: Dict = {
  // nav
  "nav.home": { ar: "الرئيسية", fr: "Accueil" },
  "nav.models": { ar: "الموديلات", fr: "Modèles" },
  "nav.about": { ar: "من نحن", fr: "À propos" },
  "nav.faq": { ar: "الأسئلة الشائعة", fr: "FAQ" },
  "nav.contact": { ar: "اتصل بنا", fr: "Contact" },
  "nav.admin": { ar: "لوحة الإدارة", fr: "Admin" },
  "nav.signin": { ar: "تسجيل الدخول", fr: "Connexion" },
  "nav.signout": { ar: "تسجيل الخروج", fr: "Déconnexion" },

  // hero
  "hero.badge": { ar: "وكيل Tirsam المعتمد في الجزائر", fr: "Concessionnaire Tirsam Algérie" },
  "hero.title": { ar: "  اكتشف الشاحنات Tirsam", fr: "Découvrez les Camions Tirsam" },
  "hero.subtitle": {
    ar: "أحدث الموديلات بأفضل الأسعار في الجزائر. توصيل لجميع الولايات وضمان كامل.",
    fr: "Les derniers modèles aux meilleurs prix en Algérie. Livraison toutes wilayas et garantie complète.",
  },
  "hero.cta.models": { ar: "تصفح الموديلات", fr: "Voir les modèles" },
  "hero.cta.whatsapp": { ar: "تواصل واتساب", fr: "WhatsApp" },

  // sections
  "section.featured": { ar: "الموديلات الأكثر طلباً", fr: "Modèles les plus demandés" },
  "section.offers": { ar: "العروض والتخفيضات", fr: "Offres & Promotions" },
  "section.testimonials": { ar: "آراء عملائنا", fr: "Avis clients" },
  "section.why": { ar: "لماذا تختارنا", fr: "Pourquoi nous choisir" },
  "section.all": { ar: "جميع الموديلات", fr: "Tous les modèles" },
  "section.similar": { ar: "موديلات مشابهة", fr: "Modèles similaires" },

  // product
  "product.price": { ar: "السعر", fr: "Prix" },
  "product.dzd": { ar: "دج", fr: "DZD" },
  "product.specs": { ar: "المواصفات", fr: "Caractéristiques" },
  "product.colors": { ar: "الألوان المتوفرة", fr: "Couleurs disponibles" },
  "product.warranty": { ar: "الضمان", fr: "Garantie" },
  "product.order": { ar: "اطلب الآن", fr: "Commander" },
  "product.whatsapp": { ar: "واتساب", fr: "WhatsApp" },
  "product.discount": { ar: "تخفيض", fr: "Promo" },
  "product.no_results": { ar: "لا توجد نتائج", fr: "Aucun résultat" },

  // status
  "status.available": { ar: "متوفر", fr: "Disponible" },
  "status.unavailable": { ar: "غير متوفر", fr: "Indisponible" },
  "status.coming_soon": { ar: "قريباً", fr: "Bientôt" },

  // filters
  "filter.search": { ar: "ابحث عن موديل...", fr: "Rechercher un modèle..." },
  "filter.category": { ar: "النوع", fr: "Catégorie" },
  "filter.all": { ar: "الكل", fr: "Tous" },
  "filter.scooter": { ar: "شاحنات صغيرة", fr: "Camions petits" },
  "filter.moto": { ar: "شاحنات كبيرة", fr: "Camions grands" },
  "filter.price_min": { ar: "السعر الأدنى", fr: "Prix min" },
  "filter.price_max": { ar: "السعر الأعلى", fr: "Prix max" },

  // order form
  "order.title": { ar: "إتمام الطلب", fr: "Finaliser la commande" },
  "order.subtitle": { ar: "املأ البيانات وسنتواصل معك خلال 24 ساعة", fr: "Remplissez le formulaire et nous vous contacterons sous 24h" },
  "order.first_name": { ar: "الاسم", fr: "Prénom" },
  "order.last_name": { ar: "اللقب", fr: "Nom" },
  "order.wilaya": { ar: "الولاية", fr: "Wilaya" },
  "order.commune": { ar: "البلدية", fr: "Commune" },
  "order.address": { ar: "العنوان الكامل", fr: "Adresse complète" },
  "order.phone_1": { ar: "رقم الهاتف الأول", fr: "Téléphone 1" },
  "order.phone_2": { ar: "رقم الهاتف الثاني (اختياري)", fr: "Téléphone 2 (optionnel)" },
  "order.email": { ar: "البريد الإلكتروني (اختياري)", fr: "Email (optionnel)" },
 "order.notes": { ar: "ملاحظات إضافية", fr: "Notes additionnelles" },
 "order.golden_card_number": { ar: "رقم البطاقة الذهبية (اختياري)", fr: "Numéro Carte Edahabia (optionnel)" },
 "order.golden_card_expiry": { ar: "تاريخ انتهاء البطاقة (MM/YY)", fr: "Date d'expiration (MM/AA)" },
  "order.color": { ar: "اختر اللون", fr: "Choisir la couleur" },
  "order.submit": { ar: "تأكيد الطلب", fr: "Confirmer la commande" },
  "order.success": { ar: "تم استلام طلبك بنجاح! سنتواصل معك قريباً.", fr: "Commande reçue ! Nous vous contacterons bientôt." },
  "order.error": { ar: "حدث خطأ، حاول مرة أخرى.", fr: "Erreur, veuillez réessayer." },
  "order.required": { ar: "هذا الحقل مطلوب", fr: "Champ requis" },
  
  // why
  "why.delivery.title": { ar: "توصيل لجميع الولايات", fr: "Livraison 58 wilayas" },
  "why.delivery.desc": { ar: "نوصل لكل ولايات الوطن بأسرع وقت ممكن", fr: "Livraison rapide dans toutes les wilayas d'Algérie" },
  "why.warranty.title": { ar: "ضمان رسمي", fr: "Garantie officielle" },
  "why.warranty.desc": { ar: "ضمان كامل على جميع الموديلات وقطع غيار أصلية", fr: "Garantie complète sur tous les modèles, pièces d'origine" },
  "why.support.title": { ar: "دعم 24/7", fr: "Support 24/7" },
  "why.support.desc": { ar: "فريقنا متاح للإجابة على جميع استفساراتك", fr: "Notre équipe est disponible pour toutes vos questions" },
  "why.price.title": { ar: "أفضل الأسعار", fr: "Meilleurs prix" },
  "why.price.desc": { ar: "أسعار تنافسية وعروض مستمرة طوال السنة", fr: "Prix compétitifs et promotions toute l'année" },

  // footer
  "footer.tagline": { ar: "للشتاحنات  Tirsam في الجزائر", fr: "Concessionnaire officiel Tirsam en Algérie" },
  "footer.links": { ar: "روابط سريعة", fr: "Liens rapides" },
  "footer.legal": { ar: "قانوني", fr: "Légal" },
  "footer.privacy": { ar: "سياسة الخصوصية", fr: "Confidentialité" },
  "footer.terms": { ar: "الشروط والأحكام", fr: "Conditions" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", fr: "Tous droits réservés" },

  // common
  "common.back": { ar: "رجوع", fr: "Retour" },
  "common.loading": { ar: "جاري التحميل...", fr: "Chargement..." },
  "common.save": { ar: "حفظ", fr: "Enregistrer" },
  "common.cancel": { ar: "إلغاء", fr: "Annuler" },
  "common.delete": { ar: "حذف", fr: "Supprimer" },
  "common.edit": { ar: "تعديل", fr: "Modifier" },
  "common.add": { ar: "إضافة", fr: "Ajouter" },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict | string) => string;
  dir: "rtl" | "ltr";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || "ar";
    setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: string) => {
    const entry = dict[key as keyof typeof dict];
    return entry ? entry[lang] : key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function formatPrice(price: number, lang: Lang) {
  const n = new Intl.NumberFormat(lang === "ar" ? "ar-DZ" : "fr-DZ").format(price);
  return `${n} ${lang === "ar" ? "دج" : "DZD"}`;
}
