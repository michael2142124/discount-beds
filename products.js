/* Product catalogue. Names, prices and photos come from the existing discountbedsbelfast.co.uk category pages.
   rank = best-seller order (lower shows first). price = lowest "from" price in pounds. */
(function () {
  var IMG = "https://www.discountbedsbelfast.co.uk/s/cc_images/";
  window.PRODUCTS = [
    // Best sellers (from the current home page)
    { id: "armagh", cat: "ottoman", name: "Armagh Ottoman Storage Bed", price: 479, detail: "Double £479, kingsize £529", img: "teaserbox_2495040385.jpg", rank: 1, link: "ottoman-offer.html" },
    { id: "states", cat: "bunk", name: "States Triple Sleeper", price: 560, detail: "Available in 2 colours", img: "teaserbox_2476050367.jpg", rank: 2 },
    { id: "mia", cat: "ottoman", name: "Mia Ottoman Bed, Taupe", price: 520, detail: "Double £520, kingsize £580", img: "teaserbox_2492310231.jpg", rank: 3 },
    { id: "roma", cat: "sofa", name: "Roma 3 & 2 Seater Recliner", price: 869, was: 939, detail: "Grey or black", img: "cache_2492659022.jpg", rank: 4 },
    { id: "neptune", cat: "bunk", name: "Neptune Bunk Bed", price: 300, detail: "Frame only, or £479 with mattresses", img: "teaserbox_2454993489.jpg", rank: 5 },
    { id: "texas", cat: "bunk", name: "Texas Bunk Bed", price: 640, detail: "Sonoma oak, grey oak or white", img: "teaserbox_2482213892.jpg", rank: 6 },

    // Mattresses
    { id: "sapphire", cat: "mattress", name: "Sapphire Mattress", price: 100, detail: "3ft £100, 4ft6 £140, 5ft £180", img: "teaserbox_2487343283.png", rank: 7 },
    { id: "honeyb2000", cat: "mattress", name: "Honey B 2000 Pocket Mattress", price: 159, detail: "Pocket sprung", img: "teaserbox_2490776940.jpg", rank: 8 },
    { id: "memorymaster", cat: "mattress", name: "Memory Master Mattress", price: 160, detail: "Memory foam", img: "teaserbox_2491384008.jpeg", rank: 9 },
    { id: "ravello", cat: "mattress", name: "Ravello 1500 Pocket Mattress", price: 340, detail: "1500 pocket springs", img: "teaserbox_2492310242.jpg", rank: 14 },
    { id: "wagner", cat: "mattress", name: "Wagner Ortho 2000 Firm Mattress", price: 350, detail: "Firm, orthopaedic support", img: "teaserbox_2490404611.jpg", rank: 16 },
    { id: "diamond", cat: "mattress", name: "Diamond 4000 Luxury Mattress", price: 600, detail: "4000 pocket springs", img: "teaserbox_2493664984.jpg", rank: 20 },

    // Ottoman beds
    { id: "nevada", cat: "ottoman", name: "Nevada Ottoman Bed", price: 300, detail: "Single £300, small double and double £360", img: "teaserbox_2492658873.jpg", rank: 10 },
    { id: "denver", cat: "ottoman", name: "Denver Ottoman Bed", price: 430, detail: "Double £430, king £480, super king £540", img: "teaserbox_2492851101.jpg", rank: 12 },
    { id: "langham", cat: "ottoman", name: "Langham Ottoman Bed, Teal", price: 630, detail: "Double £630, king £690, super king £750", img: "teaserbox_2487362943.jpg", rank: 22 },

    // Divan beds
    { id: "sapphire-divan", cat: "divan", name: "Sapphire Divan Bed", price: 200, detail: "Drawers and headboard optional extras", img: "teaserbox_2489208356.png", rank: 11 },
    { id: "candy-divan", cat: "divan", name: "Candy Divan Bed", price: 260, detail: "Drawers and headboard optional extras", img: "teaserbox_2491456677.jpg", rank: 17 },
    { id: "halo-divan", cat: "divan", name: "Halo Divan Bed", price: 310, detail: "Drawers and headboard optional extras", img: "teaserbox_2491456682.png", rank: 19 },

    // Upholstered beds
    { id: "prado", cat: "upholstered", name: "Prado Grey Fabric Bed", price: 170, detail: "Grey fabric", img: "teaserbox_2481006873.jpg", rank: 13 },
    { id: "rialto", cat: "upholstered", name: "Rialto Bed", price: 210, detail: "Storage version from £360", img: "teaserbox_2472760504.jpg", rank: 18 },
    { id: "amelia", cat: "upholstered", name: "Amelia Bed Frame", price: 230, detail: "Storage version from £340", img: "teaserbox_2487925957.jpg", rank: 21 },
    { id: "clara", cat: "upholstered", name: "Clara Side Lift Storage Bed", price: 340, detail: "Side-opening storage", img: "teaserbox_2495059532.jpg", rank: 23 },

    // Bunk and kids beds
    { id: "orlando", cat: "bunk", name: "Orlando Low Sleeper", price: 270, detail: "Low sleeper with storage", img: "teaserbox_2491050004.jpg", rank: 15 },
    { id: "hector", cat: "bunk", name: "Hector Bunk Bed", price: 340, detail: "Small double version from £380", img: "teaserbox_2495360971.png", rank: 24 },
    { id: "vision", cat: "bunk", name: "Vision Mid Sleeper", price: 460, detail: "High sleeper version from £510", img: "teaserbox_2495059584.jpg", rank: 25 },

    // Sofa beds
    { id: "luna", cat: "sofa", name: "Luna Sofa Bed", price: 359, detail: "Pull-out sofa bed", img: "teaserbox_2494551753.jpg", rank: 26 },
    { id: "chelsea-sofa", cat: "sofa", name: "Chelsea Sofa Bed", price: 379, detail: "Sofa bed", img: "teaserbox_2427198719.jpg", rank: 27 },
    { id: "shelby", cat: "sofa", name: "Shelby Sofa Bed", price: 530, detail: "Sofa bed", img: "teaserbox_2494551754.jpg", rank: 28 }
  ].map(function (p) { p.img = IMG + p.img; return p; });

  window.CATEGORIES = {
    mattress: "Mattress",
    ottoman: "Ottoman bed",
    divan: "Divan bed",
    upholstered: "Upholstered bed",
    bunk: "Bunk or kids bed",
    sofa: "Sofa or sofa bed"
  };
})();
