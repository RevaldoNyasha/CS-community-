<?php

namespace App\Enums;

enum FeedCategory: string
{
    case Programming = 'Programming';
    case ArtificialIntelligence = 'Artificial Intelligence';
    case MachineLearning = 'Machine Learning';
    case WebDevelopment = 'Web Development';
    case MobileDevelopment = 'Mobile Development';
    case Cybersecurity = 'Cybersecurity';
    case CloudComputing = 'Cloud Computing';
    case DevOps = 'DevOps';
    case DataScience = 'Data Science';
    case Databases = 'Databases';
    case OpenSource = 'Open Source';
    case CareerAdvice = 'Career Advice';
    case Scholarships = 'Scholarships';
    case ResearchPapers = 'Research Papers';
    case Other = 'Other';

    /**
     * All category values, e.g. for validation `in:` rules.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $case): string => $case->value, self::cases());
    }
}
