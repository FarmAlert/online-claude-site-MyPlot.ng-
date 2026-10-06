/*
  MYPLOT LISTINGS DATA
  ---------------------------------------------------------
  This is the single file to edit to add, remove, or update
  listings shown on the BuyMyPlot page. No HTML editing needed.

  Every entry here is a real, verified estate, rendered in the same
  large card format, in the order listed below. There is no illustrative
  "example" listing anymore: when MyPlot has a real listing, it gets
  added here; until then, nothing is shown in its place.

  HOW TO ADD A NEW LISTING:
  Copy an existing entry below, give it a unique "id", and fill
  in your details. Save the file. The site will pick it up
  automatically on next page load. New entries can be placed
  anywhere in the array, the order below is the display order,
  top to bottom.

  FIELD GUIDE:
  - id:            unique short code, no spaces (e.g. "city-stone-01")
  - name:          the estate or plot name shown as the title
  - location:      district, Abuja (shown as text on the listing card)
  - district:       the district name exactly as it appears in the explorer
                      (e.g. "Lugbe", "Gwarinpa", "Guzape"), not case sensitive.
                      This is what links a listing to its spot in the district
                      explorer, so a "FOR SALE" badge shows on the right pin
                      and this listing appears when that district is clicked.
                      If a listing's real location isn't one of the 16 tracked
                      districts, map it to whichever tracked district is
                      geographically or price tier closest, and keep using
                      the real address in "location" above so buyers still
                      see the accurate spot.
  - propertyType:  "land" or "building"
                      "land"     = vacant plot, nothing built yet
                      "building" = a structure already exists on it
  - verification:  "LOW RISK" | "MEDIUM RISK" | "HIGH RISK" | "LAND ONLY"
                      Use "LOW RISK" etc. for land that has fully passed
                      CheckMyPlot Assurance.
                      Use "LAND ONLY" only when propertyType is "building"
                      and the structure itself has NOT been independently
                      verified, only the underlying land title has.
  - verificationText: (optional) the wording shown on the badge instead of
                      "verification", e.g. "TITLE VERIFIED" for a building
                      whose land title is verified.
  - ribbon:        (optional) text of the gold ribbon on the card. Defaults to
                      "Founding Estate · Now Selling".
  - approvedNote:  (optional) the line under the location. Defaults to
                      "FCDA Approved Estate Plot".
  - imageNote:     short caption under the thumbnail, use this to say
                      "Illustrative renders" whenever the images shown
                      are architect mockups and not photos of something
                      that actually exists yet.
  - units:         an array of one or more { size, label, price, wasPrice }
                      for a simple single-plot listing, use one entry.
                      for an estate with multiple plot sizes / house types,
                      list each option as its own entry, exactly like
                      City Stone Estate below. Any number of units is fine,
                      the card lays them out three per row automatically.
  - description:   one or two honest sentences about the listing.
  ---------------------------------------------------------
*/

