/**
 * ⚠️ MOCK DATA — ข้อมูลแอปเป็นข้อมูลตัวอย่างสำหรับ prototype
 * ชื่อแอปและผู้ให้บริการเป็นชื่อจริงตามโจทย์ แต่จำนวนสถานี วิธีจ่ายเงิน
 * และรายละเอียดอื่น ๆ เป็นข้อมูลจำลอง ต้องตรวจสอบกับผู้ให้บริการก่อนใช้งานจริง
 */

export type ChargingApp = {
  id: string;
  name: string;
  operator: string;
  tagline: string;
  color: string;
  /** จำนวนสถานีโดยประมาณ (mock) */
  coverage: string;
  /** จุดเด่นสั้น ๆ 2–3 ข้อ */
  strengths: string[];
  connectors: string[];
  payment: string[];
  bestFor: string;
  /** true = เป็นแอปรวมข้อมูล ไม่ได้เป็นเจ้าของสถานีเอง */
  isDirectory?: boolean;
};

export const chargingApps: ChargingApp[] = [
  {
    id: "ev-station-pluz",
    name: "EV Station PluZ",
    operator: "OR (ปตท. น้ำมันและการค้าปลีก)",
    tagline: "เครือข่ายในปั๊ม PTT Station ทั่วประเทศ",
    color: "#0b7285",
    coverage: "ประมาณ 800+ หัวชาร์จ",
    strengths: ["อยู่ในปั๊มน้ำมัน หาง่ายระหว่างเดินทาง", "มีห้องน้ำและร้านกาแฟเกือบทุกจุด", "เหมาะกับการขับทางไกล"],
    connectors: ["CCS2", "CHAdeMO", "Type 2"],
    payment: ["บัตรเครดิต", "พร้อมเพย์", "Wallet ในแอป"],
    bestFor: "คนขับทางไกลที่อยากแวะจุดที่มีสิ่งอำนวยความสะดวกครบ",
  },
  {
    id: "ea-anywhere",
    name: "EA Anywhere",
    operator: "พลังงานบริสุทธิ์ (EA)",
    tagline: "เครือข่ายที่ครอบคลุมห้างและอาคารมากที่สุดกลุ่มหนึ่ง",
    color: "#2f9e44",
    coverage: "ประมาณ 500+ สถานี",
    strengths: ["กระจายตัวดีทั้งในเมืองและต่างจังหวัด", "มีหัว DC หลายขนาด", "จองคิวล่วงหน้าได้บางสถานี"],
    connectors: ["CCS2", "CHAdeMO", "Type 2"],
    payment: ["บัตรเครดิต", "Wallet ในแอป"],
    bestFor: "คนที่ชาร์จตามห้างและอาคารสำนักงานเป็นหลัก",
  },
  {
    id: "pea-volta",
    name: "PEA VOLTA",
    operator: "การไฟฟ้าส่วนภูมิภาค",
    tagline: "สถานีของการไฟฟ้า กระจายตามหัวเมืองต่างจังหวัด",
    color: "#7048a8",
    coverage: "ประมาณ 260+ สถานี",
    strengths: ["ค่าไฟต่อหน่วยมักถูกกว่าค่าเฉลี่ย", "มีในจังหวัดที่เครือข่ายเอกชนยังไปไม่ถึง", "หลายจุดเปิด 24 ชั่วโมง"],
    connectors: ["CCS2", "CHAdeMO", "Type 2"],
    payment: ["บัตรเครดิต", "พร้อมเพย์"],
    bestFor: "คนที่ขับต่างจังหวัดนอกเส้นทางหลัก",
  },
  {
    id: "mea-ev",
    name: "MEA EV",
    operator: "การไฟฟ้านครหลวง",
    tagline: "เน้นพื้นที่กรุงเทพฯ นนทบุรี และสมุทรปราการ",
    color: "#d9480f",
    coverage: "ประมาณ 120+ สถานี",
    strengths: ["ครอบคลุมเขตเมืองหลวงดี", "มีระบบแจ้งเตือนเมื่อชาร์จเสร็จ", "ใช้ขอติดตั้งมิเตอร์ที่บ้านผ่านแอปได้"],
    connectors: ["CCS2", "Type 2"],
    payment: ["บัตรเครดิต", "พร้อมเพย์"],
    bestFor: "คนที่ใช้รถในกรุงเทพฯ และปริมณฑลเป็นหลัก",
  },
  {
    id: "elexa",
    name: "EleXA",
    operator: "PTT / Arun Plus",
    tagline: "แอปที่รวมสถานีของหลายพันธมิตรไว้ด้วยกัน",
    color: "#1864ab",
    coverage: "ประมาณ 400+ สถานี",
    strengths: ["จองหัวชาร์จล่วงหน้าได้", "เชื่อมกับพันธมิตรหลายราย ใช้แอปเดียวได้หลายที่", "ดูสถานะว่างแบบเรียลไทม์"],
    connectors: ["CCS2", "CHAdeMO", "Type 2"],
    payment: ["บัตรเครดิต", "Wallet ในแอป", "พร้อมเพย์"],
    bestFor: "คนที่ไม่อยากโหลดหลายแอปและต้องการจองคิวล่วงหน้า",
  },
  {
    id: "sharge",
    name: "SHARGE",
    operator: "Sharge Management",
    tagline: "เน้นทำเลไลฟ์สไตล์ ห้างและคอนโดระดับบน",
    color: "#e8590c",
    coverage: "ประมาณ 200+ สถานี",
    strengths: ["ทำเลอยู่ในห้างและโรงแรมที่แวะง่าย", "มีหัว Ultra Fast หลายจุด", "หน้าแอปใช้ง่าย"],
    connectors: ["CCS2", "Type 2"],
    payment: ["บัตรเครดิต", "Wallet ในแอป"],
    bestFor: "คนเมืองที่ชาร์จระหว่างกินข้าวหรือช้อปปิ้ง",
  },
  {
    id: "evolt",
    name: "EVolt",
    operator: "EVolt Technology",
    tagline: "ผู้ให้บริการไทยที่เน้นขยายสู่หัวเมืองรอง",
    color: "#0ca678",
    coverage: "ประมาณ 150+ สถานี",
    strengths: ["มีในจังหวัดขนาดกลางหลายแห่ง", "รองรับการชาร์จทั้ง AC และ DC", "ค่าบริการอยู่กลาง ๆ"],
    connectors: ["CCS2", "Type 2"],
    payment: ["บัตรเครดิต", "พร้อมเพย์"],
    bestFor: "คนที่เดินทางระหว่างจังหวัดในภาคเดียวกัน",
  },
  {
    id: "igreen",
    name: "iGreen+",
    operator: "iGreen Energy",
    tagline: "เน้นเส้นทางขนส่งและพื้นที่อุตสาหกรรม",
    color: "#5c940d",
    coverage: "ประมาณ 90+ สถานี",
    strengths: ["มีหัวจ่ายกำลังสูงสำหรับรถเชิงพาณิชย์", "หลายจุดเปิด 24 ชั่วโมง", "ลานจอดกว้าง รถใหญ่เข้าได้"],
    connectors: ["CCS2"],
    payment: ["บัตรเครดิต", "วางบิลรายเดือน"],
    bestFor: "รถเชิงพาณิชย์และผู้ประกอบการขนส่ง",
  },
  {
    id: "spark",
    name: "Spark",
    operator: "Spark EV",
    tagline: "เน้นสนามบิน โรงแรม และแหล่งท่องเที่ยว",
    color: "#1098ad",
    coverage: "ประมาณ 70+ สถานี",
    strengths: ["ครอบคลุมจุดท่องเที่ยวและสนามบิน", "มีหัว Ultra Fast", "เหมาะกับทริปยาว"],
    connectors: ["CCS2", "Type 2"],
    payment: ["บัตรเครดิต"],
    bestFor: "คนที่ขับเที่ยวต่างจังหวัดและพักโรงแรม",
  },
  {
    id: "plugshare",
    name: "PlugShare",
    operator: "EVgo (ระดับสากล)",
    tagline: "แอปรวมแผนที่สถานีจากทุกเครือข่าย พร้อมรีวิวจากผู้ใช้จริง",
    color: "#495057",
    coverage: "รวมข้อมูลจากเกือบทุกเครือข่ายทั่วโลก",
    strengths: ["เห็นสถานีของทุกค่ายในแผนที่เดียว", "มีรีวิวและรูปจากผู้ใช้จริง", "ใช้วางแผนเส้นทางก่อนออกเดินทางได้"],
    connectors: ["ทุกประเภท"],
    payment: ["ไม่มีระบบจ่ายเงินในไทย ต้องจ่ายผ่านแอปของเครือข่ายนั้น ๆ"],
    bestFor: "ใช้ดูแผนที่และรีวิวก่อนออกเดินทาง (ไม่ใช่แอปจ่ายเงิน)",
    isDirectory: true,
  },
];

