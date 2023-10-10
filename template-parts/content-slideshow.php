<div class="hero-slider__slide" style="background-image: url(<?php echo get_field('slide_photograph')['url']; ?>)">
  <div class="hero-slider__interior container">
    <div class="hero-slider__overlay">
      <h2 class="headline headline--medium t-center"><?php echo get_the_title(); ?></h2>
      <p class="t-center"><?php echo get_field('slide_subtitle'); ?></p>
      <p class="t-center no-margin">
        <a href="<?php echo get_field('slide_link_value'); ?>" class="btn btn--blue"><?php echo get_field('slide_link_text'); ?></a></p>
    </div>
  </div>
</div>