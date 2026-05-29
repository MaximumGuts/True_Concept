import type {
  Chapter,
  DashboardSummary,
  Experiment,
  LoginResponse,
  Mcq,
  Note,
  Progress,
  QaItem,
  SearchResults,
  Subject,
  User,
} from "./generated/api.schemas";

type MockChapter = Chapter & { medium?: "Assamese" | "English" | "Both" };
type MockNote = Note & { youtubeId?: string | null };

const studentUser: User = {
  id: "0",
  username: "student",
  role: "student",
  name: "Student",
};

const adminUser: User = {
  id: "1",
  username: "admin",
  role: "admin",
  name: "Administrator",
};

const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Science",
    description: "Physics, chemistry, and practical concepts for Classes IX and X.",
    icon: "FlaskConical",
    classLevels: ["Class IX", "Class X"],
    color: "#3b82f6",
    chapterCount: 2,
  },
  {
    id: "2",
    name: "Mathematics",
    description: "Core concepts, worked examples, and practice for algebra and geometry.",
    icon: "Calculator",
    classLevels: ["Class IX", "Class X"],
    color: "#8b5cf6",
    chapterCount: 1,
  },
];

const mockChapters: MockChapter[] = [
  {
    id: "101",
    subjectId: "1",
    subjectName: "Science",
    classLevel: "Class IX",
    title: "Light: Reflection and Refraction",
    chapterNumber: 7,
    description: "Learn how light reflects from mirrors and bends through transparent media.",
    hasNotes: true,
    hasMcqs: true,
    hasQa: true,
    hasVideo: true,
    medium: "Both",
  },
  {
    id: "102",
    subjectId: "1",
    subjectName: "Science",
    classLevel: "Class X",
    title: "Electricity",
    chapterNumber: 11,
    description: "Circuits, current, resistance, and everyday applications of electricity.",
    hasNotes: true,
    hasMcqs: true,
    hasQa: true,
    hasVideo: false,
    medium: "English",
  },
  {
    id: "201",
    subjectId: "2",
    subjectName: "Mathematics",
    classLevel: "Class IX",
    title: "Polynomials",
    chapterNumber: 2,
    description: "Terms, coefficients, identities, and factorisation basics.",
    hasNotes: true,
    hasMcqs: true,
    hasQa: false,
    hasVideo: false,
    medium: "Both",
  },
];

const mockNotes: MockNote[] = [
  {
    id: "1001",
    chapterId: "101",
    title: "Key Concepts of Reflection",
    content:
      "## Laws of reflection\n\n1. Angle of incidence equals angle of reflection.\n2. The incident ray, reflected ray, and the normal lie in the same plane.\n\n### Refraction\nWhen light travels from one medium to another, its speed changes and the ray bends.",
    type: "text",
    order: 1,
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "1002",
    chapterId: "102",
    title: "Current and Resistance",
    content:
      "Electric current is the flow of charge. Resistance opposes current. Ohm's law states that **V = IR** for a conductor at constant temperature.",
    type: "text",
    order: 1,
  },
  {
    id: "1003",
    chapterId: "201",
    title: "Polynomial Basics",
    content:
      "A polynomial is an algebraic expression formed using variables and coefficients. Example: `2x^2 + 3x - 5`.",
    type: "text",
    order: 1,
  },
];

const mockMcqs: Mcq[] = [
  {
    id: "2001",
    chapterId: "101",
    question: "Which law states that the angle of incidence equals the angle of reflection?",
    options: ["Snell's law", "Law of reflection", "Ohm's law", "Newton's third law"],
    correctIndex: 1,
    explanation: "This is the first law of reflection.",
    order: 1,
  },
  {
    id: "2002",
    chapterId: "102",
    question: "According to Ohm's law, voltage equals:",
    options: ["I / R", "R / I", "I x R", "I + R"],
    correctIndex: 2,
    explanation: "Ohm's law is expressed as V = I x R.",
    order: 1,
  },
  {
    id: "2003",
    chapterId: "201",
    question: "Which of the following is a polynomial?",
    options: ["2/x + 1", "3x^2 - 4x + 6", "sqrt(x) + 1", "1/x^2"],
    correctIndex: 1,
    explanation: "A polynomial has variables with non-negative integer powers only.",
    order: 1,
  },
];

