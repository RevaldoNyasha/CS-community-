<?php

namespace App\Enums;

enum FeedItemStatus: string
{
    case Published = 'published';
    case Removed = 'removed';
}
