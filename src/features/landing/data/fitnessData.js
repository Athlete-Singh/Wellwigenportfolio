/**
 * Fitness Content Data for Wellwigen
 * Exactly matching the designs and specifications.
 */

export const CONTACT_INFO = {
  phone: "+91 9598506627",
  phoneRaw: "919598506627",
  email: "wellwigen@gmail.com",
  address: "123 Fitness Street, Wellness City, India",
  instagram: "https://www.instagram.com/wellwigen_bodyfit/",
  twitter: "https://x.com/Wellwigen",
  facebook: "https://www.facebook.com/people/WellwiGen/61581029265086/?sk=about",
  linkedin: "https://linkedin.com/company/wellwigen",
};

export const getWhatsAppUrl = (message = "Hi Wellwigen team! I want to start my fitness journey.") => {
  return `https://wa.me/${CONTACT_INFO.phoneRaw}?text=${encodeURIComponent(message)}`;
};

// Trust Chips for Hero sections
export const HOME_TRUST_CHIPS = [
  { id: "coaches", label: "Expert Coaches", icon: "Award" },
  { id: "anywhere", label: "Train From Anywhere", icon: "Globe" },
  { id: "goals", label: "Goal-Based Programs", icon: "Target" },
  { id: "community", label: "Supportive Community", icon: "Users" },
];

export const GROUP_HERO_CHIPS = [
  { id: "live", label: "Live Sessions (Online)", icon: "Video" },
  { id: "coaches", label: "Expert Coaches", icon: "Award" },
  { id: "community", label: "Supportive Community", icon: "Users" },
  { id: "levels", label: "All Fitness Levels", icon: "Activity" },
];

// Why Wellwigen 6 Tiles
export const WHY_WELLWIGEN_TILES = [
  {
    title: "Expert Coaches",
    desc: "Certified trainers with years of experience coaching real transformations.",
    icon: "Award",
    tint: "bg-teal-50 border-teal-100 text-teal-800",
  },
  {
    title: "Train From Anywhere",
    desc: "No commuting, no expensive gym memberships. Join live from your living room.",
    icon: "MapPin",
    tint: "bg-sky-50 border-sky-100 text-sky-800",
  },
  {
    title: "Goal-Based Programs",
    desc: "Targeted training plans built specifically around what you want to achieve.",
    icon: "Target",
    tint: "bg-emerald-50 border-emerald-100 text-emerald-800",
  },
  {
    title: "Progress Tracking",
    desc: "Measure strength, endurance, and consistency with continuous milestone reviews.",
    icon: "TrendingUp",
    tint: "bg-amber-50 border-amber-100 text-amber-800",
  },
  {
    title: "Supportive Community",
    desc: "Work out alongside positive peers who keep you energized and accountable.",
    icon: "Users",
    tint: "bg-purple-50 border-purple-100 text-purple-800",
  },
  {
    title: "Flexible Training",
    desc: "Sessions designed to seamlessly fit into your busy weekly schedule.",
    icon: "Clock",
    tint: "bg-rose-50 border-rose-100 text-rose-800",
  },
];

// 4 Steps for "How Wellwigen Works"
export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Choose Your Program",
    desc: "Select 1-on-1 Personal Training or energetic Live Group Fitness.",
  },
  {
    step: "02",
    title: "Tell Us Your Goal",
    desc: "Share your fitness background, lifestyle, and what you aim to achieve.",
  },
  {
    step: "03",
    title: "Start Training",
    desc: "Join your live interactive sessions led by dedicated expert coaches.",
  },
  {
    step: "04",
    title: "Track Your Progress",
    desc: "Celebrate consistent improvements in stamina, power, and physique.",
  },
];