const mockQa: QaItem[] = [
  {
    id: "3001",
    chapterId: "101",
    question: "Why does a pencil appear bent in water?",
    answer: "Because light changes direction when it moves from water to air.",
    explanation: "This bending is caused by refraction at the boundary between two media.",
    isImportant: true,
    order: 1,
  },
  {
    id: "3002",
    chapterId: "102",
    question: "What happens to current when resistance increases at constant voltage?",
    answer: "Current decreases.",
    explanation: "From V = IR, if V stays constant and R increases, I must decrease.",
    isImportant: true,
    order: 1,
  },
];

const mockExperiments: Experiment[] = [
  {
    id: "4001",
    subject: "Physics",
    classLevel: "Class IX",
    title: "Light Reflection",
    objective: "Observe how the angle of incidence changes the reflected ray.",
    theory: "A plane mirror reflects light according to the law of reflection.",
    apparatus: "Plane mirror\nRay box\nProtractor",
    procedure: "Place the mirror.\nChange the incidence angle.\nObserve the reflected ray.",
    expectedResult: "The angle of reflection matches the angle of incidence.",
    explanation: "Reflection from a smooth surface follows a predictable rule.",
    videoUrl: null,
    hints: "Try multiple angles and compare both sides of the normal.",
    summary: "Reflection obeys a simple geometric rule.",
    type: "light-reflection",
    difficulty: "easy",
  },
  {
    id: "4002",
    subject: "Chemistry",
    classLevel: "Class IX",
    title: "pH Testing with Indicators",
    objective: "Compare acidic and basic solutions using indicators.",
    theory: "Indicators change colour depending on the acidity or basicity of a solution.",
    apparatus: "Indicator paper\nSample solutions\nDropper",
    procedure: "Choose a solution.\nApply indicator.\nObserve the colour change.",
    expectedResult: "Acids and bases show different indicator colours.",
    explanation: "Indicators respond to hydrogen ion concentration.",
    videoUrl: null,
    hints: "Compare lemon juice and soap solution.",
    summary: "Indicators help classify solutions as acidic, basic, or neutral.",
    type: "ph-testing",
    difficulty: "easy",
  },
];

const mockProgress: Progress[] = [
  {
    id: "5001",
    userId: "0",
    chapterId: "101",
    chapterTitle: "Light: Reflection and Refraction",
    subjectName: "Science",
    mcqScore: 1,
    mcqTotal: 1,
    visited: true,
    lastAccessedAt: new Date().toISOString(),
  },
];

const mockDashboardSummary: DashboardSummary = {
  totalChapters: mockChapters.length,
  visitedChapters: 1,
  totalMcqAttempts: 1,
  averageScore: 100,
  recentChapters: mockProgress,
  subjectProgress: [
    { subjectId: "1", subjectName: "Science", chaptersTotal: 2, chaptersVisited: 1 },
    { subjectId: "2", subjectName: "Mathematics", chaptersTotal: 1, chaptersVisited: 0 },
  ],
};

function parseJsonBody(body: BodyInit | null | undefined): unknown {
  if (typeof body !== "string" || body.trim() === "") return undefined;
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

function createLoginResponse(user: User): LoginResponse {
  return {
    user,
    token: `mock-token:${user.role}:${user.id}`,
  };
}

export function getMockLoginResponse(role: "student" | "admin"): LoginResponse {
  return createLoginResponse(role === "admin" ? adminUser : studentUser);
}

export function isMockToken(token: string | null | undefined): boolean {
  return Boolean(token?.startsWith("mock-token:"));
}

function getMockUserFromToken(authHeader: string | null): User | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (!isMockToken(token)) return null;
  return token.includes(":admin:") ? adminUser : studentUser;
}

