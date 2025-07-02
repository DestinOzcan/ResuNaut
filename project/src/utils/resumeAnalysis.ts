import { JobDescription, AnalysisResult, Suggestion, AnalysisStep } from '../types';

export const extractKeywords = (text: string): string[] => {
  const techKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'HTML', 'CSS', 'SASS', 'Vue.js', 'Angular', 'Express.js', 'Django', 'Flask',
    'REST API', 'GraphQL', 'Microservices', 'DevOps', 'CI/CD', 'TDD', 'Agile', 'Scrum',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas',
    'Linux', 'Unix', 'Bash', 'PowerShell', 'Terraform', 'Ansible'
  ];

  const softSkills = [
    'Leadership', 'Project Management', 'Team Management', 'Communication',
    'Problem Solving', 'Critical Thinking', 'Collaboration', 'Mentoring',
    'Strategic Planning', 'Cross-functional', 'Stakeholder Management'
  ];

  const allKeywords = [...techKeywords, ...softSkills];
  const text_lower = text.toLowerCase();
  
  return allKeywords.filter(keyword => 
    text_lower.includes(keyword.toLowerCase())
  );
};

export const extractExperience = (resumeText: string): string[] => {
  const lines = resumeText.split('\n');
  const experienceSection = [];
  let inExperienceSection = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.toLowerCase().includes('experience') || 
        trimmedLine.toLowerCase().includes('employment') ||
        trimmedLine.toLowerCase().includes('work history')) {
      inExperienceSection = true;
      continue;
    }
    
    if (inExperienceSection) {
      if (trimmedLine.toLowerCase().includes('education') ||
          trimmedLine.toLowerCase().includes('skills') ||
          trimmedLine.toLowerCase().includes('projects')) {
        break;
      }
      if (trimmedLine.length > 0) {
        experienceSection.push(trimmedLine);
      }
    }
  }
  
  return experienceSection;
};

export const parseJobDescription = (content: string): JobDescription => {
  const keywords = extractKeywords(content);
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Extract requirements
  const requirements = [];
  let inRequirementsSection = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.toLowerCase().includes('requirement') ||
        trimmedLine.toLowerCase().includes('qualifications') ||
        trimmedLine.toLowerCase().includes('must have') ||
        trimmedLine.toLowerCase().includes('experience')) {
      inRequirementsSection = true;
      continue;
    }
    
    if (inRequirementsSection && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-'))) {
      requirements.push(trimmedLine.substring(1).trim());
    }
  }

  return {
    title: extractJobTitle(content),
    company: extractCompany(content),
    content,
    keywords,
    requirements: requirements.slice(0, 8)
  };
};