// 4 Class Types Chips
export const CLASS_TYPES = [
  {
    id: "hiit",
    name: "HIIT",
    desc: "High energy full-body calorie burn and cardio endurance",
    tag: "High Energy",
    color: "from-rose-500 to-orange-400",
  },
  {
    id: "tabata",
    name: "Tabata",
    desc: "Fast, intense interval rounds for maximum efficiency",
    tag: "Short & Effective",
    color: "from-amber-500 to-yellow-400",
  },
  {
    id: "yoga",
    name: "Yoga",
    desc: "Mind-body balance, deep mobility, posture, and core strength",
    tag: "Mind & Mobility",
    color: "from-teal-500 to-emerald-400",
  },
  {
    id: "junglefit",
    name: "Jungle Fit",
    desc: "Fun, functional animal flow and primal movement conditioning",
    tag: "Primal Movement",
    color: "from-sky-500 to-indigo-400",
  },
];

// Home Testimonials
// TODO: replace with real client feedback
export const HOME_TESTIMONIALS = [
  {
    id: 1,
    name: "Sneha R.",
    goal: "Weight Loss & Energy",
    result: "Lost 9 kg in 12 weeks",
    rating: 5,
    quote: "Wellwigen completely changed my mindset. The coaches are attentive and correct my form through video, making me feel like I have a trainer right beside me.",
    avatar: "/images/goal_fat_loss.jpg",
  },
  {
    id: 2,
    name: "Amit K.",
    goal: "Fitness & Strength",
    result: "Built muscle & stamina",
    rating: 5,
    quote: "The group energy is unmatched! Even after long work hours, logging into class at 7 PM feels like the best recharge of my day.",
    avatar: "/images/goal_muscle.jpg",
  },
  {
    id: 3,
    name: "Neha S.",
    goal: "Posture & Flexibility",
    result: "Zero back pain & flexible",
    rating: 5,
    quote: "I was skeptical about online classes, but the community and coaches proved me wrong. Consistent, fun, and extremely effective.",
    avatar: "/images/goal_mobility.jpg",
  },
];

// Personal Training - What You Get 6 Tiles
export const PT_BENEFITS = [
  {
    title: "Personalized Workout Plan",
    desc: "Custom exercise routines designed exclusively for your body type and fitness target.",
    icon: "FileText",
  },
  {
    title: "1-on-1 Live Coaching",
    desc: "Real-time personal guidance with immediate form correction and motivation.",
    icon: "Video",
  },
  {
    title: "Goal-Based Training",
    desc: "Targeted milestones whether you want to lose fat, build muscle, or boost athletic stamina.",
    icon: "Target",
  },
  {
    title: "Progress Tracking",
    desc: "Periodic assessments and body metric evaluations to celebrate every milestone.",
    icon: "TrendingUp",
  },
  {
    title: "Nutrition Guidance",
    desc: "Actionable, sustainable dietary recommendations to nourish your workouts.",
    icon: "Apple",
  },
  {
    title: "Coach Support",
    desc: "Direct communication with your trainer for questions, accountability, and tips.",
    icon: "HeartHandshake",
  },
];

// PT - Who is it for (4 Cards)
export const PT_GOALS = [
  {
    id: "fat-loss",
    title: "Fat Loss",
    subtitle: "Build sustainable habits and improve body composition.",
    image: "/images/goal_fat_loss.jpg",
    accent: "teal",
  },
  {
    id: "muscle-strength",
    title: "Muscle & Strength",
    subtitle: "Structured strength training for progressive results.",
    image: "/images/goal_muscle.jpg",
    accent: "sky",
  },
  {
    id: "general-fitness",
    title: "General Fitness",
    subtitle: "Improve stamina, daily energy, and overall health.",
    image: "/images/goal_general.jpg",
    accent: "amber",
  },
  {
    id: "mobility-flexibility",
    title: "Mobility & Flexibility",
    subtitle: "Better movement, flexibility, joint health, and posture.",
    image: "/images/goal_mobility.jpg",
    accent: "emerald",
  },
];

