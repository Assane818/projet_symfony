<?php

namespace App\Enum;

enum StatutDette: string
{
    case Solde = 'Solde';
    case NonSolde = 'Non Solde';
    case All = 'All';
}