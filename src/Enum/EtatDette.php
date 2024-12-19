<?php

namespace App\Enum;

enum EtatDette: string
{
    case VALIDER = 'Valider';
    case ENCOURS = 'En cours';
    case REFUSER = 'Refuser';
    case ARCHIVER = 'Archiver';
}