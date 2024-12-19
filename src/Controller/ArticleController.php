<?php

namespace App\Controller;

use App\Entity\Article;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ArticleController extends AbstractController
{
    #[Route('/articles', name: 'articles.index')]
    public function index(): Response
    {
       $htmlContent = file_get_contents('../src/Views/article/index.html');
        return new Response($htmlContent);
    }

    #[Route('/api/articles', name: 'api_articles.index')]
    public function getArticleData(ArticleRepository $articleRepository, SerializerInterface $serializer, Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 2);
        $offset = ($page - 1) * $limit;
        $totalArticle = $articleRepository->count();
        $allArtices = $articleRepository->findAll();
        $allArticesJson = $serializer->serialize($allArtices, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            },
        ]);
         // Récupérer les données depuis la base de données
        $articles = $articleRepository->findBy([], ['id' => 'Asc'], $limit, $offset);
        // Sérialiser les données avec gestion des références circulaires
        $articlesJson = $serializer->serialize($articles, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId(); // Retourner l'ID pour éviter la boucle
            },
        ]);

        return $this->json(
            [
                'path' => 'src/Controller/ClientController.php',
                'totalPages' => ceil($totalArticle / $limit),
                'currentPage' => $page,
                'totalArticles' => $totalArticle,
                'articles' => json_decode($articlesJson),
                'allArticles' => json_decode($allArticesJson),
            ]
        );
    }

    #[Route('/articles/update/{id}', name: 'articles.updateForm')]
    public function updateForm(): Response
    {
       $htmlContent = file_get_contents('../src/Views/article/updateForm.html');
        return new Response($htmlContent);
    }

    #[Route('/api/articles/update/id={id}', name: 'articles.update', methods: ['post'])]
    public function update($id, ArticleRepository $articleRepository, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $id = (int) $id;
        $article = $articleRepository->find($id);
        $article->setQuantite($request->request->get('quantite'));
        $entityManager->persist($article);
        $entityManager->flush();
        return $this->json([
            'path' => 'src/Controller/ArticleController.php',
        ]);
    }

    #[Route('/articles/form', name: 'articles.form')]
    public function form(): Response
    {
       $htmlContent = file_get_contents('../src/Views/article/form.html');
        return new Response($htmlContent);
    }

    #[Route('/api/articles/store', name: 'articles.store', methods: ['post'])]
    public function store(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $article = new Article();
        $article->setLibelle($request->request->get('libelle'));
        $article->setQuantite($request->request->get('quantite'));
        $article->setPrix($request->request->get('prix'));
        $entityManager->persist($article);
        $entityManager->flush();
        return $this->json([
            'path' => 'src/Controller/ArticleController.php',
        ]);
    }
}
