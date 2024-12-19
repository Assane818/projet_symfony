<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\User;
use App\Repository\ClientRepository;
use App\Repository\DetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Id;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

class ClientController extends AbstractController
{
    #[Route('clients', name: 'clients.index')]
    public function index(): Response
    {
        // Charger la vue HTML depuis le fichier
        $htmlContent = file_get_contents('../src/Views/Client/index.html');
        // Retourner la vue HTML
        return new Response($htmlContent);
    }

    #[Route('/api/clients', name: 'api_clients')]
    public function getClientData(ClientRepository $clientRepository, Request $request, SerializerInterface $serializer): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 2);
        $search = $request->query->get('search');
        $offset = ($page - 1) * $limit;
        $totalClients = $clientRepository->count();
         // Récupérer les données depuis la base de données
         if ($search != null || $search != '') {
            $clients = $clientRepository->findByUsername($search, $limit, $offset);
            $totalClients = count($clients);
         }
        else {
            $clients = $clientRepository->findBy([], ['id' => 'Asc'], $limit, $offset);
        }
        // Sérialiser les données avec gestion des références circulaires
        $clientsJson = $serializer->serialize($clients, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId(); // Retourner l'ID pour éviter la boucle
            },
        ]);

        return $this->json(
            [
                'message' => 'Welcome to your new controller!',
                'path' => 'src/Controller/ClientController.php',
                'totalPages' => ceil($totalClients / $limit),
                'currentPage' => $page,
                'totalClients' => $totalClients,
                'clients' => json_decode($clientsJson),
            ]
        );
    }

    #[Route('clients/form', name: 'clients.form')]
    public function form(): Response
    {
        // Charger la vue HTML depuis le fichier
        $htmlContent = file_get_contents('../src/Views/Client/form.html');
        // Retourner la vue HTML
        return new Response($htmlContent);
    }

    #[Route('api/clients/store', name: 'clients.store', methods: ['post'])]
    public function store(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $client = new Client();
        $client->setUsername($request->request->get('surname'));
        $client->setTelephone($request->request->get('phone'));
        $client->setAddress($request->request->get('address'));
        $toogleSwitch  = $request->request->get('toogle-switch');
        if ($toogleSwitch != null) {
            $user = new User();
            $user->setNom($request->request->get('nom'));
            $user->setPrenom($request->request->get('prenom'));
            $user->setLogin($request->request->get('login'));
            $user->setPassword($request->request->get('password'));
            $imageFile = $request->files->get('image');
            if ($imageFile) {
                $imagePath = $imageFile->getClientOriginalName();
                $imageFile->move('/home/assane/symfony/gestion_dette_distribut/public/img', $imagePath);
                $user->setImage($imagePath);
            }
            $client->setUsers($user);
        }
        else {
            $client->setUsers(null);
        }
        $entityManager->persist($client);
        $entityManager->flush();
        
        return $this->json([
            'message' => 'Client created successfully',
        ]);
    }


    #[Route('clients/dette/{id}', name: 'clients.dettes')]
    public function detteClient(): Response
    {
        // Charger la vue HTML depuis le fichier
        $htmlContent = file_get_contents('../src/Views/Client/detteClient.html');
        // Retourner la vue HTML
        return new Response($htmlContent);
    }

    #[Route('api/clients/dette/id={id}', name: 'api_clients.dettes')]
    public function getDetteClient($id, DetteRepository $detteRepository, Request $request, SerializerInterface $serializer, ClientRepository $clientRepository): JsonResponse
    {
        $id = (int)$id;
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 2);
        $offset = ($page - 1) * $limit;
        $client = $clientRepository->find($id);
        $clientJson = $serializer->serialize($client, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            },
        ]);
        $totalDettesClient = count($detteRepository->findBy(['client' => $id]));
        $detteClient = $detteRepository->findBy(['client' => $client], [], $limit, $offset);
        $montantTotal = 0;
        if ($totalDettesClient > 0) {
            foreach ($detteRepository->findBy(['client' => $id]) as $dette) {
                $montantTotal += ($dette->getMontant() - $dette->getMontantVerser());
            }
        }

        $detteClientJson = $serializer->serialize($detteClient, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            },
        ]);
        return $this->json([
            'path' => 'src/Controller/ClientController.php',
            'totalPages' => ceil($totalDettesClient / $limit),
            'currentPage' => $page,
            'totalDettesClient' => $totalDettesClient,
            'detteClient' => json_decode($detteClientJson),
            'client' => json_decode($clientJson),
            'montantTotal' => $montantTotal,
        ]);
    }

}