// PT - How PT Works (6 Steps)
export const PT_STEPS = [
  { step: "01", title: "Fitness Assessment", desc: "Detailed discussion on your history and movement analysis." },
  { step: "02", title: "Goal Setting", desc: "Clear, measurable milestones defined with your dedicated coach." },
  { step: "03", title: "Personalized Program", desc: "Customized workout splits and sustainable habit guidelines." },
  { step: "04", title: "Live Coaching", desc: "Interactive 1-on-1 video sessions with active form coaching." },
  { step: "05", title: "Progress Tracking", desc: "Regular weekly tracking of strength, endurance, and metrics." },
  { step: "06", title: "Program Adjustments", desc: "Continuous progression adjustments to ensure you never plateau." },
];

// PT Pricing Plans
export const PT_PLANS = [
  {
    id: "pt-starter",
    name: "Starter",
    price: "₹3,999",
    period: "/month",
    sessions: "3 sessions/week",
    features: [
      "3 live coaching sessions weekly",
      "Personalized workout plan",
      "Live interactive coaching",
      "Weekly progress tracking",
      "WhatsApp coach check-ins",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    id: "pt-transformation",
    name: "Transformation",
    price: "₹5,999",
    period: "/month",
    sessions: "5 sessions/week",
    badge: "MOST POPULAR",
    features: [
      "5 live coaching sessions weekly",
      "Customized transformation plan",
      "Comprehensive nutrition guidance",
      "Bi-weekly body composition review",
      "Priority 1-on-1 coach support",
      "Flexibility in session timings",
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    id: "pt-premium",
    name: "Premium 1:1",
    price: "₹8,999",
    period: "/month",
    sessions: "Custom Schedule",
    features: [
      "Unlimited coaching guidance",
      "Custom scheduling & time slots",
      "Daily check-ins & habit tracking",
      "Advanced biometric analytics",
      "Dedicated senior master coach",
      "Direct phone & video access",
    ],
    popular: false,
    cta: "Get Started",
  },
];

// PT Success Stories
// TODO: replace with real client feedback
export const PT_STORIES = [
  {
    name: "Rohit S.",
    result: "Lost 12 kg in 3 months",
    quote: "Personalized plan and constant support made all the difference.",
    image: "/images/goal_muscle.jpg",
  },
  {
    name: "Anjali M.",
    result: "Built strength & confidence",
    quote: "Best decision I made for my health and overall fitness.",
    image: "/images/goal_fat_loss.jpg",
  },
  {
    name: "Vikash T.",
    result: "Improved endurance",
    quote: "Now I feel stronger, fitter, and more energetic every single day.",
    image: "/images/goal_general.jpg",
  },
];

// GROUP CLASSES - Weekly Challenge (7 Days)
export const WEEKLY_CHALLENGES = [
  {
    dayIndex: 1, // Mon
    dayCode: "MON",
    name: "Monster Monday",
    type: "Full Body HIIT",
    duration: "60 min",
    image: "/images/challenge_mon.jpg",
    desc: "Kickstart your week with high-intensity intervals that burn fat and build stamina.",
    color: "from-rose-500 to-red-600",
  },
  {
    dayIndex: 2, // Tue
    dayCode: "TUE",
    name: "Tabata Tuesday",
    type: "Tabata Intervals",
    duration: "60 min",
    image: "/images/challenge_tue.jpg",
    desc: "20 seconds of intense work, 10 seconds of rest. Short, ferocious, and super effective.",
    color: "from-amber-500 to-orange-500",
  },
  {
    dayIndex: 3, // Wed
    dayCode: "WED",
    name: "Wild Wednesday",
    type: "Jungle Fit / Functional",
    duration: "60 min",
    image: "/images/challenge_wed.jpg",
    desc: "Primal movement, core stability, and agility conditioning for total body control.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    dayIndex: 4, // Thu
    dayCode: "THU",
    name: "Thor Thursday",
    type: "Strength & Power",
    duration: "60 min",
    image: "/images/challenge_thu.jpg",
    desc: "Targeted resistance and power training to build dense muscle and athletic force.",
    color: "from-sky-500 to-blue-600",
  },
  {
    dayIndex: 5, // Fri
    dayCode: "FRI",
    name: "Fit Friday",
    type: "Full Body Fitness",
    duration: "60 min",
    image: "/images/challenge_fri.jpg",
    desc: "A fun, high-spirited full body sweat session to finish the workweek strong.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    dayIndex: 6, // Sat
    dayCode: "SAT",
    name: "Strong Saturday",
    type: "Strength & Conditioning",
    duration: "60 min",
    image: "/images/challenge_sat.jpg",
    desc: "Heavy volume endurance and conditioning to challenge your physical threshold.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    dayIndex: 0, // Sun
    dayCode: "SUN",
    name: "Recovery Sunday",
    type: "Mobility & Stretching",
    duration: "60 min",
    image: "/images/challenge_sun.jpg",
    desc: "Deep somatic stretching, breathing, and joint mobility to prepare you for the next week.",
    color: "from-teal-600 to-emerald-700",
  },
];

// GROUP CLASSES - Pricing Plans (EXACTLY from picture 2)
export const GROUP_PLANS = [
  {
    id: "trial",
    name: "Trial Class",
    tagline: "Experience the energy!",
    price: "₹99",
    billingText: "1 Class",
    highlightBadge: null,
    features: [
      "Any class of your choice",
      "Live session access",
      "Coach guidance",
    ],
    cta: "Try Now",
    primary: false,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    tagline: "Our most popular",
    price: "₹1,999",
    billingText: "/month",
    highlightBadge: "MOST POPULAR",
    features: [
      "6 live classes per week",
      "All class types included",
      "Expert coaches",
      "Community access",
      "Progress tracking",
    ],
    cta: "Join Now",
    primary: true,
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    tagline: "Best Value",
    price: "₹4,999",
    billingText: "/ 3 months",
    subtext: "(₹1,666/month)",
    highlightBadge: "BEST VALUE",
    features: [
      "All 6 weekly classes",
      "Live coaching every session",
      "Community access",
      "Progress tracking",
      "Priority coach support",
    ],
    cta: "Join Now",
    primary: false,
  },
  {
    id: "annual",
    name: "Annual Plan",
    tagline: "Save More",
    price: "₹14,999",
    billingText: "/ year",
    subtext: "(₹1,250/month)",
    highlightBadge: "SAVE MORE",
    features: [
      "Unlimited class access",
      "All class types included",
      "Live coaching",
      "Community access",
      "Progress tracking",
      "Special workshops & guest coach sessions",
    ],
    cta: "Join Now",
    primary: false,
  },
];

// GROUP CLASSES - Why Choose Wellwigen Group Classes (5 Tiles)
export const WHY_GROUP_CLASSES_TILES = [
  {
    title: "Structured Weekly Schedule",
    desc: "Follow a fun and focused routine with zero guesswork.",
    icon: "CalendarCheck",
    tint: "bg-teal-50 border-teal-100 text-teal-800",
  },
  {
    title: "Live Expert Coaches",
    desc: "Real-time guidance, posture corrections, and motivation.",
    icon: "UserCheck",
    tint: "bg-sky-50 border-sky-100 text-sky-800",
  },
  {
    title: "Variety of Class Types",
    desc: "From HIIT to Yoga to Primal movements, never get bored.",
    icon: "Layers",
    tint: "bg-amber-50 border-amber-100 text-amber-800",
  },
  {
    title: "Supportive Community",
    desc: "Train, grow, and stay connected with like-minded fitness enthusiasts.",
    icon: "Users",
    tint: "bg-purple-50 border-purple-100 text-purple-800",
  },
  {
    title: "Track Your Progress",
    desc: "See your stamina, strength, and confidence improve week by week.",
    icon: "Activity",
    tint: "bg-emerald-50 border-emerald-100 text-emerald-800",
  },
];