export const appById = Object.fromEntries(
  chargingApps.map((a) => [a.id, a]),
) as Record<string, ChargingApp>;

/* ────────────────────────────────────────────────
   QUIZ — "ควรโหลดแอปไหน" 5 ข้อ
   แต่ละคำตอบให้คะแนนกับแอปที่เกี่ยวข้อง แล้วสรุปเป็น 3 อันดับแรก
   ──────────────────────────────────────────────── */

export type QuizOption = {
  id: string;
  label: string;
  hint?: string;
  scores: Record<string, number>;
};

export type QuizQuestion = {
  id: string;
  question: string;
  help?: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "car",
    question: "รถที่คุณใช้อยู่ (หรือกำลังจะซื้อ) เป็นกลุ่มไหน",
    help: "ใช้ประเมินหัวชาร์จที่รถรองรับ",
    options: [
      { id: "china", label: "จีน เช่น BYD, MG, NETA, GWM", scores: { "ev-station-pluz": 2, "ea-anywhere": 2, elexa: 1 } },
      { id: "japan", label: "ญี่ปุ่น เช่น Nissan, Toyota", scores: { "pea-volta": 2, "ev-station-pluz": 2 } },
      { id: "euro", label: "ยุโรป/อเมริกา เช่น BMW, Volvo, Tesla", scores: { sharge: 2, elexa: 2, spark: 1 } },
      { id: "none", label: "ยังไม่มีรถ กำลังหาข้อมูล", scores: { plugshare: 3, elexa: 1 } },
    ],
  },
  {
    id: "connector",
    question: "หัวชาร์จที่รถคุณใช้",
    help: "ดูได้จากคู่มือรถ หรือฝาช่องชาร์จข้างรถ",
    options: [
      { id: "ccs2", label: "CCS2", hint: "รถ EV ส่วนใหญ่ในไทยใช้หัวนี้", scores: { "ea-anywhere": 2, "ev-station-pluz": 2, sharge: 1, evolt: 1 } },
      { id: "chademo", label: "CHAdeMO", hint: "พบในรถญี่ปุ่นรุ่นเก่า", scores: { "pea-volta": 3, "ev-station-pluz": 2 } },
      { id: "type2", label: "Type 2 อย่างเดียว (ชาร์จ AC)", scores: { "mea-ev": 2, elexa: 1, evolt: 1 } },
      { id: "unsure", label: "ยังไม่แน่ใจ", scores: { plugshare: 2, elexa: 1 } },
    ],
  },
  {
    id: "area",
    question: "ปกติขับอยู่แถวไหนมากที่สุด",
    options: [
      { id: "bkk", label: "กรุงเทพฯ และปริมณฑล", scores: { "mea-ev": 3, sharge: 2, "ea-anywhere": 1 } },
      { id: "upcountry", label: "ต่างจังหวัด ในภาคเดียวกัน", scores: { "pea-volta": 3, evolt: 2 } },
      { id: "intercity", label: "ขับข้ามภาคบ่อย", scores: { "ev-station-pluz": 3, "ea-anywhere": 2, plugshare: 1 } },
      { id: "tourist", label: "เส้นทางท่องเที่ยว ทะเล/ภูเขา", scores: { spark: 3, sharge: 1, evolt: 1 } },
    ],
  },
  {
    id: "home",
    question: "ที่บ้านชาร์จได้ไหม",
    options: [
      { id: "yes", label: "ได้ ติดตั้งเครื่องชาร์จแล้ว", hint: "ใช้สถานีสาธารณะเฉพาะตอนเดินทางไกล", scores: { "ev-station-pluz": 2, spark: 1 } },
      { id: "soon", label: "ยังไม่ได้ แต่กำลังจะติดตั้ง", scores: { "mea-ev": 2, "pea-volta": 1 } },
      { id: "no", label: "ไม่ได้เลย ต้องพึ่งสถานีสาธารณะ", hint: "ควรมีแอปหลายตัวสำรองไว้", scores: { "ea-anywhere": 2, sharge: 2, "mea-ev": 2, plugshare: 1 } },
    ],
  },
  {
    id: "longtrip",
    question: "ขับทางไกลข้ามจังหวัดบ่อยแค่ไหน",
    options: [
      { id: "rare", label: "แทบไม่เลย ใช้ในเมืองเป็นหลัก", scores: { "mea-ev": 2, sharge: 1 } },
      { id: "sometimes", label: "เดือนละครั้งสองครั้ง", scores: { "ea-anywhere": 2, elexa: 1, evolt: 1 } },
      { id: "often", label: "บ่อยมาก เกือบทุกสัปดาห์", scores: { "ev-station-pluz": 3, plugshare: 2, "pea-volta": 1 } },
    ],
  },
];

