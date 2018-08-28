---
title: Highlights
permalink: /highlights
layout: archive
header:
   overlay_image: assets/images/pages/highlights-1280x600.jpg
excerpt: "Discover the pearls"
---

{% include base_path %}

We picked some [places][places] and [stories][stories] to inspire you to visit
this unique region.

## Places

<div class="grid__wrapper">
  {% for post in site.places %}
    {% if post.publish %}
      {% include archive-single.html type="grid" %}
    {% endif %}
  {% endfor %}
</div>


## Stories

<div class="grid__wrapper">
  {% for post in site.stories %}
    {% if post.publish %}
      {% include archive-single.html type="grid" %}
    {% endif %}
  {% endfor %}
</div>

[places]: {{ base_path }}/highlights#places
[stories]: {{ base_path }}/highlights#stories
