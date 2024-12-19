<?php

namespace App\Controller;

use App\Entity\Detail;
use App\Entity\Dette;
use App\Repository\ArticleRepository;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Attribute\Route;

class PanierController extends AbstractController
{
    #[Route('/panier', name: 'app_panier')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/PanierController.php',
        ]);
    }
    #[Route('/api/panier/store/id={id}', name: 'panier.store', methods: ['post'])]
    public function addPanier(SessionInterface $session, Request $request, ArticleRepository $articleRepository): JsonResponse
    {
        $panier = $session->get('panier', []);
        if (count($panier) > 0) {
            foreach ($panier as $item) {
                if ((int)$item['id'] === $request->request->get('article')) {
                    $item['quantite'] += $request->request->get('quantite');
                    break;
                } else {
                    $panier[] = [
                        'id' => $request->request->get('article'),
                        'quantite' => $request->request->get('quantite'),
                        'article' => $articleRepository->find($request->request->get('article')),
                    ];
                }
            }
        } else {
            $panier[] = [
                'id' => $request->request->get('article'),
                'quantite' => $request->request->get('quantite'),
                'article' => $articleRepository->find($request->request->get('article')),
            ];
        }
        $session->set('panier', $panier);
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/PanierController.php',
        ]);
    }
    #[Route('/api/panier/id={id}', name: 'panier.get')]
    public function getPanier(SessionInterface $session): JsonResponse
    {
        $panier = $session->get('panier', []);
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/PanierController.php',
            'panier' => $panier,
        ]);
    }

    #[Route('/api/panier/save/id={id}', name: 'panier.save', methods: ['post'])]
    public function save($id, SessionInterface $session, ClientRepository $clientRepository, EntityManagerInterface $entityManager, ArticleRepository $articleRepository): JsonResponse
    {
        $panier = $session->get('panier', []);
        $client = $clientRepository->find($id);
        if (count($panier) == 0) {
            return $this->json([
                'message' => 'Welcome to your new controller!',
                'path' => 'src/Controller/PanierController.php',
            ]);
        }
        $dette = new Dette();
        $dette->setClient($client);
        foreach ($panier as $item) {
            $detail = new Detail();
            $article = $articleRepository->find($item['id']);
            $detail->setArticle($article);
            $article->setQuantite($article->getQuantite() - $item['quantite']);
            $detail->setQuantite($item['quantite']);
            $dette->addDetail($detail);
            $dette->setMontant($dette->getMontant() + $detail->getArticle()->getPrix() * $item['quantite']);
        }
        $entityManager->persist($dette);
        $entityManager->flush();
        $session->remove('panier');
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/PanierController.php',
        ]);
    }

    #[Route('/api/panier/delete/id={id}', name: 'panier.delete', methods: ['delete'])]
    public function deletePanier($id, SessionInterface $session): JsonResponse
    {
        $panier = $session->get('panier');
        foreach($panier as $key => $item) {
            if ($item['id'] == $id) {
                unset($panier[$key]);
                break;
            }
        }
        $session->set('panier', $panier);
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/PanierController.php',
        ]);
    }
}
