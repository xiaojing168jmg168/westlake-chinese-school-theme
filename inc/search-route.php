<?php 
add_action('rest_api_init', 'wcsRegisterSearch');

function wcsRegisterSearch(){
    register_rest_route('wcs/v1', 'search', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'wcsSearchResults'
    ));
}

function wcsSearchResults($data){
  $mainQuery = new WP_Query(array(
   'post_type' => array('post', 'page', 'instructor', 'program', 'event'),
   's' => sanitize_text_field($data['term']) //search for single item
  ));

  $results = array(
    'generalInfo' => array(),
    'instructors' => array(), 
    'programs' => array(),
    'events' => array()
  );

  while($mainQuery->have_posts()){
    $mainQuery->the_post();
    if(get_post_type() == 'post' OR get_post_type() == 'page'){
        array_push($results['generalInfo'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink()
        ));
    }

    if(get_post_type() == 'instructor'){
        array_push($results['instructors'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink()
        ));
    }

    if(get_post_type() == 'program'){
        array_push($results['programs'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink()
        ));
    }
   
    if(get_post_type() == 'event'){
        array_push($results['events'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink()
        ));
    }
  }
  return $results;
}