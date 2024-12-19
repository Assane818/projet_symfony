<?php

namespace App\Enum;

enum Role: string
{
    case ADMIN = 'Admin';
    case BOUTIQUIER = 'Boutiquier';
    case CLIENT = 'Client';
}