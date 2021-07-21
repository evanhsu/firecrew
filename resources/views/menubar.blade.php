<?php
// This View triggers the MenubarComposer when it is invoked.
// The MenubarComposer determines which menubar template to
// display and returns $menubar_type
//
// Invokes 'app/Http/ViewComposers/MenubarComposer.php'
// This binding is registered in 'app/Providers/ViewServiceProvider.php'
?>
@include('menubar.'.(isset($menubar_type) ? $menubar_type : 'guest'))
