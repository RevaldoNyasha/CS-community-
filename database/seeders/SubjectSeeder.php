<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            ['name' => 'Introduction to Programming', 'code' => 'CS101', 'part' => 1, 'description' => 'Fundamentals of programming using Python'],
            ['name' => 'Discrete Mathematics', 'code' => 'CS102', 'part' => 1, 'description' => 'Logic, sets, relations, and combinatorics'],
            ['name' => 'Computer Architecture', 'code' => 'CS103', 'part' => 1, 'description' => 'Hardware organization and assembly language'],
            ['name' => 'Calculus I', 'code' => 'MA101', 'part' => 1, 'description' => 'Limits, derivatives, and integrals'],
            ['name' => 'Data Structures & Algorithms', 'code' => 'CS201', 'part' => 2, 'description' => 'Arrays, linked lists, trees, sorting, and searching'],
            ['name' => 'Object-Oriented Programming', 'code' => 'CS202', 'part' => 2, 'description' => 'OOP principles using Java/C++'],
            ['name' => 'Database Systems', 'code' => 'CS203', 'part' => 2, 'description' => 'Relational databases, SQL, and normalization'],
            ['name' => 'Linear Algebra', 'code' => 'MA201', 'part' => 2, 'description' => 'Vectors, matrices, and linear transformations'],
            ['name' => 'Operating Systems', 'code' => 'CS301', 'part' => 3, 'description' => 'Process management, memory, and file systems'],
            ['name' => 'Software Engineering', 'code' => 'CS302', 'part' => 3, 'description' => 'SDLC, design patterns, and project management'],
            ['name' => 'Computer Networks', 'code' => 'CS303', 'part' => 3, 'description' => 'Network protocols, TCP/IP, and security'],
            ['name' => 'Web Development', 'code' => 'CS304', 'part' => 3, 'description' => 'Full-stack web development'],
            ['name' => 'Artificial Intelligence', 'code' => 'CS401', 'part' => 4, 'description' => 'Search, knowledge representation, and machine learning'],
            ['name' => 'Distributed Systems', 'code' => 'CS402', 'part' => 4, 'description' => 'Distributed computing and cloud architectures'],
            ['name' => 'Cybersecurity', 'code' => 'CS403', 'part' => 4, 'description' => 'Security principles, cryptography, and ethical hacking'],
            ['name' => 'Final Year Project', 'code' => 'CS499', 'part' => 4, 'description' => 'Capstone research or development project'],
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
