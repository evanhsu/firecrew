<?php
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return [
    'discard_classes' => [
        MethodNotAllowedHttpException::class,
        NotFoundHttpException::class,
    ],
];