export function scoreQuiz(answers: Record<string, string>) {
  const totals: Record<string, number> = {};
  for (const q of quizQuestions) {
    const choice = q.options.find((o) => o.id === answers[q.id]);
    if (!choice) continue;
    for (const [appId, pts] of Object.entries(choice.scores)) {
      totals[appId] = (totals[appId] ?? 0) + pts;
    }
  }
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, score]) => ({ app: appById[id], score }))
    .filter((r) => r.app);
}

/* ────────── 5 ขั้นตอนการชาร์จครั้งแรก ────────── */

export const chargingSteps = [
  {
    n: 1,
    title: "เตรียมแอปและวางแผนก่อนออกรถ",
    body: "โหลดแอปของเครือข่ายที่จะใช้ สมัครสมาชิกและผูกบัตรให้เรียบร้อยตั้งแต่อยู่บ้าน เพราะบางสถานีสัญญาณอินเทอร์เน็ตไม่ดี การสมัครหน้างานจะเสียเวลามาก",
  },
  {
    n: 2,
    title: "จอดรถให้ตรงช่อง ดูทิศทางช่องเสียบ",
    body: "ดูก่อนว่าช่องเสียบของรถอยู่ด้านหน้าหรือด้านหลัง แล้วถอยหรือเข้าจอดให้สายชาร์จถึง สายของตู้ DC มักสั้นและหนักกว่าที่คิด",
  },
  {
    n: 3,
    title: "เลือกหัวชาร์จให้ตรงกับรถ",
    body: "หัว CCS2 คือหัวชาร์จเร็วที่รถ EV ส่วนใหญ่ในไทยใช้ ส่วน CHAdeMO พบในรถญี่ปุ่นรุ่นเก่า และ Type 2 คือหัวสำหรับชาร์จแบบ AC ที่ช้ากว่าแต่ถนอมแบตเตอรี่",
  },
  {
    n: 4,
    title: "สแกน QR หรือกดเริ่มในแอป",
    body: "เสียบหัวชาร์จให้แน่นจนล็อก แล้วสแกน QR บนตู้หรือกดปุ่มเริ่มในแอป รอสักครู่จนหน้าจอขึ้นว่ากำลังจ่ายไฟ ตรวจดูว่าตัวเลข kW ขึ้นจริงก่อนเดินจากรถ",
  },
  {
    n: 5,
    title: "ชาร์จถึง 80% แล้วถอดสาย",
    body: "การชาร์จ DC จะเร็วมากในช่วง 20–80% แล้วจะช้าลงชัดเจนหลังจากนั้น ถ้าไม่จำเป็นให้หยุดที่ 80% เพื่อประหยัดเวลาและถนอมแบตเตอรี่ อย่าลืมกดหยุดในแอปก่อนถอดสาย",
  },
];
