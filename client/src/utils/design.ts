import type { Shapes } from "./types";

export const netflixShapes: Shapes = [
  // ============================
  // TITLE
  // ============================
  {
    id: "1",
    type: "Text",
    text: "NETFLIX - HIGH LEVEL SYSTEM DESIGN",
    x: 450,
    y: 40,
  },
  {
    id: "2",
    type: "Text",
    text: "Architecture Overview",
    x: 620,
    y: 75,
  },

  // ============================
  // CLIENT LAYER
  // ============================
  {
    id: "3",
    type: "Rectangle",
    x: 500,
    y: 130,
    width: 400,
    height: 85,
    radius: 12,
  },
  {
    id: "4",
    type: "Text",
    text: "CLIENT APPLICATIONS",
    x: 620,
    y: 140,
  },
  {
    id: "5",
    type: "Text",
    text: "Web App  |  Mobile App  |  Smart TV",
    x: 565,
    y: 175,
  },

  // ============================
  // API GATEWAY
  // ============================
  {
    id: "6",
    type: "Rectangle",
    x: 590,
    y: 265,
    width: 220,
    height: 65,
    radius: 12,
  },
  {
    id: "7",
    type: "Text",
    text: "API GATEWAY",
    x: 650,
    y: 290,
  },

  // Client -> Gateway
  {
    id: "8",
    type: "Line",
    x: 700,
    y: 215,
    endX: 700,
    endY: 265,
  },

  // ============================
  // MICROSERVICES
  // ============================

  // Authentication
  {
    id: "9",
    type: "Rectangle",
    x: 80,
    y: 400,
    width: 220,
    height: 85,
    radius: 12,
  },
  {
    id: "10",
    type: "Text",
    text: "AUTH SERVICE",
    x: 130,
    y: 415,
  },
  {
    id: "11",
    type: "Text",
    text: "Login / JWT / Sessions",
    x: 100,
    y: 450,
  },

  // User service
  {
    id: "12",
    type: "Rectangle",
    x: 360,
    y: 400,
    width: 220,
    height: 85,
    radius: 12,
  },
  {
    id: "13",
    type: "Text",
    text: "USER SERVICE",
    x: 410,
    y: 415,
  },
  {
    id: "14",
    type: "Text",
    text: "Profiles / Watch History",
    x: 380,
    y: 450,
  },

  // Catalog
  {
    id: "15",
    type: "Rectangle",
    x: 640,
    y: 400,
    width: 220,
    height: 85,
    radius: 12,
  },
  {
    id: "16",
    type: "Text",
    text: "CATALOG SERVICE",
    x: 685,
    y: 415,
  },
  {
    id: "17",
    type: "Text",
    text: "Movies / Metadata",
    x: 690,
    y: 450,
  },

  // Recommendation
  {
    id: "18",
    type: "Rectangle",
    x: 920,
    y: 400,
    width: 220,
    height: 85,
    radius: 12,
  },
  {
    id: "19",
    type: "Text",
    text: "RECOMMENDATION",
    x: 965,
    y: 415,
  },
  {
    id: "20",
    type: "Text",
    text: "Personalized Suggestions",
    x: 945,
    y: 450,
  },

  // Streaming service
  {
    id: "21",
    type: "Rectangle",
    x: 1200,
    y: 400,
    width: 220,
    height: 85,
    radius: 12,
  },
  {
    id: "22",
    type: "Text",
    text: "STREAM SERVICE",
    x: 1250,
    y: 415,
  },
  {
    id: "23",
    type: "Text",
    text: "Playback / Video URL",
    x: 1230,
    y: 450,
  },

  // Gateway to services
  {
    id: "24",
    type: "Line",
    x: 700,
    y: 330,
    endX: 190,
    endY: 400,
  },
  {
    id: "25",
    type: "Line",
    x: 700,
    y: 330,
    endX: 470,
    endY: 400,
  },
  {
    id: "26",
    type: "Line",
    x: 700,
    y: 330,
    endX: 750,
    endY: 400,
  },
  {
    id: "27",
    type: "Line",
    x: 700,
    y: 330,
    endX: 1030,
    endY: 400,
  },
  {
    id: "28",
    type: "Line",
    x: 700,
    y: 330,
    endX: 1310,
    endY: 400,
  },

  // ============================
  // DATA LAYER
  // ============================

  // User DB
  {
    id: "29",
    type: "Rectangle",
    x: 100,
    y: 590,
    width: 200,
    height: 75,
    radius: 12,
  },
  {
    id: "30",
    type: "Text",
    text: "USER DATABASE",
    x: 140,
    y: 615,
  },

  // Metadata DB
  {
    id: "31",
    type: "Rectangle",
    x: 400,
    y: 590,
    width: 200,
    height: 75,
    radius: 12,
  },
  {
    id: "32",
    type: "Text",
    text: "METADATA DB",
    x: 450,
    y: 615,
  },

  // Redis
  {
    id: "33",
    type: "Rectangle",
    x: 700,
    y: 590,
    width: 200,
    height: 75,
    radius: 12,
  },
  {
    id: "34",
    type: "Text",
    text: "REDIS CACHE",
    x: 755,
    y: 615,
  },

  // Video storage
  {
    id: "35",
    type: "Rectangle",
    x: 1000,
    y: 590,
    width: 200,
    height: 75,
    radius: 12,
  },
  {
    id: "36",
    type: "Text",
    text: "VIDEO STORAGE",
    x: 1050,
    y: 615,
  },

  // CDN
  {
    id: "37",
    type: "Rectangle",
    x: 1250,
    y: 590,
    width: 170,
    height: 75,
    radius: 12,
  },
  {
    id: "38",
    type: "Text",
    text: "CDN",
    x: 1320,
    y: 615,
  },

  // Service -> DB connections
  {
    id: "39",
    type: "Line",
    x: 190,
    y: 485,
    endX: 200,
    endY: 590,
  },
  {
    id: "40",
    type: "Line",
    x: 470,
    y: 485,
    endX: 500,
    endY: 590,
  },
  {
    id: "41",
    type: "Line",
    x: 750,
    y: 485,
    endX: 800,
    endY: 590,
  },
  {
    id: "42",
    type: "Line",
    x: 1310,
    y: 485,
    endX: 1100,
    endY: 590,
  },

  // Video storage -> CDN
  {
    id: "43",
    type: "Line",
    x: 1200,
    y: 627,
    endX: 1250,
    endY: 627,
  },

  // ============================
  // FOOTER
  // ============================
  {
    id: "44",
    type: "Text",
    text: "CLIENT -> API GATEWAY -> MICROSERVICES -> DATA LAYER",
    x: 460,
    y: 750,
  },
  {
    id: "45",
    type: "Text",
    text: "Video delivery is handled through CDN edge locations",
    x: 480,
    y: 785,
  },
];