function toUrl(rawUrl: string): URL {
  return new URL(rawUrl, "http://localhost");
}

export function tryMockApiRequest(
  rawUrl: string,
  method: string,
  options: RequestInit,
): unknown | undefined {
  const url = toUrl(rawUrl);
  const path = url.pathname;
  const jsonBody = parseJsonBody(options.body);

  if (path === "/api/healthz" && method === "GET") {
    return { status: "ok" };
  }

  if (path === "/api/auth/login" && method === "POST") {
    const body = (jsonBody ?? {}) as { username?: string; password?: string };
    if (body.username === "admin" && body.password === "admin123") {
      return createLoginResponse(adminUser);
    }
    throw new Error("Mock login failed: use admin / admin123.");
  }

  if (path === "/api/auth/student-login" && method === "POST") {
    return createLoginResponse(studentUser);
  }

  if (path === "/api/auth/me" && method === "GET") {
    return getMockUserFromToken(new Headers(options.headers).get("authorization"));
  }

  if (path === "/api/subjects" && method === "GET") {
    return mockSubjects;
  }

  if (/^\/api\/subjects\/\d+$/.test(path) && method === "GET") {
    const id = path.split("/").pop() || "";
    return mockSubjects.find((subject) => subject.id === id) ?? null;
  }

  if (path === "/api/chapters" && method === "GET") {
    const subjectId = url.searchParams.get("subjectId");
    const classLevel = url.searchParams.get("classLevel");
    return mockChapters.filter((chapter) => {
      if (subjectId && chapter.subjectId !== subjectId) return false;
      if (classLevel && chapter.classLevel !== classLevel) return false;
      return true;
    });
  }

  if (/^\/api\/chapters\/\d+$/.test(path) && method === "GET") {
    const id = path.split("/").pop() || "";
    return mockChapters.find((chapter) => chapter.id === id) ?? null;
  }

  if (path === "/api/notes" && method === "GET") {
    const chapterId = url.searchParams.get("chapterId");
    return mockNotes.filter((note) => note.chapterId === chapterId);
  }

  if (path === "/api/mcqs" && method === "GET") {
    const chapterId = url.searchParams.get("chapterId");
    return mockMcqs.filter((mcq) => mcq.chapterId === chapterId);
  }

  if (path === "/api/qa" && method === "GET") {
    const chapterId = url.searchParams.get("chapterId");
    return mockQa.filter((item) => item.chapterId === chapterId);
  }

  if (path === "/api/experiments" && method === "GET") {
    const classLevel = url.searchParams.get("classLevel");
    return mockExperiments.filter((experiment) => {
      if (classLevel && experiment.classLevel !== classLevel) return false;
      return true;
    });
  }

  if (/^\/api\/experiments\/\d+$/.test(path) && method === "GET") {
    const id = path.split("/").pop() || "";
    return mockExperiments.find((experiment) => experiment.id === id) ?? null;
  }

  if (path === "/api/progress" && method === "GET") {
    return mockProgress;
  }

  if (path === "/api/dashboard/summary" && method === "GET") {
    return mockDashboardSummary;
  }

  if (path === "/api/progress/mark-chapter" && method === "POST") {
    return { ok: true };
  }

  if (path === "/api/progress/mcq-score" && method === "POST") {
    return { ok: true };
  }

  if (path === "/api/search" && method === "GET") {
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
    const chapters = mockChapters.filter((chapter) =>
      [chapter.title, chapter.description, chapter.subjectName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(q)),
    );
    const questions = mockQa.filter((item) =>
      [item.question, item.answer, item.explanation]
        .some((value) => value.toLowerCase().includes(q)),
    );
    const results: SearchResults = { chapters, questions };
    return results;
  }

  return undefined;
}