const extractJobTitle = (content: string): string => {
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim();
  
  // Common job title patterns
  const jobTitlePatterns = [
    /^(.+?)\s*-\s*.+$/,  // "Senior Developer - Company Name"
    /^(.+?)\s*\|\s*.+$/,  // "Senior Developer | Company Name"
    /^(.+?)\s*at\s*.+$/i, // "Senior Developer at Company"
  ];
  
  for (const pattern of jobTitlePatterns) {
    const match = firstLine?.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return firstLine || 'Software Engineer';
};

const extractCompany = (content: string): string => {
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim();
  
  const companyPatterns = [
    /^.+?\s*-\s*(.+)$/,   // "Title - Company Name"
    /^.+?\s*\|\s*(.+)$/,  // "Title | Company Name"
    /^.+?\s*at\s*(.+)$/i, // "Title at Company"
  ];
  
  for (const pattern of companyPatterns) {
    const match = firstLine?.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return 'Tech Company';
};

export const analyzeResume = (resumeContent: string, jobDescription: JobDescription): AnalysisResult => {
  const resumeKeywords = extractKeywords(resumeContent);
  const jobKeywords = jobDescription.keywords;
  
  const matchingKeywords = resumeKeywords.filter(keyword => 
    jobKeywords.some(jk => jk.toLowerCase() === keyword.toLowerCase())
  );
  
  const missingKeywords = jobKeywords.filter(keyword => 
    !resumeKeywords.some(rk => rk.toLowerCase() === keyword.toLowerCase())
  ).slice(0, 8); // Limit to most important missing keywords

  const matchScore = jobKeywords.length > 0 ? 
    Math.round((matchingKeywords.length / jobKeywords.length) * 100) : 0;

  const suggestions = generateSuggestions(resumeContent, jobDescription, missingKeywords, matchingKeywords);
  const optimizedContent = generateOptimizedResume(resumeContent, jobDescription, suggestions);

  return {
    matchScore,
    missingKeywords,
    strengthKeywords: matchingKeywords,
    suggestions,
    optimizedContent
  };
};

const generateSuggestions = (
  resumeContent: string, 
  jobDescription: JobDescription, 
  missingKeywords: string[],
  matchingKeywords: string[]
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  
  // Missing keyword suggestions
  missingKeywords.slice(0, 4).forEach((keyword, index) => {
    suggestions.push({
      id: `missing-${index}`,
      type: 'keyword',
      title: `Add "${keyword}" to your mission profile`,
      description: `This skill appears in the mission briefing but not in your resume. Adding it will improve your match score.`,
      priority: 'high',
      enabled: true,
      section: 'skills'
    });
  });

  // Content improvement suggestions
  const experienceLines = extractExperience(resumeContent);
  
  // Look for bullet points that could be improved
  experienceLines.slice(0, 3).forEach((line, index) => {
    if ((line.includes('•') || line.includes('-')) && line.length > 30) {
      const bulletPoint = line.replace(/^[•\-\s]+/, '').trim();
      
      // Check if bullet point lacks quantification
      if (!/\d+/.test(bulletPoint)) {
        const improvedBullet = enhanceBulletPoint(bulletPoint);
        suggestions.push({
          id: `quantify-${index}`,
          type: 'content',
          title: 'Quantify your mission achievements',
          description: 'Add specific numbers and metrics to demonstrate your impact and results.',
          priority: 'high',
          original: bulletPoint,
          improved: improvedBullet,
          enabled: true,
          section: 'experience'
        });
      }
    }
  });

  // ATS optimization suggestions
  if (!resumeContent.toLowerCase().includes('work experience') && 
      !resumeContent.toLowerCase().includes('professional experience')) {
    suggestions.push({
      id: 'ats-headers',
      type: 'ats',
      title: 'Use standard navigation headers',
      description: 'Replace custom section headers with ATS-friendly standard headers like "Work Experience".',
      priority: 'medium',
      enabled: true,
      section: 'formatting'
    });
  }

  // Formatting suggestions
  const sections = ['experience', 'skills', 'education'];
  const missingSections = sections.filter(section => 
    !resumeContent.toLowerCase().includes(section)
  );

  if (missingSections.length > 0) {
    suggestions.push({
      id: 'formatting-structure',
      type: 'formatting',
      title: 'Improve resume structure',
      description: `Add missing standard sections: ${missingSections.join(', ')}. This improves readability and ATS parsing.`,
      priority: 'medium',
      enabled: true,
      section: 'structure'
    });
  }

  // Contact information optimization
  if (!resumeContent.includes('@') || !resumeContent.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/)) {
    suggestions.push({
      id: 'contact-info',
      type: 'formatting',
      title: 'Enhance contact information',
      description: 'Ensure your email and phone number are clearly visible at the top of your resume.',
      priority: 'high',
      enabled: true,
      section: 'header'
    });
  }

  return suggestions.slice(0, 8); // Limit to 8 most important suggestions
};

const enhanceBulletPoint = (original: string): string => {
  const enhancements = [
    { pattern: /developed|created|built/i, addition: ' (increased efficiency by 30% and reduced processing time by 2 hours)' },
    { pattern: /managed|led|supervised/i, addition: ' (team of 5 developers, delivered 3 major projects on time)' },
    { pattern: /improved|optimized|enhanced/i, addition: ' (resulting in 25% performance improvement and $50K cost savings)' },
    { pattern: /implemented|deployed|launched/i, addition: ' (serving 10K+ users with 99.9% uptime)' },
    { pattern: /collaborated|worked/i, addition: ' (with cross-functional team of 8 members across 3 departments)' }
  ];

  for (const enhancement of enhancements) {
    if (enhancement.pattern.test(original)) {
      return original + enhancement.addition;
    }
  }

  return original + ' (achieved measurable results and exceeded performance targets)';
};

const generateOptimizedResume = (
  original: string, 
  jobDesc: JobDescription, 
  suggestions: Suggestion[]
): string => {
  let optimized = original;
  
  // This is a placeholder - the actual optimization is now handled in the component
  // based on user selections
  return optimized;
};

export const getAnalysisSteps = (): AnalysisStep[] => [
  {
    id: 'parsing',
    title: 'Scanning Mission Documents',
    description: 'Extracting text and structure from your resume and mission briefing',
    completed: false,
    progress: 0
  },
  {
    id: 'keywords',
    title: 'Analyzing Mission Requirements',
    description: 'Identifying key skills and requirements from the job posting',
    completed: false,
    progress: 0
  },
  {
    id: 'matching',
    title: 'Calculating Mission Alignment',
    description: 'Comparing your resume against mission requirements',
    completed: false,
    progress: 0
  },
  {
    id: 'optimizing',
    title: 'Optimizing for Launch',
    description: 'Generating AI-powered improvements and mission recommendations',
    completed: false,
    progress: 0
  }
];