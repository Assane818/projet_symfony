<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SecurityController extends AbstractController
{
    #[Route('/security', name: 'security')]
    public function securitytForm(): Response
    {
        $htmlContent = file_get_contents('../src/Views/security/security.html');
        return new Response($htmlContent);
    }
    #[Route('api/security', name: 'api_security')]
    public function getUserConnect(Request $request, UserRepository $userRepository): JsonResponse
    {
        $login = $request->request->get('login');
        $password = $request->request->get('password');
        $user = $userRepository->findOneBy(['login' => $login, 'password' => $password]);
        $userJson = json_encode($user);
        if ($user) {
            return $this->json([
                'message' => 'Welcome to your new controller!',
                'path' => 'src/Controller/SecurityController.php',
                'user' => $userJson,
                'status' => true,
            ]);
        }
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/SecurityController.php',
            'status' => false,
        ]);
    }
}
