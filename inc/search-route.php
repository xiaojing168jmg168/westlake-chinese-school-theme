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
            'permalink' => get_the_permalink(),
            'postType' => get_post_type(),
            'authorName' => get_the_author()
        ));
    }

    if(get_post_type() == 'instructor'){
        array_push($results['instructors'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink(),
            'image' => get_the_post_thumbnail_url()
        ));
    }

    if(get_post_type() == 'program'){
        array_push($results['programs'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink()
        ));
    }
   
    if(get_post_type() == 'event'){
        $eventDate = new DateTime(get_field('event_date'));
        $description = null;
        if(has_excerpt()){
            $description = get_the_excerpt();
          }else{
            $description = wp_trim_words(get_the_content(), 18);
          }
        array_push($results['events'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink(),
            'month' => $eventDate->format('M'),
            'day' => $eventDate->format('d'),
            'description' => $description 
        ));
    }
  }
  return $results;
}