export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "what-is-a-natal-chart",
    title: "ما هي الخريطة الفلكية؟",
    description: "مقدمة مبسطة لفهم الخريطة الفلكية (Natal Chart) وما تكشفه عن شخصيتك.",
  },
  {
    slug: "zodiac-signs-guide",
    title: "دليل الأبراج الاثني عشر",
    description: "نظرة سريعة على كل برج من الأبراج الـ12 وعنصره وسماته العامة.",
  },
  {
    slug: "houses-explained",
    title: "البيوت الفلكية الاثنا عشر ومعانيها",
    description: "ما هي البيوت الفلكية، ولماذا يُستخدم نظام Whole Sign في بوابة الفلك.",
  },
  {
    slug: "planets-in-astrology",
    title: "الكواكب في علم التنجيم",
    description: "دور كل كوكب في الخريطة الفلكية، من الشمس والقمر إلى الكواكب البعيدة.",
  },
  {
    slug: "how-synastry-works",
    title: "كيف يعمل توافق الأبراج (Synastry)؟",
    description: "شرح مبسط لفكرة مقارنة خريطتين فلكيتين ومعنى الجوانب الفلكية بينهما.",
  },
];
