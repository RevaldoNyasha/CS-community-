<?php

namespace App\Enums;

enum PostType: string
{
    case Resource = 'resource';
    case Hackathon = 'hackathon';
    case Announcement = 'announcement';
}
