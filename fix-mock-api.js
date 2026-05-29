const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, 'lib/api-client-react/src/mock-api.ts');
let content = fs.readFileSync(mockPath, 'utf8');

// Replace integer IDs with strings
// id: \d+, -> id: "\d+",
content = content.replace(/(id|subjectId|chapterId|userId):\s*(\d+),/g, '$1: "$2",');

// Mock data filtering
// === id -> === "id"
// Number(url.searchParams.get("...")) -> url.searchParams.get("...")
content = content.replace(/const subjectId = Number\(url\.searchParams\.get\("subjectId"\) \?\? ""\);/g, 'const subjectId = url.searchParams.get("subjectId");');
content = content.replace(/const chapterId = Number\(url\.searchParams\.get\("chapterId"\) \?\? ""\);/g, 'const chapterId = url.searchParams.get("chapterId");');

content = content.replace(/const id = Number\(path\.split\("\/"\)\.pop\(\)\);/g, 'const id = path.split("/").pop() || "";');

fs.writeFileSync(mockPath, content);
console.log('mock-api.ts fixed');
