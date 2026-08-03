export type Score = 1 | 2 | 3 | 4 | 5;

export type Company = {
  id: string;
  name: string;
  tag: string;
  rating: number;
  reviewCount: number;
  recommendCount: number;
  scores: {
    work: number;
    social: number;
    mentor: number;
    experience: number;
  };
};

export type Review = {
  id: string;
  companyId: string;
  name: string;
  department: string;
  intania: string;
  daysAgo: number;
  recommended: boolean;
  position: string;
  duration: string;
  compensation: string;
  workMode: string;
  scores: {
    work: Score;
    social: Score;
    mentor: Score;
    experience: Score;
  };
  sections: {
    application: string;
    work: string;
    atmosphere: string;
    advice: string;
  };
};

export const companies: Company[] = [
  {
    id: "line-man-wongnai",
    name: "LINE MAN Wongnai",
    tag: "Tech",
    rating: 4.6,
    reviewCount: 21,
    recommendCount: 18,
    scores: { work: 4.6, social: 4.4, mentor: 4.6, experience: 4.8 },
  },
  {
    id: "agoda",
    name: "Agoda",
    tag: "Travel",
    rating: 4.4,
    reviewCount: 16,
    recommendCount: 13,
    scores: { work: 4.7, social: 4.3, mentor: 4.2, experience: 4.8 },
  },
  {
    id: "scb-techx",
    name: "SCB TechX",
    tag: "Finance",
    rating: 4.3,
    reviewCount: 19,
    recommendCount: 11,
    scores: { work: 4.2, social: 4.1, mentor: 3.9, experience: 4.5 },
  },
  {
    id: "shopee",
    name: "Shopee",
    tag: "E-commerce",
    rating: 4.5,
    reviewCount: 18,
    recommendCount: 14,
    scores: { work: 4.7, social: 4.2, mentor: 4.3, experience: 4.6 },
  },
  {
    id: "scg",
    name: "SCG",
    tag: "Industrial",
    rating: 4.2,
    reviewCount: 15,
    recommendCount: 11,
    scores: { work: 4.1, social: 4.3, mentor: 4.2, experience: 4.2 },
  },
  {
    id: "ptt",
    name: "PTT",
    tag: "Energy",
    rating: 4.1,
    reviewCount: 17,
    recommendCount: 10,
    scores: { work: 4.0, social: 4.2, mentor: 4.1, experience: 4.2 },
  },
  {
    id: "ey",
    name: "EY",
    tag: "Consulting",
    rating: 4.0,
    reviewCount: 12,
    recommendCount: 8,
    scores: { work: 4.2, social: 3.9, mentor: 3.8, experience: 4.1 },
  },
  {
    id: "ais",
    name: "AIS",
    tag: "Telecom",
    rating: 4.2,
    reviewCount: 14,
    recommendCount: 10,
    scores: { work: 4.1, social: 4.2, mentor: 4.2, experience: 4.3 },
  },
  {
    id: "toyota",
    name: "Toyota",
    tag: "Automotive",
    rating: 4.1,
    reviewCount: 13,
    recommendCount: 9,
    scores: { work: 4.0, social: 4.1, mentor: 4.0, experience: 4.2 },
  },
  {
    id: "cpf",
    name: "CPF",
    tag: "Food Tech",
    rating: 3.9,
    reviewCount: 8,
    recommendCount: 6,
    scores: { work: 3.8, social: 4.0, mentor: 3.9, experience: 4.0 },
  },
  {
    id: "mitr-phol",
    name: "Mitr Phol",
    tag: "Process",
    rating: 4.1,
    reviewCount: 7,
    recommendCount: 6,
    scores: { work: 4.0, social: 4.0, mentor: 4.1, experience: 4.2 },
  },
  {
    id: "bangchak",
    name: "Bangchak",
    tag: "Sustainability",
    rating: 4.2,
    reviewCount: 9,
    recommendCount: 7,
    scores: { work: 4.1, social: 4.3, mentor: 4.2, experience: 4.3 },
  },
  {
    id: "true-digital",
    name: "True Digital",
    tag: "Digital",
    rating: 4.1,
    reviewCount: 13,
    recommendCount: 9,
    scores: { work: 4.2, social: 4.0, mentor: 4.0, experience: 4.2 },
  },
];

