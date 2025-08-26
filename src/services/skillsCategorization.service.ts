/**
 * Service for categorizing and analyzing candidate skills
 */

export interface SkillCategory {
  name: string;
  keywords: string[];
  priority: number; // Higher means more important
}

export interface CategorizedSkill {
  skill: string;
  categories: string[];
  isTech: boolean;
  priority: number;
  icon?: string;
}

/**
 * Comprehensive skills categorization service
 */
export class SkillsCategorizationService {
  private skillCategories: SkillCategory[] = [
    {
      name: 'Frontend',
      keywords: ['react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css', 'sass', 'less', 'webpack', 'vite', 'next', 'nuxt'],
      priority: 9
    },
    {
      name: 'Backend',
      keywords: ['node', 'express', 'fastapi', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', '.net', 'php'],
      priority: 9
    },
    {
      name: 'Programming Languages',
      keywords: ['python', 'javascript', 'typescript', 'java', 'c#', 'go', 'rust', 'kotlin', 'swift', 'ruby', 'php', 'scala'],
      priority: 10
    },
    {
      name: 'Cloud & DevOps',
      keywords: ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab', 'github actions'],
      priority: 8
    },
    {
      name: 'Databases',
      keywords: ['mongodb', 'postgresql', 'mysql', 'redis', 'cassandra', 'elasticsearch', 'dynamodb', 'sqlite', 'oracle'],
      priority: 7
    },
    {
      name: 'Mobile',
      keywords: ['react native', 'flutter', 'swift', 'kotlin', 'xamarin', 'ionic', 'cordova'],
      priority: 8
    },
    {
      name: 'Data & AI',
      keywords: ['machine learning', 'ml', 'ai', 'data science', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn'],
      priority: 9
    },
    {
      name: 'Design',
      keywords: ['figma', 'sketch', 'adobe', 'ui/ux', 'photoshop', 'illustrator', 'design'],
      priority: 5
    },
    {
      name: 'Project Management',
      keywords: ['agile', 'scrum', 'kanban', 'jira', 'trello', 'asana', 'project management'],
      priority: 4
    },
    {
      name: 'Soft Skills',
      keywords: ['leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking'],
      priority: 3
    }
  ];

  /**
   * Categorizes a single skill
   */
  categorizeSkill(skill: string): CategorizedSkill {
    const normalizedSkill = skill.toLowerCase().trim();
    const categories: string[] = [];
    let maxPriority = 0;
    let isTech = false;

    for (const category of this.skillCategories) {
      const matches = category.keywords.some(keyword => 
        normalizedSkill.includes(keyword.toLowerCase())
      );
      
      if (matches) {
        categories.push(category.name);
        maxPriority = Math.max(maxPriority, category.priority);
        
        // Mark as tech if it's in a tech category (priority >= 6)
        if (category.priority >= 6) {
          isTech = true;
        }
      }
    }

    return {
      skill,
      categories,
      isTech,
      priority: maxPriority,
      icon: this.getSkillIcon(categories, normalizedSkill)
    };
  }

  /**
   * Categorizes an array of skills
   */
  categorizeSkills(skills: string[]): CategorizedSkill[] {
    return skills.map(skill => this.categorizeSkill(skill));
  }

  /**
   * Gets tech skills from an array
   */
  getTechSkills(skills: string[]): CategorizedSkill[] {
    return this.categorizeSkills(skills).filter(skill => skill.isTech);
  }

  /**
   * Gets non-tech skills from an array
   */
  getNonTechSkills(skills: string[]): CategorizedSkill[] {
    return this.categorizeSkills(skills).filter(skill => !skill.isTech);
  }

  /**
   * Sorts skills by priority and category
   */
  sortSkillsByPriority(skills: CategorizedSkill[]): CategorizedSkill[] {
    return [...skills].sort((a, b) => {
      // First sort by priority (descending)
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // Then by skill name (ascending)
      return a.skill.localeCompare(b.skill);
    });
  }

  /**
   * Groups skills by category
   */
  groupSkillsByCategory(skills: CategorizedSkill[]): Record<string, CategorizedSkill[]> {
    const grouped: Record<string, CategorizedSkill[]> = {};
    
    skills.forEach(skill => {
      if (skill.categories.length === 0) {
        // Uncategorized skills
        if (!grouped['Other']) {
          grouped['Other'] = [];
        }
        grouped['Other'].push(skill);
      } else {
        // Add to each category it belongs to
        skill.categories.forEach(category => {
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(skill);
        });
      }
    });

    return grouped;
  }

  /**
   * Gets skill statistics
   */
  getSkillStats(skills: string[]): {
    total: number;
    techSkills: number;
    nonTechSkills: number;
    categoriesCount: Record<string, number>;
    topCategory: string | null;
  } {
    const categorized = this.categorizeSkills(skills);
    const techSkills = categorized.filter(s => s.isTech).length;
    const nonTechSkills = categorized.length - techSkills;
    
    const categoriesCount: Record<string, number> = {};
    let maxCount = 0;
    let topCategory: string | null = null;

    categorized.forEach(skill => {
      skill.categories.forEach(category => {
        categoriesCount[category] = (categoriesCount[category] || 0) + 1;
        if (categoriesCount[category] > maxCount) {
          maxCount = categoriesCount[category];
          topCategory = category;
        }
      });
    });

    return {
      total: skills.length,
      techSkills,
      nonTechSkills,
      categoriesCount,
      topCategory
    };
  }

  /**
   * Checks if a skill is considered technical
   */
  isTechnicalSkill(skill: string): boolean {
    return this.categorizeSkill(skill).isTech;
  }

  /**
   * Gets icon for skill based on category and name
   */
  private getSkillIcon(categories: string[], skillName: string): string | undefined {
    // Priority order for icons
    if (categories.includes('Programming Languages')) return 'code';
    if (categories.includes('Frontend')) return 'monitor';
    if (categories.includes('Backend')) return 'server';
    if (categories.includes('Cloud & DevOps')) return 'cloud';
    if (categories.includes('Databases')) return 'database';
    if (categories.includes('Mobile')) return 'smartphone';
    if (categories.includes('Data & AI')) return 'brain';
    if (categories.includes('Design')) return 'palette';
    if (categories.includes('Project Management')) return 'calendar';
    
    // Specific skill icons
    if (skillName.includes('react')) return 'react';
    if (skillName.includes('node')) return 'hexagon';
    if (skillName.includes('python')) return 'code';
    if (skillName.includes('docker')) return 'package';
    if (skillName.includes('aws')) return 'cloud';
    
    return undefined;
  }

  /**
   * Adds a custom skill category
   */
  addSkillCategory(category: SkillCategory): void {
    this.skillCategories.push(category);
  }

  /**
   * Updates an existing skill category
   */
  updateSkillCategory(categoryName: string, updates: Partial<SkillCategory>): boolean {
    const index = this.skillCategories.findIndex(cat => cat.name === categoryName);
    if (index === -1) return false;
    
    this.skillCategories[index] = { ...this.skillCategories[index], ...updates };
    return true;
  }

  /**
   * Gets all available skill categories
   */
  getSkillCategories(): SkillCategory[] {
    return [...this.skillCategories];
  }
}

// Export singleton instance
export const skillsCategorizationService = new SkillsCategorizationService();