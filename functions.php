<?php
require get_theme_file_path('/inc/search-route.php');

function wsc_custom_rest(){
  register_rest_field('post','authorName', array(
    'get_callback' => function(){
      return get_the_author();
    }
  ));
}
add_action('rest_api_init','wsc_custom_rest');

function pageBanner($args = NULL) {
if (!isset($args['title'])){
$args['title'] = get_the_title();
}

if (!isset($args['subtitle'])) {
$args['subtitle'] = get_field('page_banner_subtitle');
}
if (!isset($args['image'])) {
  if(get_field('page_banner_background_image') AND !is_archive() AND !is_home()){
    $args['image'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
  }
 else{
  $args['image'] = get_theme_file_uri('/images/ocean.jpg');
 }
  }
  ?>
  <div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['image']; ?>)"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title'] ?></h1>
        <div class="page-banner__intro">
          <p><?php echo $args['subtitle'] ?></p>
        </div>
      </div>
    </div>
  <?php
}
function wcs_files(){
    wp_enqueue_script('main-chinese-js',get_theme_file_uri('/build/index.js'),array('jquery'), '1.0', true);
    wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('wcs_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style('wcs_extra_styles', get_theme_file_uri('/build/index.css'));

    wp_localize_script('main-chinese-js', 'wcsData', array(
      'root_url' => get_site_url(),
    ));
}
add_action('wp_enqueue_scripts', 'wcs_files');


function wcs_features(){
    // register_nav_menu('headerMenuLocation', 'Header Menu Location');
    // register_nav_menu('footerLocationOne', 'Footer Location One');
    // register_nav_menu('footerLocationTwo', 'Footer Location Two');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_image_size('professorLandscape', 400, 260, true);
    add_image_size('professorPortrait', 900, 350, true);
    add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'wcs_features');

function wcs_adjust_queries($query) {
  if(!is_admin() AND is_post_type_archive('program') AND is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }

  if(!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()){
    $today = date('Ymd');
    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query',array(
        array(
          'key' => 'event_date',
          'compare' => '>=',
          'value' => $today,
          'type' => 'numeric'
        )
        ));
  }
}

add_action('pre_get_posts', 'wcs_adjust_queries');