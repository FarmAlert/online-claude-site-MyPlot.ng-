/*
  MYPLOT LISTINGS DATA
  ---------------------------------------------------------
  This is the single file to edit to add, remove, or update
  listings shown on the BuyMyPlot page. No HTML editing needed.

  HOW TO ADD A NEW LISTING:
  Copy an existing entry below, give it a unique "id", and fill
  in your details. Save the file. The site will pick it up
  automatically on next page load.

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
  - founding:      true/false, shows the "Founding Estate" ribbon
  - imageNote:     short caption under the thumbnail, use this to say
                      "Illustrative renders" whenever the images shown
                      are architect mockups and not photos of something
                      that actually exists yet.
  - units:         an array of one or more { size, label, price, wasPrice }
                      for a simple single-plot listing, use one entry.
                      for an estate with multiple plot sizes / house types,
                      list each option as its own entry, exactly like
                      City Stone Estate below.
  - description:   one or two honest sentences about the listing.
  ---------------------------------------------------------
*/

const MYPLOT_LISTINGS = [

  {
    id: "city-stone-estate-01",
    name: "City Stone Estate",
    location: "Kabusa-Shereti District, Abuja",
    district: "lugbe",
    propertyType: "land",
    verification: "LOW RISK",
    founding: true,
    imageNote: "Illustrative architect renders. Land only, nothing has been built yet.",
    description: "FCDA approved estate plots along the tarred Kabusa-Sheretti Road. Renders show the kind of home each plot size supports, they are concept designs, not existing structures.",
    units: [
      { size: "500 sqm", label: "Sized for a 5 Bedroom Fully Detached Duplex", price: "₦18,500,000", wasPrice: "₦24,800,000" },
      { size: "300 sqm", label: "Sized for a 4 Bedroom Semi Detached Duplex", price: "₦11,700,000", wasPrice: "₦14,900,000" },
      { size: "200 sqm", label: "Sized for a 4 Bedroom Terrace Duplex", price: "₦7,800,000", wasPrice: "₦10,000,000" }
    ]
  },

  {
    id: "example-gwarinpa-01",
    name: "750 sqm Residential Plot",
    location: "Gwarinpa, Abuja",
    district: "gwarinpa",
    propertyType: "land",
    verification: "LOW RISK",
    founding: false,
    isExample: true,
    imageNote: "Example listing, for illustration only.",
    description: "Full CheckMyPlot Assurance: title, registry, satellite, on the ground, court, and community checks.",
    units: [
      { size: "750 sqm", label: "Residential plot", price: "₦35,000,000", wasPrice: "" }
    ]
  },

  {
    id: "example-guzape-01",
    name: "4 Bedroom Fully Detached Duplex",
    location: "Guzape, Abuja",
    district: "guzape",
    propertyType: "building",
    verification: "LAND ONLY",
    founding: false,
    isExample: true,
    imageNote: "Example listing, for illustration only.",
    description: "Only the underlying land title has been checked. The building itself, approvals, construction quality, developer track record, has not yet been independently verified.",
    units: [
      { size: "—", label: "4 Bedroom Fully Detached Duplex", price: "₦180,000,000", wasPrice: "" }
    ]
  }

];