const MYPLOT_LISTINGS = [

  {
    id: "solar-city-apo-01",
    name: "Solar City Apo",
    location: "Apo, Burum West District, Abuja",
    district: "lugbe",
    propertyType: "land",
    verification: "LOW RISK",
    imageNote: "Illustrative renders showing the kind of home each plot size supports.",
    description: "FCDA C of O. Listed on behalf of Lamblight Greenfield Limited. Gated estate with 24-hour surveillance, a well planned vicinity, recreation spaces, a dedicated security network, and scenic views.",
    units: [
      { size: "170 sqm", label: "Land plot", price: "₦9,000,000", wasPrice: "" },
      { size: "250 sqm", label: "Land plot", price: "₦13,400,000", wasPrice: "" },
      { size: "350 sqm", label: "Land plot", price: "₦19,000,000", wasPrice: "" },
      { size: "450 sqm", label: "Land plot", price: "₦24,000,000", wasPrice: "" },
      { size: "600 sqm", label: "Land plot", price: "₦31,800,000", wasPrice: "" },
      { size: "1,000 sqm", label: "Land plot", price: "₦54,000,000", wasPrice: "" }
    ]
  },

  {
    id: "the-embassy-wasa-01",
    name: "The Embassy",
    location: "Wasa District, Abuja",
    district: "kuje",
    propertyType: "land",
    verification: "LOW RISK",
    imageNote: "Illustrative renders showing the kind of home each plot size supports.",
    description: "Pre-sale pricing with instant allocation and FCDA C of O, listed on behalf of Lamblight Greenfield Limited (RC 9462329).",
    units: [
      { size: "150 sqm", label: "3 Bedroom Terrace Duplex", price: "₦7,500,000", wasPrice: "" },
      { size: "250 sqm", label: "4 Bedroom Semi Detached", price: "₦12,500,000", wasPrice: "" },
      { size: "350 sqm", label: "4 Bedroom Fully Detached", price: "₦17,500,000", wasPrice: "" },
      { size: "450 sqm", label: "5 Bedroom Fully Detached with BQ", price: "₦22,500,000", wasPrice: "" },
      { size: "1,000 sqm", label: "Block of Flats", price: "₦50,000,000", wasPrice: "" }
    ]
  },

  {
    id: "prestige-gardens-asokoro-01",
    name: "Prestige Gardens",
    location: "Asokoro 2, Abuja",
    district: "asokoro",
    propertyType: "land",
    verification: "LOW RISK",
    imageNote: "Illustrative renders showing the kind of home each plot size supports.",
    description: "FCDA approved estate in Asokoro 2, listed on behalf of OCONY Properties & Investment. Gated, with neighbourhood CCTV, adequate water supply, and a dedicated recreational center.",
    units: [
      { size: "250 sqm", label: "Semi Detached", price: "₦25,000,000", wasPrice: "" },
      { size: "500 sqm", label: "Fully Detached", price: "₦40,000,000", wasPrice: "" },
      { size: "Off-plan", label: "3 Bedroom Maisonette", price: "₦150,000,000", wasPrice: "" }
    ]
  },

  {
    id: "city-stone-estate-01",
    name: "City Stone Estate",
    location: "Kabusa-Shereti District, Abuja",
    district: "lugbe",
    propertyType: "land",
    verification: "LOW RISK",
    imageNote: "Illustrative architect renders. Land only, nothing has been built yet.",
    description: "FCDA approved estate plots along the tarred Kabusa-Sheretti Road. Renders show the kind of home each plot size supports, they are concept designs, not existing structures.",
    units: [
      { size: "500 sqm", label: "Sized for a 5 Bedroom Fully Detached Duplex", price: "₦18,500,000", wasPrice: "₦24,800,000" },
      { size: "300 sqm", label: "Sized for a 4 Bedroom Semi Detached Duplex", price: "₦11,700,000", wasPrice: "₦14,900,000" },
      { size: "200 sqm", label: "Sized for a 4 Bedroom Terrace Duplex", price: "₦7,800,000", wasPrice: "₦10,000,000" }
    ]
  },

  {
    id: "the-nexus-residence-apo-01",
    name: "The Nexus Residence",
    location: "CBN Estate, Apo, Abuja",
    district: "lugbe",
    propertyType: "building",
    verification: "LAND ONLY",
    verificationText: "TITLE VERIFIED",
    ribbon: "Limited Offer · Now Selling Off-Plan",
    approvedNote: "FCDA C of O · Title verified by MyPlot",
    imageNote: "Artist's impressions. The home is under construction and delivered fully finished.",
    description: "A smart 5-bedroom terrace over three floors with two master suites, three walk-in closets and a boys' quarters with its own WC. Whole-home automation is wired in during the build and included in the price. Part of a 37-home estate with an on-site school, landscaped streets and dedicated parking. Price and availability subject to change without notice.",
    units: [
      { size: "5 Bedroom Terrace", label: "Smart system included · delivered finished", price: "₦325,000,000", wasPrice: "" }
    ]
  }

];
