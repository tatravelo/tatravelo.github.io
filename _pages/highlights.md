---
title: Highlights
permalink: /highlights
layout: archive
header:
   overlay_image: assets/images/splash-highlights-1280x850.jpg
excerpt: "Discover the pearls"
---

{% include base_path %}

We picked some [places][places] and [stories][stories] to inspire you to visit
this unique region.

## Places
<div class="grid__wrapper">
  {% for post in site.places %}
    {% include archive-single.html type="grid" %}
  {% endfor %}
</div>


## Stories
<div class="grid__wrapper">
  {% for post in site.stories %}
    {% include archive-single.html type="grid" %}
  {% endfor %}
</div>

[places]: {{ base_path }}/highlights#places
[stories]: {{ base_path }}/highlights#stories
