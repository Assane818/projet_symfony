<?php

namespace App\Controller;

use App\Repository\DetteRepository;
use App\Repository\PayementRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class DetteController extends AbstractController
{
    #[Route('/dettes', name: 'app_dette')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/DetteController.php',
        ]);
    }

    #[Route('/dettes/detail/{detteid}&{clientid}', name: 'dettes.detail')]
    public function detail(): Response
    {
        $htmlContent = file_get_contents('../src/Views/dette/detail.html');
        return new Response($htmlContent);
    }

    #[Route('/api/dettes/detail/detteid={detteid}&clientid={clientid}', name: 'api_dettes.detail')]
    public function getDetailDette($detteid, $clientid,PayementRepository $payementRepository, DetteRepository $detteRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        $detteId = (int) $detteid;
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 2);
        $offset = ($page - 1) * $limit;
        $dette = $detteRepository->find($detteId);
        $detteJson = $serializer->serialize($dette, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            },
        ]);

        $totalPayements = count($payementRepository->findBy(['dette' => $dette]));
        $payementsDette = $payementRepository->findBy(['dette' => $dette], [], $limit, $offset);
        $payementsJson = $serializer->serialize($payementsDette, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            },
        ]);
        return $this->json([
            'path' => 'src/Controller/DetteController.php',
            'totalPages' => ceil($totalPayements / $limit),
            'currentPage' => $page,
            'dette' => json_decode($detteJson),
            'payements' => json_decode($payementsJson),
            'totalPayements' => $totalPayements
        ]);
    }

    #[Route('/dettes/form/{id}', name: 'dettes.form')]
    public function form(): Response
    {
        $htmlContent = file_get_contents('../src/Views/dette/form.html');
        return new Response($htmlContent);
    }
}