export const reviews: Review[] = [
  {
    id: "data-engineer-intern",
    companyId: "line-man-wongnai",
    name: "Anonymous",
    department: "ภาคคอมพิวเตอร์",
    intania: "107",
    daysAgo: 7,
    recommended: true,
    position: "Data Engineer Intern",
    duration: "3 เดือน",
    compensation: "500 บาท/วัน",
    workMode: "Work from home",
    scores: { work: 5, social: 4, mentor: 2, experience: 5 },
    sections: {
      application:
        "สมัครผ่านเว็บไซต์บริษัท แล้วมีทั้งหมด 2 รอบ คือรอบ resume screening กับสัมภาษณ์ 1 รอบ ใช้เวลาประมาณ 2 อาทิตย์กว่าจะได้ผลสัมภาษณ์ ตอนสัมภาษณ์จะถามทั้งเรื่องพื้นฐานที่เกี่ยวกับตำแหน่ง และถามพฤติกรรมการทำงานด้วย ถ้าจะเตรียมตัว แนะนำให้ทำความเข้าใจงานของบริษัทกับทบทวนโปรเจกต์ที่เคยทำไปก่อน เพราะมีโอกาสโดนถามลึกพอสมควร",
      work:
        "ได้ช่วยงานหลักของทีมจริง ไม่ได้เป็นงานเบ็ดเตล็ดอย่างเดียว มีทั้งงานย่อยที่ให้รับผิดชอบเองและงานที่ทำร่วมกับพี่ในทีม ได้ลองใช้เครื่องมือที่ทีมใช้งานจริง รวมถึงได้เห็น flow การทำงานตั้งแต่รับ requirement ไปจนถึงส่งงาน เนื้องานโดยรวมค่อนข้างตรงกับตำแหน่งที่สมัคร และได้เรียนรู้เพิ่มจากของที่ไม่เคยใช้มาก่อนพอสมควร",
      atmosphere:
        "บรรยากาศในทีมค่อนข้างเป็นกันเอง พี่ ๆ พร้อมตอบคำถามและไม่ได้ทำให้รู้สึกเกร็งเกินไป การสื่อสารในทีมชัดเจนและตามงานกันพอดี วัฒนธรรมการทำงานค่อนข้าง professional แต่ไม่ได้กดดันเกิน สวัสดิการถือว่าโอเคสำหรับ intern ส่วนการเดินทางถ้าไป onsite ก็ต้องเผื่อเวลาในช่วงเช้าพอสมควร แต่สถานที่ทำงานเดินทางได้ไม่ยาก",
      advice:
        "สิ่งที่ชอบคือได้ทำงานจริงและเห็นภาพการทำงานในบริษัทชัดเจนขึ้นมาก สิ่งที่ไม่ชอบคือบางช่วงงานค่อนข้างเร็ว ทำให้ต้องปรับตัวพอสมควร สิ่งที่ได้เรียนรู้มากที่สุดคือการทำงานร่วมกับทีมและการสื่อสารในบริบทงานจริง ถ้าใครสนใจสมัคร แนะนำให้เตรียมพื้นฐานที่เกี่ยวกับตำแหน่งไปให้แน่น และอย่ากลัวที่จะถามเวลามีอะไรไม่เข้าใจ เพราะยิ่งถามเร็วก็ยิ่งเรียนรู้ได้เร็วครับ",
    },
  },
  {
    id: "backend-intern",
    companyId: "line-man-wongnai",
    name: "Anonymous",
    department: "ภาคไฟฟ้า",
    intania: "106",
    daysAgo: 12,
    recommended: true,
    position: "Backend Intern",
    duration: "2 เดือน",
    compensation: "18,000 บาท/เดือน",
    workMode: "Hybrid",
    scores: { work: 4, social: 4, mentor: 3, experience: 4 },
    sections: {
      application: "สมัครผ่าน referral แล้วมี screening กับ technical interview รวมใช้เวลาประมาณหนึ่งสัปดาห์",
      work: "ได้ช่วยพัฒนา feature ย่อยใน service จริง มี code review และได้คุยกับทีม product บางช่วง งานค่อนข้างตรงกับตำแหน่งที่สมัคร แต่ช่วงแรกต้องใช้เวลาเข้าใจระบบเยอะพอสมควร",
      atmosphere: "ทีมคุยง่ายและช่วยกันดี มี standup สั้น ๆ ทำให้เห็นภาพงานของทีมชัด",
      advice: "เตรียมพื้นฐาน backend, database และโปรเจกต์ที่เคยทำไว้เล่าให้กระชับจะช่วยได้มาก",
    },
  },
];
