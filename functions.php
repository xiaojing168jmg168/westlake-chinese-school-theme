<?php
function wcs_files(){
    wp_enqueue_style('wcs_main_styles', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'wcs_files');
?>