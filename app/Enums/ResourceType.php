<?php

namespace App\Enums;

enum ResourceType: string
{
    case PastExam = 'past_exam';
    case LectureNote = 'lecture_note';
    case Module = 'module';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::PastExam => 'Past Exam',
            self::LectureNote => 'Lecture Note',
            self::Module => 'Module',
            self::Other => 'Other',
        };
    }
}
