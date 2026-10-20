<?php

namespace App\Enums;

enum ConversationStatus: string
{
    /** A message request the recipient hasn't answered yet. */
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Declined = 'declined';
}
