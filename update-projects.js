const https = require('https');
const fs = require('fs');

// Your published Google Sheets CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTP0-E7SPOAEOq3D5uswy-iupKjrSeqiBI0Ca6CzzJ86-3pt2EXlSSME7H3GmMwO8u8tv_bgq98Nwh4/pub?output=csv';

function fetchCSVData() {
    return new Promise((resolve, reject) => {
        https.get(SHEET_URL, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                resolve(data);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const projects = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            // Simple CSV parsing - split by tabs since your data uses tabs
            const columns = line.split('\t');
            if (columns.length >= 4) {
                projects.push({
                    hackerName: columns[0] || '',
                    projectLink: columns[1] || '',
                    legalAdvice: columns[2] || '',
                    lawyer: columns[3] || ''
                });
            }
        }
    }
    
    return projects;
}

function generateProjectHTML(projects) {
    let html = '            <div class="projects-grid">\n';
    html += '                <!-- Auto-generated from Google Sheets -->\n';
    
    projects.forEach(project => {
        const hasLink = project.projectLink && 
                       project.projectLink !== 'n/a' && 
                       project.projectLink.trim() !== '';
        
        html += '                <div class="project-card">\n';
        html += '                    <div class="project-header">\n';
        html += `                        <h3 class="project-hacker">${escapeHtml(project.hackerName)}</h3>\n`;
        
        if (hasLink) {
            html += `                        <a href="${escapeHtml(project.projectLink)}" class="project-link" target="_blank">View Project →</a>\n`;
        } else {
            html += '                        <span class="project-link">No Link Available</span>\n';
        }
        
        html += '                    </div>\n';
        html += '                    <div class="project-advice">\n';
        html += '                        <h4>Legal Advice Provided:</h4>\n';
        html += `                        <p>${escapeHtml(project.legalAdvice)}</p>\n`;
        html += '                    </div>\n';
        html += '                    <div class="project-lawyer">\n';
        html += '                        <span class="lawyer-label">Legal Advisor:</span>\n';
        html += `                        <span class="lawyer-name">${escapeHtml(project.lawyer)}</span>\n`;
        html += '                    </div>\n';
        html += '                </div>\n\n';
    });
    
    html += '            </div>';
    return html;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

function updateIndexHTML(projectsHTML) {
    const indexPath = 'index.html';
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Find the projects section and replace it
    const startMarker = '<div class="projects-grid">';
    const endMarker = '</div>\n        </div>\n    </section>';
    
    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length - '</div>\n        </div>\n    </section>'.length;
    
    if (startIndex !== -1 && endIndex !== -1) {
        const beforeProjects = content.substring(0, startIndex);
        const afterProjects = content.substring(endIndex);
        
        const newContent = beforeProjects + projectsHTML + '\n        ' + afterProjects;
        fs.writeFileSync(indexPath, newContent, 'utf8');
        console.log('✅ Successfully updated index.html with latest projects');
    } else {
        console.error('❌ Could not find projects section in index.html');
    }
}

function updateProjectCount(projectCount) {
    const indexPath = 'index.html';
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Update the project count in the hero section
    const countRegex = /<span id="project-count">\d+<\/span>/;
    const newCountSpan = `<span id="project-count">${projectCount}</span>`;
    
    if (countRegex.test(content)) {
        content = content.replace(countRegex, newCountSpan);
        fs.writeFileSync(indexPath, content, 'utf8');
        console.log(`✅ Updated project count to ${projectCount}`);
    } else {
        console.error('❌ Could not find project count span in index.html');
    }
}

async function main() {
    try {
        console.log('🔄 Fetching data from Google Sheets...');
        const csvData = await fetchCSVData();
        
        console.log('📊 Parsing CSV data...');
        const projects = parseCSV(csvData);
        
        console.log(`📋 Found ${projects.length} projects`);
        
        console.log('🏗️ Generating HTML...');
        const projectsHTML = generateProjectHTML(projects);
        
        console.log('💾 Updating index.html...');
        updateIndexHTML(projectsHTML);
        
        console.log('🔢 Updating project count...');
        updateProjectCount(projects.length);
        
        console.log('🎉 Update complete!');
    } catch (error) {
        console.error('❌ Error updating projects:', error);
        process.exit(1);
    }
}

main(); 