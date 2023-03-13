<?php
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return [
    'discard_classes' => [
        NotFoundHttpException::class,
    ],
];