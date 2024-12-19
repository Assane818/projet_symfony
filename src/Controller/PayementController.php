<?php

namespace App\Controller;

use App\Entity\Dette;
use App\Entity\Payement;
use App\Repository\DetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PayementController extends AbstractController
{
    #[Route('/payement', name: 'app_payement')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/PayementController.php',
        ]);
    }

    #[Route('/payements/form/detteid={detteid}&clientid={clientid}', name: 'payement.form')]
    public function form(): Response
    {
        $htmlContent = file_get_contents('../src/Views/payement/form.html');
        return new Response($htmlContent);
    }

    #[Route('/api/payements/store/detteid={detteid}&clientid={clientid}', name: 'api_payement.store', methods: ['post'])]
    public function store($detteid, Request $request, EntityManagerInterface $entityManager, DetteRepository $detteRepository): JsonResponse
    {
        $detteId = (int) $detteid;
        $dette = $detteRepository->find($detteId);
        $payement = new Payement();
        $payement->setMontantPayer($request->request->get('montantPayer'));
        $payement->setDette($dette);
        $entityManager->persist($payement);
        $dette->setMontantVerser($dette->getMontantVerser() + $payement->getMontantPayer());
        $entityManager->persist($dette);
        $entityManager->flush();
        return $this->json([
            'message' => 'Payement created successfully',
            'path' => 'src/Controller/PayementController.php',
        ]);

    }
}
