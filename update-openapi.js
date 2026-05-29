const fs = require('fs');
const path = require('path');

const openapiPath = path.join(__dirname, 'lib/api-spec/openapi.yaml');
let content = fs.readFileSync(openapiPath, 'utf8');

// Replace integer with string for id fields
const idFields = [
  'id', 'subjectId', 'chapterId', 'noteId', 'mcqId', 'qaId', 'videoId', 'experimentId', 'userId'
];

// Regex to find:
// name:
//   type: integer
for (const field of idFields) {
  const regex = new RegExp(`(${field}:\\n\\s*)type:\\s*integer`, 'g');
  content = content.replace(regex, `$1type: string`);
}

fs.writeFileSync(openapiPath, content);
console.log('OpenAPI spec updated successfully.');
