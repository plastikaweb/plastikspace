#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Configuració
const README_PATH = './mvp_github_issues.md'; // Ruta al teu readme
const REPO = 'plastikaweb/plastikspace'; // Canvia amb el teu repo

// Estructura per parsear els issues
const issues = [];
let currentSection = '';

// Llegir el markdown
const content = fs.readFileSync(README_PATH, 'utf-8');
const lines = content.split('\n');

// Parser simple del markdown
let currentIssue = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detectar secció (##)
  if (line.startsWith('## ')) {
    currentSection = line.replace('## ', '').trim();
  }

  // Detectar issue (###)
  if (line.startsWith('### ')) {
    if (currentIssue) {
      issues.push(currentIssue);
    }

    currentIssue = {
      title: line.replace('### ', '').trim(),
      section: currentSection,
      labels: [],
      description: '',
      tasks: []
    };
    continue;
  }

  // Detectar labels
  if (currentIssue && line.startsWith('- Labels:')) {
    const labelStr = line.replace('- Labels:', '').trim();
    currentIssue.labels = labelStr
      .replace(/`/g, '')
      .split(',')
      .map(l => l.trim());
  }

  // Detectar descripció
  if (currentIssue && line.startsWith('- Description:')) {
    currentIssue.description = line.replace('- Description:', '').trim();
  }

  // Detectar tasks
  if (currentIssue && line.startsWith('  - [ ]')) {
    const task = line.replace('  - [ ]', '').trim();
    currentIssue.tasks.push(task);
  }
}

// Afegir l'últim issue
if (currentIssue) {
  issues.push(currentIssue);
}

console.log(`\n📋 S'han trobat ${issues.length} issues\n`);

// Funció per crear un issue
function createIssue(issue) {
  try {
    // Construir el body amb descripció i tasks
    let body = issue.description;

    if (issue.tasks.length > 0) {
      body += '\n\n### Tasks:\n';
      issue.tasks.forEach(task => {
        body += `- [ ] ${task}\n`;
      });
    }

    // Construir la comanda gh
    let command = `gh issue create --repo ${REPO} --title "${issue.title}" --body "${body.replace(/"/g, '\\"')}"`;

    // Afegir labels
    if (issue.labels.length > 0) {
      command += ` --label "${issue.labels.join(',')}"`;
    }

    console.log(`✅ Creant: ${issue.title}`);
    execSync(command, { stdio: 'inherit' });

  } catch (error) {
    console.error(`❌ Error creant issue "${issue.title}":`, error.message);
  }
}

// Confirmar avant de crear
console.log('Issues que es crearan:\n');
issues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue.title}`);
  console.log(`   Labels: ${issue.labels.join(', ')}`);
});

console.log(`\n⚠️  Això crearà ${issues.length} issues. Estàs segur? (escriu 'yes' per continuar)`);

// Llegir input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n> ', (answer) => {
  rl.close();

  if (answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Creant issues...\n');

    // Crear els issues seqüencialment
    issues.forEach(issue => {
      createIssue(issue);
    });

    console.log(`\n✨ Fet! S'han creat ${issues.length} issues`);
  } else {
    console.log('❌ Operació cancel·lada');
    process.exit(1);
  }
});