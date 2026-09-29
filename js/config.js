/* Site settings. Everything the shop needs to fill in before launch lives here.
   Blank values are safe: the related feature simply stays switched off. See SETUP.md. */
window.SITE_CONFIG = {
  // Google Analytics 4 measurement ID, e.g. "G-AB12CD34EF". Only loads after the visitor accepts analytics cookies.
  ga4Id: "",

  // Where the callback / reservation forms POST to (e.g. a Formspree endpoint "https://formspree.io/f/xxxxxx").
  // Blank = demo mode: the thank-you message shows but nothing is sent.
  formEndpoint: "",

  // Call tracking. Each traffic source (or page) can show its own forwarding number so calls can be
  // attributed to it. Blank numbers fall back to the main shop number.
  phone: {
    main: { display: "028 9045 3723", tel: "+442890453723" },
    bySource: {
      // utm_source value: { display, tel }
      // google:   { display: "028 9000 0001", tel: "+442890000001" },
      // facebook: { display: "028 9000 0002", tel: "+442890000002" }
    },
    byPage: {
      // page id (set on <body data-page="...">): { display, tel }
      // "ottoman-offer": { display: "028 9000 0003", tel: "+442890000003" }
    }
  },

  // Google reviews. Paste 2 or 3 REAL reviews (with permission) and the real star rating.
  // The review section only appears once at least one review is added. Never invent reviews.
  reviews: {
    rating: null,          // e.g. 4.8
    count: null,           // e.g. 126
    url: "",               // link to the Google Business Profile reviews
    items: [
      // { text: "Short quote, max about 25 words.", name: "First name + initial", area: "Bangor" }
    ]
  },

  // Showroom photos and video. Add real, professionally shot media here (see SETUP.md).
  showroom: {
    photo: "",             // e.g. "img/showroom.jpg" (1600 x 1000 or larger)
    video: ""              // e.g. a YouTube embed URL "https://www.youtube-nocookie.com/embed/XXXX"
  }
};
