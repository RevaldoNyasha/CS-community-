<?php

namespace App\Enums;

enum PostType: string
{
    case Resource = 'resource';
    case Hackathon = 'hackathon';
    case Project = 'project';
    case Announcement = 'announcement';
}
